const { getPool } = require("../config/db");

const TABLES = {
  barang: "peminjaman_barang",
  ruangan: "peminjaman_ruangan",
  laboratorium: "peminjaman_laboratorium",
};

const ITEM_COL = {
  barang: "barang",
  ruangan: "ruangan",
  laboratorium: "laboratorium",
};

function formatDate(d) {
  return d ? new Date(d).toISOString().slice(0, 10) : "";
}

function formatRow(row, tipe) {
  const itemCol = ITEM_COL[tipe];
  return {
    id: row.id,
    userId: row.user_id,
    nama: row.nama,
    nim: row.nim,
    prodi: row.prodi,
    item: row[itemCol],
    kategori: row.kategori,
    tipe,
    tanggalPinjam: formatDate(row.tanggal_pinjam),
    tanggalKembali: formatDate(row.tanggal_kembali),
    jamMulai: row.jam_mulai ? String(row.jam_mulai).slice(0, 5) : "",
    jamSelesai: row.jam_selesai ? String(row.jam_selesai).slice(0, 5) : "",
    status: row.status,
    catatanAdmin: row.catatan_admin,
    gedungId: row.gedung_id,
    organisasi: row.organisasi,
    detail: row.detail_json ? JSON.parse(row.detail_json) : {},
    laporanSelesai: !!row.laporan_selesai,
    createdAt: row.created_at,
  };
}

