import React, { useState } from "react";

export default function LaporanSarpras() {
  const [filter, setFilter] = useState("ALL");

  const [data, setData] = useState([
    {
      id: 1,
      barang: "Laptop Asus",
      pelapor: "Budi",
      tanggal: "2026-06-10",
      deskripsi: "Layar tidak menyala setelah digunakan",
      status: "MENUNGGU",
      image:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
    },
    {
      id: 2,
      barang: "Proyektor Epson",
      pelapor: "Siti",
      tanggal: "2026-06-11",
      deskripsi: "Gambar buram dan tidak fokus",
      status: "DIPROSES",
      image:
        "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc",
    },
    {
      id: 3,
      barang: "AC Ruangan",
      pelapor: "Andi",
      tanggal: "2026-06-12",
      deskripsi: "AC bocor dan tidak dingin",
      status: "SELESAI",
      image:
        "https://images.unsplash.com/photo-1581091870622-2c8f3f5b3a07",
    },
  ]);

  const filteredData =
    filter === "ALL"
      ? data
      : data.filter((item) => item.status === filter);

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

  const updateStatus = (id, newStatus) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  };

  return (
    <main className="grow bg-slate-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Laporan Sarpras 🔧
          </h1>
          <p className="text-gray-500 mt-2">
            Monitoring dan penanganan laporan kerusakan fasilitas
          </p>
        </div>

        {/* FILTER */}
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

        {/* LIST */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {filteredData.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl shadow-lg overflow-hidden"
            >

              {/* IMAGE */}
              <img
                src={item.image}
                alt="bukti kerusakan"
                className="h-48 w-full object-cover"
              />

              <div className="p-5">

                {/* TITLE */}
                <h2 className="text-xl font-bold">
                  {item.barang}
                </h2>

                <p className="text-sm text-gray-500">
                  Pelapor: {item.pelapor} • {item.tanggal}
                </p>

                {/* DESKRIPSI */}
                <p className="mt-3 text-gray-600 text-sm">
                  📌 {item.deskripsi}
                </p>

                {/* STATUS */}
                <div className="mt-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* ACTION */}
                <div className="flex flex-wrap gap-2 mt-4">

                  <button
                    onClick={() => updateStatus(item.id, "DIPROSES")}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-xl text-sm"
                  >
                    Proses
                  </button>

                  <button
                    onClick={() => updateStatus(item.id, "SELESAI")}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-xl text-sm"
                  >
                    Selesai
                  </button>

                  <button
                    onClick={() => updateStatus(item.id, "DITOLAK")}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-xl text-sm"
                  >
                    Tolak
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>

      </div>
    </main>
  );
}