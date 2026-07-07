const { getPool } = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "Token autentikasi tidak ditemukan" });
  }
  try {
    const token = header.split(" ")[1];
    req.user = jwt.verify(
      token,
      process.env.JWT_SECRET || "sarpras_jwt_secret",
    );
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Token tidak valid atau sudah kadaluarsa",
    });
  }
}

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

function formatDateDisplay(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function attachPeminjamRoutes(app) {
  app.get("/api/peminjam/DashboardPeminjam", authenticate, async (req, res) => {
    try {
      const pool = getPool();
      const userId = req.user.id;

      // ── Nama user ──────────────────────────────────────────────────────────
      const [[userRow]] = await pool.query(
        "SELECT nama FROM users WHERE id = ?",
        [userId],
      );
      const namaUser = userRow?.nama || "Peminjam";

      // ── Events kalender ────────────────────────────────────────────────────
      const [calendarRows] = await pool.query(
        `
SELECT item, tanggal_pinjam, status, tipe FROM (
    SELECT barang AS item, tanggal_pinjam, status, 'barang' AS tipe
    FROM peminjaman_barang
    WHERE user_id = ?

    UNION ALL

    SELECT ruangan, tanggal_pinjam, status, 'ruangan'
    FROM peminjaman_ruangan
    WHERE user_id = ?

    UNION ALL

    SELECT laboratorium, tanggal_pinjam, status, 'laboratorium'
    FROM peminjaman_laboratorium
    WHERE user_id = ?
) p
ORDER BY tanggal_pinjam ASC
`,
        [userId, userId, userId],
      );

      const [notifRows] = await pool.query(
        `
SELECT item,status,updated_at FROM (

    SELECT barang AS item,status,updated_at
    FROM peminjaman_barang
    WHERE user_id=?

    UNION ALL

    SELECT ruangan,status,updated_at
    FROM peminjaman_ruangan
    WHERE user_id=?

    UNION ALL

    SELECT laboratorium,status,updated_at
    FROM peminjaman_laboratorium
    WHERE user_id=?

) n
ORDER BY updated_at DESC
LIMIT 5
`,
        [userId, userId, userId],
      );
      const notifikasi = notifRows.map((row) => {
        const tipeMap = {
          Disetujui: "disetujui",
          Menunggu: "diproses",
          Ditolak: "ditolak",
        };

        const labelMap = {
          Disetujui: "Disetujui",
          Menunggu: "Sedang Diproses",
          Ditolak: "Ditolak",
        };

        return {
          tipe: tipeMap[row.status] || "info",
          title: `${row.item} ${labelMap[row.status]}`,
          sub: row.updated_at ? formatDateDisplay(row.updated_at) : "",
        };
      });

      const peminjamanByDate = calendarRows.reduce((acc, row) => {
        const date = formatDate(row.tanggal_pinjam);

        if (!acc[date]) acc[date] = [];

        acc[date].push({
          item: row.item,
          status: row.status,
          tipe: row.tipe,
        });

        return acc;
      }, {});

      const colorByStatus = {
        Disetujui: "#22c55e",
        Menunggu: "#f59e0b",
        Ditolak: "#ef4444",
      };

      const events = calendarRows.map((row) => ({
        title: row.item,
        date: formatDate(row.tanggal_pinjam),
        color: colorByStatus[row.status] || "#6366f1",
      }));

      //   ── Ketersediaan sarpras hari ini ──────────────────────────────────────
      const today = new Date().toISOString().slice(0, 10);
      const [ketersediaanRows] = await pool.query(`
SELECT
    s.nama,
    s.status,
    s.tipe,
    COUNT(pb.id) AS dipinjam
FROM sarpras s

LEFT JOIN peminjaman_barang pb
ON pb.barang = s.nama
AND pb.status = 'Disetujui'
AND CURDATE() BETWEEN pb.tanggal_pinjam AND pb.tanggal_kembali

WHERE s.tipe = 'barang'

GROUP BY s.id

ORDER BY s.nama
LIMIT 6
`);

      const ketersediaan = ketersediaanRows.map((row) => ({
        nama: row.nama,
        status: row.dipinjam > 0 ? "Dipinjam" : row.status,
      }));

      // ── Peminjaman aktif milik user ────────────────────────────────────────
      const [[stats]] = await pool.query(
        `
SELECT
(
    SELECT COUNT(*) FROM (
        SELECT id FROM peminjaman_barang WHERE user_id = ?
        UNION ALL
        SELECT id FROM peminjaman_ruangan WHERE user_id = ?
        UNION ALL
        SELECT id FROM peminjaman_laboratorium WHERE user_id = ?
    ) t
) AS totalPengajuan,

(
    SELECT COUNT(*) FROM (
        SELECT id FROM peminjaman_barang WHERE user_id = ? AND status='Menunggu'
        UNION ALL
        SELECT id FROM peminjaman_ruangan WHERE user_id = ? AND status='Menunggu'
        UNION ALL
        SELECT id FROM peminjaman_laboratorium WHERE user_id = ? AND status='Menunggu'
    ) t
) AS menunggu,

(
    SELECT COUNT(*) FROM (
        SELECT id FROM peminjaman_barang WHERE user_id = ? AND status='Disetujui'
        UNION ALL
        SELECT id FROM peminjaman_ruangan WHERE user_id = ? AND status='Disetujui'
        UNION ALL
        SELECT id FROM peminjaman_laboratorium WHERE user_id = ? AND status='Disetujui'
    ) t
) AS disetujui,

(
    SELECT COUNT(*) FROM (
        SELECT id FROM peminjaman_barang WHERE user_id = ? AND status='Ditolak'
        UNION ALL
        SELECT id FROM peminjaman_ruangan WHERE user_id = ? AND status='Ditolak'
        UNION ALL
        SELECT id FROM peminjaman_laboratorium WHERE user_id = ? AND status='Ditolak'
    ) t
) AS ditolak
`,
        [
          userId,
          userId,
          userId,
          userId,
          userId,
          userId,
          userId,
          userId,
          userId,
          userId,
          userId,
          userId,
        ],
      );

      const [aktifRows] = await pool.query(
        `
SELECT item,tanggal_pinjam,tanggal_kembali,status FROM (

    SELECT barang AS item,tanggal_pinjam,tanggal_kembali,status
    FROM peminjaman_barang
    WHERE user_id=? AND status IN ('Disetujui','Menunggu')

    UNION ALL

    SELECT ruangan,tanggal_pinjam,tanggal_kembali,status
    FROM peminjaman_ruangan
    WHERE user_id=? AND status IN ('Disetujui','Menunggu')

    UNION ALL

    SELECT laboratorium,tanggal_pinjam,tanggal_kembali,status
    FROM peminjaman_laboratorium
    WHERE user_id=? AND status IN ('Disetujui','Menunggu')

) a
ORDER BY tanggal_pinjam ASC
LIMIT 5
`,
        [userId, userId, userId],
      );
      const peminjamanAktif = aktifRows.map((row) => ({
        nama: row.item,
        tanggalMulai: formatDateDisplay(row.tanggal_pinjam),
        tanggalSelesai: formatDateDisplay(row.tanggal_kembali),
        status: row.status,
      }));
      // ── Jadwal pengembalian terdekat ───────────────────────────────────────
      const [kembaliRows] = await pool.query(
        `
SELECT item,tanggal_kembali FROM (

    SELECT barang AS item,tanggal_kembali
    FROM peminjaman_barang
    WHERE user_id=? AND status='Disetujui'
    AND DATE(tanggal_kembali)>=CURDATE()

    UNION ALL

    SELECT ruangan,tanggal_kembali
    FROM peminjaman_ruangan
    WHERE user_id=? AND status='Disetujui'
    AND DATE(tanggal_kembali)>=CURDATE()

    UNION ALL

    SELECT laboratorium,tanggal_kembali
    FROM peminjaman_laboratorium
    WHERE user_id=? AND status='Disetujui'
    AND DATE(tanggal_kembali)>=CURDATE()

) k
ORDER BY tanggal_kembali ASC
LIMIT 5
`,
        [userId, userId, userId],
      );

      const jadwalPengembalian = kembaliRows.map((row) => ({
        nama: row.item,
        tanggalKembali: formatDateDisplay(row.tanggal_kembali),
      }));

      // ── Response ───────────────────────────────────────────────────────────
      res.json({
        success: true,
        data: {
          namaUser,

          totalPengajuan: stats.totalPengajuan,
          menunggu: stats.menunggu,
          disetujui: stats.disetujui,
          ditolak: stats.ditolak,

          events,
          peminjamanByDate,

          notifikasi,

          ketersediaan,

          peminjamanAktif,

          jadwalPengembalian,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
}

module.exports = { attachPeminjamRoutes };
