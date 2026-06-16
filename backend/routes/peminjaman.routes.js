const { getPool } = require("../config/db");

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

function formatPeminjamanRow(row) {
  const approved = row.status === "Disetujui";

  return {
    id: row.id,
    tipe: row.tipe,
    item: row.item,
    nama_peminjam: row.nama_peminjam,
    peminjam: row.nama_peminjam,
    barang: row.item,
    tanggal_pinjam: formatDate(row.tanggal_pinjam),
    tanggal: formatDate(row.tanggal_pinjam),
    tanggal_kembali: formatDate(row.tanggal_kembali),
    status: approved ? "APPROVED" : row.status,
    status_asli: row.status,
  };
}

function attachPeminjamanRoutes(app) {
  const auth = app._sarprasAuth || {};
  const { authenticate, authorize } = auth;
  if (!authenticate || !authorize) return;

  const allowedRoles = authorize("janitor", "pegawai_sarpras", "peminjam");

  app.get("/api/peminjaman", authenticate, allowedRoles, async (req, res) => {
    try {
      const { status } = req.query;
      let statusFilter = null;

      if (status) {
        const normalized = status.toLowerCase();
        if (normalized === "approved" || normalized === "disetujui") {
          statusFilter = "Disetujui";
        } else if (normalized === "pending" || normalized === "menunggu") {
          statusFilter = "Menunggu";
        } else if (normalized === "rejected" || normalized === "ditolak") {
          statusFilter = "Ditolak";
        } else {
          statusFilter = status;
        }
      }

      const pool = getPool();
      let query = `
        SELECT id, nama AS nama_peminjam, barang AS item, tanggal_pinjam, tanggal_kembali, status, 'barang' AS tipe
        FROM peminjaman_barang
        UNION ALL
        SELECT id, nama, ruangan, tanggal_pinjam, tanggal_kembali, status, 'ruangan'
        FROM peminjaman_ruangan
        UNION ALL
        SELECT id, nama, laboratorium, tanggal_pinjam, tanggal_kembali, status, 'laboratorium'
        FROM peminjaman_laboratorium
      `;

      const params = [];
      if (statusFilter) {
        query = `
          SELECT * FROM (${query}) AS peminjaman_gabungan
          WHERE status = ?
          ORDER BY tanggal_pinjam DESC
        `;
        params.push(statusFilter);
      } else {
        query = `
          SELECT * FROM (${query}) AS peminjaman_gabungan
          ORDER BY tanggal_pinjam DESC
        `;
      }

      const [rows] = await pool.query(query, params);
      res.json({ success: true, data: rows.map(formatPeminjamanRow) });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
}

module.exports = { attachPeminjamanRoutes };
