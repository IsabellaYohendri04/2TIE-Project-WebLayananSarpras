import React, { useState, useEffect } from "react";
import axios from "axios";
import { BsFillExclamationDiamondFill } from "react-icons/bs";
import { Link } from "react-router-dom";
// import dataPeminjaman from "../../data/peminjaman-barang.json";

function PeminjamanBarang() {

const [dataPeminjaman, setDataPeminjaman] = useState([]);
const [filteredData, setFilteredData] = useState([]);
const [search, setSearch] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(true);
const [debouncedSearch, setDebouncedSearch] = useState("");

  // Ambil data sekali saat halaman dibuka
  // Ambil data sekali saat halaman dibuka
useEffect(() => {
    axios
    .get("/api/peminjaman/barang")
    .then((response) => {
      setDataPeminjaman(response.data);
      setFilteredData(response.data);
    })
    .catch((err) => {
      console.error(err);
    });
}, []);

// Debounce 500ms
useEffect(() => {
  console.log("Debounced Search:", debouncedSearch);
  const timeout = setTimeout(() => {
    setDebouncedSearch(search);
  }, 500);

  return () => clearTimeout(timeout);
}, [search]);

// Filter dijalankan setelah debounce selesai
useEffect(() => {
  const result = dataPeminjaman.filter(
    (item) =>
      item.nama.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      item.barang.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      item.kategori.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  setFilteredData(result);
}, [debouncedSearch, dataPeminjaman]);


    
    const errorInfo = error ? (
		    <div className="bg-red-200 mb-5 p-5 text-sm font-light text-gray-600 rounded flex items-center">
		        <BsFillExclamationDiamondFill className="text-red-600 me-2 text-lg" />
		        {error}
		    </div>
    ) : null

  const getStatusColor = (status) => {
    switch (status) {
      case "Disetujui":
        return "bg-green-100 text-green-700";
      case "Ditolak":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  console.log("DATA:", dataPeminjaman);
console.log("IS ARRAY:", Array.isArray(dataPeminjaman));

  const dataArray = Array.isArray(dataPeminjaman)
  ? dataPeminjaman
  : [];

const totalPengajuan = dataArray.length;

const totalMenunggu = dataArray.filter(
  (item) => item.status === "Menunggu"
).length;

const totalDisetujui = dataArray.filter(
  (item) => item.status === "Disetujui"
).length;

const totalDitolak = dataArray.filter(
  (item) => item.status === "Ditolak"
).length;
  return (
    <main className="grow">
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Peminjaman Barang
          </h1>

          <p className="text-gray-500 mt-2">
            Kelola dan verifikasi pengajuan peminjaman barang.
          </p>
        </div>

        {/* Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

          <div className="bg-gradient-to-r from-violet-500 to-violet-700 text-white rounded-3xl p-6 shadow-lg">
            <p>Total Pengajuan</p>
            <h2 className="text-4xl font-bold mt-2">
              {totalPengajuan}
            </h2>
          </div>

          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-3xl p-6 shadow-lg">
            <p>Menunggu</p>
            <h2 className="text-4xl font-bold mt-2">
              {totalMenunggu}
            </h2>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-700 text-white rounded-3xl p-6 shadow-lg">
            <p>Disetujui</p>
            <h2 className="text-4xl font-bold mt-2">
              {totalDisetujui}
            </h2>
          </div>

          <div className="bg-gradient-to-r from-red-500 to-red-700 text-white rounded-3xl p-6 shadow-lg">
            <p>Ditolak</p>
            <h2 className="text-4xl font-bold mt-2">
              {totalDitolak}
            </h2>
          </div>

        </div>

        {/* Search */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow p-5 mb-8">

          <div className="relative">

            <input
              type="text"
              value={search}
  onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama peminjam, barang, atau kategori..."
              className="w-full border border-gray-200 rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />

            <span className="absolute left-4 top-3 text-lg">
              🔍
            </span>

          </div>

        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {dataArray.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >

              <div className="relative">

                <img
                  src={item.image}
                  alt={item.barang}
                  className="w-full h-52 object-cover"
                />

                <div className="absolute top-4 right-4">

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold shadow ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>

                </div>

              </div>

              <div className="p-6">

                <div className="flex items-center gap-3 mb-5">

                  <div className="w-12 h-12 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-bold">
                    {item.nama.substring(0, 2).toUpperCase()}
                  </div>

                  <div>

                    <h3 className="font-bold text-gray-800 dark:text-white">
                      {item.nama}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {item.prodi}
                    </p>

                  </div>

                </div>

                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  {item.barang}
                </h2>

                <span className="inline-block bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-xs font-medium mb-5">
                  {item.kategori}
                </span>

                <div className="space-y-3 mb-5">

                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Tanggal Pinjam
                    </span>

                    <span className="font-medium">
                      {item.tanggalPinjam}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Tanggal Kembali
                    </span>

                    <span className="font-medium">
                      {item.tanggalKembali}
                    </span>
                  </div>

                </div>

  
                <div className="grid grid-cols-3 gap-2">

                  <Link
  to={`/pegawai/peminjaman/barang/${item.id}`}
  className="border rounded-xl py-2 text-center hover:bg-gray-100"
>
  Detail
</Link>

                 

                </div>

              </div>

            </div>
          ))}

        </div>

      </div>
    </main>
  );
}

export default PeminjamanBarang;