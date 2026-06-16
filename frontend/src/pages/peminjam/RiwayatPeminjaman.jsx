import React, { useState, useEffect } from "react";
import {
  PageShell,
  PageHeader,
  ContentCard,
  StatCard,
  DataTable,
  inputClass,
} from "./components/PeminjamLayout";
import { getRiwayatPeminjaman } from "../../services/peminjamanService";

function RiwayatPeminjaman() {
  const [search, setSearch] = useState("");
  const [dataRiwayat, setDataRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRiwayatPeminjaman()
      .then(setDataRiwayat)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredData = dataRiwayat.filter((item) =>
    (item.item || "").toLowerCase().includes(search.toLowerCase()) ||
    (item.nama || "").toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Disetujui":
        return "bg-green-100 text-green-700";
      case "Menunggu":
        return "bg-yellow-100 text-yellow-700";
      case "Ditolak":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const columns = [
    { key: "item", label: "Nama Sarpras" },
    { key: "kategori", label: "Kategori" },
    { key: "tanggalPinjam", label: "Tanggal Pinjam" },
    { key: "tanggalKembali", label: "Tanggal Kembali" },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: (row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <PageShell>
      <PageHeader
        title="Riwayat Peminjaman"
        subtitle="Seluruh riwayat peminjaman sarana dan prasarana Anda"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="Total Peminjaman" value={dataRiwayat.length} color="violet" />
        <StatCard
          label="Disetujui"
          value={dataRiwayat.filter((i) => i.status === "Disetujui").length}
          color="green"
        />
        <StatCard
          label="Menunggu"
          value={dataRiwayat.filter((i) => i.status === "Menunggu").length}
          color="yellow"
        />
      </div>

      <ContentCard>
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Cari riwayat peminjaman..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={inputClass}
          />
        </div>

        {loading ? (
          <p className="text-center text-gray-500 py-8">Memuat riwayat...</p>
        ) : (
          <DataTable
            columns={columns}
            data={filteredData}
            emptyMessage="Tidak ada riwayat peminjaman ditemukan."
          />
        )}
      </ContentCard>
    </PageShell>
  );
}

export default RiwayatPeminjaman;
