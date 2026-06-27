const bcrypt = require("bcryptjs");
const { getPool } = require("../config/db");

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

function formatDisplayDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    const str = String(value);
    return str.length >= 5 ? str.slice(0, 5) : str;
  }
  return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

function statusBadge(status) {
  if (status === "Disetujui") return "bg-green-100 text-green-700";
  if (status === "Ditolak") return "bg-red-100 text-red-700";
  return "bg-yellow-100 text-yellow-700";
}

function sanitizePegawai(user) {
  return {
    id: user.id,
    nip: user.nip,
    nama: user.nama,
    email: user.email,
    divisi: user.divisi,
    no_hp: user.no_hp,
    status: user.status,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
}

function attachPegawaiRoutes(app) {
  const auth = app._sarprasAuth || {};
  const { authenticate, authorize } = auth;
  if (!authenticate || !authorize) return;

  app.get(
    "/api/pegawai/dashboard",
    authenticate,
    authorize("pegawai_sarpras"),
    async (_req, res) => {
      try {
        const pool = getPool();
        const today = new Date().toISOString().slice(0, 10);

        const unionQuery = `
          SELECT id, nama, barang AS item, status, tanggal_pinjam, tanggal_kembali, created_at, 'barang' AS tipe
          FROM peminjaman_barang
          UNION ALL
          SELECT id, nama, ruangan AS item, status, tanggal_pinjam, tanggal_kembali, created_at, 'ruangan'
          FROM peminjaman_ruangan
          UNION ALL
          SELECT id, nama, laboratorium AS item, status, tanggal_pinjam, tanggal_kembali, created_at, 'laboratorium'
          FROM peminjaman_laboratorium
        `;

        const [[statsRow]] = await pool.query(`
          SELECT
            SUM(CASE WHEN status = 'Disetujui' AND (tanggal_kembali IS NULL OR tanggal_kembali >= ?) THEN 1 ELSE 0 END) AS aktif,
            SUM(CASE WHEN status = 'Menunggu' THEN 1 ELSE 0 END) AS menunggu,
            SUM(CASE WHEN status = 'Disetujui' AND tanggal_kembali IS NOT NULL AND tanggal_kembali < ? THEN 1 ELSE 0 END) AS selesai,
            SUM(CASE WHEN status = 'Disetujui' AND tanggal_kembali IS NOT NULL AND tanggal_kembali < ? THEN 1 ELSE 0 END) AS terlambat
          FROM (${unionQuery}) AS p
        `, [today, today, today]);

        const chartLabels = [];
        const chartPeminjaman = [];
        const chartPengembalian = [];

        for (let i = 6; i >= 0; i -= 1) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().slice(0, 10);
          chartLabels.push(
            d.toLocaleDateString("id-ID", { day: "numeric", month: "short" })
          );

          const [[pinjamRow]] = await pool.query(
            `SELECT COUNT(*) AS total FROM (${unionQuery}) AS p WHERE DATE(tanggal_pinjam) = ?`,
            [dateStr]
          );
          const [[kembaliRow]] = await pool.query(
            `SELECT COUNT(*) AS total FROM (${unionQuery}) AS p WHERE DATE(tanggal_kembali) = ?`,
            [dateStr]
          );
          chartPeminjaman.push(pinjamRow.total);
          chartPengembalian.push(kembaliRow.total);
        }

        const [recentRows] = await pool.query(
          `SELECT * FROM (${unionQuery}) AS p ORDER BY created_at DESC LIMIT 5`
        );

        const recentPeminjaman = recentRows.map((row) => ({
          id: row.id,
          tipe: row.tipe,
          nama: row.item,
          peminjam: row.nama,
          tanggal: formatDisplayDate(row.created_at),
          jam: formatTime(row.created_at),
          status: row.status,
          badge: statusBadge(row.status),
        }));

        const [pendingRows] = await pool.query(
          `SELECT * FROM (${unionQuery}) AS p WHERE status = 'Menunggu' ORDER BY created_at DESC LIMIT 5`
        );

        const [dueRows] = await pool.query(
          `SELECT * FROM (${unionQuery}) AS p
           WHERE status = 'Disetujui' AND tanggal_kembali IS NOT NULL
           AND tanggal_kembali BETWEEN ? AND DATE_ADD(?, INTERVAL 3 DAY)
           ORDER BY tanggal_kembali ASC LIMIT 5`,
          [today, today]
        );

        const notifications = [
          ...pendingRows.map((row) => ({
            id: `pending-${row.tipe}-${row.id}`,
            color: "bg-yellow-500",
            title: `Pengajuan ${row.item} — ${row.nama}`,
            sub: "Menunggu persetujuan Anda",
            tanggal: formatDisplayDate(row.created_at),
            link: row.tipe === "barang"
              ? "/peminjaman/barang"
              : row.tipe === "ruangan"
                ? "/peminjaman/ruangan"
                : "/peminjaman/laboratorium",
          })),
          ...dueRows.map((row) => ({
            id: `due-${row.tipe}-${row.id}`,
            color: "bg-blue-500",
            title: `Pengembalian ${row.item}`,
            sub: `${row.nama} · jatuh tempo ${formatDisplayDate(row.tanggal_kembali)}`,
            tanggal: formatDisplayDate(row.tanggal_kembali),
            link: row.tipe === "barang"
              ? "/peminjaman/barang"
              : row.tipe === "ruangan"
                ? "/peminjaman/ruangan"
                : "/peminjaman/laboratorium",
          })),
        ].slice(0, 8);

        const [[fasilitasRow]] = await pool.query(`
          SELECT
            (SELECT COUNT(*) FROM barang) +
            (SELECT COUNT(*) FROM sarpras WHERE tipe IN ('ruangan', 'laboratorium')) AS total
        `);

        res.json({
          success: true,
          data: {
            stats: {
              aktif: Number(statsRow.aktif) || 0,
              menunggu: Number(statsRow.menunggu) || 0,
              selesai: Number(statsRow.selesai) || 0,
              terlambat: Number(statsRow.terlambat) || 0,
              totalFasilitas: Number(fasilitasRow.total) || 0,
            },
            chart: {
              labels: chartLabels,
              peminjaman: chartPeminjaman,
              pengembalian: chartPengembalian,
            },
            recentPeminjaman,
            notifications,
          },
        });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  );

  app.get(
    "/api/pegawai/notifications",
    authenticate,
    authorize("pegawai_sarpras"),
    async (_req, res) => {
      try {
        const pool = getPool();
        const today = new Date().toISOString().slice(0, 10);
        const unionQuery = `
          SELECT id, nama, barang AS item, status, tanggal_kembali, created_at, 'barang' AS tipe
          FROM peminjaman_barang
          UNION ALL
          SELECT id, nama, ruangan AS item, status, tanggal_kembali, created_at, 'ruangan'
          FROM peminjaman_ruangan
          UNION ALL
          SELECT id, nama, laboratorium AS item, status, tanggal_kembali, created_at, 'laboratorium'
          FROM peminjaman_laboratorium
        `;

        const [pendingRows] = await pool.query(
          `SELECT * FROM (${unionQuery}) AS p WHERE status = 'Menunggu' ORDER BY created_at DESC LIMIT 6`
        );

        const [dueRows] = await pool.query(
          `SELECT * FROM (${unionQuery}) AS p
           WHERE status = 'Disetujui' AND tanggal_kembali IS NOT NULL
           AND tanggal_kembali BETWEEN ? AND DATE_ADD(?, INTERVAL 3 DAY)
           ORDER BY tanggal_kembali ASC LIMIT 4`,
          [today, today]
        );

        const notifications = [
          ...pendingRows.map((row) => ({
            id: `pending-${row.tipe}-${row.id}`,
            title: `Pengajuan ${row.item} — ${row.nama}`,
            message: "Menunggu persetujuan Anda",
            tanggal: formatDisplayDate(row.created_at),
            link: row.tipe === "barang"
              ? "/peminjaman/barang"
              : row.tipe === "ruangan"
                ? "/peminjaman/ruangan"
                : "/peminjaman/laboratorium",
          })),
          ...dueRows.map((row) => ({
            id: `due-${row.tipe}-${row.id}`,
            title: `Pengembalian ${row.item}`,
            message: `${row.nama} · jatuh tempo ${formatDisplayDate(row.tanggal_kembali)}`,
            tanggal: formatDisplayDate(row.tanggal_kembali),
            link: row.tipe === "barang"
              ? "/peminjaman/barang"
              : row.tipe === "ruangan"
                ? "/peminjaman/ruangan"
                : "/peminjaman/laboratorium",
          })),
        ];

        res.json({ success: true, data: notifications });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  );

  app.get(
    "/api/pegawai",
    authenticate,
    authorize("pegawai_sarpras"),
    async (req, res) => {
      try {
        const { search, status, page = "1", limit = "10" } = req.query;
        const pageNum = Math.max(1, parseInt(page, 10) || 1);
        const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
        const offset = (pageNum - 1) * limitNum;

        let where =
          "FROM users WHERE role = 'pegawai_sarpras'";
        const params = [];

        if (search) {
          where +=
            " AND (nama LIKE ? OR nip LIKE ? OR email LIKE ? OR divisi LIKE ?)";
          const term = `%${search}%`;
          params.push(term, term, term, term);
        }

        if (status && status !== "all") {
          where += " AND status = ?";
          params.push(status);
        }

        const pool = getPool();
        const [[countRow]] = await pool.query(
          `SELECT COUNT(*) AS total ${where}`,
          params
        );
        const total = Number(countRow.total) || 0;

        const [[statsRow]] = await pool.query(
          `SELECT
            SUM(CASE WHEN status = 'aktif' THEN 1 ELSE 0 END) AS aktif,
            SUM(CASE WHEN status = 'nonaktif' THEN 1 ELSE 0 END) AS nonaktif
          ${where}`,
          params
        );

        const [rows] = await pool.query(
          `SELECT id, nip, nama, email, divisi, no_hp, status, created_at, updated_at ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
          [...params, limitNum, offset]
        );

        res.json({
          success: true,
          data: rows,
          stats: {
            total,
            aktif: Number(statsRow.aktif) || 0,
            nonaktif: Number(statsRow.nonaktif) || 0,
          },
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum) || 1,
          },
        });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  );

  app.get(
    "/api/pegawai/:id",
    authenticate,
    authorize("pegawai_sarpras"),
    async (req, res) => {
      try {
        const pool = getPool();
        const [rows] = await pool.query(
          "SELECT id, nip, nama, email, divisi, no_hp, status, created_at, updated_at FROM users WHERE id = ? AND role = 'pegawai_sarpras'",
          [req.params.id]
        );

        if (rows.length === 0) {
          return res
            .status(404)
            .json({ success: false, message: "Pegawai tidak ditemukan" });
        }

        res.json({ success: true, data: rows[0] });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  );

  app.post(
    "/api/pegawai",
    authenticate,
    authorize("pegawai_sarpras"),
    async (req, res) => {
      try {
        const { nip, nama, email, password, divisi, no_hp, status } =
          req.body;

        if (!nip || !nama || !email || !password) {
          return res.status(400).json({
            success: false,
            message:
              "NIP, nama, email, dan password wajib diisi",
          });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const pool = getPool();
        const [result] = await pool.query(
          "INSERT INTO users (email, password, role, nama, nip, divisi, no_hp, status) VALUES (?, ?, 'pegawai_sarpras', ?, ?, ?, ?, ?)",
          [
            email,
            hashedPassword,
            nama,
            nip,
            divisi || "Sarana Prasarana",
            no_hp || null,
            status || "aktif",
          ]
        );

        const [rows] = await pool.query(
          "SELECT id, nip, nama, email, divisi, no_hp, status, created_at, updated_at FROM users WHERE id = ?",
          [result.insertId]
        );

        res.status(201).json({ success: true, data: sanitizePegawai(rows[0]) });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  );

  app.put(
    "/api/pegawai/:id",
    authenticate,
    authorize("pegawai_sarpras"),
    async (req, res) => {
      try {
        const { nip, nama, email, password, divisi, no_hp, status } =
          req.body;

        if (!nip || !nama || !email) {
          return res.status(400).json({
            success: false,
            message:
              "NIP, nama, dan email wajib diisi",
          });
        }

        const pool = getPool();

        const [existing] = await pool.query(
          "SELECT * FROM users WHERE id = ? AND role = 'pegawai_sarpras'",
          [req.params.id]
        );

        if (existing.length === 0) {
          return res.status(404).json({
            success: false,
            message: "Pegawai tidak ditemukan",
          });
        }

        if (password) {
          const hashedPassword = await bcrypt.hash(password, 10);

          await pool.query(
            "UPDATE users SET nip = ?, nama = ?, email = ?, password = ?, divisi = ?, no_hp = ?, status = ? WHERE id = ? AND role = 'pegawai_sarpras'",
            [
              nip,
              nama,
              email,
              hashedPassword,
              divisi || "Sarana Prasarana",
              no_hp || null,
              status || "aktif",
              req.params.id,
            ]
          );
        } else {
          await pool.query(
            "UPDATE users SET nip = ?, nama = ?, email = ?, divisi = ?, no_hp = ?, status = ? WHERE id = ? AND role = 'pegawai_sarpras'",
            [
              nip,
              nama,
              email,
              divisi || "Sarana Prasarana",
              no_hp || null,
              status || "aktif",
              req.params.id,
            ]
          );
        }

        const [rows] = await pool.query(
          "SELECT id, nip, nama, email, divisi, no_hp, status, created_at, updated_at FROM users WHERE id = ?",
          [req.params.id]
        );

        res.json({ success: true, data: sanitizePegawai(rows[0]) });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  );

  app.delete(
    "/api/pegawai/:id",
    authenticate,
    authorize("pegawai_sarpras"),
    async (req, res) => {
      try {
        if (Number(req.params.id) === req.user.id) {
          return res.status(400).json({
            success: false,
            message: "Tidak dapat menghapus akun yang sedang login",
          });
        }

        const pool = getPool();
        const [existing] = await pool.query(
          "SELECT * FROM users WHERE id = ? AND role = 'pegawai_sarpras'",
          [req.params.id]
        );

        if (existing.length === 0) {
          return res.status(404).json({
            success: false,
            message: "Pegawai tidak ditemukan",
          });
        }

        await pool.query(
          "DELETE FROM users WHERE id = ? AND role = 'pegawai_sarpras'",
          [req.params.id]
        );

        res.json({ success: true, message: "Pegawai berhasil dihapus" });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  );

  const laporanTables = {
    barang: { table: "peminjaman_barang", itemCol: "barang" },
    ruangan: { table: "peminjaman_ruangan", itemCol: "ruangan" },
    laboratorium: { table: "peminjaman_laboratorium", itemCol: "laboratorium" },
  };

  function parseLaporanRow(row, tipe, itemCol) {
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

  app.get(
    "/api/pegawai/laporan-kondisi",
    authenticate,
    authorize("pegawai_sarpras"),
    async (req, res) => {
      try {
        const { search, status = "all", tipe = "all" } = req.query;
        const pool = getPool();
        const results = [];

        const typesToQuery =
          tipe && tipe !== "all" ? [[tipe, laporanTables[tipe]]].filter(([, v]) => v) : Object.entries(laporanTables);

        for (const [typeKey, { table, itemCol }] of typesToQuery) {
          let query = `SELECT * FROM ${table} WHERE laporan_selesai = 1`;
          const params = [];

          if (search) {
            query += ` AND (${itemCol} LIKE ? OR nama LIKE ? OR nim LIKE ?)`;
            const term = `%${search}%`;
            params.push(term, term, term);
          }

          const [rows] = await pool.query(query, params);
          results.push(...rows.map((r) => parseLaporanRow(r, typeKey, itemCol)));
        }

        let filtered = results;
        if (status === "pending") {
          filtered = results.filter((r) => !r.laporan);
        } else if (status === "submitted") {
          filtered = results.filter((r) => r.laporan);
        }

        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.json({ success: true, data: filtered });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  );

  app.delete(
    "/api/pegawai/laporan-kondisi/:tipe/:id",
    authenticate,
    authorize("pegawai_sarpras"),
    async (req, res) => {
      try {
        const config = laporanTables[req.params.tipe];
        if (!config) {
          return res.status(400).json({ success: false, message: "Tipe tidak valid" });
        }

        const pool = getPool();
        await pool.query(
          `UPDATE ${config.table} SET laporan_selesai = 0, laporan_kondisi_json = NULL WHERE id = ?`,
          [req.params.id]
        );

        res.json({ success: true, message: "Laporan kondisi berhasil dihapus" });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  );
}

module.exports = { attachPegawaiRoutes };