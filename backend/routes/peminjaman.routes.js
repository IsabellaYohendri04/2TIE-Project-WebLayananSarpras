const { getPool } = require("../config/db");
const { uploadPeminjaman } = require("../config/uploadPeminjaman");
const { sendJadwalEmail } = require("../config/email");

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

function formatDateTime(value) {
  if (!value) return null;
  return new Date(value).toISOString();
}

function parseDetailJson(raw) {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function parseCreateBody(req) {
  let detail = req.body.detail;
  if (typeof detail === "string") {
    detail = parseDetailJson(detail);
  }
  const fileProposal = req.file ? `/uploads/peminjaman/${req.file.filename}` : null;
  return { ...req.body, detail, fileProposal };
}

function maybeUploadPeminjaman(req, res, next) {
  if (req.is("multipart/form-data")) {
    return uploadPeminjaman.single("fileProposal")(req, res, next);
  }
  next();
}

async function resolvePeminjamEmail(pool, row) {
  if (row.user_id) {
    const [users] = await pool.query("SELECT email FROM users WHERE id = ?", [row.user_id]);
    if (users[0]?.email) return users[0].email;
  }
  if (row.nim) {
    const [users] = await pool.query("SELECT email FROM users WHERE nim = ?", [row.nim]);
    if (users[0]?.email) return users[0].email;
  }
  const detail = parseDetailJson(row.detail_json);
  return detail?.email || null;
}

function basePeminjamanFields(row, email) {
  return {
    id: row.id,
    nama: row.nama,
    nim: row.nim,
    prodi: row.prodi,
    email,
    tanggalPinjam: formatDate(row.tanggal_pinjam),
    tanggalKembali: formatDate(row.tanggal_kembali),
    jamMulai: row.jam_mulai,
    jamSelesai: row.jam_selesai,
    status: row.status,
    catatanAdmin: row.catatan_admin,
    organisasi: row.organisasi,
    detail: parseDetailJson(row.detail_json),
    fileProposal: row.file_proposal || null,
    jadwalSubjek: row.jadwal_subjek || null,
    jadwalPertemuan: formatDateTime(row.jadwal_pertemuan),
    createdAt: row.created_at,
  };
}

function formatPeminjamanRow(row) {
  const approved = row.status === "Disetujui";
  return {
    id: row.id,
    tipe: row.tipe,
    item: row.item,
    peminjam: row.nama,
    nama: row.nama,
    nim: row.nim,
    prodi: row.prodi,
    tanggal: formatDate(row.tanggal_pinjam),
    tanggalPinjam: formatDate(row.tanggal_pinjam),
    tanggalKembali: formatDate(row.tanggal_kembali),
    tanggal_kembali: formatDate(row.tanggal_kembali),
    status: approved ? "APPROVED" : row.status,
    kategori: row.kategori,
    jamMulai: row.jam_mulai,
    jamSelesai: row.jam_selesai,
    organisasi: row.organisasi,
    catatanAdmin: row.catatan_admin,
    detail: row.detail_json ? JSON.parse(row.detail_json) : null,
    createdAt: row.created_at,
  };
}

function formatBarangRow(row, email = null) {
  return {
    ...basePeminjamanFields(row, email),
    tipe: "barang",
    image: row.image || "/images/icon-02.svg",
    barang: row.barang,
    item: row.barang,
    kategori: row.kategori,
  };
}

function formatRuanganRow(row, email = null) {
  return {
    ...basePeminjamanFields(row, email),
    tipe: "ruangan",
    ruangan: row.ruangan,
    item: row.ruangan,
    kategori: row.kategori,
  };
}

function formatLabRow(row, email = null) {
  return {
    ...basePeminjamanFields(row, email),
    tipe: "laboratorium",
    laboratorium: row.laboratorium,
    item: row.laboratorium,
    kategori: row.kategori,
  };
}

const tipeConfig = {
  barang: { table: "peminjaman_barang", itemCol: "barang", format: formatBarangRow },
  ruangan: { table: "peminjaman_ruangan", itemCol: "ruangan", format: formatRuanganRow },
  laboratorium: { table: "peminjaman_laboratorium", itemCol: "laboratorium", format: formatLabRow },
};

async function fetchPeminjamanById(pool, tipe, id) {
  const config = tipeConfig[tipe];
  if (!config) return null;
  const [rows] = await pool.query(`SELECT * FROM ${config.table} WHERE id = ?`, [id]);
  if (!rows.length) return null;
  const email = await resolvePeminjamEmail(pool, rows[0]);
  return config.format(rows[0], email);
}

function attachPeminjamanRoutes(app) {
  const auth = app._sarprasAuth || {};
  const { authenticate, authorize } = auth;
  if (!authenticate || !authorize) return;

  const allRoles = authorize("janitor", "pegawai_sarpras", "peminjam");
  const adminOnly = authorize("pegawai_sarpras");
  const submitRoles = authorize("peminjam", "janitor", "pegawai_sarpras");

  // --- Unified list (janitor dashboard) ---
  app.get("/api/peminjaman", authenticate, allRoles, async (req, res) => {
    try {
      const { status } = req.query;
      let statusFilter = null;
      if (status) {
        const normalized = status.toLowerCase();
        if (normalized === "approved" || normalized === "disetujui") statusFilter = "Disetujui";
        else if (normalized === "pending" || normalized === "menunggu") statusFilter = "Menunggu";
        else if (normalized === "rejected" || normalized === "ditolak") statusFilter = "Ditolak";
        else statusFilter = status;
      }

      const pool = getPool();
      let query = `
        SELECT id, nama, nim, prodi, barang AS item, kategori, tanggal_pinjam, tanggal_kembali,
               jam_mulai, jam_selesai, organisasi, catatan_admin, detail_json, status, created_at, 'barang' AS tipe
        FROM peminjaman_barang
        UNION ALL
        SELECT id, nama, nim, prodi, ruangan, kategori, tanggal_pinjam, tanggal_kembali,
               jam_mulai, jam_selesai, organisasi, catatan_admin, detail_json, status, created_at, 'ruangan'
        FROM peminjaman_ruangan
        UNION ALL
        SELECT id, nama, nim, prodi, laboratorium, kategori, tanggal_pinjam, tanggal_kembali,
               jam_mulai, jam_selesai, organisasi, catatan_admin, detail_json, status, created_at, 'laboratorium'
        FROM peminjaman_laboratorium
      `;
      const params = [];
      if (statusFilter) {
        query = `SELECT * FROM (${query}) AS data WHERE status = ? ORDER BY created_at DESC`;
        params.push(statusFilter);
      } else {
        query = `SELECT * FROM (${query}) AS data ORDER BY created_at DESC`;
      }
      const [rows] = await pool.query(query, params);
      res.json({ success: true, data: rows.map(formatPeminjamanRow) });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // --- Riwayat peminjam ---
  app.get("/api/peminjaman/riwayat", authenticate, submitRoles, async (req, res) => {
    try {
      const pool = getPool();
      const userId = req.user?.id;
      const userNim = req.user?.nim;
      const filter = userNim ? "WHERE nim = ?" : userId ? "WHERE user_id = ?" : "";
      const param = userNim || userId;

      const queries = [
        `SELECT id, nama, barang AS item, kategori, tanggal_pinjam, tanggal_kembali, status, 'barang' AS tipe, created_at FROM peminjaman_barang ${filter}`,
        `SELECT id, nama, ruangan AS item, kategori, tanggal_pinjam, tanggal_kembali, status, 'ruangan' AS tipe, created_at FROM peminjaman_ruangan ${filter}`,
        `SELECT id, nama, laboratorium AS item, kategori, tanggal_pinjam, tanggal_kembali, status, 'laboratorium' AS tipe, created_at FROM peminjaman_laboratorium ${filter}`,
      ];

      const results = [];
      for (const q of queries) {
        const [rows] = param ? await pool.query(q, [param]) : await pool.query(q.replace(filter, ""));
        results.push(...rows);
      }
      results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      res.json(results.map((r) => ({
        id: r.id,
        tipe: r.tipe,
        item: r.item,
        kategori: r.kategori,
        tanggalPinjam: formatDate(r.tanggal_pinjam),
        tanggalKembali: formatDate(r.tanggal_kembali),
        status: r.status,
      })));
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // --- BARANG CRUD ---
  app.get("/api/peminjaman/barang", authenticate, allRoles, async (_req, res) => {
    try {
      const pool = getPool();
      const [rows] = await pool.query("SELECT * FROM peminjaman_barang ORDER BY created_at DESC");
      res.json(rows.map(formatBarangRow));
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.get("/api/peminjaman/barang/:id", authenticate, allRoles, async (req, res) => {
    try {
      const pool = getPool();
      const [rows] = await pool.query("SELECT * FROM peminjaman_barang WHERE id = ?", [req.params.id]);
      if (!rows.length) return res.status(404).json({ success: false, message: "Data tidak ditemukan" });
      res.json(formatBarangRow(rows[0]));
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.post("/api/peminjaman/barang", authenticate, submitRoles, async (req, res) => {
    try {
      const { nama, nim, prodi, barang, kategori, tanggalPinjam, tanggalKembali, jamMulai, jamSelesai, organisasi, detail } = req.body;
      if (!nama || !barang || !tanggalPinjam) {
        return res.status(400).json({ success: false, message: "Nama, barang, dan tanggal wajib diisi" });
      }
      const pool = getPool();
      const [result] = await pool.query(
        `INSERT INTO peminjaman_barang
         (user_id, nama, nim, prodi, barang, kategori, tanggal_pinjam, tanggal_kembali, jam_mulai, jam_selesai, organisasi, detail_json, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Menunggu')`,
        [
          req.user?.id || null, nama, nim || req.user?.nim, prodi || req.user?.prodi,
          barang, kategori || "Barang", tanggalPinjam, tanggalKembali || tanggalPinjam,
          jamMulai || null, jamSelesai || null, organisasi || null,
          detail ? JSON.stringify(detail) : null,
        ]
      );
      const [rows] = await pool.query("SELECT * FROM peminjaman_barang WHERE id = ?", [result.insertId]);
      res.status(201).json(formatBarangRow(rows[0]));
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.put("/api/peminjaman/barang/:id", authenticate, adminOnly, async (req, res) => {
    try {
      const { status, catatanAdmin } = req.body;
      const pool = getPool();
      await pool.query(
        "UPDATE peminjaman_barang SET status = ?, catatan_admin = ? WHERE id = ?",
        [status, catatanAdmin || "", req.params.id]
      );
      const [rows] = await pool.query("SELECT * FROM peminjaman_barang WHERE id = ?", [req.params.id]);
      res.json(formatBarangRow(rows[0]));
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.delete("/api/peminjaman/barang/:id", authenticate, adminOnly, async (req, res) => {
    try {
      const pool = getPool();
      await pool.query("DELETE FROM peminjaman_barang WHERE id = ?", [req.params.id]);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // --- RUANGAN CRUD ---
  app.get("/api/peminjaman/ruangan", authenticate, allRoles, async (_req, res) => {
    try {
      const pool = getPool();
      const [rows] = await pool.query("SELECT * FROM peminjaman_ruangan ORDER BY created_at DESC");
      res.json(rows.map(formatRuanganRow));
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.post("/api/peminjaman/ruangan", authenticate, submitRoles, async (req, res) => {
    try {
      const { nama, nim, prodi, ruangan, kategori, tanggalPinjam, tanggalKembali, jamMulai, jamSelesai, organisasi, detail } = req.body;
      if (!nama || !ruangan || !tanggalPinjam) {
        return res.status(400).json({ success: false, message: "Nama, ruangan, dan tanggal wajib diisi" });
      }
      const pool = getPool();
      const [result] = await pool.query(
        `INSERT INTO peminjaman_ruangan
         (user_id, nama, nim, prodi, ruangan, kategori, tanggal_pinjam, tanggal_kembali, jam_mulai, jam_selesai, organisasi, detail_json, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Menunggu')`,
        [
          req.user?.id || null, nama, nim || req.user?.nim, prodi || req.user?.prodi,
          ruangan, kategori || "Ruangan", tanggalPinjam, tanggalKembali || tanggalPinjam,
          jamMulai || null, jamSelesai || null, organisasi || null,
          detail ? JSON.stringify(detail) : null,
        ]
      );
      const [rows] = await pool.query("SELECT * FROM peminjaman_ruangan WHERE id = ?", [result.insertId]);
      res.status(201).json(formatRuanganRow(rows[0]));
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.put("/api/peminjaman/ruangan/:id", authenticate, adminOnly, async (req, res) => {
    try {
      const { status, catatanAdmin } = req.body;
      const pool = getPool();
      await pool.query(
        "UPDATE peminjaman_ruangan SET status = ?, catatan_admin = ? WHERE id = ?",
        [status, catatanAdmin || "", req.params.id]
      );
      const [rows] = await pool.query("SELECT * FROM peminjaman_ruangan WHERE id = ?", [req.params.id]);
      res.json(formatRuanganRow(rows[0]));
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.delete("/api/peminjaman/ruangan/:id", authenticate, adminOnly, async (req, res) => {
    try {
      const pool = getPool();
      await pool.query("DELETE FROM peminjaman_ruangan WHERE id = ?", [req.params.id]);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // --- LABORATORIUM CRUD ---
  app.get("/api/peminjaman/laboratorium", authenticate, allRoles, async (_req, res) => {
    try {
      const pool = getPool();
      const [rows] = await pool.query("SELECT * FROM peminjaman_laboratorium ORDER BY created_at DESC");
      res.json(rows.map(formatLabRow));
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.post("/api/peminjaman/laboratorium", authenticate, submitRoles, async (req, res) => {
    try {
      const { nama, nim, prodi, laboratorium, kategori, tanggalPinjam, tanggalKembali, jamMulai, jamSelesai, organisasi, detail } = req.body;
      if (!nama || !laboratorium || !tanggalPinjam) {
        return res.status(400).json({ success: false, message: "Nama, laboratorium, dan tanggal wajib diisi" });
      }
      const pool = getPool();
      const [result] = await pool.query(
        `INSERT INTO peminjaman_laboratorium
         (user_id, nama, nim, prodi, laboratorium, kategori, tanggal_pinjam, tanggal_kembali, jam_mulai, jam_selesai, organisasi, detail_json, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Menunggu')`,
        [
          req.user?.id || null, nama, nim || req.user?.nim, prodi || req.user?.prodi,
          laboratorium, kategori || "Laboratorium", tanggalPinjam, tanggalKembali || tanggalPinjam,
          jamMulai || null, jamSelesai || null, organisasi || null,
          detail ? JSON.stringify(detail) : null,
        ]
      );
      const [rows] = await pool.query("SELECT * FROM peminjaman_laboratorium WHERE id = ?", [result.insertId]);
      res.status(201).json(formatLabRow(rows[0]));
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.put("/api/peminjaman/laboratorium/:id", authenticate, adminOnly, async (req, res) => {
    try {
      const { status, catatanAdmin } = req.body;
      const pool = getPool();
      await pool.query(
        "UPDATE peminjaman_laboratorium SET status = ?, catatan_admin = ? WHERE id = ?",
        [status, catatanAdmin || "", req.params.id]
      );
      const [rows] = await pool.query("SELECT * FROM peminjaman_laboratorium WHERE id = ?", [req.params.id]);
      res.json(formatLabRow(rows[0]));
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.delete("/api/peminjaman/laboratorium/:id", authenticate, adminOnly, async (req, res) => {
    try {
      const pool = getPool();
      await pool.query("DELETE FROM peminjaman_laboratorium WHERE id = ?", [req.params.id]);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  const laporanTables = {
    barang: { table: "peminjaman_barang", itemCol: "barang" },
    ruangan: { table: "peminjaman_ruangan", itemCol: "ruangan" },
    laboratorium: { table: "peminjaman_laboratorium", itemCol: "laboratorium" },
  };

  function formatLaporanRow(row, tipe, itemCol) {
    let laporan = null;
    if (row.laporan_kondisi_json) {
      try {
        laporan = JSON.parse(row.laporan_kondisi_json);
      } catch {
        laporan = null;
      }
    }
    return {
      id: row.id,
      tipe,
      item: row[itemCol],
      kategori: row.kategori,
      nama: row.nama,
      nim: row.nim,
      prodi: row.prodi,
      tanggalPinjam: formatDate(row.tanggal_pinjam),
      tanggalKembali: formatDate(row.tanggal_kembali),
      status: row.status,
      laporanSelesai: Boolean(row.laporan_selesai),
      laporan,
      createdAt: row.created_at,
    };
  }

  // --- Laporan Kondisi (peminjam: pending / submit) ---
  app.get("/api/peminjaman/laporan-kondisi", authenticate, submitRoles, async (req, res) => {
    try {
      const pool = getPool();
      const today = new Date().toISOString().slice(0, 10);
      const userId = req.user?.id;
      const userNim = req.user?.nim;
      const results = [];

      for (const [tipe, { table, itemCol }] of Object.entries(laporanTables)) {
        let query = `
          SELECT * FROM ${table}
          WHERE status = 'Disetujui'
          AND tanggal_kembali IS NOT NULL
          AND tanggal_kembali < ?
          AND (laporan_selesai IS NULL OR laporan_selesai = 0)
        `;
        const params = [today];

        if (userNim) {
          query += " AND nim = ?";
          params.push(userNim);
        } else if (userId) {
          query += " AND user_id = ?";
          params.push(userId);
        }

        const [rows] = await pool.query(query, params);
        results.push(...rows.map((r) => formatLaporanRow(r, tipe, itemCol)));
      }

      results.sort((a, b) => new Date(b.tanggalKembali) - new Date(a.tanggalKembali));
      res.json(results);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.post("/api/peminjaman/laporan-kondisi", authenticate, submitRoles, async (req, res) => {
    try {
      const { peminjamanId, tipe, kondisi, kelengkapan, catatan } = req.body;
      if (!peminjamanId || !tipe) {
        return res.status(400).json({ success: false, message: "ID peminjaman dan tipe wajib diisi" });
      }

      const config = laporanTables[tipe];
      if (!config) {
        return res.status(400).json({ success: false, message: "Tipe peminjaman tidak valid" });
      }

      const pool = getPool();
      const [rows] = await pool.query(
        `SELECT * FROM ${config.table} WHERE id = ?`,
        [peminjamanId]
      );

      if (!rows.length) {
        return res.status(404).json({ success: false, message: "Data peminjaman tidak ditemukan" });
      }

      const row = rows[0];
      const userNim = req.user?.nim;
      const userId = req.user?.id;

      if (userNim && row.nim !== userNim) {
        return res.status(403).json({ success: false, message: "Anda tidak memiliki akses ke data ini" });
      }
      if (!userNim && userId && row.user_id !== userId) {
        return res.status(403).json({ success: false, message: "Anda tidak memiliki akses ke data ini" });
      }

      const laporanJson = JSON.stringify({
        kondisi: kondisi || "Baik",
        kelengkapan: kelengkapan || "",
        catatan: catatan || "",
        tanggalLaporan: new Date().toISOString(),
        pelapor: req.user?.nama || row.nama,
      });

      await pool.query(
        `UPDATE ${config.table} SET laporan_selesai = 1, laporan_kondisi_json = ? WHERE id = ?`,
        [laporanJson, peminjamanId]
      );

      res.json({ success: true, message: "Laporan kondisi berhasil dikirim" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
}

module.exports = { attachPeminjamanRoutes };
