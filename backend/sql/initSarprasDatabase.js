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

  if (!fs.existsSync(jsonPath)) {
    return [];
  }

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

  await db.query(`

    CREATE TABLE IF NOT EXISTS gedung (
      id INT AUTO_INCREMENT PRIMARY KEY,
      slug VARCHAR(50) NOT NULL UNIQUE,
      nama VARCHAR(100) NOT NULL,
      icon VARCHAR(10) NULL,
      deskripsi TEXT NULL,
      lantai INT DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS ruangan (
      id INT AUTO_INCREMENT PRIMARY KEY,
      gedung_id INT NOT NULL,
      kode VARCHAR(20) NOT NULL,
      nama VARCHAR(200) NOT NULL,
      tipe ENUM('kelas','ruangan') NOT NULL DEFAULT 'ruangan',
      lantai INT DEFAULT 1,
      kapasitas INT DEFAULT 30,
      fasilitas JSON NULL,
      status ENUM('tersedia','terbatas','penuh') NOT NULL DEFAULT 'tersedia',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (gedung_id) REFERENCES gedung(id) ON DELETE CASCADE
=======
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
>>>>>>> 567df8493f6aca7aff1c087ae8364b9b38a2ffac
    )
  `);

  await db.query(`
<<<<<<< HEAD
    CREATE TABLE IF NOT EXISTS laboratorium (
      id INT AUTO_INCREMENT PRIMARY KEY,
      gedung_id INT NOT NULL,
      kode VARCHAR(20) NOT NULL,
      nama VARCHAR(200) NOT NULL,
      lantai INT DEFAULT 1,
      kapasitas INT DEFAULT 30,
      fasilitas JSON NULL,
      status ENUM('tersedia','terbatas','penuh') NOT NULL DEFAULT 'tersedia',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (gedung_id) REFERENCES gedung(id) ON DELETE CASCADE
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS barang (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nama VARCHAR(200) NOT NULL,
      kategori VARCHAR(100) NULL,
      stok INT DEFAULT 1,
      status ENUM('tersedia','terbatas','habis') NOT NULL DEFAULT 'tersedia',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS laporan_kondisi (
      id INT AUTO_INCREMENT PRIMARY KEY,
      peminjaman_id INT NOT NULL,
      tipe ENUM('barang','ruangan','laboratorium') NOT NULL,
      kondisi VARCHAR(50) NOT NULL,
      kelengkapan TEXT NULL,
      catatan TEXT NULL,
      user_id INT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const peminjamanExtraCols = [
    "user_id INT NULL",
    "jam_mulai TIME NULL",
    "jam_selesai TIME NULL",
    "gedung_id INT NULL",
    "organisasi VARCHAR(100) NULL",
    "detail_json TEXT NULL",
    "laporan_selesai TINYINT(1) NOT NULL DEFAULT 0",
  ];
  for (const table of ["peminjaman_barang", "peminjaman_ruangan", "peminjaman_laboratorium"]) {
    for (const col of peminjamanExtraCols) {
      const colName = col.split(" ")[0];
      try {
        await db.query(`ALTER TABLE ${table} ADD COLUMN ${col}`);
      } catch {
        /* kolom sudah ada */
      }
    }
  }

  try {
    await db.query(
      "ALTER TABLE ruangan MODIFY COLUMN tipe ENUM('kelas','ruangan','kamar') NOT NULL DEFAULT 'ruangan'"
    );
  } catch {
    /* ignore */
  }

  const [gedungCount] = await db.query("SELECT COUNT(*) as total FROM gedung");
  if (gedungCount[0].total === 0) {
    const gedungSeed = [
      ["gedung-utama", "Gedung Utama", "🏛️", "Gedung pusat kegiatan akademik & seminar", 4],
      ["gedung-serba-guna", "Gedung Serba Guna", "🏟️", "Gedung serba guna — event & olahraga", 2],
      ["gedung-olahraga", "Gedung Olahraga", "🏀", "Fasilitas olahraga indoor & outdoor", 2],
      ["workshop-listrik", "Workshop Listrik", "⚡", "Area praktikum teknik listrik", 2],
      ["workshop-mesin", "Workshop Mesin", "🔧", "Area praktikum teknik mesin", 2],
      ["dormitori", "Dormitori", "🏠", "Asrama mahasiswa", 3],
    ];
    for (const g of gedungSeed) {
      await db.query(
        "INSERT INTO gedung (slug, nama, icon, deskripsi, lantai) VALUES (?, ?, ?, ?, ?)",
        g
      );
    }

    const [gedungRows] = await db.query("SELECT id, slug FROM gedung");
    const gedungMap = Object.fromEntries(gedungRows.map((r) => [r.slug, r.id]));

    const ruanganSeed = [
      [gedungMap["gedung-utama"], "R-101", "Ruang Kelas A101", "kelas", 1, 40, ["Proyektor", "AC", "Whiteboard"]],
      [gedungMap["gedung-utama"], "R-102", "Ruang Kelas A102", "kelas", 1, 40, ["Proyektor", "AC", "Whiteboard"]],
      [gedungMap["gedung-utama"], "R-123", "Ruang Seminar", "ruangan", 2, 200, ["Proyektor", "AC", "Sound System"]],
      [gedungMap["gedung-utama"], "R-201", "Ruang Rapat", "ruangan", 3, 30, ["TV", "AC", "Whiteboard"]],
      [gedungMap["gedung-serba-guna"], "GSG-01", "Hall Utama GSG", "ruangan", 1, 500, ["Sound System", "Panggung", "Lighting"]],
      [gedungMap["gedung-serba-guna"], "GSG-K1", "Ruang Kelas GSG-1", "kelas", 2, 35, ["Proyektor", "AC"]],
      [gedungMap["gedung-olahraga"], "GOR-01", "GOR Mini", "ruangan", 1, 150, ["Sound System", "Scoreboard"]],
      [gedungMap["workshop-listrik"], "WL-01", "Workshop Elektro", "ruangan", 1, 30, ["Oscilloscope", "AC", "Meja Praktikum"]],
      [gedungMap["workshop-mesin"], "WM-01", "Workshop Mesin CNC", "ruangan", 1, 35, ["Mesin CNC", "AC", "Alat Keselamatan"]],
      [gedungMap["dormitori"], "D-101", "Ruang Pertemuan Dorm", "ruangan", 1, 50, ["AC", "Proyektor"]],
    ];
    for (const r of ruanganSeed) {
      await db.query(
        "INSERT INTO ruangan (gedung_id, kode, nama, tipe, lantai, kapasitas, fasilitas, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'tersedia')",
        [r[0], r[1], r[2], r[3], r[4], r[5], JSON.stringify(r[6])]
      );
    }

    const labSeed = [
      [gedungMap["gedung-utama"], "LAB-151", "Lab 151 Jaringan", 1, 30, ["PC", "Router", "Switch"]],
      [gedungMap["gedung-utama"], "LAB-152", "Lab 152 Komputer", 1, 35, ["PC", "Proyektor", "AC"]],
      [gedungMap["gedung-serba-guna"], "LAB-MM", "Lab Multimedia", 2, 28, ["PC Editing", "Proyektor", "AC"]],
      [gedungMap["workshop-listrik"], "LAB-PLC", "Lab PLC", 1, 25, ["PLC Kit", "Oscilloscope"]],
      [gedungMap["workshop-mesin"], "LAB-MK", "Lab Mekatronika", 1, 30, ["Robot Arm", "Sensor Kit"]],
    ];
    for (const l of labSeed) {
      await db.query(
        "INSERT INTO laboratorium (gedung_id, kode, nama, lantai, kapasitas, fasilitas, status) VALUES (?, ?, ?, ?, ?, ?, 'tersedia')",
        [l[0], l[1], l[2], l[3], l[4], JSON.stringify(l[5])]
      );
    }

    const barangSeed = [
      ["Kursi", "Furnitur", 100],
      ["Sofa Panjang", "Furnitur", 10],
      ["Proyektor Epson", "Elektronik", 5],
      ["Sound System", "Elektronik", 3],
      ["Mic Wireless", "Elektronik", 8],
      ["Meja Putih Panjang", "Furnitur", 20],
      ["Papan Backdrop", "Event", 4],
      ["Blower", "Peralatan", 6],
    ];
    for (const b of barangSeed) {
      await db.query(
        "INSERT INTO barang (nama, kategori, stok, status) VALUES (?, ?, ?, 'tersedia')",
        b
      );
    }
  }

  const [gedungAll] = await db.query("SELECT id, slug FROM gedung");
  const gedungMapAll = Object.fromEntries(gedungAll.map((r) => [r.slug, r.id]));
  const [ruangTotal] = await db.query("SELECT COUNT(*) as total FROM ruangan");

  if (ruangTotal[0].total < 80 && gedungMapAll["gedung-utama"]) {
    const syncSlugs = ["gedung-utama", "gedung-serba-guna", "workshop-listrik", "workshop-mesin", "dormitori"];
    for (const slug of syncSlugs) {
      const gid = gedungMapAll[slug];
      if (gid) {
        await db.query("DELETE FROM ruangan WHERE gedung_id = ?", [gid]);
        await db.query("DELETE FROM laboratorium WHERE gedung_id = ?", [gid]);
      }
    }

    const pushKelas = (gid, lantai, from, to) => {
      const rows = [];
      for (let n = from; n <= to; n++) {
        rows.push([gid, String(n), `Ruang Kelas ${n}`, "kelas", lantai, 40, ["Proyektor", "AC", "Whiteboard"]]);
      }
      return rows;
    };

    const ruanganSeed = [
      ...pushKelas(gedungMapAll["gedung-utama"], 1, 130, 150),
      ...pushKelas(gedungMapAll["gedung-utama"], 2, 210, 240),
      ...pushKelas(gedungMapAll["gedung-serba-guna"], 1, 130, 150),
      ...pushKelas(gedungMapAll["gedung-serba-guna"], 2, 210, 240),
      ...pushKelas(gedungMapAll["workshop-listrik"], 1, 101, 110),
      ...pushKelas(gedungMapAll["workshop-mesin"], 1, 101, 110),
    ];

    for (let lt = 1; lt <= 3; lt++) {
      for (let n = 1; n <= 10; n++) {
        const num = 100 + lt * 10 + n;
        ruanganSeed.push([
          gedungMapAll["dormitori"],
          `D-${num}`,
          `Kamar D-${num}`,
          "kamar",
          lt,
          4,
          ["AC", "Kasur", "Lemari"],
        ]);
      }
    }

    for (const r of ruanganSeed) {
      await db.query(
        "INSERT INTO ruangan (gedung_id, kode, nama, tipe, lantai, kapasitas, fasilitas, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'tersedia')",
        [r[0], r[1], r[2], r[3], r[4], r[5], JSON.stringify(r[6])]
      );
    }

    const labSeed = [];
    for (let i = 151; i <= 154; i++) {
      labSeed.push([gedungMapAll["gedung-utama"], `LAB-${i}`, `Lab ${i}`, 3, 30, ["PC", "Router", "AC"]]);
    }
    for (let i = 151; i <= 154; i++) {
      labSeed.push([gedungMapAll["gedung-serba-guna"], `GSG-LAB-${i}`, `Lab GSG ${i}`, 3, 28, ["PC", "Proyektor"]]);
    }
    labSeed.push([gedungMapAll["workshop-listrik"], "LAB-PLC", "Lab PLC", 2, 25, ["PLC", "Oscilloscope"]]);
    labSeed.push([gedungMapAll["workshop-mesin"], "LAB-MK", "Lab Mekatronika", 2, 30, ["Robot Arm", "Sensor"]]);

    for (const l of labSeed) {
      await db.query(
        "INSERT INTO laboratorium (gedung_id, kode, nama, lantai, kapasitas, fasilitas, status) VALUES (?, ?, ?, ?, ?, ?, 'tersedia')",
        [l[0], l[1], l[2], l[3], l[4], JSON.stringify(l[5])]
      );
    }
    console.log("Data ruangan/lab di-sync dengan layout lantai baru");
  }

=======
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
    )
  `);

