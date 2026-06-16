import React, { useCallback, useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import {
  getSarpras,
  createSarpras,
  updateSarpras,
} from "./services/janitorService";

const EMPTY_FORM = {
  nama: "",
  kategori: "",
  tipe: "barang",
  status: "Tersedia",
  lokasi: "",
  kondisi_teks: "",
  kondisi_image: "",
};

export default function KelolaSarpras() {
  const [filter, setFilter] = useState("all");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
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

  const getStatusStyle = (status) => {
    switch (status) {
      case "Tersedia":
        return "bg-green-100 text-green-700";
      case "Dipinjam":
      case "Dipakai":
        return "bg-blue-100 text-blue-700";
      case "Rusak":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const openCreateModal = () => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setFormData({
      nama: item.nama,
      kategori: item.kategori,
      tipe: item.tipe || "barang",
      status: item.status,
      lokasi: item.lokasi || "",
      kondisi_teks: item.kondisi?.teks || "",
      kondisi_image: item.kondisi?.image || "",
    });
    setEditingId(item.id);
    setShowModal(true);
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
        await updateSarpras(editingId, formData);
      } else {
        await createSarpras(formData);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyimpan data sarpras");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="grow bg-slate-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Kelola Sarpras 📦
          </h1>
          <p className="text-gray-500 mt-2">
            Monitoring barang, status, dan kondisi sarana prasarana
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <button
            onClick={openCreateModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl shadow"
          >
            + Tambah Barang
          </button>

          <select
            className="border rounded-2xl px-4 py-3"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Semua Status</option>
            <option value="Tersedia">Tersedia</option>
            <option value="Dipinjam">Dipinjam</option>
            <option value="Rusak">Rusak</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-12">Memuat data...</div>
        ) : data.length === 0 ? (
          <div className="text-center text-gray-500 py-12">Belum ada data sarpras.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl shadow-lg overflow-hidden"
              >
                <img
                  src={item.kondisi.image}
                  alt="kondisi barang"
                  className="h-48 w-full object-cover"
                />

                <div className="p-5">
                  <h2 className="text-xl font-bold text-gray-800">{item.nama}</h2>
                  <p className="text-gray-500 text-sm">
                    {item.kategori} • {item.lokasi}
                  </p>

                  <div className="mt-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <p className="mt-3 text-gray-600 text-sm">
                    📌 {item.kondisi.teks}
                  </p>

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => openEditModal(item)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-xl"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold">
                {editingId ? "Edit Sarpras" : "Tambah Sarpras"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-500"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nama *</label>
                <input
                  name="nama"
                  value={formData.nama}
                  onChange={handleFormChange}
                  required
                  className="w-full border rounded-xl px-4 py-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Kategori *</label>
                  <input
                    name="kategori"
                    value={formData.kategori}
                    onChange={handleFormChange}
                    required
                    className="w-full border rounded-xl px-4 py-2.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tipe</label>
                  <select
                    name="tipe"
                    value={formData.tipe}
                    onChange={handleFormChange}
                    className="w-full border rounded-xl px-4 py-2.5"
                  >
                    <option value="barang">Barang</option>
                    <option value="ruangan">Ruangan</option>
                    <option value="laboratorium">Laboratorium</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="w-full border rounded-xl px-4 py-2.5"
                  >
                    <option value="Tersedia">Tersedia</option>
                    <option value="Dipinjam">Dipinjam</option>
                    <option value="Dipakai">Dipakai</option>
                    <option value="Rusak">Rusak</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Lokasi</label>
                  <input
                    name="lokasi"
                    value={formData.lokasi}
                    onChange={handleFormChange}
                    className="w-full border rounded-xl px-4 py-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Kondisi</label>
                <textarea
                  name="kondisi_teks"
                  value={formData.kondisi_teks}
                  onChange={handleFormChange}
                  rows={3}
                  className="w-full border rounded-xl px-4 py-2.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">URL Gambar</label>
                <input
                  name="kondisi_image"
                  value={formData.kondisi_image}
                  onChange={handleFormChange}
                  className="w-full border rounded-xl px-4 py-2.5"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border rounded-xl py-2.5"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl py-2.5"
                >
                  {submitting ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
