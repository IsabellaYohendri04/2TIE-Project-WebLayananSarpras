const { getPool } = require("../config/db");

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

function attachJanitorRoutes(app) {
  const auth = app._sarprasAuth || {};
  const { authenticate, authorize } = auth;
  if (!authenticate || !authorize) return;

  app.get(
    "/api/janitor/dashboard",
    authenticate,
    authorize("janitor"),
    async (_req, res) => {
      try {
        const pool = getPool();

        const [[sarprasStats]] = await pool.query(
          "SELECT COUNT(*) AS total FROM sarpras"
        );

        const [[peminjamanStats]] = await pool.query(`
          SELECT COUNT(*) AS total FROM (
            SELECT id FROM peminjaman_barang WHERE status = 'Disetujui'
            UNION ALL
            SELECT id FROM peminjaman_ruangan WHERE status = 'Disetujui'
            UNION ALL
            SELECT id FROM peminjaman_laboratorium WHERE status = 'Disetujui'
          ) AS aktif
        `);

        const [[laporanStats]] = await pool.query(`
          SELECT COUNT(*) AS total FROM laporan_kerusakan
          WHERE status IN ('MENUNGGU', 'DIPROSES')
        `);

        const [peminjamanRows] = await pool.query(`
          SELECT item, nama_peminjam, tanggal_pinjam, tipe FROM (
            SELECT barang AS item, nama AS nama_peminjam, tanggal_pinjam, 'barang' AS tipe
            FROM peminjaman_barang WHERE status = 'Disetujui'
            UNION ALL
            SELECT ruangan, nama, tanggal_pinjam, 'ruangan'
            FROM peminjaman_ruangan WHERE status = 'Disetujui'
            UNION ALL
            SELECT laboratorium, nama, tanggal_pinjam, 'laboratorium'
            FROM peminjaman_laboratorium WHERE status = 'Disetujui'
          ) AS p
          ORDER BY tanggal_pinjam ASC
        `);

        const colorByTipe = {
          barang: "#ef4444",
          ruangan: "#3b82f6",
          laboratorium: "#f97316",
        };

        const events = peminjamanRows.map((row) => ({
          title: `${row.item} - ${row.nama_peminjam}`,
          date: formatDate(row.tanggal_pinjam),
          color: colorByTipe[row.tipe] || "#6366f1",
        }));

        const peminjamanByDate = peminjamanRows.reduce((acc, row) => {
          const date = formatDate(row.tanggal_pinjam);
          if (!acc[date]) acc[date] = [];
          acc[date].push({
            item: row.item,
            peminjam: row.nama_peminjam,
            tipe: row.tipe,
          });
          return acc;
        }, {});

        res.json({
          success: true,
          data: {
            totalSarpras: sarprasStats.total,
            totalPeminjamanAktif: peminjamanStats.total,
            totalLaporan: laporanStats.total,
            events,
            peminjamanByDate,
          },
        });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  );
}

module.exports = { attachJanitorRoutes };