>>>>>>> 567df8493f6aca7aff1c087ae8364b9b38a2ffac
  const [barangCountRows] = await db.query(
    "SELECT COUNT(*) as total FROM peminjaman_barang"
  );
  if (barangCountRows[0].total === 0) {
    const SEED_PEMINJAMAN_BARANG = loadSeedPeminjamanBarang();
    for (const item of SEED_PEMINJAMAN_BARANG) {
      await db.query(
        `INSERT INTO peminjaman_barang
          (nama, nim, prodi, barang, kategori, image, tanggal_pinjam, tanggal_kembali, status, catatan_admin)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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

  const [sarprasCountRows] = await db.query("SELECT COUNT(*) as total FROM sarpras");
  if (sarprasCountRows[0].total === 0) {
    const seedSarpras = [
      ["Laptop Asus VivoBook", "Elektronik", "barang", "Dipinjam", "Lab Komputer 1", "Normal saat dipinjam", "https://images.unsplash.com/photo-1517336714731-489689fd1ca8"],
      ["Proyektor Epson", "Elektronik", "barang", "Tersedia", "Gudang", "Baik", "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc"],
      ["AC Ruangan", "Elektronik", "barang", "Rusak", "Gedung A", "Bocor & tidak dingin", "https://images.unsplash.com/photo-1581091870622-2c8f3f5b3a07"],
      ["Kursi Kuliah", "Furnitur", "barang", "Dipinjam", "Ruang 204", "Sedikit retak pada kaki", "https://images.unsplash.com/photo-1582582494700-5fdbec1c5b0c"],
      ["Ruang Seminar", "Ruangan", "ruangan", "Dipakai", "Gedung B Lantai 2", "Kapasitas 100 orang", "https://images.unsplash.com/photo-1497366216548-37526070297c"],
      ["Lab Komputer", "Laboratorium", "laboratorium", "Dipakai", "Gedung C", "30 unit PC aktif", "https://images.unsplash.com/photo-1517694712202-14dd9538aa97"],
      ["Speaker JBL", "Audio", "barang", "Tersedia", "Gudang", "Kondisi baik", "https://via.placeholder.com/300x200?text=Speaker"],
      ["Drone DJI Mini 4", "Multimedia", "barang", "Tersedia", "Gudang", "Siap pakai", "https://via.placeholder.com/300x200?text=Drone"],
    ];

    for (const item of seedSarpras) {
      await db.query(
        `INSERT INTO sarpras (nama, kategori, tipe, status, lokasi, kondisi_teks, kondisi_image)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        item
      );
    }
  }

  const [laporanCountRows] = await db.query(
    "SELECT COUNT(*) as total FROM laporan_kerusakan"
  );
  if (laporanCountRows[0].total === 0) {
    const seedLaporan = [
      [1, "Laptop Asus VivoBook", "Andi Saputra", "Layar tidak menyala setelah digunakan", "MENUNGGU", "https://images.unsplash.com/photo-1517336714731-489689fd1ca8", "2026-06-10"],
      [2, "Proyektor Epson", "Siti Rahma", "Gambar buram dan tidak fokus", "DIPROSES", "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc", "2026-06-11"],
      [3, "AC Ruangan", "Budi Santoso", "AC bocor dan tidak dingin", "SELESAI", "https://images.unsplash.com/photo-1581091870622-2c8f3f5b3a07", "2026-06-12"],
      [null, "Kursi Kuliah", "Intan Permata", "Kaki kursi patah saat dipindahkan", "MENUNGGU", "https://images.unsplash.com/photo-1582582494700-5fdbec1c5b0c", "2026-06-14"],
    ];

    for (const item of seedLaporan) {
      await db.query(
        `INSERT INTO laporan_kerusakan
          (sarpras_id, barang, pelapor, isi_laporan, status, image, tanggal)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        item
      );
    }
  }

  const [ruanganCountRows] = await db.query(
    "SELECT COUNT(*) as total FROM peminjaman_ruangan"
  );
  if (ruanganCountRows[0].total === 0) {
    await db.query(
      `INSERT INTO peminjaman_ruangan
        (nama, nim, prodi, ruangan, kategori, tanggal_pinjam, tanggal_kembali, status, catatan_admin)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ["Rizky Pratama", "233510105", "Teknik Informatika", "Ruang Seminar", "Ruangan", "2026-06-15", "2026-06-16", "Disetujui", "Disetujui pegawai sarpras"]
    );
  }

  const [labCountRows] = await db.query(
    "SELECT COUNT(*) as total FROM peminjaman_laboratorium"
  );
  if (labCountRows[0].total === 0) {
    await db.query(
      `INSERT INTO peminjaman_laboratorium
        (nama, nim, prodi, laboratorium, kategori, tanggal_pinjam, tanggal_kembali, status, catatan_admin)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ["Dewi Lestari", "233510106", "Teknik Elektro", "Lab Komputer", "Laboratorium", "2026-06-18", "2026-06-20", "Disetujui", "Disetujui pegawai sarpras"]
    );
  }

  await db.end();
  console.log(`Database "${DB_NAME}" siap digunakan`);
}

module.exports = { initSarprasDatabase };
