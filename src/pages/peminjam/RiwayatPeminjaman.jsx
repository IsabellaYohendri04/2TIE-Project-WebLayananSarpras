import React, { useState } from "react";

function RiwayatPeminjaman() {

  const [search, setSearch] = useState("");

  const dataRiwayat = [
    {
      id: 1,
      nama: "Laptop Asus VivoBook",
      kategori: "Barang",
      tanggalPinjam: "2026-06-13",
      tanggalKembali: "2026-06-15",
      status: "Selesai",
    },
    {
      id: 2,
      nama: "Ruang Seminar",
      kategori: "Ruangan",
      tanggalPinjam: "2026-06-20",
      tanggalKembali: "2026-06-21",
      status: "Selesai",
    },
    {
      id: 3,
      nama: "Laboratorium Jaringan",
      kategori: "Laboratorium",
      tanggalPinjam: "2026-07-01",
      tanggalKembali: "2026-07-02",
      status: "Diproses",
    },
  ];

  const filteredData = dataRiwayat.filter(
    (item) =>
      item.nama.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Selesai":
        return "bg-green-100 text-green-700";

      case "Diproses":
        return "bg-yellow-100 text-yellow-700";

      case "Ditolak":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <main className="grow bg-slate-50">

      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">

          <h1 className="text-3xl font-bold">
            Riwayat Peminjaman
          </h1>

          <p className="text-gray-500 mt-2">
            Seluruh riwayat peminjaman sarana dan prasarana.
          </p>

        </div>

        {/* Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white rounded-3xl p-6 shadow-lg">

            <p className="text-gray-500">
              Total Peminjaman
            </p>

            <h2 className="text-4xl font-bold text-violet-600 mt-2">
              12
            </h2>

          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg">

            <p className="text-gray-500">
              Selesai
            </p>

            <h2 className="text-4xl font-bold text-green-600 mt-2">
              10
            </h2>

          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg">

            <p className="text-gray-500">
              Diproses
            </p>

            <h2 className="text-4xl font-bold text-yellow-500 mt-2">
              2
            </h2>

          </div>

        </div>

        {/* Search */}
        <div className="bg-white rounded-3xl shadow-lg p-5 mb-8">

          <input
            type="text"
            placeholder="Cari riwayat peminjaman..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-xl p-3"
          />

        </div>

        {/* Riwayat */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {filteredData.map((item) => (

            <div
              key={item.id}
              className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition"
            >

              <div className="flex justify-between items-start mb-4">

                <div>

                  <h2 className="text-xl font-bold">
                    {item.nama}
                  </h2>

                  <p className="text-gray-500 text-sm">
                    {item.kategori}
                  </p>

                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>

              </div>

              <div className="space-y-2 mb-5">

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Tanggal Pinjam
                  </span>

                  <span>
                    {item.tanggalPinjam}
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Tanggal Kembali
                  </span>

                  <span>
                    {item.tanggalKembali}
                  </span>

                </div>

              </div>

              <button
                className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-xl"
              >
                Detail
              </button>

            </div>

          ))}

        </div>

      </div>

    </main>
  );
}

export default RiwayatPeminjaman;