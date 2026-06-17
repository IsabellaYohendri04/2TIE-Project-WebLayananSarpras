const { getPool } = require("../config/db");

// GET semua barang (untuk peminjam & pegawai)
async function getBarang(req, res) {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT * FROM barang ORDER BY created_at DESC"
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// CREATE barang (pegawai sarpras)
async function createBarang(req, res) {
  try {
    const { nama, kategori, status, kondisi } = req.body;
    const image = req.file ? req.file.filename : null;

    const pool = getPool();

    const [result] = await pool.query(
      `INSERT INTO barang (nama, kategori, status, kondisi, image)
       VALUES (?, ?, ?, ?, ?)`,
      [nama, kategori, status || "Tersedia", kondisi, image]
    );

    res.status(201).json({
      success: true,
      message: "Barang berhasil ditambahkan",
      id: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// UPDATE barang
async function updateBarang(req, res) {
  try {
    const { id } = req.params;
    const { nama, kategori, status, kondisi } = req.body;

    const pool = getPool();

    await pool.query(
      `UPDATE barang SET nama=?, kategori=?, status=?, kondisi=? WHERE id=?`,
      [nama, kategori, status, kondisi, id]
    );

    res.json({ success: true, message: "Barang berhasil diupdate" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// DELETE barang
async function deleteBarang(req, res) {
  try {
    const { id } = req.params;
    const pool = getPool();

    await pool.query("DELETE FROM barang WHERE id=?", [id]);

    res.json({ success: true, message: "Barang dihapus" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  getBarang,
  createBarang,
  updateBarang,
  deleteBarang,
};