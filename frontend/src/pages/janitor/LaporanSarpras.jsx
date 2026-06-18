import React, { useCallback, useEffect, useState } from "react";
import { getLaporan, updateLaporanStatus } from "./services/janitorService";

export default function LaporanSarpras() {
  const [filter, setFilter] = useState("ALL");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = filter === "ALL" ? {} : { status: filter };
      const res = await getLaporan(params);
      setData(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Gagal memuat laporan. Pastikan server berjalan."
      );
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getStatusColor = (status) => {
    switch (status) {
      case "MENUNGGU":
        return "bg-yellow-100 text-yellow-700";
      case "DIPROSES":
        return "bg-blue-100 text-blue-700";
      case "SELESAI":
        return "bg-green-100 text-green-700";
      case "DITOLAK":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const updateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    setError("");

    try {
      await updateLaporanStatus(id, newStatus);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memperbarui status laporan");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <main className="grow bg-slate-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Laporan Sarpras 🔧
          </h1>
          <p className="text-gray-500 mt-2">
            Monitoring dan penanganan laporan kerusakan fasilitas
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setFilter("ALL")}
            className="px-4 py-2 rounded-xl bg-gray-200"
          >
            Semua
          </button>
          <button
            onClick={() => setFilter("MENUNGGU")}
            className="px-4 py-2 rounded-xl bg-yellow-100 text-yellow-700"
          >
            Menunggu
          </button>
          <button
            onClick={() => setFilter("DIPROSES")}
            className="px-4 py-2 rounded-xl bg-blue-100 text-blue-700"
          >
            Diproses
          </button>
          <button
            onClick={() => setFilter("SELESAI")}
            className="px-4 py-2 rounded-xl bg-green-100 text-green-700"
          >
            Selesai
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-12">Memuat data...</div>
        ) : data.length === 0 ? (
          <div className="text-center text-gray-500 py-12">Belum ada laporan.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl shadow-lg overflow-hidden"
              >
                <img
                  src={item.image}
                  alt="bukti kerusakan"
                  className="h-48 w-full object-cover"
                />

                <div className="p-5">
                  <h2 className="text-xl font-bold">{item.barang}</h2>
                  <p className="text-sm text-gray-500">
                    Pelapor: {item.pelapor} • {item.tanggal}
                  </p>

                  <p className="mt-3 text-gray-600 text-sm">
                    📌 {item.deskripsi}
                  </p>

                  <div className="mt-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <button
                      onClick={() => updateStatus(item.id, "DIPROSES")}
                      disabled={updatingId === item.id}
                      className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-3 py-2 rounded-xl text-sm"
                    >
                      Proses
                    </button>
                    <button
                      onClick={() => updateStatus(item.id, "SELESAI")}
                      disabled={updatingId === item.id}
                      className="bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white px-3 py-2 rounded-xl text-sm"
                    >
                      Selesai
                    </button>
                    <button
                      onClick={() => updateStatus(item.id, "DITOLAK")}
                      disabled={updatingId === item.id}
                      className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white px-3 py-2 rounded-xl text-sm"
                    >
                      Tolak
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}