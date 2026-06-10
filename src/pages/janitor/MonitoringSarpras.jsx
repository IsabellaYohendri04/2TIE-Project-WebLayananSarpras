import React, { useState } from "react";

export default function MonitoringSarpras() {
  const [filter, setFilter] = useState("ALL");

  const [data] = useState([
    {
      id: 1,
      nama: "Laptop Asus",
      status: "DIPAKAI",
      peminjam: "Budi",
      lokasi: "Lab Komputer 1",
      mulai: "2026-06-10",
      deadline: "2026-06-12",
    },
    {
      id: 2,
      nama: "Proyektor Epson",
      status: "DIPAKAI",
      peminjam: "Siti",
      lokasi: "Aula",
      mulai: "2026-06-11",
      deadline: "2026-06-13",
    },
    {
      id: 3,
      nama: "AC Ruangan",
      status: "RUSAK",
      peminjam: "-",
      lokasi: "Gedung A",
      mulai: "-",
      deadline: "-",
    },
    {
      id: 4,
      nama: "Kursi Kuliah",
      status: "TERSEDIA",
      peminjam: "-",
      lokasi: "Ruang 204",
      mulai: "-",
      deadline: "-",
    },
  ]);

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
    return new Date(deadline) < new Date("2026-06-10"); // dummy tanggal sekarang
  };

  const filteredData =
    filter === "ALL"
      ? data
      : data.filter((item) => item.status === filter);

  return (
    <main className="grow bg-slate-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Monitoring Sarpras 📊
          </h1>
          <p className="text-gray-500 mt-2">
            Pantau penggunaan dan kondisi sarana prasarana secara real-time
          </p>
        </div>

        {/* STAT MINI DASHBOARD */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

          <div className="bg-white p-5 rounded-3xl shadow">
            <p className="text-gray-500">Sedang Dipakai</p>
            <h2 className="text-3xl font-bold text-blue-600">2</h2>
          </div>

          <div className="bg-white p-5 rounded-3xl shadow">
            <p className="text-gray-500">Tersedia</p>
            <h2 className="text-3xl font-bold text-green-600">1</h2>
          </div>

          <div className="bg-white p-5 rounded-3xl shadow">
            <p className="text-gray-500">Rusak</p>
            <h2 className="text-3xl font-bold text-red-600">1</h2>
          </div>

          <div className="bg-white p-5 rounded-3xl shadow">
            <p className="text-gray-500">Overdue</p>
            <h2 className="text-3xl font-bold text-yellow-600">1</h2>
          </div>

        </div>

        {/* FILTER */}
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

        {/* GRID CARD */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {filteredData.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-3xl shadow-lg p-5 border-l-8 ${
                isOverdue(item.deadline) ? "border-red-500" : "border-transparent"
              }`}
            >

              {/* HEADER CARD */}
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-gray-800">
                  {item.nama}
                </h2>

                <span
                  className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </div>

              {/* INFO */}
              <div className="mt-3 text-sm text-gray-600 space-y-1">

                <p>👤 Peminjam: {item.peminjam}</p>
                <p>📍 Lokasi: {item.lokasi}</p>
                <p>📅 Mulai: {item.mulai}</p>
                <p>⏳ Deadline: {item.deadline}</p>

              </div>

              {/* ALERT */}
              {isOverdue(item.deadline) && (
                <div className="mt-3 bg-red-50 text-red-600 p-3 rounded-xl text-sm">
                  ⚠ Barang ini sudah melewati batas pengembalian!
                </div>
              )}

            </div>
          ))}

        </div>

      </div>
    </main>
  );
}