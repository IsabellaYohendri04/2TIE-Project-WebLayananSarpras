import React, { useState } from "react";

export default function KelolaSarpras() {
  const [filter, setFilter] = useState("all");

  const [data, setData] = useState([
    {
      id: 1,
      nama: "Laptop Asus",
      kategori: "Elektronik",
      status: "Dipinjam",
      lokasi: "Lab Komputer 1",
      kondisi: {
        teks: "Normal saat dipinjam",
        image:
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
      },
    },
    {
      id: 2,
      nama: "Proyektor Epson",
      kategori: "Elektronik",
      status: "Tersedia",
      lokasi: "Gudang",
      kondisi: {
        teks: "Baik",
        image:
          "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc",
      },
    },
    {
      id: 3,
      nama: "AC Ruangan",
      kategori: "Elektronik",
      status: "Rusak",
      lokasi: "Gedung A",
      kondisi: {
        teks: "Bocor & tidak dingin",
        image:
          "https://images.unsplash.com/photo-1581091870622-2c8f3f5b3a07",
      },
    },
    {
      id: 4,
      nama: "Kursi Kuliah",
      kategori: "Furnitur",
      status: "Dipinjam",
      lokasi: "Ruang 204",
      kondisi: {
        teks: "Sedikit retak pada kaki",
        image:
          "https://images.unsplash.com/photo-1582582494700-5fdbec1c5b0c",
      },
    },
  ]);

  const filteredData =
    filter === "all"
      ? data
      : data.filter((item) => item.status === filter);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Tersedia":
        return "bg-green-100 text-green-700";
      case "Dipinjam":
        return "bg-blue-100 text-blue-700";
      case "Rusak":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleDelete = (id) => {
    alert("Dummy delete barang ID: " + id);
  };

  return (
    <main className="grow bg-slate-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Kelola Sarpras 📦
          </h1>
          <p className="text-gray-500 mt-2">
            Monitoring barang, status, dan kondisi sarana prasarana
          </p>
        </div>

        {/* ACTION + FILTER */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">

          <button
            onClick={() => alert("Dummy tambah barang")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl shadow"
          >
            + Tambah Barang
          </button>

          <select
            className="border rounded-2xl px-4 py-3"
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Semua Status</option>
            <option value="Tersedia">Tersedia</option>
            <option value="Dipinjam">Dipinjam</option>
            <option value="Rusak">Rusak</option>
          </select>

        </div>

        {/* GRID LIST (CARD STYLE BIAR MODERN) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {filteredData.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl shadow-lg overflow-hidden"
            >

              {/* IMAGE KONDISI BARANG */}
              <img
                src={item.kondisi.image}
                alt="kondisi barang"
                className="h-48 w-full object-cover"
              />

              <div className="p-5">

                {/* TITLE */}
                <h2 className="text-xl font-bold text-gray-800">
                  {item.nama}
                </h2>

                <p className="text-gray-500 text-sm">
                  {item.kategori} • {item.lokasi}
                </p>

                {/* STATUS */}
                <div className="mt-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* KONDISI TEKS */}
                <p className="mt-3 text-gray-600 text-sm">
                  📌 {item.kondisi.teks}
                </p>

                {/* ACTION BUTTON */}
                <div className="flex gap-3 mt-4">

                  <button
                    onClick={() => alert("Edit dummy ID: " + item.id)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-xl"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
                  >
                    Hapus
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