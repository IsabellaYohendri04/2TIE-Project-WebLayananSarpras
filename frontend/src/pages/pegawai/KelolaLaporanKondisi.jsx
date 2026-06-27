import React, { useState, useEffect, useCallback, useMemo } from "react";
import { FiTrash2, FiX, FiEye } from "react-icons/fi";
import TablePagination, { PAGE_LIMIT, getRowNumber } from "../../components/TablePagination";
import { useDebouncedValue } from "../../hooks/usePaginatedFilter";
import {
  getLaporanKondisiAdmin,
  deleteLaporanKondisiAdmin,
} from "./services/pegawaiService";

const TIPE_LABEL = {
  barang: "Barang",
  ruangan: "Ruangan",
  laboratorium: "Laboratorium",
};

export default function KelolaLaporanKondisi() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const [tipeFilter, setTipeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getLaporanKondisiAdmin({
        search: debouncedSearch,
        tipe: tipeFilter,
      });
      setList(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat laporan kondisi");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, tipeFilter]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, tipeFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_LIMIT));
  const safePage = Math.min(page, totalPages);
  const paginatedList = useMemo(() => {
    const start = (safePage - 1) * PAGE_LIMIT;
    return list.slice(start, start + PAGE_LIMIT);
  }, [list, safePage]);

  const handleDelete = async (item) => {
    if (!window.confirm(`Hapus laporan kondisi "${item.item}" dari ${item.nama}?`)) return;
    setDeleting(true);
    try {
      await deleteLaporanKondisiAdmin(item.tipe, item.id);
      setSelected(null);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menghapus laporan");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Laporan Kondisi Barang
        </h1>
        <p className="text-gray-500 mt-2">
          Kelola laporan kondisi sarpras yang diisi peminjam setelah peminjaman selesai.
        </p>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-4">{error}</div>
      )}

      <div className="flex flex-col md:flex-row justify-end gap-3 mb-6">
        <select
          value={tipeFilter}
          onChange={(e) => setTipeFilter(e.target.value)}
          className="border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-2xl px-4 py-3"
        >
          <option value="all">Semua Tipe</option>
          <option value="barang">Barang</option>
          <option value="ruangan">Ruangan</option>
          <option value="laboratorium">Laboratorium</option>
        </select>
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari barang, nama, NIM..."
            className="w-full sm:w-72 border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <span className="absolute left-4 top-3 text-lg">🔍</span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Memuat data...</div>
        ) : list.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            Belum ada laporan kondisi yang masuk.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold w-14">No</th>
                  <th className="px-6 py-4 text-sm font-semibold">Barang / Sarpras</th>
                  <th className="px-6 py-4 text-sm font-semibold">Tipe</th>
                  <th className="px-6 py-4 text-sm font-semibold">Peminjam</th>
                  <th className="px-6 py-4 text-sm font-semibold">Periode</th>
                  <th className="px-6 py-4 text-sm font-semibold">Kondisi</th>
                  <th className="px-6 py-4 text-sm font-semibold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {paginatedList.map((item, index) => (
                  <tr key={`${item.tipe}-${item.id}`} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-6 py-4 text-sm text-gray-500">{getRowNumber(safePage, index)}</td>
                    <td className="px-6 py-4 font-medium text-gray-800 dark:text-white">{item.item}</td>
                    <td className="px-6 py-4 text-sm capitalize">{TIPE_LABEL[item.tipe] || item.tipe}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800 dark:text-white">{item.nama}</p>
                      <p className="text-xs text-gray-500">{item.nim} · {item.prodi}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.tanggalPinjam} — {item.tanggalKembali}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        {item.laporan?.kondisi || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelected(item)}
                          className="p-2 rounded-xl text-violet-600 hover:bg-violet-50"
                          title="Detail"
                        >
                          <FiEye size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          disabled={deleting}
                          className="p-2 rounded-xl text-red-600 hover:bg-red-50"
                          title="Hapus"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && list.length > 0 && (
          <TablePagination
            page={safePage}
            totalPages={totalPages}
            total={list.length}
            onPageChange={setPage}
            itemLabel="laporan"
          />
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Detail Laporan Kondisi</h2>
              <button onClick={() => setSelected(null)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500">
                <FiX size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div>
                <p className="text-gray-500">Barang / Sarpras</p>
                <p className="font-semibold text-gray-800 dark:text-white">{selected.item}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">Peminjam</p>
                  <p className="font-medium">{selected.nama}</p>
                </div>
                <div>
                  <p className="text-gray-500">NIM</p>
                  <p className="font-medium">{selected.nim || "-"}</p>
                </div>
              </div>
              <div>
                <p className="text-gray-500">Periode Peminjaman</p>
                <p className="font-medium">{selected.tanggalPinjam} — {selected.tanggalKembali}</p>
              </div>
              <div>
                <p className="text-gray-500">Kondisi</p>
                <p className="font-medium">{selected.laporan?.kondisi || "-"}</p>
              </div>
              <div>
                <p className="text-gray-500">Kelengkapan</p>
                <p className="font-medium">{selected.laporan?.kelengkapan || "-"}</p>
              </div>
              <div>
                <p className="text-gray-500">Catatan</p>
                <p className="font-medium whitespace-pre-wrap">{selected.laporan?.catatan || "-"}</p>
              </div>
              {selected.laporan?.tanggalLaporan && (
                <div>
                  <p className="text-gray-500">Tanggal Laporan</p>
                  <p className="font-medium">
                    {new Date(selected.laporan.tanggalLaporan).toLocaleString("id-ID")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
