const { getPool } = require("../config/db");

function formatLaporanRow(row) {
  return {
    id: row.id,
    sarpras_id: row.sarpras_id,
    barang: row.barang,
    pelapor: row.pelapor,
    isi_laporan: row.isi_laporan,
    deskripsi: row.isi_laporan,
    status: row.status,
    image: row.image || "/images/icon-02.svg",
    tanggal: row.tanggal
      ? new Date(row.tanggal).toISOString().slice(0, 10)
      : "",
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function attachLaporanRoutes(app) {
  const auth = app._sarprasAuth || {};
  const { authenticate, authorize } = auth;
  if (!authenticate || !authorize) return;

  const janitorOrPegawai = authorize("janitor", "pegawai_sarpras");

  app.get("/api/laporan", authenticate, janitorOrPegawai, async (req, res) => {
    try {
      const { status } = req.query;
      let query = "SELECT * FROM laporan_kerusakan WHERE 1=1";
      const params = [];

      if (status && status !== "ALL") {
        query += " AND status = ?";
        params.push(status);
      }

      query += " ORDER BY tanggal DESC, created_at DESC";

      const pool = getPool();
      const [rows] = await pool.query(query, params);

      res.json({ success: true, data: rows.map(formatLaporanRow) });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.put("/api/laporan/:id", authenticate, janitorOrPegawai, async (req, res) => {
    try {
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: "Status wajib diisi",
        });
      }

      const allowed = ["MENUNGGU", "DIPROSES", "SELESAI", "DITOLAK"];
      if (!allowed.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Status tidak valid",
        });
      }

      const pool = getPool();
      const [existing] = await pool.query(
        "SELECT id FROM laporan_kerusakan WHERE id = ?",
        [req.params.id]
      );

      if (existing.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Laporan tidak ditemukan" });
      }

      await pool.query("UPDATE laporan_kerusakan SET status = ? WHERE id = ?", [
        status,
        req.params.id,
      ]);

      const [rows] = await pool.query(
        "SELECT * FROM laporan_kerusakan WHERE id = ?",
        [req.params.id]
      );

      res.json({ success: true, data: formatLaporanRow(rows[0]) });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
}

module.exports = { attachLaporanRoutes };
