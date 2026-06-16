const { getPool } = require("../config/db");

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

function attachSarprasRoutes(app) {
  const auth = app._sarprasAuth || {};
  const { authenticate, authorize } = auth;
  if (!authenticate || !authorize) return;

  const janitorOrPegawai = authorize("janitor", "pegawai_sarpras");

  app.get("/api/sarpras", authenticate, janitorOrPegawai, async (req, res) => {
    try {
      const { status, kategori } = req.query;
      let query = "SELECT * FROM sarpras WHERE 1=1";
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
            COALESCE(pb.nama, pr.nama, pl.nama, '-') AS peminjam,
            COALESCE(pb.tanggal_pinjam, pr.tanggal_pinjam, pl.tanggal_pinjam) AS mulai,
            COALESCE(pb.tanggal_kembali, pr.tanggal_kembali, pl.tanggal_kembali) AS deadline
          FROM sarpras s
          LEFT JOIN peminjaman_barang pb
            ON pb.barang = s.nama AND pb.status = 'Disetujui'
          LEFT JOIN peminjaman_ruangan pr
            ON pr.ruangan = s.nama AND pr.status = 'Disetujui'
          LEFT JOIN peminjaman_laboratorium pl
            ON pl.laboratorium = s.nama AND pl.status = 'Disetujui'
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

  app.get("/api/sarpras/:id", authenticate, janitorOrPegawai, async (req, res) => {
    try {
      const pool = getPool();
      const [rows] = await pool.query("SELECT * FROM sarpras WHERE id = ?", [
        req.params.id,
      ]);

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

  app.post("/api/sarpras", authenticate, janitorOrPegawai, async (req, res) => {
    try {
      const { nama, kategori, tipe, status, lokasi, kondisi_teks, kondisi_image } =
        req.body;

      if (!nama || !kategori) {
        return res.status(400).json({
          success: false,
          message: "Nama dan kategori wajib diisi",
        });
      }

      const pool = getPool();
      const [result] = await pool.query(
        `INSERT INTO sarpras (nama, kategori, tipe, status, lokasi, kondisi_teks, kondisi_image)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          nama,
          kategori,
          tipe || "barang",
          status || "Tersedia",
          lokasi || null,
          kondisi_teks || null,
          kondisi_image || null,
        ]
      );

      const [rows] = await pool.query("SELECT * FROM sarpras WHERE id = ?", [
        result.insertId,
      ]);

      res.status(201).json({ success: true, data: formatSarprasRow(rows[0]) });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.put("/api/sarpras/:id", authenticate, janitorOrPegawai, async (req, res) => {
    try {
      const { nama, kategori, tipe, status, lokasi, kondisi_teks, kondisi_image } =
        req.body;

      if (!nama || !kategori) {
        return res.status(400).json({
          success: false,
          message: "Nama dan kategori wajib diisi",
        });
      }

      const pool = getPool();
      const [existing] = await pool.query("SELECT id FROM sarpras WHERE id = ?", [
        req.params.id,
      ]);

      if (existing.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Sarpras tidak ditemukan" });
      }

      await pool.query(
        `UPDATE sarpras
         SET nama = ?, kategori = ?, tipe = ?, status = ?, lokasi = ?,
             kondisi_teks = ?, kondisi_image = ?
         WHERE id = ?`,
        [
          nama,
          kategori,
          tipe || "barang",
          status || "Tersedia",
          lokasi || null,
          kondisi_teks || null,
          kondisi_image || null,
          req.params.id,
        ]
      );

      const [rows] = await pool.query("SELECT * FROM sarpras WHERE id = ?", [
        req.params.id,
      ]);

      res.json({ success: true, data: formatSarprasRow(rows[0]) });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.delete(
    "/api/sarpras/:id",
    authenticate,
    authorize("pegawai_sarpras"),
    async (req, res) => {
      try {
        const pool = getPool();
        const [existing] = await pool.query("SELECT id FROM sarpras WHERE id = ?", [
          req.params.id,
        ]);

        if (existing.length === 0) {
          return res
            .status(404)
            .json({ success: false, message: "Sarpras tidak ditemukan" });
        }

        await pool.query("DELETE FROM sarpras WHERE id = ?", [req.params.id]);
        res.json({ success: true, message: "Sarpras berhasil dihapus" });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  );
}

module.exports = { attachSarprasRoutes };
