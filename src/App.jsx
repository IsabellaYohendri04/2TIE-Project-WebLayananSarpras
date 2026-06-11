import React, { useEffect, lazy, Suspense } from "react";

import { Routes, Route, useLocation } from "react-router-dom";

import "./css/style.css";
import "./charts/ChartjsConfig";

// Layout
import MainLayout from "./partials/MainLayout";
import AuthLayout from "./partials/AuthLayout";

// Components
import Loading from "./components/Loading";

// Normal Import
import Dashboard from "./pages/Dashboard";

import KelolaBarang from "./pages/pegawai/KelolaBarang";
import KelolaPegawai from "./pages/pegawai/KelolaPegawai";

import KelolaRuangan from "./pages/pegawai/KelolaRuangan";
import KelolaLaboratorium from "./pages/pegawai/KelolaLaboratorium";

import PeminjamanBarang from "./pages/pegawai/PeminjamanBarang";
import PeminjamanRuangan from "./pages/pegawai/PeminjamanRuangan";
import PeminjamanLaboratorium from "./pages/pegawai/PeminjamanLaboratorium";

import DashboardPeminjam from "./pages/peminjam/DashboardPeminjam";
import DetailPeminjaman from "./pages/pegawai/DetailPeminjaman";
import FormPeminjaman from "./pages/peminjam/FormPeminjamanBarang";
import FormPeminjamanBarang from "./pages/peminjam/FormPeminjamanBarang";
import FormPeminjamanRuangan from "./pages/peminjam/FormPeminjamanRuangan";
import FormPeminjamanLab from "./pages/peminjam/FormPeminjamanLab";
import LaporanKondisiSarpras from "./pages/peminjam/LaporanKondisiSarpras";
import RiwayatPeminjaman from "./pages/peminjam/RiwayatPeminjaman";

// Lazy Loading Auth
const Login = lazy(() => import("./pages/auth/Login"));

const Register = lazy(() => import("./pages/auth/Register"));

const Forgot = lazy(() => import("./pages/auth/Forgot"));

function App() {
  const location = useLocation();

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";

    window.scroll({ top: 0 });

    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]);

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Main Layout */}
        <Route element={<MainLayout />}>
          {/* Dashboard */}
          <Route path="/" element={<Dashboard />} />
           <Route path="/peminjam" element={<DashboardPeminjam />} />

          {/* Pegawai */}
          <Route path="/pegawai" element={<KelolaPegawai />} />

          {/* Fasilitas */}
          <Route path="/fasilitas/barang" element={<KelolaBarang />} />

          <Route path="/fasilitas/ruangan" element={<KelolaRuangan />} />

          <Route
            path="/fasilitas/laboratorium"
            element={<KelolaLaboratorium />}
          />

          {/* Peminjaman */}
          <Route path="/peminjaman/barang" element={<PeminjamanBarang />} />

          <Route path="/peminjaman/ruangan" element={<PeminjamanRuangan />} />
          <Route path="/peminjam/peminjaman-barang" element={<FormPeminjamanBarang />} />
          <Route path="/peminjam/peminjaman-ruangan" element={<FormPeminjamanRuangan />} />
          <Route path="/peminjam/peminjaman-lab" element={<FormPeminjamanLab />} />
          <Route path="/peminjam/laporan-kondisi" element={<LaporanKondisiSarpras />} />
          <Route path="/peminjam/riwayat-peminjaman" element={<RiwayatPeminjaman />} />


          <Route
            path="/peminjaman/laboratorium"
            element={<PeminjamanLaboratorium />}
          />

          <Route
  path="/pegawai/peminjaman/barang/:id"
  element={<DetailPeminjaman />}
/>
        </Route>

        {/* Auth Layout */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/forgot" element={<Forgot />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