function attachPeminjamanRoutes(app) {
  const auth = app._sarprasAuth || {};
  const { authenticate, authorize } = auth;
  if (!authenticate || !authorize) return;

  const sarprasOnly = [authenticate, authorize("pegawai_sarpras")];
  const peminjamCreate = [authenticate, authorize("peminjam", "janitor")];
  const readRoles = [authenticate, authorize("pegawai_sarpras", "janitor", "peminjam")];

  // Riwayat gabungan untuk peminjam
  app.get("/api/peminjaman/riwayat", ...readRoles, async (req, res) => {
    try {
      const pool = getPool();
      const isOwnOnly = req.user.role === "peminjam" || req.user.role === "janitor";
      const userFilter = isOwnOnly ? " AND user_id = ?" : "";
      const userParam = isOwnOnly ? [req.user.id] : [];

      const queries = Object.entries(TABLES).map(async ([tipe, table]) => {
        const itemCol = ITEM_COL[tipe];
        const [rows] = await pool.query(
          `SELECT *, '${tipe}' AS tipe_label FROM ${table} WHERE 1=1${userFilter} ORDER BY created_at DESC`,
          userParam
        );
        return rows.map((r) => ({
          id: r.id,
          tipe,
          nama: r.nama,
          item: r[itemCol],
          kategori: r.kategori || tipe,
          tanggalPinjam: formatDate(r.tanggal_pinjam),
          tanggalKembali: formatDate(r.tanggal_kembali),
          status: r.status,
          laporanSelesai: !!r.laporan_selesai,
        }));
      });

      const results = (await Promise.all(queries)).flat();
      results.sort((a, b) => b.tanggalPinjam.localeCompare(a.tanggalPinjam));
      res.json(results);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Laporan kondisi — peminjaman yang sudah lewat tanggal kembali
  app.get("/api/peminjaman/laporan-kondisi", ...readRoles, async (req, res) => {
    try {
      const pool = getPool();
      const today = new Date().toISOString().slice(0, 10);
      const isOwnOnly = req.user.role === "peminjam" || req.user.role === "janitor";
      const userFilter = isOwnOnly ? " AND user_id = ?" : "";
      const userParam = isOwnOnly ? [today, req.user.id] : [today];

      const all = [];
      for (const [tipe, table] of Object.entries(TABLES)) {
        const itemCol = ITEM_COL[tipe];
        const [rows] = await pool.query(
          `SELECT *, '${tipe}' AS tipe_label FROM ${table}
           WHERE tanggal_kembali <= ? AND status = 'Disetujui' AND laporan_selesai = 0${userFilter}`,
          userParam
        );
        for (const r of rows) {
          all.push({
            id: r.id,
            tipe,
            item: r[itemCol],
            kategori: r.kategori || tipe,
            tanggalPinjam: formatDate(r.tanggal_pinjam),
            tanggalKembali: formatDate(r.tanggal_kembali),
            statusLaporan: !!r.laporan_selesai,
          });
        }
      }
      res.json(all);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.post("/api/peminjaman/laporan-kondisi", ...peminjamCreate, async (req, res) => {
    try {
      const { peminjamanId, tipe, kondisi, kelengkapan, catatan } = req.body;
      if (!peminjamanId || !tipe || !kondisi) {
        return res.status(400).json({ success: false, message: "Data laporan tidak lengkap" });
      }
      const table = TABLES[tipe];
      if (!table) return res.status(400).json({ success: false, message: "Tipe tidak valid" });

      const pool = getPool();
      const [existing] = await pool.query(
        `SELECT * FROM ${table} WHERE id = ? AND user_id = ?`,
        [peminjamanId, req.user.id]
      );
      if (!existing.length) {
        return res.status(404).json({ success: false, message: "Peminjaman tidak ditemukan" });
      }

      await pool.query(
        `INSERT INTO laporan_kondisi (peminjaman_id, tipe, kondisi, kelengkapan, catatan, user_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [peminjamanId, tipe, kondisi, kelengkapan || "", catatan || "", req.user.id]
      );
      await pool.query(`UPDATE ${table} SET laporan_selesai = 1 WHERE id = ?`, [peminjamanId]);
      res.status(201).json({ success: true, message: "Laporan berhasil dikirim" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Generic handlers per tipe
  for (const [tipe, table] of Object.entries(TABLES)) {
    const itemCol = ITEM_COL[tipe];

    app.get(`/api/peminjaman/${tipe}`, ...readRoles, async (req, res) => {
      try {
        const pool = getPool();
        let query = `SELECT * FROM ${table} WHERE 1=1`;
        const params = [];

        if (req.user.role === "peminjam") {
          query += " AND user_id = ?";
          params.push(req.user.id);
        } else if (req.user.role === "janitor") {
          query += " AND status = 'Disetujui'";
        }

        if (req.query.status) {
          query += " AND status = ?";
          params.push(req.query.status);
        }

        query += " ORDER BY created_at DESC";
        const [rows] = await pool.query(query, params);
        res.json(rows.map((r) => formatRow(r, tipe)));
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    });

    app.get(`/api/peminjaman/${tipe}/:id`, ...readRoles, async (req, res) => {
      try {
        const pool = getPool();
        const [rows] = await pool.query(`SELECT * FROM ${table} WHERE id = ?`, [req.params.id]);
        if (!rows.length) return res.status(404).json({ success: false, message: "Data tidak ditemukan" });

        const row = rows[0];
        if (req.user.role === "peminjam" && row.user_id !== req.user.id) {
          return res.status(403).json({ success: false, message: "Akses ditolak" });
        }
        if (req.user.role === "janitor" && row.status !== "Disetujui") {
          return res.status(403).json({ success: false, message: "Akses ditolak" });
        }
        res.json(formatRow(row, tipe));
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    });

    app.post(`/api/peminjaman/${tipe}`, ...peminjamCreate, async (req, res) => {
      try {
        const body = req.body;
        const itemName = body.item || body[itemCol] || body.barang || body.ruangan || body.laboratorium;
        if (!body.nama || !itemName || !body.tanggalPinjam) {
          return res.status(400).json({ success: false, message: "Nama, item, dan tanggal pinjam wajib diisi" });
        }

        const pool = getPool();
        const [result] = await pool.query(
          `INSERT INTO ${table}
            (user_id, nama, nim, prodi, ${itemCol}, kategori, tanggal_pinjam, tanggal_kembali,
             jam_mulai, jam_selesai, status, gedung_id, organisasi, detail_json)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Menunggu', ?, ?, ?)`,
          [
            req.user.id,
            body.nama,
            body.nim || null,
            body.prodi || null,
            itemName,
            body.kategori || tipe,
            body.tanggalPinjam,
            body.tanggalKembali || body.tanggalPinjam,
            body.jamMulai || null,
            body.jamSelesai || null,
            body.gedungId || null,
            body.organisasi || null,
            JSON.stringify(body.detail || {}),
          ]
        );

        const [rows] = await pool.query(`SELECT * FROM ${table} WHERE id = ?`, [result.insertId]);
        res.status(201).json(formatRow(rows[0], tipe));
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    });

    app.put(`/api/peminjaman/${tipe}/:id`, ...sarprasOnly, async (req, res) => {
      try {
        const { status, catatanAdmin } = req.body;
        const pool = getPool();
        await pool.query(
          `UPDATE ${table} SET status = ?, catatan_admin = ? WHERE id = ?`,
          [status, catatanAdmin || "", req.params.id]
        );
        const [rows] = await pool.query(`SELECT * FROM ${table} WHERE id = ?`, [req.params.id]);
        if (!rows.length) return res.status(404).json({ success: false, message: "Data tidak ditemukan" });
        res.json(formatRow(rows[0], tipe));
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    });

    app.delete(`/api/peminjaman/${tipe}/:id`, ...sarprasOnly, async (req, res) => {
      try {
        const pool = getPool();
        await pool.query(`DELETE FROM ${table} WHERE id = ?`, [req.params.id]);
        res.json({ success: true });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    });
  }
}

module.exports = { attachPeminjamanRoutes };
