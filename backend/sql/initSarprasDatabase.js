const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const { getDbConfig } = require("../config/db");

function loadSeedPeminjamanBarang() {
  const jsonPath = path.join(
    __dirname,
    "../../public/data/peminjaman-barang.json"
  );

  if (!fs.existsSync(jsonPath)) return [];

  return JSON.parse(fs.readFileSync(jsonPath, "utf8")).map((item) => ({
    nama: item.nama,
    nim: item.nim,
    prodi: item.prodi,
    barang: item.barang,
    kategori: item.kategori,
    status: item.status,
    tanggal_pinjam: item.tanggalPinjam,
    tanggal_kembali: item.tanggalKembali,
    image: item.image,
    catatan_admin: item.catatanAdmin || "",
  }));
}

async function initSarprasDatabase() {
  const DB_NAME = process.env.DB_NAME || "sarpras_db";

  const root = await mysql.createPool({
    ...getDbConfig(false),
    connectionLimit: 2,
  });

  await root.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
  await root.end();

  const db = await mysql.createPool({
    ...getDbConfig(true),
    connectionLimit: 10,
  });

  // ================= USERS =================
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('pegawai_sarpras', 'janitor', 'peminjam') NOT NULL,
      nama VARCHAR(100) NOT NULL,
      nip VARCHAR(20) NULL,
      nim VARCHAR(20) NULL,
      prodi VARCHAR(50) NULL,
      no_hp VARCHAR(15) NULL,
      status ENUM('aktif', 'nonaktif') NOT NULL DEFAULT 'aktif',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // ================= SARPRAS MASTER =================
  await db.query(`
    CREATE TABLE IF NOT EXISTS sarpras (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nama VARCHAR(200) NOT NULL,
      kategori VARCHAR(100) NOT NULL,
      tipe ENUM('barang', 'ruangan', 'laboratorium') NOT NULL,
      status ENUM('Tersedia','Dipinjam','Dipakai','Rusak','Maintenance') NOT NULL DEFAULT 'Tersedia',
      lokasi VARCHAR(200) NULL,
      kondisi_teks TEXT NULL,
      kondisi_image VARCHAR(500) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // ================= PEMINJAMAN =================
  await db.query(`
    CREATE TABLE IF NOT EXISTS peminjaman_barang (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nama VARCHAR(100) NOT NULL,
      nim VARCHAR(50),
      prodi VARCHAR(100),
      barang VARCHAR(200) NOT NULL,
      kategori VARCHAR(100),
      image VARCHAR(255),
      tanggal_pinjam DATE NOT NULL,
      tanggal_kembali DATE,
      status ENUM('Menunggu','Disetujui','Ditolak') DEFAULT 'Menunggu',
      catatan_admin TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS peminjaman_ruangan (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nama VARCHAR(100) NOT NULL,
      nim VARCHAR(50),
      prodi VARCHAR(100),
      ruangan VARCHAR(200) NOT NULL,
      kategori VARCHAR(100),
      image VARCHAR(255),
      tanggal_pinjam DATE NOT NULL,
      tanggal_kembali DATE,
      status ENUM('Menunggu','Disetujui','Ditolak') DEFAULT 'Menunggu',
      catatan_admin TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS peminjaman_laboratorium (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nama VARCHAR(100) NOT NULL,
      nim VARCHAR(50),
      prodi VARCHAR(100),
      laboratorium VARCHAR(200) NOT NULL,
      kategori VARCHAR(100),
      image VARCHAR(255),
      tanggal_pinjam DATE NOT NULL,
      tanggal_kembali DATE,
      status ENUM('Menunggu','Disetujui','Ditolak') DEFAULT 'Menunggu',
      catatan_admin TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // ================= EXTRA COLS SAFETY =================
  const extraCols = [
    "user_id INT NULL",
    "jam_mulai TIME NULL",
    "jam_selesai TIME NULL",
    "gedung_id INT NULL",
    "organisasi VARCHAR(100) NULL",
    "detail_json TEXT NULL",
    "laporan_selesai TINYINT(1) DEFAULT 0",
  ];

  for (const table of [
    "peminjaman_barang",
    "peminjaman_ruangan",
    "peminjaman_laboratorium",
  ]) {
    for (const col of extraCols) {
      try {
        await db.query(`ALTER TABLE ${table} ADD COLUMN ${col}`);
      } catch {}
    }
  }

  // ================= SEED USERS =================
  const [userCount] = await db.query("SELECT COUNT(*) as total FROM users");

  if (userCount[0].total === 0) {
    await db.query(
      `INSERT INTO users (email,password,role,nama,nip,prodi,no_hp,status)
       VALUES (?,?,?,?,?,?,?,?)`,
      [
        "admin@sarpras.ac.id",
        await bcrypt.hash("admin123", 10),
        "pegawai_sarpras",
        "Admin Sarpras",
        "19850101",
        "Sistem",
        "081234567890",
        "aktif",
      ]
    );
  }

  // ================= SEED PEMINJAMAN =================
  const [barangCount] = await db.query(
    "SELECT COUNT(*) as total FROM peminjaman_barang"
  );

  if (barangCount[0].total === 0) {
    const seed = loadSeedPeminjamanBarang();

    for (const item of seed) {
      await db.query(
        `INSERT INTO peminjaman_barang
        (nama,nim,prodi,barang,kategori,image,tanggal_pinjam,tanggal_kembali,status,catatan_admin)
        VALUES (?,?,?,?,?,?,?,?,?,?)`,
        [
          item.nama,
          item.nim,
          item.prodi,
          item.barang,
          item.kategori,
          item.image,
          item.tanggal_pinjam,
          item.tanggal_kembali,
          item.status,
          item.catatan_admin,
        ]
      );
    }
  }

  await db.end();
  console.log(`Database "${DB_NAME}" siap digunakan`);
}

module.exports = { initSarprasDatabase };