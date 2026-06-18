const path = require("path");
const fs = require("fs");
const { getPool } = require("../config/db");
const { upload, removeUploadedFile } = require("../config/upload");

function formatSarprasRow(row) {
  return {
    id: row.id,
    nama: row.nama,
    kategori: row.kategori,
    tipe: row.tipe,
    status: row.status,
    lokasi: row.lokasi,
    kondisi: {
      teks: row.kondisi_teks || "",
      image: row.kondisi_image || "/images/icon-02.svg",
    },
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function mapMonitoringStatus(status) {
  switch (status) {
    case "Tersedia":
      return "TERSEDIA";
    case "Dipinjam":
    case "Dipakai":
      return "DIPAKAI";
    case "Rusak":
      return "RUSAK";
    case "Maintenance":
      return "MAINTENANCE";
    default:
      return status;
  }
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toISOString().slice(0, 10);
}

function buildImagePath(file) {
  return file ? `/uploads/sarpras/${file.filename}` : null;
}

function parseBodyFields(body) {
  return {
    nama: (body.nama || "").trim(),
    kategori: (body.kategori || "").trim(),
    status: body.status || "Tersedia",
    lokasi: (body.lokasi || "").trim() || null,
    kondisi_teks: (body.kondisi_teks || "").trim() || null,
    tipe: "barang",
  };
}

async function clearSarprasReferences(pool, id) {
  try {
    await pool.query(
      "UPDATE laporan_kerusakan SET sarpras_id = NULL WHERE sarpras_id = ?",
      [id]
    );
  } catch {
    // tabel laporan opsional
  }
}

function attachSarprasRoutes(app) {
  const auth = app._sarprasAuth || {};
  const { authenticate, authorize } = auth;
  if (!authenticate || !authorize) return;

  const janitorOrPegawai = authorize("janitor", "pegawai_sarpras");

  app.get("/api/sarpras", authenticate, janitorOrPegawai, async (req, res) => {
    try {
      const { status, kategori } = req.query;
      let query = "SELECT * FROM sarpras WHERE tipe = 'barang'";
      const params = [];

      if (status && status !== "all") {
        query += " AND status = ?";
        params.push(status);
      }

      if (kategori && kategori !== "all") {
        query += " AND kategori = ?";
        params.push(kategori);
      }

      query += " ORDER BY nama ASC";

      const pool = getPool();
      const [rows] = await pool.query(query, params);

      res.json({ success: true, data: rows.map(formatSarprasRow) });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Endpoint khusus peminjam
  app.get("/api/public/barang", authenticate, async (_req, res) => {
    try {
      const pool = getPool();
      const [rows] = await pool.query(`
        SELECT *
        FROM sarpras
        WHERE tipe = 'barang'
        AND status = 'Tersedia'
        ORDER BY nama ASC
      `);

      const data = rows.map(formatSarprasRow);

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });

  app.get(
    "/api/sarpras/monitoring",
    authenticate,
    janitorOrPegawai,
    async (_req, res) => {
      try {
        const pool = getPool();
        const [rows] = await pool.query(`
          SELECT
            s.id,
            s.nama,
            s.status,
            s.lokasi,
            COALESCE(pb.nama, '-') AS peminjam,
            pb.tanggal_pinjam AS mulai,
            pb.tanggal_kembali AS deadline
          FROM sarpras s
          LEFT JOIN peminjaman_barang pb
            ON pb.barang = s.nama AND pb.status = 'Disetujui'
          WHERE s.tipe = 'barang'
          ORDER BY s.nama ASC
        `);

        const data = rows.map((row) => ({
          id: row.id,
          nama: row.nama,
          status: mapMonitoringStatus(row.status),
          peminjam: row.peminjam || "-",
          lokasi: row.lokasi || "-",
          mulai: formatDate(row.mulai),
          deadline: formatDate(row.deadline),
        }));

        res.json({ success: true, data });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  );

  app.delete(
    "/api/sarpras/:id",
    authenticate,
    janitorOrPegawai,
    async (req, res) => {
      try {
        const id = Number(req.params.id);
        if (!id) {
          return res.status(400).json({
            success: false,
            message: "ID sarpras tidak valid",
          });
        }

        const pool = getPool();
        const [existing] = await pool.query(
          "SELECT id, kondisi_image FROM sarpras WHERE id = ?",
          [id]
        );

        if (existing.length === 0) {
          return res
            .status(404)
            .json({ success: false, message: "Sarpras tidak ditemukan" });
        }

        await clearSarprasReferences(pool, id);
        await pool.query("DELETE FROM sarpras WHERE id = ?", [id]);
        removeUploadedFile(existing[0].kondisi_image);

        res.json({ success: true, message: "Sarpras berhasil dihapus" });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  );

  app.get("/api/sarpras/:id", authenticate, janitorOrPegawai, async (req, res) => {
    try {
      const pool = getPool();
      const [rows] = await pool.query(
        "SELECT * FROM sarpras WHERE id = ? AND tipe = 'barang'",
        [req.params.id]
      );

      if (rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Sarpras tidak ditemukan" });
      }

      res.json({ success: true, data: formatSarprasRow(rows[0]) });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.post(
    "/api/sarpras",
    authenticate,
    janitorOrPegawai,
    upload.single("foto"),
    async (req, res) => {
      try {
        const fields = parseBodyFields(req.body);

        if (!fields.nama || !fields.kategori) {
          if (req.file) removeUploadedFile(buildImagePath(req.file));
          return res.status(400).json({
            success: false,
            message: "Nama dan kategori wajib diisi",
          });
        }

        const kondisi_image = buildImagePath(req.file);
        const pool = getPool();

        const [result] = await pool.query(
          `INSERT INTO sarpras (nama, kategori, tipe, status, lokasi, kondisi_teks, kondisi_image)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            fields.nama,
            fields.kategori,
            fields.tipe,
            fields.status,
            fields.lokasi,
            fields.kondisi_teks,
            kondisi_image,
          ]
        );

        const [rows] = await pool.query("SELECT * FROM sarpras WHERE id = ?", [
          result.insertId,
        ]);

        res.status(201).json({ success: true, data: formatSarprasRow(rows[0]) });
      } catch (error) {
        if (req.file) removeUploadedFile(buildImagePath(req.file));
        res.status(500).json({ success: false, message: error.message });
      }
    }
  );

  app.put(
    "/api/sarpras/:id",
    authenticate,
    janitorOrPegawai,
    upload.single("foto"),
    async (req, res) => {
      try {
        const id = Number(req.params.id);
        const fields = parseBodyFields(req.body);

        if (!fields.nama || !fields.kategori) {
          if (req.file) removeUploadedFile(buildImagePath(req.file));
          return res.status(400).json({
            success: false,
            message: "Nama dan kategori wajib diisi",
          });
        }

        const pool = getPool();
        const [existing] = await pool.query(
          "SELECT id, kondisi_image FROM sarpras WHERE id = ?",
          [id]
        );

        if (existing.length === 0) {
          if (req.file) removeUploadedFile(buildImagePath(req.file));
          return res
            .status(404)
            .json({ success: false, message: "Sarpras tidak ditemukan" });
        }

        let kondisi_image = existing[0].kondisi_image;
        if (req.file) {
          removeUploadedFile(kondisi_image);
          kondisi_image = buildImagePath(req.file);
        }

        await pool.query(
          `UPDATE sarpras
           SET nama = ?, kategori = ?, tipe = ?, status = ?, lokasi = ?,
               kondisi_teks = ?, kondisi_image = ?
           WHERE id = ?`,
          [
            fields.nama,
            fields.kategori,
            fields.tipe,
            fields.status,
            fields.lokasi,
            fields.kondisi_teks,
            kondisi_image,
            id,
          ]
        );

        const [rows] = await pool.query("SELECT * FROM sarpras WHERE id = ?", [id]);
        res.json({ success: true, data: formatSarprasRow(rows[0]) });
      } catch (error) {
        if (req.file) removeUploadedFile(buildImagePath(req.file));
        res.status(500).json({ success: false, message: error.message });
      }
    }
  );
}

module.exports = { attachSarprasRoutes };