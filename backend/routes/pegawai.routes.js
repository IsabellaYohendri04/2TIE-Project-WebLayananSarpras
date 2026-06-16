const bcrypt = require("bcryptjs");
const { getPool } = require("../config/db");

function sanitizePegawai(user) {
  return {
    id: user.id,
    nip: user.nip,
    nama: user.nama,
    email: user.email,
    jabatan: user.jabatan,
    divisi: user.divisi,
    no_hp: user.no_hp,
    status: user.status,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
}

function attachPegawaiRoutes(app) {
  const auth = app._sarprasAuth || {};
  const { authenticate, authorize } = auth;
  if (!authenticate || !authorize) return;

  app.get(
    "/api/pegawai",
    authenticate,
    authorize("pegawai_sarpras"),
    async (req, res) => {
      try {
        const { search, status } = req.query;

        let query =
          "SELECT id, nip, nama, email, jabatan, divisi, no_hp, status, created_at, updated_at FROM users WHERE role = 'pegawai_sarpras'";
        const params = [];

        if (search) {
          query +=
            " AND (nama LIKE ? OR nip LIKE ? OR email LIKE ? OR jabatan LIKE ? OR divisi LIKE ?)";
          const term = `%${search}%`;
          params.push(term, term, term, term, term);
        }

        if (status && status !== "all") {
          query += " AND status = ?";
          params.push(status);
        }

        query += " ORDER BY created_at DESC";

        const pool = getPool();
        const [rows] = await pool.query(query, params);

        res.json({ success: true, data: rows });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  );

  app.get(
    "/api/pegawai/:id",
    authenticate,
    authorize("pegawai_sarpras"),
    async (req, res) => {
      try {
        const pool = getPool();
        const [rows] = await pool.query(
          "SELECT id, nip, nama, email, jabatan, divisi, no_hp, status, created_at, updated_at FROM users WHERE id = ? AND role = 'pegawai_sarpras'",
          [req.params.id]
        );

        if (rows.length === 0) {
          return res
            .status(404)
            .json({ success: false, message: "Pegawai tidak ditemukan" });
        }

        res.json({ success: true, data: rows[0] });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  );

  app.post(
    "/api/pegawai",
    authenticate,
    authorize("pegawai_sarpras"),
    async (req, res) => {
      try {
        const { nip, nama, email, password, jabatan, divisi, no_hp, status } =
          req.body;

        if (!nip || !nama || !email || !password || !jabatan) {
          return res.status(400).json({
            success: false,
            message:
              "NIP, nama, email, password, dan jabatan wajib diisi",
          });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const pool = getPool();
        const [result] = await pool.query(
          "INSERT INTO users (email, password, role, nama, nip, jabatan, divisi, no_hp, status) VALUES (?, ?, 'pegawai_sarpras', ?, ?, ?, ?, ?, ?)",
          [
            email,
            hashedPassword,
            nama,
            nip,
            jabatan,
            divisi || "Sarana Prasarana",
            no_hp || null,
            status || "aktif",
          ]
        );

        const [rows] = await pool.query(
          "SELECT id, nip, nama, email, jabatan, divisi, no_hp, status, created_at, updated_at FROM users WHERE id = ?",
          [result.insertId]
        );

        res.status(201).json({ success: true, data: sanitizePegawai(rows[0]) });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  );

  app.put(
    "/api/pegawai/:id",
    authenticate,
    authorize("pegawai_sarpras"),
    async (req, res) => {
      try {
        const { nip, nama, email, password, jabatan, divisi, no_hp, status } =
          req.body;

        if (!nip || !nama || !email || !jabatan) {
          return res.status(400).json({
            success: false,
            message:
              "NIP, nama, email, dan jabatan wajib diisi",
          });
        }

        const pool = getPool();

        const [existing] = await pool.query(
          "SELECT * FROM users WHERE id = ? AND role = 'pegawai_sarpras'",
          [req.params.id]
        );

        if (existing.length === 0) {
          return res.status(404).json({
            success: false,
            message: "Pegawai tidak ditemukan",
          });
        }

        if (password) {
          const hashedPassword = await bcrypt.hash(password, 10);

          await pool.query(
            "UPDATE users SET nip = ?, nama = ?, email = ?, password = ?, jabatan = ?, divisi = ?, no_hp = ?, status = ? WHERE id = ? AND role = 'pegawai_sarpras'",
            [
              nip,
              nama,
              email,
              hashedPassword,
              jabatan,
              divisi || "Sarana Prasarana",
              no_hp || null,
              status || "aktif",
              req.params.id,
            ]
          );
        } else {
          await pool.query(
            "UPDATE users SET nip = ?, nama = ?, email = ?, jabatan = ?, divisi = ?, no_hp = ?, status = ? WHERE id = ? AND role = 'pegawai_sarpras'",
            [
              nip,
              nama,
              email,
              jabatan,
              divisi || "Sarana Prasarana",
              no_hp || null,
              status || "aktif",
              req.params.id,
            ]
          );
        }

        const [rows] = await pool.query(
          "SELECT id, nip, nama, email, jabatan, divisi, no_hp, status, created_at, updated_at FROM users WHERE id = ?",
          [req.params.id]
        );

        res.json({ success: true, data: sanitizePegawai(rows[0]) });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  );

  app.delete(
    "/api/pegawai/:id",
    authenticate,
    authorize("pegawai_sarpras"),
    async (req, res) => {
      try {
        if (Number(req.params.id) === req.user.id) {
          return res.status(400).json({
            success: false,
            message: "Tidak dapat menghapus akun yang sedang login",
          });
        }

        const pool = getPool();
        const [existing] = await pool.query(
          "SELECT * FROM users WHERE id = ? AND role = 'pegawai_sarpras'",
          [req.params.id]
        );

        if (existing.length === 0) {
          return res.status(404).json({
            success: false,
            message: "Pegawai tidak ditemukan",
          });
        }

        await pool.query(
          "DELETE FROM users WHERE id = ? AND role = 'pegawai_sarpras'",
          [req.params.id]
        );

        res.json({ success: true, message: "Pegawai berhasil dihapus" });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  );
}

module.exports = { attachPegawaiRoutes };
