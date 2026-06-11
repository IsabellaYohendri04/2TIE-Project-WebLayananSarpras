-- Database: sarpras_db
-- Jalankan manual jika init otomatis gagal:
-- mysql -u root -p < src/pages/pegawai/server/schema.sql

CREATE DATABASE IF NOT EXISTS sarpras_db;
USE sarpras_db;

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
