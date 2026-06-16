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
      setError(
        err.response?.data?.message || "Email atau password salah"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 bg-violet-500 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">S</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Selamat Datang
          </h1>
          <p className="text-gray-500 mt-2">
            Login sesuai role: Pegawai Sarpras, Janitor, atau Peminjam
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="email@sarpras.ac.id"
              onChange={handleChange}
              className="form-input w-full rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-violet-500 focus:ring-violet-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <Link
                to="/forgot"
                className="text-sm text-violet-500 hover:text-violet-600"
              >
                Lupa Password?
              </Link>
            </div>
            <input
              type="password"
              name="password"
              placeholder="Masukkan password"
              onChange={handleChange}
              className="form-input w-full rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-violet-500 focus:ring-violet-500"
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {loading && (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-xl text-sm">
              Mohon tunggu, sedang login...
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-500 hover:bg-violet-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition duration-200"
          >
            {loading ? "Loading..." : "Masuk"}
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-xs text-gray-500 space-y-1">
          <p className="font-semibold text-gray-600 dark:text-gray-300 mb-2">
            Akun demo (pertama kali):
          </p>
          <p>Pegawai: admin@sarpras.ac.id / admin123</p>
          <p>Janitor: janitor@sarpras.ac.id / janitor123</p>
          <p>Peminjam: peminjam@sarpras.ac.id / peminjam123</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
