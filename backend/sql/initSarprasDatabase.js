const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const { getDbConfig } = require("../config/db");

function loadSeedPeminjamanBarang() {
  const jsonPath = path.join(
    __dirname,
    "../../public/data/peminjaman-barang.json",
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
      divisi VARCHAR(100) NULL,
      status ENUM('aktif', 'nonaktif') NOT NULL DEFAULT 'aktif',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  try {
    await db.query(`ALTER TABLE users DROP COLUMN jabatan`);
  } catch {
    // kolom jabatan mungkin sudah tidak ada
  }

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

  // ================= GEDUNG / RUANGAN / LAB =================
  await db.query(`
    CREATE TABLE IF NOT EXISTS gedung (
      id INT AUTO_INCREMENT PRIMARY KEY,
      slug VARCHAR(50) NOT NULL UNIQUE,
      nama VARCHAR(100) NOT NULL,
      icon VARCHAR(10) DEFAULT '🏢',
      deskripsi TEXT,
      lantai INT DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS ruangan (
      id INT AUTO_INCREMENT PRIMARY KEY,
      gedung_id INT NOT NULL,
      kode VARCHAR(20) NOT NULL,
      nama VARCHAR(100) NOT NULL,
      tipe ENUM('kelas','kamar','olahraga','umum') DEFAULT 'kelas',
      lantai INT NOT NULL DEFAULT 1,
      kapasitas INT DEFAULT 40,
      fasilitas JSON,
      status ENUM('tersedia','terbatas','penuh') DEFAULT 'tersedia',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (gedung_id) REFERENCES gedung(id) ON DELETE CASCADE
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS laboratorium (
      id INT AUTO_INCREMENT PRIMARY KEY,
      gedung_id INT NOT NULL,
      kode VARCHAR(20) NOT NULL,
      nama VARCHAR(100) NOT NULL,
      lantai INT NOT NULL DEFAULT 1,
      kapasitas INT DEFAULT 30,
      fasilitas JSON,
      status ENUM('tersedia','terbatas','penuh') DEFAULT 'tersedia',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (gedung_id) REFERENCES gedung(id) ON DELETE CASCADE
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS barang (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nama VARCHAR(200) NOT NULL,
      kategori VARCHAR(100) DEFAULT 'Umum',
      stok INT DEFAULT 1,
      status ENUM('tersedia','terbatas','habis') DEFAULT 'tersedia',
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
    "laporan_kondisi_json TEXT NULL",
    "file_proposal VARCHAR(500) NULL",
    "jadwal_subjek VARCHAR(255) NULL",
    "jadwal_pertemuan DATETIME NULL",
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

  try {
    await db.query("ALTER TABLE users ADD COLUMN divisi VARCHAR(100) NULL");
  } catch {}

  // ================= SEED USERS =================
  const demoUsers = [
    [
      "admin@sarpras.ac.id",
      "admin123",
      "pegawai_sarpras",
      "Admin Sarpras",
      "19850101",
      null,
      "Sistem",
      "081234567890",
    ],
    [
      "janitor@sarpras.ac.id",
      "janitor123",
      "janitor",
      "Budi Janitor",
      "19900102",
      null,
      "Sarpras",
      "081234567891",
    ],
    [
      "peminjam@sarpras.ac.id",
      "peminjam123",
      "peminjam",
      "Andi Mahasiswa",
      null,
      "220101001",
      "Teknik Informatika",
      "081234567892",
    ],
  ];

  for (const [email, pass, role, nama, nip, nim, prodi, no_hp] of demoUsers) {
    const [exists] = await db.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    if (exists.length === 0) {
      await db.query(
        `INSERT INTO users (email,password,role,nama,nip,nim,prodi,no_hp,status)
         VALUES (?,?,?,?,?,?,?,?,?)`,
        [
          email,
          await bcrypt.hash(pass, 10),
          role,
          nama,
          nip,
          nim,
          prodi,
          no_hp,
          "aktif",
        ],
      );
    }
  }

  // ================= SEED GEDUNG & FASILITAS =================
  const [gedungCount] = await db.query("SELECT COUNT(*) as total FROM gedung");
  if (gedungCount[0].total === 0) {
    const gedungSeed = [
      [
        "gedung-utama",
        "Gedung Utama",
        "🏛️",
        "Gedung pusat kegiatan akademik",
        3,
      ],
      [
        "gedung-serba-guna",
        "Gedung Serba Guna",
        "🏟️",
        "Event, seminar & kegiatan kampus",
        3,
      ],
      ["gedung-olahraga", "Gedung Olahraga", "🏀", "Fasilitas olahraga", 1],
      [
        "workshop-listrik",
        "Workshop Listrik",
        "⚡",
        "Praktikum teknik elektro",
        2,
      ],
      ["workshop-mesin", "Workshop Mesin", "🔧", "Praktikum teknik mesin", 2],
      ["dormitori", "Dormitori", "🏠", "Asrama mahasiswa", 3],
    ];
    for (const g of gedungSeed) {
      await db.query(
        "INSERT INTO gedung (slug, nama, icon, deskripsi, lantai) VALUES (?, ?, ?, ?, ?)",
        g,
      );
    }

    const [gedungRows] = await db.query("SELECT id, slug FROM gedung");
    const gedungMap = Object.fromEntries(gedungRows.map((g) => [g.slug, g.id]));

    async function seedKelas(slug, lantai, from, to) {
      const gid = gedungMap[slug];
      for (let n = from; n <= to; n++) {
        const kode = String(n);
        const status =
          n % 7 === 0 ? "terbatas" : n % 11 === 0 ? "penuh" : "tersedia";
        await db.query(
          `INSERT INTO ruangan (gedung_id, kode, nama, tipe, lantai, kapasitas, fasilitas, status)
           VALUES (?, ?, ?, 'kelas', ?, 40, ?, ?)`,
          [
            gid,
            kode,
            `Ruang Kelas ${kode}`,
            lantai,
            JSON.stringify(["Proyektor", "AC", "Whiteboard"]),
            status,
          ],
        );
      }
    }

    async function seedKamar(slug, lantai, from, to) {
      const gid = gedungMap[slug];
      for (let n = from; n <= to; n++) {
        const kode = `D${lantai}${String(n).padStart(2, "0")}`;
        const status = n % 9 === 0 ? "penuh" : "tersedia";
        await db.query(
          `INSERT INTO ruangan (gedung_id, kode, nama, tipe, lantai, kapasitas, fasilitas, status)
           VALUES (?, ?, ?, 'kamar', ?, 4, ?, ?)`,
          [
            gid,
            kode,
            `Kamar ${kode}`,
            lantai,
            JSON.stringify(["Kasur", "Lemari"]),
            status,
          ],
        );
      }
    }

    async function seedLab(slug, lantai, labs) {
      const gid = gedungMap[slug];
      for (let i = 0; i < labs.length; i++) {
        const kode = `L${lantai}0${i + 1}`;
        await db.query(
          `INSERT INTO laboratorium (gedung_id, kode, nama, lantai, kapasitas, fasilitas, status)
           VALUES (?, ?, ?, ?, 30, ?, 'tersedia')`,
          [
            gid,
            kode,
            labs[i],
            lantai,
            JSON.stringify(["Meja Lab", "AC", "Alat Praktikum"]),
          ],
        );
      }
    }

    await seedKelas("gedung-utama", 1, 130, 150);
    await seedKelas("gedung-utama", 2, 210, 240);
    await seedKelas("gedung-serba-guna", 1, 130, 150);
    await seedKelas("gedung-serba-guna", 2, 210, 240);
    await seedKelas("workshop-listrik", 1, 101, 110);
    await seedKelas("workshop-mesin", 1, 101, 110);
    await seedKamar("dormitori", 1, 1, 12);
    await seedKamar("dormitori", 2, 1, 12);
    await seedKamar("dormitori", 3, 1, 12);
    await seedLab("gedung-utama", 3, [
      "Lab Komputer",
      "Lab Kimia",
      "Lab Fisika",
      "Lab Microbiology",
      "Lab Bahasa",
    ]);
    await seedLab("gedung-serba-guna", 3, [
      "Lab Multimedia",
      "Lab Desain",
      "Lab Prototyping",
      "Lab IoT",
    ]);
    await seedLab("workshop-listrik", 2, [
      "Lab Elektronika",
      "Lab PLC",
      "Lab Instrumentasi",
    ]);
    await seedLab("workshop-mesin", 2, ["Lab CNC", "Lab Las", "Lab Metrologi"]);
  }

  // ================= SEED BARANG =================
  const [barangMasterCount] = await db.query(
    "SELECT COUNT(*) as total FROM barang",
  );
  if (barangMasterCount[0].total === 0) {
    const barangSeed = [
      ["Proyektor Epson EB-X06", "Elektronik", 8, "tersedia"],
      ["Speaker Portable JBL", "Audio", 5, "tersedia"],
      ["Kamera Canon EOS", "Multimedia", 3, "terbatas"],
      ["Laptop Lenovo ThinkPad", "Elektronik", 10, "tersedia"],
      ["Tripod Kamera", "Multimedia", 6, "tersedia"],
      ["Microphone Wireless", "Audio", 4, "terbatas"],
      ["Meja Lipat", "Perabot", 15, "tersedia"],
      ["Kursi Plastik", "Perabot", 50, "tersedia"],
    ];
    for (const b of barangSeed) {
      await db.query(
        "INSERT INTO barang (nama, kategori, stok, status) VALUES (?, ?, ?, ?)",
        b,
      );
    }
  }

  // ================= SEED PEMINJAMAN =================
  const [barangCount] = await db.query(
    "SELECT COUNT(*) as total FROM peminjaman_barang",
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
        ],
      );
    }
  }

  // ================= MIGRASI COL LAPORAN KONDISI =================
  // Pastikan kolom yang dipakai fitur laporan kondisi sudah ada.
  for (const table of [
    "peminjaman_barang",
    "peminjaman_ruangan",
    "peminjaman_laboratorium",
  ]) {
    // laporan_selesai & laporan_kondisi_json dipakai oleh endpoint /api/pegawai/laporan-kondisi
    await db
      .query(
        `ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS laporan_selesai TINYINT(1) DEFAULT 0`,
      )
      .catch(() => {});
    await db
      .query(
        `ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS laporan_kondisi_json TEXT NULL`,
      )
      .catch(() => {});
  }

  await db.end();
  console.log(`Database "${DB_NAME}" siap digunakan`);
}

module.exports = { initSarprasDatabase };
