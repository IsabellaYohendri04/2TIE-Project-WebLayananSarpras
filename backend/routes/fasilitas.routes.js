const { getPool } = require("../config/db");

function attachFasilitasRoutes(app) {
  const auth = app._sarprasAuth || {};
  const { authenticate, authorize } = auth;
  if (!authenticate || !authorize) return;

  const sarprasOnly = [authenticate, authorize("pegawai_sarpras")];
  const readAll = [authenticate, authorize("pegawai_sarpras", "janitor", "peminjam")];

  // --- Gedung ---
  app.get("/api/gedung", ...readAll, async (_req, res) => {
    try {
      const pool = getPool();
      const [rows] = await pool.query("SELECT * FROM gedung ORDER BY nama");
      res.json(rows);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.post("/api/gedung", ...sarprasOnly, async (req, res) => {
    try {
      const { slug, nama, icon, deskripsi, lantai } = req.body;
      if (!slug || !nama) {
        return res.status(400).json({ success: false, message: "Slug dan nama wajib diisi" });
      }
      const pool = getPool();
      const [result] = await pool.query(
        "INSERT INTO gedung (slug, nama, icon, deskripsi, lantai) VALUES (?, ?, ?, ?, ?)",
        [slug, nama, icon || "🏢", deskripsi || "", lantai || 1]
      );
      const [rows] = await pool.query("SELECT * FROM gedung WHERE id = ?", [result.insertId]);
      res.status(201).json(rows[0]);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.put("/api/gedung/:id", ...sarprasOnly, async (req, res) => {
    try {
      const { slug, nama, icon, deskripsi, lantai } = req.body;
      const pool = getPool();
      await pool.query(
        "UPDATE gedung SET slug=?, nama=?, icon=?, deskripsi=?, lantai=? WHERE id=?",
        [slug, nama, icon, deskripsi, lantai, req.params.id]
      );
      const [rows] = await pool.query("SELECT * FROM gedung WHERE id = ?", [req.params.id]);
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.delete("/api/gedung/:id", ...sarprasOnly, async (req, res) => {
    try {
      const pool = getPool();
      await pool.query("DELETE FROM gedung WHERE id = ?", [req.params.id]);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // --- Ruangan ---
  app.get("/api/ruangan", ...readAll, async (req, res) => {
    try {
      const pool = getPool();
      let query = `
        SELECT r.*, g.slug AS gedung_slug, g.nama AS gedung_nama
        FROM ruangan r
        JOIN gedung g ON g.id = r.gedung_id
        WHERE 1=1
      `;
      const params = [];
      if (req.query.gedung) {
        query += " AND g.slug = ?";
        params.push(req.query.gedung);
      }
      if (req.query.tipe) {
        query += " AND r.tipe = ?";
        params.push(req.query.tipe);
      }
      if (req.query.lantai) {
        query += " AND r.lantai = ?";
        params.push(Number(req.query.lantai));
      }
      if (req.query.status) {
        query += " AND r.status = ?";
        params.push(req.query.status);
      }
      query += " ORDER BY r.nama";
      const [rows] = await pool.query(query, params);
      res.json(rows.map(formatRuangan));
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.get("/api/ruangan/:id", ...readAll, async (req, res) => {
    try {
      const pool = getPool();
      const [rows] = await pool.query(
        `SELECT r.*, g.slug AS gedung_slug, g.nama AS gedung_nama
         FROM ruangan r JOIN gedung g ON g.id = r.gedung_id WHERE r.id = ?`,
        [req.params.id]
      );
      if (!rows.length) return res.status(404).json({ success: false, message: "Ruangan tidak ditemukan" });
      res.json(formatRuangan(rows[0]));
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.post("/api/ruangan", ...sarprasOnly, async (req, res) => {
    try {
      const { gedung_id, kode, nama, tipe, lantai, kapasitas, fasilitas, status } = req.body;
      if (!gedung_id || !kode || !nama) {
        return res.status(400).json({ success: false, message: "Gedung, kode, dan nama wajib diisi" });
      }
      const pool = getPool();
      const [result] = await pool.query(
        `INSERT INTO ruangan (gedung_id, kode, nama, tipe, lantai, kapasitas, fasilitas, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          gedung_id, kode, nama, tipe || "ruangan", lantai || 1,
          kapasitas || 30, JSON.stringify(fasilitas || []), status || "tersedia",
        ]
      );
      const [rows] = await pool.query("SELECT * FROM ruangan WHERE id = ?", [result.insertId]);
      res.status(201).json(formatRuangan(rows[0]));
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.put("/api/ruangan/:id", ...sarprasOnly, async (req, res) => {
    try {
      const { gedung_id, kode, nama, tipe, lantai, kapasitas, fasilitas, status } = req.body;
      const pool = getPool();
      await pool.query(
        `UPDATE ruangan SET gedung_id=?, kode=?, nama=?, tipe=?, lantai=?, kapasitas=?, fasilitas=?, status=? WHERE id=?`,
        [
          gedung_id, kode, nama, tipe, lantai, kapasitas,
          JSON.stringify(fasilitas || []), status, req.params.id,
        ]
      );
      const [rows] = await pool.query("SELECT * FROM ruangan WHERE id = ?", [req.params.id]);
      res.json(formatRuangan(rows[0]));
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.delete("/api/ruangan/:id", ...sarprasOnly, async (req, res) => {
    try {
      const pool = getPool();
      await pool.query("DELETE FROM ruangan WHERE id = ?", [req.params.id]);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // --- Laboratorium ---
  app.get("/api/laboratorium", ...readAll, async (req, res) => {
    try {
      const pool = getPool();
      let query = `
        SELECT l.*, g.slug AS gedung_slug, g.nama AS gedung_nama
        FROM laboratorium l
        JOIN gedung g ON g.id = l.gedung_id
        WHERE 1=1
      `;
      const params = [];
      if (req.query.gedung) {
        query += " AND g.slug = ?";
        params.push(req.query.gedung);
      }
      if (req.query.lantai) {
        query += " AND l.lantai = ?";
        params.push(Number(req.query.lantai));
      }
      query += " ORDER BY l.nama";
      const [rows] = await pool.query(query, params);
      res.json(rows.map(formatLab));
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.get("/api/laboratorium/:id", ...readAll, async (req, res) => {
    try {
      const pool = getPool();
      const [rows] = await pool.query(
        `SELECT l.*, g.slug AS gedung_slug, g.nama AS gedung_nama
         FROM laboratorium l JOIN gedung g ON g.id = l.gedung_id WHERE l.id = ?`,
        [req.params.id]
      );
      if (!rows.length) return res.status(404).json({ success: false, message: "Laboratorium tidak ditemukan" });
      res.json(formatLab(rows[0]));
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.post("/api/laboratorium", ...sarprasOnly, async (req, res) => {
    try {
      const { gedung_id, kode, nama, lantai, kapasitas, fasilitas, status } = req.body;
      if (!gedung_id || !kode || !nama) {
        return res.status(400).json({ success: false, message: "Gedung, kode, dan nama wajib diisi" });
      }
      const pool = getPool();
      const [result] = await pool.query(
        `INSERT INTO laboratorium (gedung_id, kode, nama, lantai, kapasitas, fasilitas, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          gedung_id, kode, nama, lantai || 1, kapasitas || 30,
          JSON.stringify(fasilitas || []), status || "tersedia",
        ]
      );
      const [rows] = await pool.query("SELECT * FROM laboratorium WHERE id = ?", [result.insertId]);
      res.status(201).json(formatLab(rows[0]));
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.put("/api/laboratorium/:id", ...sarprasOnly, async (req, res) => {
    try {
      const { gedung_id, kode, nama, lantai, kapasitas, fasilitas, status } = req.body;
      const pool = getPool();
      await pool.query(
        `UPDATE laboratorium SET gedung_id=?, kode=?, nama=?, lantai=?, kapasitas=?, fasilitas=?, status=? WHERE id=?`,
        [
          gedung_id, kode, nama, lantai, kapasitas,
          JSON.stringify(fasilitas || []), status, req.params.id,
        ]
      );
      const [rows] = await pool.query("SELECT * FROM laboratorium WHERE id = ?", [req.params.id]);
      res.json(formatLab(rows[0]));
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.delete("/api/laboratorium/:id", ...sarprasOnly, async (req, res) => {
    try {
      const pool = getPool();
      await pool.query("DELETE FROM laboratorium WHERE id = ?", [req.params.id]);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // --- Barang ---
  app.get("/api/barang", ...readAll, async (_req, res) => {
    try {
      const pool = getPool();
      const [rows] = await pool.query("SELECT * FROM barang ORDER BY nama");
      res.json(rows);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.post("/api/barang", ...sarprasOnly, async (req, res) => {
    try {
      const { nama, kategori, stok, status } = req.body;
      if (!nama) return res.status(400).json({ success: false, message: "Nama barang wajib diisi" });
      const pool = getPool();
      const [result] = await pool.query(
        "INSERT INTO barang (nama, kategori, stok, status) VALUES (?, ?, ?, ?)",
        [nama, kategori || "Umum", stok || 1, status || "tersedia"]
      );
      const [rows] = await pool.query("SELECT * FROM barang WHERE id = ?", [result.insertId]);
      res.status(201).json(rows[0]);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.put("/api/barang/:id", ...sarprasOnly, async (req, res) => {
    try {
      const { nama, kategori, stok, status } = req.body;
      const pool = getPool();
      await pool.query(
        "UPDATE barang SET nama=?, kategori=?, stok=?, status=? WHERE id=?",
        [nama, kategori, stok, status, req.params.id]
      );
      const [rows] = await pool.query("SELECT * FROM barang WHERE id = ?", [req.params.id]);
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.delete("/api/barang/:id", ...sarprasOnly, async (req, res) => {
    try {
      const pool = getPool();
      await pool.query("DELETE FROM barang WHERE id = ?", [req.params.id]);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
}

function parseJson(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try { return JSON.parse(val); } catch { return []; }
}

function formatRuangan(row) {
  return {
    id: row.id,
    gedungId: row.gedung_id,
    gedungSlug: row.gedung_slug,
    gedungNama: row.gedung_nama,
    kode: row.kode,
    nama: row.nama,
    tipe: row.tipe,
    lantai: row.lantai,
    kapasitas: row.kapasitas,
    fasilitas: parseJson(row.fasilitas),
    status: row.status,
  };
}

function formatLab(row) {
  return {
    id: row.id,
    gedungId: row.gedung_id,
    gedungSlug: row.gedung_slug,
    gedungNama: row.gedung_nama,
    kode: row.kode,
    nama: row.nama,
    lantai: row.lantai,
    kapasitas: row.kapasitas,
    fasilitas: parseJson(row.fasilitas),
    status: row.status,
  };
}

module.exports = { attachFasilitasRoutes };
