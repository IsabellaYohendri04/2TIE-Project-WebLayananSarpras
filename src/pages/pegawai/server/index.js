import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDatabase } from "./database.js";
import authRoutes from "./routes/auth.routes.js";
import pegawaiRoutes from "./routes/pegawai.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "Server sarpras berjalan" });
});

app.use("/api/auth", authRoutes);
app.use("/api/pegawai", pegawaiRoutes);

async function start() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`Server sarpras berjalan di http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Gagal memulai server:", error.message);
    console.error(
      "Pastikan MySQL berjalan dan konfigurasi DB di file .env sudah benar."
    );
    process.exit(1);
  }
}

start();
