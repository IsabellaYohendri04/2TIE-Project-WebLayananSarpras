-- Import manual via HeidiSQL / phpMyAdmin di Laragon (opsional)
-- Database dibuat otomatis oleh `npm run init-db` jika MySQL sudah terhubung.

CREATE DATABASE IF NOT EXISTS `sarpras_db`;
USE `sarpras_db`;

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
);

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
);

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
);

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
);

CREATE TABLE IF NOT EXISTS sarpras (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(200) NOT NULL,
  kategori VARCHAR(100) NOT NULL,
  tipe ENUM('barang', 'ruangan', 'laboratorium') NOT NULL DEFAULT 'barang',
  status ENUM('Tersedia', 'Dipinjam', 'Dipakai', 'Rusak', 'Maintenance') NOT NULL DEFAULT 'Tersedia',
  lokasi VARCHAR(200) NULL,
  kondisi_teks TEXT NULL,
  kondisi_image VARCHAR(500) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS laporan_kerusakan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sarpras_id INT NULL,
  barang VARCHAR(200) NOT NULL,
  pelapor VARCHAR(100) NOT NULL,
  pelapor_id INT NULL,
  isi_laporan TEXT NOT NULL,
  status ENUM('MENUNGGU', 'DIPROSES', 'SELESAI', 'DITOLAK') NOT NULL DEFAULT 'MENUNGGU',
  image VARCHAR(500) NULL,
  tanggal DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (sarpras_id) REFERENCES sarpras(id) ON DELETE SET NULL
);
