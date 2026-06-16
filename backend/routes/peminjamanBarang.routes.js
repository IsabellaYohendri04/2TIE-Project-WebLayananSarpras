const { getPool } = require("../config/db");

function formatBarangRow(row) {
  const tanggalPinjam = row.tanggal_pinjam
    ? new Date(row.tanggal_pinjam).toISOString().slice(0, 10)
    : "";
  const tanggalKembali = row.tanggal_kembali
    ? new Date(row.tanggal_kembali).toISOString().slice(0, 10)
    : "";

  return {
    id: row.id,
    image: row.image || "/images/icon-02.svg",
    nama: row.nama,
    nim: row.nim,
    prodi: row.prodi,
    barang: row.barang,
    kategori: row.kategori,
    tanggalPinjam: tanggalPinjam,
    tanggalKembali: tanggalKembali,
    status: row.status,
    catatanAdmin: row.catatan_admin,
  };
}

async function getBarangPeminjaman(_req, res) {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT * FROM peminjaman_barang ORDER BY created_at DESC"
    );
    res.json(rows.map(formatBarangRow));
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getBarangPeminjamanById(req, res) {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT * FROM peminjaman_barang WHERE id = ?",
      [Number(req.params.id)]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Data tidak ditemukan" });
    }

    res.json(formatBarangRow(rows[0]));
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { getBarangPeminjaman, getBarangPeminjamanById };
