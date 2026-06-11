import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getPool from "../database.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

const sanitizeUser = (user) => ({
  id: user.id,
  email: user.email,
  role: user.role,
  nama: user.nama,
  nip: user.nip,
  nim: user.nim,
  jabatan: user.jabatan,
  divisi: user.divisi,
  prodi: user.prodi,
  no_hp: user.no_hp,
  status: user.status,
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email dan password wajib diisi",
      });
    }

    const pool = await getPool();
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ? AND status = 'aktif'",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah",
      });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah",
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, nama: user.nama },
      process.env.JWT_SECRET || "sarpras_jwt_secret",
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.json({
      success: true,
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/me", authenticate, async (req, res) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [
      req.user.id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    res.json({ success: true, user: sanitizeUser(rows[0]) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
