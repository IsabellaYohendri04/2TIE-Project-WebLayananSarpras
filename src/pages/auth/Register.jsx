import React from "react";
import { Link } from "react-router-dom";

function Register() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 bg-violet-500 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">S</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Create Account
          </h1>

          <p className="text-gray-500 mt-2">
            Daftar akun baru
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5">

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>

            <input
              type="text"
              placeholder="John Doe"
              className="form-input w-full rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              className="form-input w-full rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              className="form-input w-full rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-violet-500 hover:bg-violet-600 text-white font-semibold py-3 rounded-xl transition duration-200"
          >
            Register
          </button>

        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Sudah punya akun?{" "}
            <Link
              to="/login"
              className="text-violet-500 hover:text-violet-600 font-medium"
            >
              Login
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Register;