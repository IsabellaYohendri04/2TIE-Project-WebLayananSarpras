import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth, ROLE_HOME } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dataForm, setDataForm] = useState({ email: "", password: "" });

  React.useEffect(() => {
    if (isAuthenticated && user) {
      navigate(ROLE_HOME[user.role] || "/", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setDataForm({ ...dataForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!dataForm.email || !dataForm.password) {
      setError("Email dan password wajib diisi");
      return;
    }
    try {
      setLoading(true);
      const loggedInUser = await login(dataForm.email, dataForm.password);
      const from = location.state?.from;
      const home = ROLE_HOME[loggedInUser.role] || "/";
      navigate(from && from !== "/login" ? from : home, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Email atau password salah");
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { role: "Pegawai Sarpras", email: "admin@sarpras.ac.id", pass: "admin123", color: "from-violet-500 to-indigo-600" },
    { role: "Janitor", email: "janitor@sarpras.ac.id", pass: "janitor123", color: "from-emerald-500 to-teal-600" },
    { role: "Peminjam", email: "peminjam@sarpras.ac.id", pass: "peminjam123", color: "from-blue-500 to-cyan-600" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-violet-950 to-indigo-950" />
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: "radial-gradient(circle at 20% 20%, rgba(139,92,246,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(59,130,246,0.3) 0%, transparent 50%)",
      }} />
      <div className="absolute top-20 left-10 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-2xl shadow-violet-500/40 mb-4">
            <span className="text-white text-2xl font-black">S</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Sarpras PCR</h1>
          <p className="text-violet-200/80 mt-2 text-sm">Sistem Layanan Sarana & Prasarana</p>
        </div>

        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl shadow-black/20">
          <h2 className="text-xl font-bold text-white mb-1">Selamat Datang</h2>
          <p className="text-violet-200/70 text-sm mb-6">Masuk ke akun Anda</p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-violet-200 uppercase tracking-wider mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={dataForm.email}
                placeholder="email@sarpras.ac.id"
                onChange={handleChange}
                className="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-semibold text-violet-200 uppercase tracking-wider">Password</label>
                <Link to="/forgot" className="text-xs text-violet-300 hover:text-white transition">Lupa password?</Link>
              </div>
              <input
                type="password"
                name="password"
                value={dataForm.password}
                placeholder="••••••••"
                onChange={handleChange}
                className="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-violet-400 transition"
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-400/40 text-red-100 px-4 py-3 rounded-xl text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-900/50 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Memproses..." : "Masuk Sekarang"}
            </button>
          </form>
        </div>

        <div className="mt-6 grid gap-2">
          <p className="text-center text-xs text-violet-300/60 uppercase tracking-widest mb-2">Akun Demo</p>
          {demoAccounts.map((a) => (
            <button
              key={a.email}
              type="button"
              onClick={() => setDataForm({ email: a.email, password: a.pass })}
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-left group"
            >
              <span className="text-sm font-medium text-white/90">{a.role}</span>
              <span className={`text-xs px-2 py-1 rounded-lg bg-gradient-to-r ${a.color} text-white opacity-80 group-hover:opacity-100`}>Klik isi</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Login;
