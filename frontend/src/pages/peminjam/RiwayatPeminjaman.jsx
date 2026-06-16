import React, { useState } from "react";
import {
  PageShell,
  PageHeader,
  ContentCard,
  StatCard,
  DataTable,
  inputClass,
} from "./components/PeminjamLayout";

function RiwayatPeminjaman() {
  const [search, setSearch] = useState("");

  const dataRiwayat = [
    {
      id: 1,
      nama: "Laptop Asus VivoBook",
      kategori: "Barang",
      tanggalPinjam: "2026-06-13",
      tanggalKembali: "2026-06-15",
      status: "Selesai",
    },
    {
      id: 2,
      nama: "Ruang Seminar",
      kategori: "Ruangan",
      tanggalPinjam: "2026-06-20",
      tanggalKembali: "2026-06-21",
      status: "Selesai",
    },
    {
      id: 3,
      nama: "Laboratorium Jaringan",
      kategori: "Laboratorium",
      tanggalPinjam: "2026-07-01",
      tanggalKembali: "2026-07-02",
      status: "Diproses",
    },
    {
      id: 4,
      nama: "Proyektor Epson",
      kategori: "Barang",
      tanggalPinjam: "2026-05-10",
      tanggalKembali: "2026-05-12",
      status: "Ditolak",
    },
  ];

  const filteredData = dataRiwayat.filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Selesai":
        return "bg-green-100 text-green-700";
      case "Diproses":
        return "bg-yellow-100 text-yellow-700";
      case "Ditolak":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const columns = [
    { key: "nama", label: "Nama Sarpras" },
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
    {
      key: "aksi",
      label: "Aksi",
      align: "center",
      render: () => (
        <button className="text-violet-600 hover:text-violet-800 font-medium text-sm">
          Detail
        </button>
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
          label="Selesai"
          value={dataRiwayat.filter((i) => i.status === "Selesai").length}
          color="green"
        />
        <StatCard
          label="Diproses"
          value={dataRiwayat.filter((i) => i.status === "Diproses").length}
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

        <DataTable
          columns={columns}
          data={filteredData}
          emptyMessage="Tidak ada riwayat peminjaman ditemukan."
        />
      </ContentCard>
    </PageShell>
  );
}

export default RiwayatPeminjaman;
