import React, { useEffect, lazy, Suspense } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import "./css/style.css";
import "./charts/ChartjsConfig";

import MainLayout from "./partials/MainLayout";
import AuthLayout from "./partials/AuthLayout";
import Loading from "./components/Loading";
import ProtectedRoute from "./components/ProtectedRoute";

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
import FormPeminjamanBarang from "./pages/peminjam/FormPeminjamanBarang";
import FormPeminjamanRuangan from "./pages/peminjam/FormPeminjamanRuangan";
<<<<<<< HEAD
import FormPeminjamanLab from "./pages/peminjam/FormPeminjamanLab";
import LaporanKondisiSarpras from "./pages/peminjam/LaporanKondisiSarpras";
import RiwayatPeminjaman from "./pages/peminjam/RiwayatPeminjaman";

// =========================
// 🧹 JANITOR IMPORT START
// =========================
=======
>>>>>>> cfcd74cdaee6aaa18b6c9d13b43ac3ad240d2b92
import DashboardJanitor from "./pages/janitor/DashboardJanitor";
import KelolaSarpras from "./pages/janitor/KelolaSarpras";
import MonitoringSarpras from "./pages/janitor/MonitoringSarpras";
import PeminjamanSarpras from "./pages/janitor/PeminjamanSarpras";
import LaporanSarpras from "./pages/janitor/LaporanSarpras";

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
<<<<<<< HEAD

        {/* ========================= */}
        {/* MAIN LAYOUT */}
        {/* ========================= */}
        <Route element={<MainLayout />}>

          {/* Dashboard */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/peminjam" element={<DashboardPeminjam />} />

          {/* Pegawai */}
          <Route path="/pegawai" element={<KelolaPegawai />} />

          {/* Fasilitas */}
          <Route path="/fasilitas/barang" element={<KelolaBarang />} />
          <Route path="/fasilitas/ruangan" element={<KelolaRuangan />} />
          <Route path="/fasilitas/laboratorium" element={<KelolaLaboratorium />} />

          {/* Peminjaman */}
          <Route path="/peminjaman/barang" element={<PeminjamanBarang />} />
          <Route path="/peminjaman/ruangan" element={<PeminjamanRuangan />} />
          <Route path="/peminjaman/laboratorium" element={<PeminjamanLaboratorium />} />

          <Route path="/peminjam/peminjaman-barang" element={<FormPeminjamanBarang />} />
          <Route path="/peminjam/peminjaman-ruangan" element={<FormPeminjamanRuangan />} />
          <Route path="/peminjam/peminjaman-lab" element={<FormPeminjamanLab />} />
          <Route path="/peminjam/laporan-kondisi" element={<LaporanKondisiSarpras />} />
          <Route path="/peminjam/riwayat-peminjaman" element={<RiwayatPeminjaman />} />


          <Route path="/pegawai/peminjaman/barang/:id" element={<DetailPeminjaman />} />

          {/* ========================= */}
          {/* 🧹 JANITOR ROUTES START */}
          {/* ========================= */}

          <Route path="/janitor">
            {/* Dashboard Janitor */}
            <Route index element={<DashboardJanitor />} />

            {/* Kelola Sarpras */}
            <Route path="kelola-sarpras" element={<KelolaSarpras />} />

            {/* Monitoring */}
            <Route path="monitoring-sarpras" element={<MonitoringSarpras />} />

            {/* Peminjaman (APPROVED ONLY) */}
            <Route path="peminjaman-sarpras" element={<PeminjamanSarpras />} />

            {/* Laporan Kerusakan */}
            <Route path="laporan-sarpras" element={<LaporanSarpras />} />
          </Route>

          {/* ========================= */}
          {/* 🧹 JANITOR ROUTES END */}
          {/* ========================= */}

        </Route>

        {/* ========================= */}
        {/* AUTH LAYOUT */}
        {/* ========================= */}
=======
        {/* Auth - public */}
>>>>>>> cfcd74cdaee6aaa18b6c9d13b43ac3ad240d2b92
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            {/* Pegawai Sarpras */}
            <Route element={<ProtectedRoute allowedRoles={["pegawai_sarpras"]} />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/pegawai" element={<KelolaPegawai />} />
              <Route path="/fasilitas/barang" element={<KelolaBarang />} />
              <Route path="/fasilitas/ruangan" element={<KelolaRuangan />} />
              <Route path="/fasilitas/laboratorium" element={<KelolaLaboratorium />} />
              <Route path="/peminjaman/barang" element={<PeminjamanBarang />} />
              <Route path="/peminjaman/ruangan" element={<PeminjamanRuangan />} />
              <Route path="/peminjaman/laboratorium" element={<PeminjamanLaboratorium />} />
              <Route path="/pegawai/peminjaman/barang/:id" element={<DetailPeminjaman />} />
            </Route>

            {/* Janitor */}
            <Route element={<ProtectedRoute allowedRoles={["janitor"]} />}>
              <Route path="/janitor" element={<DashboardJanitor />} />
              <Route path="/janitor/kelola-sarpras" element={<KelolaSarpras />} />
              <Route path="/janitor/monitoring-sarpras" element={<MonitoringSarpras />} />
              <Route path="/janitor/peminjaman-sarpras" element={<PeminjamanSarpras />} />
              <Route path="/janitor/laporan-sarpras" element={<LaporanSarpras />} />
            </Route>

            {/* Peminjam */}
            <Route element={<ProtectedRoute allowedRoles={["peminjam"]} />}>
              <Route path="/peminjam" element={<DashboardPeminjam />} />
              <Route path="/peminjam/peminjaman-barang" element={<FormPeminjamanBarang />} />
              <Route path="/peminjam/peminjaman-ruangan" element={<FormPeminjamanRuangan />} />
            </Route>
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
