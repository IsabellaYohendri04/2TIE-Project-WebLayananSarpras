import React, { useState, useEffect, useCallback } from "react";
import { BsFillExclamationDiamondFill } from "react-icons/bs";
import { FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import {
  getPegawai,
  createPegawai,
  updatePegawai,
  deletePegawai,
} from "./services/pegawaiService";
import TablePagination, { PAGE_LIMIT, getRowNumber } from "../../components/TablePagination";

const EMPTY_FORM = {
  nip: "",
  nama: "",
  email: "",
  password: "",
  divisi: "Sarana Prasarana",
  no_hp: "",
  status: "aktif",
};

function KelolaPegawai() {
  const [pegawaiList, setPegawaiList] = useState([]);
  const [stats, setStats] = useState({ total: 0, aktif: 0, nonaktif: 0 });
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchPegawai = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getPegawai({
        search: debouncedSearch,
        status: statusFilter,
        page,
        limit: PAGE_LIMIT,
      });
      setPegawaiList(response.data);
      setStats(response.stats || { total: 0, aktif: 0, nonaktif: 0 });
      setPagination(response.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Gagal memuat data pegawai. Pastikan server berjalan."
      );
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, statusFilter, page]);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchPegawai();
  }, [fetchPegawai]);

  const totalPegawai = stats.total;
  const totalAktif = stats.aktif;
  const totalNonaktif = stats.nonaktif;

  const openCreateModal = () => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setShowModal(true);
  };

  const openEditModal = (pegawai) => {
    setFormData({
      nip: pegawai.nip,
      nama: pegawai.nama,
      email: pegawai.email,
      password: "",
      divisi: pegawai.divisi,
      no_hp: pegawai.no_hp || "",
      status: pegawai.status,
    });
    setEditingId(pegawai.id);
    setShowModal(true);
  };

  const openDeleteModal = (pegawai) => {
    setDeleteTarget(pegawai);
    setShowDeleteModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (editingId) {
        const payload = { ...formData };
        if (!payload.password) delete payload.password;
        await updatePegawai(editingId, payload);
      } else {
        await createPegawai(formData);
      }
      setShowModal(false);
      fetchPegawai();
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal menyimpan data pegawai"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSubmitting(true);
    setError("");

    try {
      await deletePegawai(deleteTarget.id);
      setShowDeleteModal(false);
      setDeleteTarget(null);
      fetchPegawai();
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal menghapus data pegawai"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    return status === "aktif"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";
  };

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Kelola Pegawai
        </h1>
        <p className="text-gray-500 mt-2">
          Kelola akun pegawai sarpras dari database MySQL.
        </p>
      </div>

      {error && (
        <div className="bg-red-200 mb-5 p-5 text-sm font-light text-gray-600 rounded flex items-center">
          <BsFillExclamationDiamondFill className="text-red-600 me-2 text-lg shrink-0" />
          {error}
        </div>
      )}

      {/* Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-violet-500 to-violet-700 text-white rounded-3xl p-6 shadow-lg">
          <p>Total Pegawai</p>
          <h2 className="text-4xl font-bold mt-2">{totalPegawai}</h2>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-700 text-white rounded-3xl p-6 shadow-lg">
          <p>Aktif</p>
          <h2 className="text-4xl font-bold mt-2">{totalAktif}</h2>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-red-700 text-white rounded-3xl p-6 shadow-lg">
          <p>Nonaktif</p>
          <h2 className="text-4xl font-bold mt-2">{totalNonaktif}</h2>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <button
          onClick={openCreateModal}
          className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-3 rounded-2xl shadow font-medium"
        >
          + Tambah Pegawai
        </button>

        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-2xl px-4 py-3"
          >
            <option value="all">Semua Status</option>
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Nonaktif</option>
          </select>

          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, NIP, email..."
              className="w-full sm:w-64 border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <span className="absolute left-4 top-3 text-lg">🔍</span>
          </div>
        </div>
      </div>

      {/* Tabel */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            Memuat data pegawai...
          </div>
        ) : pegawaiList.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            Belum ada data pegawai.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 w-14">
                    No
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                    NIP
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Nama
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Divisi
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                    No. HP
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-center">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {pegawaiList.map((pegawai, index) => (
                  <tr
                    key={pegawai.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {getRowNumber(page, index)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200 font-mono">
                      {pegawai.nip}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-bold text-sm shrink-0">
                          {pegawai.nama.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">
                            {pegawai.nama}
                          </p>
                          <p className="text-xs text-gray-500">
                            {pegawai.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {pegawai.divisi}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {pegawai.no_hp || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(
                          pegawai.status
                        )}`}
                      >
                        {pegawai.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(pegawai)}
                          className="p-2 rounded-xl text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(pegawai)}
                          className="p-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
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
        {!loading && pegawaiList.length > 0 && (
          <TablePagination
            page={page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            onPageChange={setPage}
            itemLabel="pegawai"
          />
        )}
      </div>

      {/* Modal Form Tambah/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {editingId ? "Edit Pegawai" : "Tambah Pegawai"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  NIP *
                </label>
                <input
                  type="text"
                  name="nip"
                  value={formData.nip}
                  onChange={handleFormChange}
                  required
                  className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="Contoh: 198501012010011001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleFormChange}
                  required
                  className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="Nama pegawai"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="email@sarpras.ac.id"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password {editingId ? "(kosongkan jika tidak diubah)" : "*"}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleFormChange}
                  required={!editingId}
                  className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder={editingId ? "Password baru (opsional)" : "Password login pegawai"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Divisi
                </label>
                <input
                  type="text"
                  name="divisi"
                  value={formData.divisi}
                  onChange={handleFormChange}
                  className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="Sarana Prasarana"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    No. HP
                  </label>
                  <input
                    type="text"
                    name="no_hp"
                    value={formData.no_hp}
                    onChange={handleFormChange}
                    className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-xl py-2.5 font-medium"
                >
                  {submitting
                    ? "Menyimpan..."
                    : editingId
                      ? "Simpan Perubahan"
                      : "Tambah Pegawai"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              Hapus Pegawai
            </h2>
            <p className="text-gray-500 mb-6">
              Apakah Anda yakin ingin menghapus{" "}
              <span className="font-semibold text-gray-800 dark:text-white">
                {deleteTarget.nama}
              </span>
              ? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteTarget(null);
                }}
                className="flex-1 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={submitting}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl py-2.5 font-medium"
              >
                {submitting ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default KelolaPegawai;
