import React from "react";
import PeminjamanAdmin from "./PeminjamanAdmin";
import {
  getPeminjamanLaboratorium,
  updatePeminjamanLaboratorium,
  deletePeminjamanLaboratorium,
} from "../../services/peminjamanService";

export default function PeminjamanLaboratorium() {
  return (
    <PeminjamanAdmin
      title="Peminjaman Laboratorium"
      tipe="laboratorium"
      fetchFn={getPeminjamanLaboratorium}
      updateFn={updatePeminjamanLaboratorium}
      deleteFn={deletePeminjamanLaboratorium}
    />
  );
}
