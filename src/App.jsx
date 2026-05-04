import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import "./css/style.css";

import "./charts/ChartjsConfig";

// Import pages
import Dashboard from "./pages/Dashboard";

import KelolaFasilitas from "./pages/pegawai/KelolaFasilitas";
import KelolaPegawai from "./pages/pegawai/KelolaPegawai";

import KelolaBarang from "./pages/pegawai/KelolaBarang";
import KelolaRuangan from "./pages/pegawai/KelolaRuangan";
import KelolaLaboratorium from "./pages/pegawai/KelolaLaboratorium";

import PeminjamanBarang from "./pages/pegawai/PeminjamanBarang";
import PeminjamanRuangan from "./pages/pegawai/PeminjamanRuangan";
import PeminjamanLaboratorium from "./pages/pegawai/PeminjamanLaboratorium";
function App() {
  const location = useLocation();

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]); // triggered on route change

  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route path="/pegawai" element={<KelolaPegawai />} />

        {/* Fasilitas */}
        <Route path="/fasilitas/barang" element={<KelolaFasilitas />} />
        <Route path="/fasilitas/ruangan" element={<KelolaRuangan />} />
        <Route path="/fasilitas/laboratorium" element={<KelolaLaboratorium />} />

        {/* Peminjaman */}
        <Route path="/peminjaman/barang" element={<PeminjamanBarang />} />
        <Route path="/peminjaman/ruangan" element={<PeminjamanRuangan />} />
        <Route path="/peminjaman/laboratorium" element={<PeminjamanLaboratorium />} />
      </Routes>
    </>
  );
}

export default App;
