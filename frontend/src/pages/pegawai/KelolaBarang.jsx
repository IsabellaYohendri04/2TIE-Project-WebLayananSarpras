import React, { useState, useEffect, useCallback, useMemo } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import TablePagination, { PAGE_LIMIT, getRowNumber } from "../../components/TablePagination";
import TableFilterBar from "../../components/TableFilterBar";
import { useDebouncedValue } from "../../hooks/usePaginatedFilter";
import {
  getBarangMaster,
  createBarangMaster,
  updateBarangMaster,
  deleteBarangMaster,
} from "../../services/fasilitasService";

const EMPTY = { nama: "", kategori: "Umum", stok: 1, status: "tersedia" };

const STATUS_OPTIONS = [
  { value: "all", label: "Semua Status" },
  { value: "tersedia", label: "Tersedia" },
  { value: "terbatas", label: "Terbatas" },
  { value: "habis", label: "Habis" },
];

export default function KelolaBarang() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const debouncedSearch = useDebouncedValue(search);
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      setList(await getBarangMaster());
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  const filteredList = useMemo(() => {
    let result = list;
    if (statusFilter !== "all") {
      result = result.filter((item) => item.status === statusFilter);
    }
    if (debouncedSearch.trim()) {
      const term = debouncedSearch.toLowerCase();
      result = result.filter(
        (item) =>
          (item.nama || "").toLowerCase().includes(term) ||
          (item.kategori || "").toLowerCase().includes(term)
      );
    }
    return result;
  }, [list, debouncedSearch, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredList.length / PAGE_LIMIT));
  const safePage = Math.min(page, totalPages);
  const paginatedList = useMemo(() => {
    const start = (safePage - 1) * PAGE_LIMIT;
    return filteredList.slice(start, start + PAGE_LIMIT);
  }, [filteredList, safePage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, stok: Number(form.stok) };
      if (editId) await updateBarangMaster(editId, payload);
      else await createBarangMaster(payload);
      setShowModal(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyimpan");
    }
  };

  return (
    <main className="grow">
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Kelola Barang</h1>
            <p className="text-gray-500 mt-1">CRUD inventaris barang sarpras</p>
          </div>
          <button onClick={() => { setForm(EMPTY); setEditId(null); setShowModal(true); }} className="btn bg-violet-600 text-white hover:bg-violet-700">+ Tambah Barang</button>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-4">{error}</div>}

        <TableFilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Cari nama, kategori..."
          filterValue={statusFilter}
          onFilterChange={setStatusFilter}
          filterOptions={STATUS_OPTIONS}
        />

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left w-14">No</th>
                <th className="p-4 text-left">Nama</th>
                <th className="p-4 text-left">Kategori</th>
                <th className="p-4 text-left">Stok</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center">Memuat...</td></tr>
              ) : paginatedList.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Tidak ada data barang.</td></tr>
              ) : paginatedList.map((item, index) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 text-gray-500">{getRowNumber(safePage, index)}</td>
                  <td className="p-4 font-medium">{item.nama}</td>
                  <td className="p-4">{item.kategori}</td>
                  <td className="p-4">{item.stok}</td>
                  <td className="p-4"><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">{item.status}</span></td>
                  <td className="p-4 text-center">
                    <button onClick={() => { setForm(item); setEditId(item.id); setShowModal(true); }} className="text-violet-600 mr-3"><FiEdit2 /></button>
                    <button onClick={() => deleteBarangMaster(item.id).then(fetchData)} className="text-red-600"><FiTrash2 /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && filteredList.length > 0 && (
            <TablePagination
              page={safePage}
              totalPages={totalPages}
              total={filteredList.length}
              onPageChange={setPage}
              itemLabel="barang"
            />
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4">
              <h2 className="text-xl font-bold">{editId ? "Edit" : "Tambah"} Barang</h2>
              <input required placeholder="Nama Barang" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} className="form-input w-full" />
              <input placeholder="Kategori" value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })} className="form-input w-full" />
              <input type="number" placeholder="Stok" value={form.stok} onChange={(e) => setForm({ ...form, stok: e.target.value })} className="form-input w-full" />
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="form-input w-full">
                <option value="tersedia">Tersedia</option>
                <option value="terbatas">Terbatas</option>
                <option value="habis">Habis</option>
              </select>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="btn bg-gray-100 flex-1">Batal</button>
                <button type="submit" className="btn bg-violet-600 text-white flex-1">Simpan</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
