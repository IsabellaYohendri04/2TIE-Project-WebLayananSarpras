import React, { useState, useEffect, useMemo } from "react";
import {
  PageShell,
  PageHeader,
  ContentCard,
  StatCard,
  DataTable,
  inputClass,
} from "./components/PeminjamLayout";
import TablePagination, { PAGE_LIMIT } from "../../components/TablePagination";
import { getRiwayatPeminjaman } from "../../services/peminjamanService";

function RiwayatPeminjaman() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [dataRiwayat, setDataRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRiwayatPeminjaman()
      .then(setDataRiwayat)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredData = useMemo(
    () =>
      dataRiwayat.filter(
        (item) =>
          (item.item || "").toLowerCase().includes(search.toLowerCase()) ||
          (item.nama || "").toLowerCase().includes(search.toLowerCase())
      ),
    [dataRiwayat, search]
  );

  useEffect(() => {
    setPage(1);
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_LIMIT));
  const safePage = Math.min(page, totalPages);
  const paginatedData = useMemo(() => {
    const start = (safePage - 1) * PAGE_LIMIT;
    return filteredData.slice(start, start + PAGE_LIMIT);
  }, [filteredData, safePage]);

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
          <>
            <DataTable
              columns={columns}
              data={paginatedData}
              emptyMessage="Tidak ada riwayat peminjaman ditemukan."
            />
            {filteredData.length > 0 && (
              <TablePagination
                page={safePage}
                totalPages={totalPages}
                total={filteredData.length}
                onPageChange={setPage}
                itemLabel="riwayat"
              />
            )}
          </>
        )}
      </ContentCard>
    </PageShell>
  );
}

export default RiwayatPeminjaman;
