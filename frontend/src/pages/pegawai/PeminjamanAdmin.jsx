import React, { useState, useEffect, useCallback, useMemo } from "react";
import { FiTrash2 } from "react-icons/fi";
import TablePagination, { PAGE_LIMIT, getRowNumber } from "../../components/TablePagination";
import TableFilterBar from "../../components/TableFilterBar";
import { useDebouncedValue } from "../../hooks/usePaginatedFilter";

const STATUS_OPTIONS = [
  { value: "all", label: "Semua Status" },
  { value: "Menunggu", label: "Menunggu" },
  { value: "Disetujui", label: "Disetujui" },
  { value: "Ditolak", label: "Ditolak" },
];

function PeminjamanAdmin({ title, tipe, fetchFn, updateFn, deleteFn, filterFn }) {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const debouncedSearch = useDebouncedValue(search);
  const [page, setPage] = useState(1);

  const itemField = tipe === "barang" ? "barang" : tipe === "ruangan" ? "ruangan" : "laboratorium";

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await fetchFn();
      setAllData(filterFn ? rows.filter(filterFn) : rows);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }, [fetchFn, filterFn]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, filterFn]);

  const filteredData = useMemo(() => {
    let result = allData;
    if (statusFilter !== "all") {
      result = result.filter((item) => item.status === statusFilter);
    }
    if (debouncedSearch.trim()) {
      const term = debouncedSearch.toLowerCase();
      result = result.filter(
        (item) =>
          (item.nama || "").toLowerCase().includes(term) ||
          (item.nim || "").toLowerCase().includes(term) ||
          (item.prodi || "").toLowerCase().includes(term) ||
          (item[itemField] || item.item || "").toLowerCase().includes(term) ||
          (item.kategori || "").toLowerCase().includes(term)
      );
    }
    return result;
  }, [allData, debouncedSearch, statusFilter, itemField]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_LIMIT));
  const safePage = Math.min(page, totalPages);
  const data = useMemo(() => {
    const start = (safePage - 1) * PAGE_LIMIT;
    return filteredData.slice(start, start + PAGE_LIMIT);
  }, [filteredData, safePage]);

  const handleStatus = async (id, status) => {
    const catatan = window.prompt("Catatan admin (opsional):", "") || "";
    try {
      await updateFn(id, { status, catatanAdmin: catatan });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal update");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus pengajuan ini?")) return;
    await deleteFn(id);
    fetchData();
  };

  const statusColor = (s) => {
    if (s === "Disetujui") return "bg-green-100 text-green-700";
    if (s === "Ditolak") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <main className="grow">
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
          <p className="text-gray-500 mt-1">Kelola pengajuan peminjaman — setujui, tolak, atau hapus</p>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-4">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl shadow"><p className="text-gray-500 text-sm">Total</p><p className="text-2xl font-bold">{allData.length}</p></div>
          <div className="bg-white p-5 rounded-2xl shadow"><p className="text-gray-500 text-sm">Menunggu</p><p className="text-2xl font-bold text-yellow-600">{allData.filter((d) => d.status === "Menunggu").length}</p></div>
          <div className="bg-white p-5 rounded-2xl shadow"><p className="text-gray-500 text-sm">Disetujui</p><p className="text-2xl font-bold text-green-600">{allData.filter((d) => d.status === "Disetujui").length}</p></div>
        </div>

        <TableFilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Cari peminjam, item..."
          filterValue={statusFilter}
          onFilterChange={setStatusFilter}
          filterOptions={STATUS_OPTIONS}
        />

        <div className="bg-white rounded-3xl shadow-lg overflow-x-auto border border-slate-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
                <th className="p-4 text-left font-semibold w-14">No</th>
                <th className="p-4 text-left font-semibold">Peminjam</th>
                <th className="p-4 text-left font-semibold">Item</th>
                <th className="p-4 text-left font-semibold">Periode</th>
                <th className="p-4 text-left font-semibold">Status</th>
                <th className="p-4 text-center font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center">Memuat...</td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Belum ada pengajuan</td></tr>
              ) : data.map((item, index) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 text-gray-500">{getRowNumber(safePage, index)}</td>
                  <td className="p-4">
                    <p className="font-medium">{item.nama}</p>
                    <p className="text-xs text-gray-500">{item.nim} · {item.prodi}</p>
                  </td>
                  <td className="p-4">{item[itemField] || item.item}</td>
                  <td className="p-4">{item.tanggalPinjam} — {item.tanggalKembali}<br /><span className="text-xs text-gray-500">{item.jamMulai} - {item.jamSelesai}</span></td>
                  <td className="p-4"><span className={`px-3 py-1 rounded-full text-xs ${statusColor(item.status)}`}>{item.status}</span></td>
                  <td className="p-4 text-center whitespace-nowrap">
                    {item.status === "Menunggu" && (
                      <>
                        <button onClick={() => handleStatus(item.id, "Disetujui")} className="text-green-600 text-xs font-medium mr-2">Setujui</button>
                        <button onClick={() => handleStatus(item.id, "Ditolak")} className="text-red-600 text-xs font-medium mr-2">Tolak</button>
                      </>
                    )}
                    <button onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-red-600"><FiTrash2 /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && filteredData.length > 0 && (
            <TablePagination
              page={safePage}
              totalPages={totalPages}
              total={filteredData.length}
              onPageChange={setPage}
              itemLabel="pengajuan"
            />
          )}
        </div>
      </div>
    </main>
  );
}

export default PeminjamanAdmin;
