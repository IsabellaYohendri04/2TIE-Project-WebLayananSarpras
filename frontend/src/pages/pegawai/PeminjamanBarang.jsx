import React from "react";
import PeminjamanAdmin from "./PeminjamanAdmin";
import {
  getPeminjamanBarang,
  updatePeminjamanBarang,
  deletePeminjamanBarang,
} from "../../services/peminjamanService";

export default function PeminjamanBarang() {
  return (
    <PeminjamanAdmin
      title="Peminjaman Barang"
      tipe="barang"
      fetchFn={getPeminjamanBarang}
      updateFn={updatePeminjamanBarang}
      deleteFn={deletePeminjamanBarang}
    />
  );
}
