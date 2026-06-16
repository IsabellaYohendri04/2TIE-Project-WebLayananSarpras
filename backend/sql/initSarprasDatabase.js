const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");

function env(name, fallback) {
  return process.env[name] ?? fallback;
}

async function initSarprasDatabase() {
  const DB_NAME = env("DB_NAME", "sarpras_db");
  const DB_HOST = env("DB_HOST", "localhost");
  const DB_PORT = Number(env("DB_PORT", 3306));
  const DB_USER = env("DB_USER", "root");
  const DB_PASSWORD = env("DB_PASSWORD", "");

  // Ensure database exists
  const root = await mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 2,
  });

  await root.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
  await root.end();

  const db = await mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
  });

  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('pegawai_sarpras', 'janitor', 'peminjam') NOT NULL,
      nama VARCHAR(100) NOT NULL,
      nip VARCHAR(20) NULL,
      nim VARCHAR(20) NULL,
      jabatan VARCHAR(50) NULL,
      divisi VARCHAR(50) NULL DEFAULT 'Sarana Prasarana',
      prodi VARCHAR(50) NULL,
      no_hp VARCHAR(15) NULL,
      status ENUM('aktif', 'nonaktif') NOT NULL DEFAULT 'aktif',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // Minimal peminjaman tables to satisfy FE
  // Barang
  await db.query(`
    CREATE TABLE IF NOT EXISTS peminjaman_barang (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nama VARCHAR(100) NOT NULL,
      nim VARCHAR(50) NULL,
      prodi VARCHAR(100) NULL,
      barang VARCHAR(200) NOT NULL,
      kategori VARCHAR(100) NULL,
      image VARCHAR(255) NULL,
      tanggal_pinjam DATE NOT NULL,
      tanggal_kembali DATE NULL,
      status ENUM('Menunggu','Disetujui','Ditolak') NOT NULL DEFAULT 'Menunggu',
      catatan_admin TEXT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // Ruangan
  await db.query(`
    CREATE TABLE IF NOT EXISTS peminjaman_ruangan (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nama VARCHAR(100) NOT NULL,
      nim VARCHAR(50) NULL,
      prodi VARCHAR(100) NULL,
      ruangan VARCHAR(200) NOT NULL,
      kategori VARCHAR(100) NULL,
      image VARCHAR(255) NULL,
      tanggal_pinjam DATE NOT NULL,
      tanggal_kembali DATE NULL,
      status ENUM('Menunggu','Disetujui','Ditolak') NOT NULL DEFAULT 'Menunggu',
      catatan_admin TEXT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // Laboratorium
  await db.query(`
    CREATE TABLE IF NOT EXISTS peminjaman_laboratorium (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nama VARCHAR(100) NOT NULL,
      nim VARCHAR(50) NULL,
      prodi VARCHAR(100) NULL,
      laboratorium VARCHAR(200) NOT NULL,
      kategori VARCHAR(100) NULL,
      image VARCHAR(255) NULL,
      tanggal_pinjam DATE NOT NULL,
      tanggal_kembali DATE NULL,
      status ENUM('Menunggu','Disetujui','Ditolak') NOT NULL DEFAULT 'Menunggu',
      catatan_admin TEXT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // Seed at least one row for barang if table empty
  const [countRows] = await db.query(
    "SELECT COUNT(*) as total FROM peminjaman_barang"
  );
  if (countRows[0].total === 0) {
    await db.query(`
      INSERT INTO peminjaman_barang
        (nama, nim, prodi, barang, kategori, image, tanggal_pinjam, tanggal_kembali, status, catatan_admin)
      VALUES
        ('Mahasiswa Peminjam', '22010001', 'Teknik Informatika', 'Komputer', 'Teknologi', '/data/default-barang.png', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY), 'Menunggu', 'Mohon menunggu konfirmasi admin')
    `);
  }

  // Seed default users if empty
  const [userCountRows] = await db.query("SELECT COUNT(*) as total FROM users");
  if (userCountRows[0].total === 0) {
    await db.query(
      "INSERT INTO users (email, password, role, nama, nip, jabatan, divisi, no_hp, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        "admin@sarpras.ac.id",
        await bcrypt.hash("admin123", 10),
        "pegawai_sarpras",
        "Admin Sarpras",
        "198501012010011001",
        "Kepala Sarana Prasarana",
        "Sarana Prasarana",
        "081234567890",
        "aktif",
      ]
    );
    await db.query(
      "INSERT INTO users (email, password, role, nama, nim, prodi, no_hp, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        "peminjam@sarpras.ac.id",
        await bcrypt.hash("peminjam123", 10),
        "peminjam",
        "Mahasiswa Peminjam",
        "22010001",
        "Teknik Informatika",
        "085612345678",
        "aktif",
      ]
    );
    await db.query(
      "INSERT INTO users (email, password, role, nama, no_hp, status) VALUES (?, ?, ?, ?, ?, ?)",
      [
        "janitor@sarpras.ac.id",
        await bcrypt.hash("janitor123", 10),
        "janitor",
        "Petugas Kebersihan",
        "081298765432",
        "aktif",
      ]
    );
  }

  await db.end();
}

module.exports = { initSarprasDatabase };

