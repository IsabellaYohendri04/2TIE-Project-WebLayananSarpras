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
  const [showPass, setShowPass] = useState(false);

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
    { role: "Pegawai Sarpras", email: "admin@sarpras.ac.id", pass: "admin123", icon: "👔", color: "from-violet-500 to-indigo-600" },
    { role: "Janitor", email: "janitor@sarpras.ac.id", pass: "janitor123", icon: "🧹", color: "from-emerald-500 to-teal-600" },
    { role: "Peminjam", email: "peminjam@sarpras.ac.id", pass: "peminjam123", icon: "🎓", color: "from-blue-500 to-cyan-600" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden flex">
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-900 via-violet-950 to-indigo-950 items-center justify-center p-12">
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: "radial-gradient(circle at 30% 30%, rgba(139,92,246,0.5) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(59,130,246,0.4) 0%, transparent 50%)",
        }} />
        <div className="absolute top-20 left-16 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-16 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-md text-white">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-2xl shadow-violet-500/40 mb-8">
            <span className="text-3xl font-black">S</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight leading-tight">Sarpras PCR</h1>
          <p className="text-violet-200/90 mt-4 text-lg leading-relaxed">
            Sistem layanan sarana & prasarana kampus — peminjaman ruangan, lab, olahraga, dan dormitori dalam satu platform.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4">
            {["🏢 Ruangan", "🧪 Laboratorium", "🏀 Olahraga", "🏠 Dormitori"].map((f) => (
              <div key={f} className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl px-4 py-3 text-sm font-medium">
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-gradient-to-br from-slate-50 to-violet-50/30">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg mb-3">
              <span className="text-white text-xl font-black">S</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Sarpras PCR</h1>
          </div>

          <div className="bg-white rounded-[32px] p-8 shadow-2xl shadow-violet-200/40 border border-slate-100">
            <h2 className="text-2xl font-bold text-gray-900">Selamat Datang</h2>
            <p className="text-gray-500 mt-1 mb-8">Masuk ke akun Anda untuk melanjutkan</p>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={dataForm.email}
                  placeholder="email@sarpras.ac.id"
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition"
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Password</label>
                  <Link to="/forgot" className="text-xs text-violet-600 hover:text-violet-800 font-medium">Lupa password?</Link>
                </div>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    name="password"
                    value={dataForm.password}
                    placeholder="••••••••"
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                  >
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">{error}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Memproses...
                  </span>
                ) : "Masuk Sekarang"}
              </button>
            </form>
          </div>

          <div className="mt-6">
            <p className="text-center text-xs text-gray-400 uppercase tracking-widest mb-3">Akun Demo — klik untuk isi otomatis</p>
            <div className="grid gap-2">
              {demoAccounts.map((a) => (
                <button
                  key={a.email}
                  type="button"
                  onClick={() => setDataForm({ email: a.email, password: a.pass })}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white border border-slate-200 hover:border-violet-300 hover:shadow-md transition text-left group"
                >
                  <span className="text-xl">{a.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{a.role}</p>
                    <p className="text-xs text-gray-400 truncate">{a.email}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-xl bg-gradient-to-r ${a.color} text-white font-medium shrink-0`}>
                    Isi
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
