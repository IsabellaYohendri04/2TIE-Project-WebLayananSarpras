require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { initSarprasDatabase } = require("./sql/initSarprasDatabase");
const {
  getBarangPeminjaman,
  getBarangPeminjamanById,
} = require("./routes/peminjamanBarang.routes");

const { attachAuthRoutes } = require("./routes/auth.routes");
const { attachPegawaiRoutes } = require("./routes/pegawai.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "Server sarpras berjalan" });
});

attachAuthRoutes(app);
attachPegawaiRoutes(app);

// Peminjaman Barang
app.get("/api/peminjaman/barang", getBarangPeminjaman);
app.get("/api/peminjaman/barang/:id", getBarangPeminjamanById);

const PORT = process.env.PORT || 3001;

async function start() {
  try {
    await initSarprasDatabase();
    app.listen(PORT, () => {
      console.log(`Server sarpras berjalan di http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Gagal memulai server:", error.message);
    process.exit(1);
  }
}

start();

