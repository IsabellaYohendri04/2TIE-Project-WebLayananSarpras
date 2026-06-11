import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const DB_NAME = process.env.DB_NAME || "sarpras_db";

let pool;

export async function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
    });
  }
  return pool;
}

export async function initDatabase() {
  const rootPool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    waitForConnections: true,
    connectionLimit: 5,
  });

  await rootPool.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
  await rootPool.end();

  const db = await getPool();

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

  const [rows] = await db.query("SELECT COUNT(*) as total FROM users");
  if (rows[0].total === 0) {
    await seedDefaultUsers(db);
  }
}

async function seedDefaultUsers(db) {
  const users = [
    {
      email: "admin@sarpras.ac.id",
      password: await bcrypt.hash("admin123", 10),
      role: "pegawai_sarpras",
      nama: "Admin Sarpras",
      nip: "198501012010011001",
      jabatan: "Kepala Sarana Prasarana",
      divisi: "Sarana Prasarana",
      no_hp: "081234567890",
      status: "aktif",
    },
    {
      email: "janitor@sarpras.ac.id",
      password: await bcrypt.hash("janitor123", 10),
      role: "janitor",
      nama: "Petugas Kebersihan",
      no_hp: "081298765432",
      status: "aktif",
    },
    {
      email: "peminjam@sarpras.ac.id",
      password: await bcrypt.hash("peminjam123", 10),
      role: "peminjam",
      nama: "Mahasiswa Peminjam",
      nim: "22010001",
      prodi: "Teknik Informatika",
      no_hp: "085612345678",
      status: "aktif",
    },
  ];

  for (const user of users) {
    await db.query(
      `INSERT INTO users (email, password, role, nama, nip, nim, jabatan, divisi, prodi, no_hp, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.email,
        user.password,
        user.role,
        user.nama,
        user.nip || null,
        user.nim || null,
        user.jabatan || null,
        user.divisi || null,
        user.prodi || null,
        user.no_hp || null,
        user.status,
      ]
    );
  }

  console.log("Akun default berhasil dibuat (lihat .env.example untuk kredensial)");
}

export default getPool;
