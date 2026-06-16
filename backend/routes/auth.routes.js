const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function env(name, fallback) {
  return process.env[name] ?? fallback;
}

function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Token autentikasi tidak ditemukan" });
  }

  try {
    const token = header.split(" ")[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET || "sarpras_jwt_secret");
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Token tidak valid atau sudah kadaluarsa" });
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Anda tidak memiliki akses ke fitur ini" });
    }
    next();
  };
}

async function getPool() {
  const DB_NAME = env("DB_NAME", "sarpras_db");
  return mysql.createPool({
    host: env("DB_HOST", "localhost"),
    port: Number(env("DB_PORT", 3306)),
    user: env("DB_USER", "root"),
    password: env("DB_PASSWORD", ""),
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
  });
}

function sanitizeUser(user) {
  return {
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
  };
}

function attachAuthRoutes(app) {
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email dan password wajib diisi" });
      }

      const pool = await getPool();
      const [rows] = await pool.query(
        "SELECT * FROM users WHERE email = ? AND status = 'aktif'",
        [email]
      );
      await pool.end();

      if (rows.length === 0) {
        return res.status(401).json({ success: false, message: "Email atau password salah" });
      }

      const user = rows[0];
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ success: false, message: "Email atau password salah" });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role, nama: user.nama },
        process.env.JWT_SECRET || "sarpras_jwt_secret",
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
      );

      res.json({ success: true, token, user: sanitizeUser(user) });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.get("/api/auth/me", authenticate, async (req, res) => {
    try {
      const pool = await getPool();
      const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [req.user.id]);
      await pool.end();

      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: "User tidak ditemukan" });
      }

      res.json({ success: true, user: sanitizeUser(rows[0]) });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app._sarprasAuth = { authenticate, authorize };
}

module.exports = { attachAuthRoutes };

