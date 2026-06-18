require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");

const { initSarprasDatabase } = require("./sql/initSarprasDatabase");
const { testConnection } = require("./config/db");

const { attachAuthRoutes } = require("./routes/auth.routes");
const { attachPegawaiRoutes } = require("./routes/pegawai.routes");
const { attachFasilitasRoutes } = require("./routes/fasilitas.routes");
const { attachPeminjamanRoutes } = require("./routes/peminjaman.routes");
const { attachSarprasRoutes } = require("./routes/sarpras.routes");
const { attachLaporanRoutes } = require("./routes/laporan.routes");
const { attachJanitorRoutes } = require("./routes/janitor.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Server sarpras berjalan",
  });
});

// Register Routes
attachAuthRoutes(app);
attachPegawaiRoutes(app);
attachFasilitasRoutes(app);
attachPeminjamanRoutes(app);
attachSarprasRoutes(app);
attachLaporanRoutes(app);
attachJanitorRoutes(app);

const PORT = process.env.PORT || 3001;

async function start() {
  try {
    await initSarprasDatabase();
    await testConnection();

    console.log("✅ MySQL Laragon terhubung");

    app.listen(PORT, () => {
      console.log(`✅ Server sarpras berjalan di http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Gagal memulai server:", error);
    process.exit(1);
  }
}

start();