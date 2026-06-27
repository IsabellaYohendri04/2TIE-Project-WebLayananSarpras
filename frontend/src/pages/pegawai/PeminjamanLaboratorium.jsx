import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import PeminjamanAdmin from "./PeminjamanAdmin";
import {
  getPeminjamanLaboratorium,
  updatePeminjamanLaboratorium,
  deletePeminjamanLaboratorium,
} from "../../services/peminjamanService";

const GEDUNG_LABELS = {
  "gedung-utama": "Gedung Utama",
  "gedung-serba-guna": "Gedung Serba Guna",
  "workshop-listrik": "Workshop Listrik",
  "workshop-mesin": "Workshop Mesin",
};

export default function PeminjamanLaboratorium() {
  const [searchParams] = useSearchParams();
  const gedung = searchParams.get("gedung");

  const filterFn = useMemo(() => {
    if (!gedung) return null;

    return (item) => {
      const lab = (item.laboratorium || "").toLowerCase();
      const kategori = (item.kategori || "").toLowerCase();
      const label = (GEDUNG_LABELS[gedung] || gedung).toLowerCase();
      return lab.includes(label) || kategori.includes(label);
    };
  }, [gedung]);

  const title = gedung
    ? `Peminjaman Laboratorium — ${GEDUNG_LABELS[gedung] || gedung}`
    : "Peminjaman Laboratorium";

  return (
    <PeminjamanAdmin
      title={title}
      tipe="laboratorium"
      fetchFn={getPeminjamanLaboratorium}
      updateFn={updatePeminjamanLaboratorium}
      deleteFn={deletePeminjamanLaboratorium}
      filterFn={filterFn}
    />
  );
}
