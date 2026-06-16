import React from "react";
import PeminjamanAdmin from "./PeminjamanAdmin";
import {
  getPeminjamanRuangan,
  updatePeminjamanRuangan,
  deletePeminjamanRuangan,
} from "../../services/peminjamanService";

export default function PeminjamanRuangan() {
  return (
    <PeminjamanAdmin
      title="Peminjaman Ruangan"
      tipe="ruangan"
      fetchFn={getPeminjamanRuangan}
      updateFn={updatePeminjamanRuangan}
      deleteFn={deletePeminjamanRuangan}
    />
  );
}
