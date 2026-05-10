import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [dataForm, setDataForm] = useState({
    email: "",
    password: "",
  });

  // Handle Input
  const handleChange = (e) => {

    setDataForm({
      ...dataForm,
      [e.target.name]: e.target.value,
    });

  };

  // Handle Login
  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    // Validasi kosong
    if (!dataForm.email || !dataForm.password) {

      setError("Email dan password wajib diisi");

      return;

    }

    // Validasi login sederhana
    if (
      dataForm.email !== "admin@gmail.com" ||
      dataForm.password !== "123"
    ) {

      setError("Email atau password salah");

      return;

    }

    try {

      setLoading(true);

      // Axios request
      await axios.post(
        "https://jsonplaceholder.typicode.com/posts",
        dataForm
      );

      // Simulasi loading login
      setTimeout(() => {

        navigate("/");

      }, 2000);

    } catch (err) {

      setError("Terjadi kesalahan");

    } finally {

      setLoading(false);

    }

  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8">

        {/* Logo */}
        <div className="flex justify-center mb-6">

          <div className="w-14 h-14 bg-violet-500 rounded-full flex items-center justify-center">

            <span className="text-white text-2xl font-bold">
              S
            </span>

          </div>

        </div>

        {/* Title */}
        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Welcome Back
          </h1>

          <p className="text-gray-500 mt-2">
            Login untuk melanjutkan
          </p>

        </div>

        {/* Form */}
        <form
          className="space-y-5"
          onSubmit={handleSubmit}
        >

          {/* Email */}
          <div>

            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">

              Email

            </label>

            <input
              type="email"
              name="email"
              placeholder="admin@gmail.com"
              onChange={handleChange}
              className="form-input w-full rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-violet-500 focus:ring-violet-500"
            />

          </div>

          {/* Password */}
          <div>

            <div className="flex items-center justify-between mb-2">

              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">

                Password

              </label>

              <Link
                to="/forgot"
                className="text-sm text-violet-500 hover:text-violet-600"
              >
                Forgot Password?
              </Link>

            </div>

            <input
              type="password"
              name="password"
              placeholder="123"
              onChange={handleChange}
              className="form-input w-full rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-violet-500 focus:ring-violet-500"
            />

          </div>

          {/* Error */}
          {
            error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M4.93 19h14.14c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.2 16c-.77 1.33.19 3 1.73 3z"
                  />
                </svg>

                <span>
                  {error}
                </span>

              </div>
            )
          }

          {/* Loading */}
          {
            loading && (
              <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">

                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>

                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a10 10 0 00-10 10h2z"
                  ></path>
                </svg>

                <span>
                  Mohon tunggu, sedang login...
                </span>

              </div>
            )
          }

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-500 hover:bg-violet-600 text-white font-semibold py-3 rounded-xl transition duration-200"
          >

            {
              loading
                ? "Loading..."
                : "Sign In"
            }

          </button>

        </form>

        {/* Footer */}
        <div className="mt-6 text-center">

          <p className="text-sm text-gray-500">

            Belum punya akun?{" "}

            <Link
              to="/register"
              className="text-violet-500 hover:text-violet-600 font-medium"
            >
              Register
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;