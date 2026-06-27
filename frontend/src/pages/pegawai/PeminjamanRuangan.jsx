import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import PeminjamanAdmin from "./PeminjamanAdmin";
import {
  getPeminjamanRuangan,
  updatePeminjamanRuangan,
  deletePeminjamanRuangan,
} from "../../services/peminjamanService";

const GEDUNG_LABELS = {
  "gedung-utama": "Gedung Utama",
  "gedung-serba-guna": "Gedung Serba Guna",
  "gedung-olahraga": "Gedung Olahraga",
  "workshop-listrik": "Workshop Listrik",
  "workshop-mesin": "Workshop Mesin",
  dormitori: "Dormitori",
};

export default function PeminjamanRuangan() {
  const [searchParams] = useSearchParams();
  const gedung = searchParams.get("gedung");
  const tipe = searchParams.get("tipe");

  const filterFn = useMemo(() => {
    if (!gedung && !tipe) return null;

    return (item) => {
      const ruangan = (item.ruangan || "").toLowerCase();
      const kategori = (item.kategori || "").toLowerCase();
      const detail = item.detail || {};

      if (tipe === "olahraga") {
        return kategori.includes("olahraga") || ruangan.includes("olahraga");
      }
      if (tipe === "dormitori") {
        return kategori.includes("dormitori") || ruangan.includes("dormitori");
      }
      if (gedung) {
        const label = (GEDUNG_LABELS[gedung] || gedung).toLowerCase();
        return (
          ruangan.includes(label) ||
          kategori.includes(label) ||
          (detail.gedung || "").toLowerCase().includes(gedung.replace(/-/g, " "))
        );
      }
      return true;
    };
  }, [gedung, tipe]);

  const title = tipe === "olahraga"
    ? "Peminjaman Gedung Olahraga"
    : tipe === "dormitori"
      ? "Peminjaman Dormitori"
      : gedung
        ? `Peminjaman Ruangan — ${GEDUNG_LABELS[gedung] || gedung}`
        : "Peminjaman Ruangan";

  return (
    <PeminjamanAdmin
      title={title}
      tipe="ruangan"
      fetchFn={getPeminjamanRuangan}
      updateFn={updatePeminjamanRuangan}
      deleteFn={deletePeminjamanRuangan}
      filterFn={filterFn}
    />
  );
}
