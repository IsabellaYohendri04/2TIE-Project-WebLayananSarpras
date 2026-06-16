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
import DetailPeminjaman from "./pages/pegawai/DetailPeminjaman";

import DashboardPeminjam from "./pages/peminjam/DashboardPeminjam";
import FormPeminjamanBarang from "./pages/peminjam/FormPeminjamanBarang";
import FormPeminjamanRuangan from "./pages/peminjam/FormPeminjamanRuangan";
import FormPeminjamanLab from "./pages/peminjam/FormPeminjamanLab";
import FormPeminjamanOlahraga from "./pages/peminjam/FormPeminjamanOlahraga";
import FormPeminjamanDormitori from "./pages/peminjam/FormPeminjamanDormitori";
import PilihRuangan from "./pages/peminjam/PilihRuangan";
import LaporanKondisiSarpras from "./pages/peminjam/LaporanKondisiSarpras";
import RiwayatPeminjaman from "./pages/peminjam/RiwayatPeminjaman";

<<<<<<< HEAD
=======
// Janitor
>>>>>>> 567df8493f6aca7aff1c087ae8364b9b38a2ffac
import DashboardJanitor from "./pages/janitor/DashboardJanitor";
import KelolaSarpras from "./pages/janitor/KelolaSarpras";
import MonitoringSarpras from "./pages/janitor/MonitoringSarpras";
import PeminjamanSarpras from "./pages/janitor/PeminjamanSarpras";
import LaporanSarpras from "./pages/janitor/LaporanSarpras";

// Auth (lazy)
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Forgot = lazy(() => import("./pages/auth/Forgot"));

const peminjamanRoutes = [
  { path: "peminjaman-barang", element: <FormPeminjamanBarang /> },
  { path: "peminjaman-ruangan", element: <PilihRuangan /> },
  { path: "peminjaman-ruangan/form", element: <FormPeminjamanRuangan /> },
  { path: "peminjaman-lab", element: <FormPeminjamanLab /> },
  { path: "peminjaman-lab/form", element: <FormPeminjamanLab /> },
  { path: "peminjaman-olahraga", element: <FormPeminjamanOlahraga /> },
  { path: "peminjaman-dormitori", element: <FormPeminjamanDormitori /> },
  { path: "laporan-kondisi", element: <LaporanKondisiSarpras /> },
  { path: "riwayat-peminjaman", element: <RiwayatPeminjaman /> },
];

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
=======

        {/* AUTH */}
>>>>>>> 567df8493f6aca7aff1c087ae8364b9b38a2ffac
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
        </Route>

<<<<<<< HEAD
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
=======
        {/* PROTECTED */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>

            {/* PEGAWAI SARPRAS */}
>>>>>>> 567df8493f6aca7aff1c087ae8364b9b38a2ffac
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

<<<<<<< HEAD
=======
            {/* PEMINJAM */}
            <Route element={<ProtectedRoute allowedRoles={["peminjam"]} />}>
              <Route path="/peminjam" element={<DashboardPeminjam />} />
              <Route path="/peminjam/peminjaman-barang" element={<FormPeminjamanBarang />} />
              <Route path="/peminjam/peminjaman-ruangan" element={<FormPeminjamanRuangan />} />
              <Route path="/peminjam/peminjaman-lab" element={<FormPeminjamanLab />} />
              <Route path="/peminjam/laporan-kondisi" element={<LaporanKondisiSarpras />} />
              <Route path="/peminjam/riwayat-peminjaman" element={<RiwayatPeminjaman />} />
            </Route>

            {/* JANITOR */}
>>>>>>> 567df8493f6aca7aff1c087ae8364b9b38a2ffac
            <Route element={<ProtectedRoute allowedRoles={["janitor"]} />}>
              <Route path="/janitor" element={<DashboardJanitor />} />
              <Route path="/janitor/kelola-sarpras" element={<KelolaSarpras />} />
              <Route path="/janitor/monitoring-sarpras" element={<MonitoringSarpras />} />
              <Route path="/janitor/peminjaman-sarpras" element={<PeminjamanSarpras />} />
              <Route path="/janitor/laporan-sarpras" element={<LaporanSarpras />} />
              {peminjamanRoutes.map((r) => (
                <Route key={`janitor-${r.path}`} path={`/janitor/${r.path}`} element={r.element} />
              ))}
            </Route>

<<<<<<< HEAD
            <Route element={<ProtectedRoute allowedRoles={["peminjam"]} />}>
              <Route path="/peminjam" element={<DashboardPeminjam />} />
              {peminjamanRoutes.map((r) => (
                <Route key={`peminjam-${r.path}`} path={`/peminjam/${r.path}`} element={r.element} />
              ))}
            </Route>
          </Route>
        </Route>

=======
          </Route>
        </Route>

        {/* fallback */}
>>>>>>> 567df8493f6aca7aff1c087ae8364b9b38a2ffac
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </Suspense>
  );
}

export default App;