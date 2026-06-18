import React, { useCallback, useEffect, useState } from "react";
import { BsFillExclamationDiamondFill } from "react-icons/bs";
import { FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import {
  PageShell,
  PageHeader,
  StatCard,
  ContentCard,
} from "../peminjam/components/PeminjamLayout";
import {
  getSarpras,
  createSarpras,
  updateSarpras,
  deleteSarpras,
} from "./services/janitorService";

const EMPTY_FORM = {
  nama: "",
  kategori: "",
  status: "Tersedia",
  lokasi: "",
  kondisi_teks: "",
};

export default function KelolaSarpras() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [fotoFile, setFotoFile] = useState(null);
  const [fotoPreview, setFotoPreview] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = filter === "all" ? {} : { status: filter };
      const res = await getSarpras(params);
      setData(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Gagal memuat data sarpras. Pastikan server berjalan."
      );
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    return () => {
      if (fotoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(fotoPreview);
      }
    };
  }, [fotoPreview]);

  const filteredData = data.filter(
    (item) =>
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.kategori.toLowerCase().includes(search.toLowerCase()) ||
      (item.lokasi || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalSarpras = data.length;
  const totalTersedia = data.filter((d) => d.status === "Tersedia").length;
  const totalDipinjam = data.filter(
    (d) => d.status === "Dipinjam" || d.status === "Dipakai"
  ).length;
  const totalRusak = data.filter((d) => d.status === "Rusak").length;

  const getStatusStyle = (status) => {
    switch (status) {
      case "Tersedia":
        return "bg-green-100 text-green-700";
      case "Dipinjam":
      case "Dipakai":
        return "bg-blue-100 text-blue-700";
      case "Rusak":
        return "bg-red-100 text-red-700";
      case "Maintenance":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setFotoFile(null);
    setFotoPreview("");
    setEditingId(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setFormData({
      nama: item.nama,
      kategori: item.kategori,
      status: item.status,
      lokasi: item.lokasi || "",
      kondisi_teks: item.kondisi?.teks || "",
    });
    setFotoFile(null);
    setFotoPreview(item.kondisi?.image || "");
    setEditingId(item.id);
    setShowModal(true);
  };

  const openDeleteModal = (item) => {
    setDeleteError("");
    setDeleteTarget(item);
    setShowDeleteModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Hanya file gambar yang diperbolehkan");
      return;
    }

    if (fotoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(fotoPreview);
    }

    setFotoFile(file);
    setFotoPreview(URL.createObjectURL(file));
  };

  const buildFormData = () => {
    const payload = new FormData();
    payload.append("nama", formData.nama.trim());
    payload.append("kategori", formData.kategori.trim());
    payload.append("tipe", "barang");
    payload.append("status", formData.status);
    payload.append("lokasi", formData.lokasi.trim());
    payload.append("kondisi_teks", formData.kondisi_teks.trim());
    if (fotoFile) payload.append("foto", fotoFile);
    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const payload = buildFormData();
      if (editingId) {
        await updateSarpras(editingId, payload);
      } else {
        await createSarpras(payload);
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyimpan data sarpras");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSubmitting(true);
    setDeleteError("");

    try {
      await deleteSarpras(deleteTarget.id);
      setShowDeleteModal(false);
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      setDeleteError(
        err.response?.data?.message || "Gagal menghapus data sarpras"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageShell>
      <PageHeader
        title="Kelola Barang 📦"
        subtitle="Kelola data barang sarana prasarana"
        badge="Janitor"
        backTo="/janitor"
      />

      {error && (
        <div className="bg-red-200 mb-5 p-5 text-sm text-gray-700 rounded-2xl flex items-center">
          <BsFillExclamationDiamondFill className="text-red-600 me-2 text-lg shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Barang" value={totalSarpras} color="blue" />
        <StatCard label="Tersedia" value={totalTersedia} color="green" />
        <StatCard label="Dipinjam" value={totalDipinjam} color="violet" />
        <StatCard label="Rusak" value={totalRusak} color="red" />
      </div>

      <ContentCard>
        <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
          <button
            onClick={openCreateModal}
            className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-3 rounded-2xl shadow font-medium"
          >
            + Tambah Barang
          </button>

          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-slate-200 rounded-2xl px-4 py-3 bg-white"
            >
              <option value="all">Semua Status</option>
              <option value="Tersedia">Tersedia</option>
              <option value="Dipinjam">Dipinjam</option>
              <option value="Dipakai">Dipakai</option>
              <option value="Rusak">Rusak</option>
              <option value="Maintenance">Maintenance</option>
            </select>

            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama, kategori, lokasi..."
                className="w-full sm:w-72 border border-slate-200 rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <span className="absolute left-4 top-3 text-lg">🔍</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-12">Memuat data...</div>
        ) : filteredData.length === 0 ? (
          <div className="text-center text-gray-500 py-12">Belum ada data barang.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredData.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50 rounded-[28px] overflow-hidden border border-slate-100 hover:shadow-lg transition"
              >
                <img
                  src={item.kondisi?.image || "/images/icon-02.svg"}
                  alt={item.nama}
                  className="h-48 w-full object-cover"
                  onError={(e) => {
                    e.target.src = "/images/icon-02.svg";
                  }}
                />

                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">{item.nama}</h2>
                      <p className="text-gray-500 text-sm mt-1">
                        {item.kategori} • {item.lokasi || "-"}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${getStatusStyle(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <p className="mt-3 text-gray-600 text-sm line-clamp-2">
                    📌 {item.kondisi?.teks || "Tidak ada catatan kondisi"}
                  </p>

                  <div className="flex gap-2 mt-4">
                    <button
                      type="button"
                      onClick={() => openEditModal(item)}
                      className="flex-1 flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-white px-4 py-2.5 rounded-xl font-medium transition"
                    >
                      <FiEdit2 size={16} />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => openDeleteModal(item)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl font-medium transition"
                    >
                      <FiTrash2 size={16} />
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ContentCard>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-gray-800">
                {editingId ? "Edit Barang" : "Tambah Barang"}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl hover:bg-slate-100 text-gray-500"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Barang *
                </label>
                <input
                  name="nama"
                  value={formData.nama}
                  onChange={handleFormChange}
                  required
                  placeholder="Contoh: Laptop Asus"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori *
                  </label>
                  <input
                    name="kategori"
                    value={formData.kategori}
                    onChange={handleFormChange}
                    required
                    placeholder="Elektronik"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-white"
                  >
                    <option value="Tersedia">Tersedia</option>
                    <option value="Dipinjam">Dipinjam</option>
                    <option value="Dipakai">Dipakai</option>
                    <option value="Rusak">Rusak</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lokasi
                </label>
                <input
                  name="lokasi"
                  value={formData.lokasi}
                  onChange={handleFormChange}
                  placeholder="Gudang / Lab 1"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kondisi / Catatan
                </label>
                <textarea
                  name="kondisi_teks"
                  value={formData.kondisi_teks}
                  onChange={handleFormChange}
                  rows={3}
                  placeholder="Deskripsi kondisi barang"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Foto
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFotoChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-white"
                />
                <p className="text-xs text-gray-500 mt-1">Maks. 5 MB, format JPG/PNG</p>
                {fotoPreview && (
                  <img
                    src={fotoPreview}
                    alt="Preview"
                    className="mt-3 h-40 w-full object-cover rounded-xl border border-slate-200"
                    onError={(e) => {
                      e.target.src = "/images/icon-02.svg";
                    }}
                  />
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-slate-200 text-gray-700 rounded-xl py-2.5 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-xl py-2.5 font-medium"
                >
                  {submitting ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Tambah"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Hapus Barang</h2>
            <p className="text-gray-500 mb-4">
              Apakah Anda yakin ingin menghapus{" "}
              <span className="font-semibold text-gray-800">{deleteTarget.nama}</span>?
              Tindakan ini tidak dapat dibatalkan.
            </p>

            {deleteError && (
              <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
                {deleteError}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteTarget(null);
                  setDeleteError("");
                }}
                className="flex-1 border border-slate-200 text-gray-700 rounded-xl py-2.5 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
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
    </PageShell>
  );
}