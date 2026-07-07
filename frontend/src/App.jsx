import React, { useEffect, lazy, Suspense } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import "./css/style.css";
import "./charts/ChartjsConfig";

import MainLayout from "./partials/MainLayout";
import AuthLayout from "./partials/AuthLayout";
import Loading from "./components/Loading";
import ProtectedRoute from "./components/ProtectedRoute";

// ================= AUTH =================
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Forgot = lazy(() => import("./pages/auth/Forgot"));

// ================= PEGAWAI =================
const Dashboard = lazy(() => import("./pages/pegawai/Dashboard"));
const KelolaBarang = lazy(() => import("./pages/pegawai/KelolaBarang"));
const KelolaPegawai = lazy(() => import("./pages/pegawai/KelolaPegawai"));
const KelolaRuangan = lazy(() => import("./pages/pegawai/KelolaRuangan"));
const KelolaLaboratorium = lazy(
  () => import("./pages/pegawai/KelolaLaboratorium"),
);
const KelolaLaporanKondisi = lazy(
  () => import("./pages/pegawai/KelolaLaporanKondisi"),
);
const PeminjamanBarang = lazy(() => import("./pages/pegawai/PeminjamanBarang"));
const PeminjamanRuangan = lazy(
  () => import("./pages/pegawai/PeminjamanRuangan"),
);
const PeminjamanLaboratorium = lazy(
  () => import("./pages/pegawai/PeminjamanLaboratorium"),
);
const DetailPeminjaman = lazy(() => import("./pages/pegawai/DetailPeminjaman"));

// ================= PEMINJAM =================
const DashboardPeminjam = lazy(
  () => import("./pages/peminjam/DashboardPeminjam"),
);
const FormPeminjamanBarang = lazy(
  () => import("./pages/peminjam/FormPeminjamanBarang"),
);
const FormPeminjamanRuangan = lazy(
  () => import("./pages/peminjam/FormPeminjamanRuangan"),
);
const FormPeminjamanLab = lazy(
  () => import("./pages/peminjam/FormPeminjamanLab"),
);
const FormPeminjamanOlahraga = lazy(
  () => import("./pages/peminjam/FormPeminjamanOlahraga"),
);
const FormPeminjamanDormitori = lazy(
  () => import("./pages/peminjam/FormPeminjamanDormitori"),
);
const PilihRuangan = lazy(() => import("./pages/peminjam/PilihRuangan"));
const LaporanKondisiSarpras = lazy(
  () => import("./pages/peminjam/LaporanKondisiSarpras"),
);
const RiwayatPeminjaman = lazy(
  () => import("./pages/peminjam/RiwayatPeminjaman"),
);

// ================= JANITOR =================
const DashboardJanitor = lazy(() => import("./pages/janitor/DashboardJanitor"));
const KelolaSarpras = lazy(() => import("./pages/janitor/KelolaSarpras"));
const MonitoringSarpras = lazy(
  () => import("./pages/janitor/MonitoringSarpras"),
);
const PeminjamanSarpras = lazy(
  () => import("./pages/janitor/PeminjamanSarpras"),
);
const LaporanSarpras = lazy(() => import("./pages/janitor/LaporanSarpras"));

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
        {/* ================= AUTH ================= */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            {/* ================= PEGAWAI ================= */}
            <Route
              element={<ProtectedRoute allowedRoles={["pegawai_sarpras"]} />}
            >
              <Route path="/" element={<Dashboard />} />
              <Route path="/pegawai" element={<KelolaPegawai />} />

              <Route path="/fasilitas/barang" element={<KelolaBarang />} />
              <Route path="/fasilitas/ruangan" element={<KelolaRuangan />} />
              <Route
                path="/fasilitas/laboratorium"
                element={<KelolaLaboratorium />}
              />

              <Route path="/peminjaman/barang" element={<PeminjamanBarang />} />
              <Route
                path="/peminjaman/ruangan"
                element={<PeminjamanRuangan />}
              />
              <Route
                path="/peminjaman/laboratorium"
                element={<PeminjamanLaboratorium />}
              />

              <Route
                path="/laporan-kondisi"
                element={<KelolaLaporanKondisi />}
              />

              <Route
                path="/pegawai/peminjaman/barang/:id"
                element={<DetailPeminjaman />}
              />
            </Route>

            {/* ================= PEMINJAM ================= */}
            <Route element={<ProtectedRoute allowedRoles={["peminjam"]} />}>
              <Route path="/peminjam" element={<DashboardPeminjam />} />

              {peminjamanRoutes.map((route) => (
                <Route
                  key={`peminjam-${route.path}`}
                  path={`/peminjam/${route.path}`}
                  element={route.element}
                />
              ))}
            </Route>

            {/* ================= JANITOR ================= */}
            <Route element={<ProtectedRoute allowedRoles={["janitor"]} />}>
              <Route path="/janitor" element={<DashboardJanitor />} />

              <Route
                path="/janitor/kelola-sarpras"
                element={<KelolaSarpras />}
              />

              <Route
                path="/janitor/monitoring-sarpras"
                element={<MonitoringSarpras />}
              />

              <Route
                path="/janitor/peminjaman-sarpras"
                element={<PeminjamanSarpras />}
              />

              <Route
                path="/janitor/laporan-sarpras"
                element={<LaporanSarpras />}
              />

              {peminjamanRoutes.map((route) => (
                <Route
                  key={`janitor-${route.path}`}
                  path={`/janitor/${route.path}`}
                  element={route.element}
                />
              ))}
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
