import React, { useEffect, useState } from "react";
import { getSarprasMonitoring } from "./services/janitorService";

export default function MonitoringSarpras() {
  const [filter, setFilter] = useState("ALL");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    getSarprasMonitoring()
      .then((res) => setData(res.data))
      .catch((err) => {
        setError(
          err.response?.data?.message ||
            "Gagal memuat monitoring. Pastikan server berjalan."
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "TERSEDIA":
        return "bg-green-100 text-green-700";
      case "DIPAKAI":
        return "bg-blue-100 text-blue-700";
      case "RUSAK":
        return "bg-red-100 text-red-700";
      case "MAINTENANCE":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const isOverdue = (deadline) => {
    if (!deadline || deadline === "-") return false;
    return new Date(deadline) < new Date();
  };

  const filteredData =
    filter === "ALL"
      ? data
      : data.filter((item) => item.status === filter);

  const totalDipakai = data.filter((item) => item.status === "DIPAKAI").length;
  const totalTersedia = data.filter((item) => item.status === "TERSEDIA").length;
  const totalRusak = data.filter((item) => item.status === "RUSAK").length;
  const totalOverdue = data.filter((item) => isOverdue(item.deadline)).length;

  return (
    <main className="grow bg-slate-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Monitoring Sarpras 📊
          </h1>
          <p className="text-gray-500 mt-2">
            Pantau penggunaan dan kondisi sarana prasarana secara real-time
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-500 py-12">Memuat data...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-5 rounded-3xl shadow">
                <p className="text-gray-500">Sedang Dipakai</p>
                <h2 className="text-3xl font-bold text-blue-600">{totalDipakai}</h2>
              </div>
              <div className="bg-white p-5 rounded-3xl shadow">
                <p className="text-gray-500">Tersedia</p>
                <h2 className="text-3xl font-bold text-green-600">{totalTersedia}</h2>
              </div>
              <div className="bg-white p-5 rounded-3xl shadow">
                <p className="text-gray-500">Rusak</p>
                <h2 className="text-3xl font-bold text-red-600">{totalRusak}</h2>
              </div>
              <div className="bg-white p-5 rounded-3xl shadow">
                <p className="text-gray-500">Overdue</p>
                <h2 className="text-3xl font-bold text-yellow-600">{totalOverdue}</h2>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              <button onClick={() => setFilter("ALL")} className="px-4 py-2 bg-gray-200 rounded-xl">
                Semua
              </button>
              <button onClick={() => setFilter("DIPAKAI")} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl">
                Dipakai
              </button>
              <button onClick={() => setFilter("TERSEDIA")} className="px-4 py-2 bg-green-100 text-green-700 rounded-xl">
                Tersedia
              </button>
              <button onClick={() => setFilter("RUSAK")} className="px-4 py-2 bg-red-100 text-red-700 rounded-xl">
                Rusak
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredData.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-3xl shadow-lg p-5 border-l-8 ${
                    isOverdue(item.deadline) ? "border-red-500" : "border-transparent"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold text-gray-800">{item.nama}</h2>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="mt-3 text-sm text-gray-600 space-y-1">
                    <p>👤 Peminjam: {item.peminjam}</p>
                    <p>📍 Lokasi: {item.lokasi}</p>
                    <p>📅 Mulai: {item.mulai}</p>
                    <p>⏳ Deadline: {item.deadline}</p>
                  </div>

                  {isOverdue(item.deadline) && (
                    <div className="mt-3 bg-red-50 text-red-600 p-3 rounded-xl text-sm">
                      ⚠ Barang ini sudah melewati batas pengembalian!
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
