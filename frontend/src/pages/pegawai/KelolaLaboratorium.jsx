import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import TablePagination, { PAGE_LIMIT, getRowNumber } from "../../components/TablePagination";
import TableFilterBar from "../../components/TableFilterBar";
import { useDebouncedValue } from "../../hooks/usePaginatedFilter";
import {
  getGedung,
  getLaboratorium,
  createLaboratorium,
  updateLaboratorium,
  deleteLaboratorium,
} from "../../services/fasilitasService";

const EMPTY = {
  gedung_id: "",
  kode: "",
  nama: "",
  lantai: 1,
  kapasitas: 30,
  fasilitas: "",
  status: "tersedia",
};

const STATUS_OPTIONS = [
  { value: "all", label: "Semua Status" },
  { value: "tersedia", label: "Tersedia" },
  { value: "terbatas", label: "Terbatas" },
  { value: "penuh", label: "Penuh" },
];

export default function KelolaLaboratorium() {
  const [searchParams] = useSearchParams();
  const gedungFilter = searchParams.get("gedung") || "";

  const [gedungList, setGedungList] = useState([]);
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
      const params = {};
      if (gedungFilter) params.gedung = gedungFilter;
      const [gedung, lab] = await Promise.all([getGedung(), getLaboratorium(params)]);
      setGedungList(gedung);
      setList(lab);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }, [gedungFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, gedungFilter]);

  const filteredList = useMemo(() => {
    let result = list;
    if (statusFilter !== "all") {
      result = result.filter((item) => item.status === statusFilter);
    }
    if (debouncedSearch.trim()) {
      const term = debouncedSearch.toLowerCase();
      result = result.filter(
        (item) =>
          (item.kode || "").toLowerCase().includes(term) ||
          (item.nama || "").toLowerCase().includes(term) ||
          (item.gedungNama || "").toLowerCase().includes(term)
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

  const filterLabel = gedungFilter
    ? gedungList.find((g) => g.slug === gedungFilter)?.nama || gedungFilter
    : null;

  const openCreate = () => { setForm(EMPTY); setEditId(null); setShowModal(true); };

  const openEdit = (item) => {
    setForm({
      gedung_id: item.gedungId,
      kode: item.kode,
      nama: item.nama,
      lantai: item.lantai,
      kapasitas: item.kapasitas,
      fasilitas: (item.fasilitas || []).join(", "),
      status: item.status,
    });
    setEditId(item.id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      gedung_id: Number(form.gedung_id),
      lantai: Number(form.lantai),
      kapasitas: Number(form.kapasitas),
      fasilitas: form.fasilitas.split(",").map((s) => s.trim()).filter(Boolean),
    };
    try {
      if (editId) await updateLaboratorium(editId, payload);
      else await createLaboratorium(payload);
      setShowModal(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyimpan");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus laboratorium ini?")) return;
    await deleteLaboratorium(id);
    fetchData();
  };

  return (
    <main className="grow">
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Kelola Laboratorium{filterLabel ? ` — ${filterLabel}` : ""}
            </h1>
            <p className="text-gray-500 mt-1">CRUD data laboratorium per gedung</p>
          </div>
          <button onClick={openCreate} className="btn bg-violet-600 text-white hover:bg-violet-700">+ Tambah Lab</button>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-4">{error}</div>}

        <TableFilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Cari kode, nama, gedung..."
          filterValue={statusFilter}
          onFilterChange={setStatusFilter}
          filterOptions={STATUS_OPTIONS}
        />

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left w-14">No</th>
                <th className="p-4 text-left">Kode</th>
                <th className="p-4 text-left">Nama</th>
                <th className="p-4 text-left">Gedung</th>
                <th className="p-4 text-left">Kapasitas</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="p-8 text-center">Memuat...</td></tr>
              ) : paginatedList.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-gray-500">Tidak ada data laboratorium.</td></tr>
              ) : paginatedList.map((item, index) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 text-gray-500">{getRowNumber(safePage, index)}</td>
                  <td className="p-4 font-medium">{item.kode}</td>
                  <td className="p-4">{item.nama}</td>
                  <td className="p-4">{item.gedungNama}</td>
                  <td className="p-4">{item.kapasitas}</td>
                  <td className="p-4"><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">{item.status}</span></td>
                  <td className="p-4 text-center">
                    <button onClick={() => openEdit(item)} className="text-violet-600 mr-3"><FiEdit2 /></button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600"><FiTrash2 /></button>
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
              itemLabel="laboratorium"
            />
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 w-full max-w-lg space-y-4">
              <h2 className="text-xl font-bold">{editId ? "Edit" : "Tambah"} Laboratorium</h2>
              <select required value={form.gedung_id} onChange={(e) => setForm({ ...form, gedung_id: e.target.value })} className="form-input w-full">
                <option value="">Pilih Gedung</option>
                {gedungList.map((g) => <option key={g.id} value={g.id}>{g.nama}</option>)}
              </select>
              <input required placeholder="Kode Lab" value={form.kode} onChange={(e) => setForm({ ...form, kode: e.target.value })} className="form-input w-full" />
              <input required placeholder="Nama Lab" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} className="form-input w-full" />
              <div className="grid grid-cols-2 gap-3">
                <input type="number" value={form.lantai} onChange={(e) => setForm({ ...form, lantai: e.target.value })} className="form-input w-full" />
                <input type="number" value={form.kapasitas} onChange={(e) => setForm({ ...form, kapasitas: e.target.value })} className="form-input w-full" />
              </div>
              <input placeholder="Fasilitas (pisah koma)" value={form.fasilitas} onChange={(e) => setForm({ ...form, fasilitas: e.target.value })} className="form-input w-full" />
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="form-input w-full">
                <option value="tersedia">Tersedia</option>
                <option value="terbatas">Terbatas</option>
                <option value="penuh">Penuh</option>
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
