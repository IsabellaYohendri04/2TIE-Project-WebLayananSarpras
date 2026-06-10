import React from "react";
import FilterButton from "../../components/DropdownFilter";
import Datepicker from "../../components/Datepicker";
import Banner from "../../partials/Banner";

function DashboardPeminjam() {
  return (
    <>
      <main className="grow">
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

          {/* Header */}
          <div className="sm:flex sm:justify-between sm:items-center mb-8">

            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                Halo, Nailah 👋
              </h1>

              <p className="text-gray-500 mt-2">
                Selamat datang di Sistem Layanan Sarana dan Prasarana
              </p>
            </div>

            <div className="flex gap-2 mt-4 sm:mt-0">
              <FilterButton align="right" />
              <Datepicker align="right" />
            </div>

          </div>

          {/* Quick Action */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

            <button className="bg-violet-600 hover:bg-violet-700 text-white rounded-2xl p-6 shadow-lg transition-all hover:scale-105 text-left">
              <div className="text-5xl mb-3">📦</div>
              <h3 className="font-bold text-lg">
                Pinjam Barang
              </h3>
              <p className="mt-2 opacity-90">
                Ajukan peminjaman barang sarpras
              </p>
            </button>

            <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-6 shadow-lg transition-all hover:scale-105 text-left">
              <div className="text-5xl mb-3">🏢</div>
              <h3 className="font-bold text-lg">
                Pinjam Ruangan
              </h3>
              <p className="mt-2 opacity-90">
                Reservasi ruang kelas dan laboratorium
              </p>
            </button>

            <button className="bg-green-600 hover:bg-green-700 text-white rounded-2xl p-6 shadow-lg transition-all hover:scale-105 text-left">
              <div className="text-5xl mb-3">🔧</div>
              <h3 className="font-bold text-lg">
                Lapor Kerusakan
              </h3>
              <p className="mt-2 opacity-90">
                Laporkan fasilitas yang rusak
              </p>
            </button>

          </div>

          {/* Statistik */}
          <div className="grid grid-cols-12 gap-6 mb-8">

            <div className="col-span-12 md:col-span-6 xl:col-span-3 bg-gradient-to-r from-violet-500 to-violet-700 text-white rounded-2xl p-6 shadow-lg">
              <p>Total Pengajuan</p>
              <h2 className="text-4xl font-bold mt-3">25</h2>
            </div>

            <div className="col-span-12 md:col-span-6 xl:col-span-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-2xl p-6 shadow-lg">
              <p>Menunggu Persetujuan</p>
              <h2 className="text-4xl font-bold mt-3">3</h2>
            </div>

            <div className="col-span-12 md:col-span-6 xl:col-span-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-2xl p-6 shadow-lg">
              <p>Sedang Dipinjam</p>
              <h2 className="text-4xl font-bold mt-3">5</h2>
            </div>

            <div className="col-span-12 md:col-span-6 xl:col-span-3 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-2xl p-6 shadow-lg">
              <p>Ditolak</p>
              <h2 className="text-4xl font-bold mt-3">2</h2>
            </div>

          </div>

          {/* Pengajuan + Notifikasi */}
          <div className="grid grid-cols-12 gap-6 mb-8">

            <div className="col-span-12 xl:col-span-8 bg-white dark:bg-gray-800 rounded-2xl shadow p-6">

              <h2 className="text-xl font-bold mb-4">
                Status Pengajuan Terbaru
              </h2>

              <table className="w-full">

                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">Barang</th>
                    <th className="text-left py-3">Tanggal</th>
                    <th className="text-left py-3">Status</th>
                  </tr>
                </thead>

                <tbody>

                  <tr className="border-b">
                    <td className="py-3">Proyektor Epson</td>
                    <td>07 Juni 2026</td>
                    <td>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                        Disetujui
                      </span>
                    </td>
                  </tr>

                  <tr className="border-b">
                    <td className="py-3">Laptop Asus</td>
                    <td>08 Juni 2026</td>
                    <td>
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                        Menunggu
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3">Kamera Canon</td>
                    <td>09 Juni 2026</td>
                    <td>
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">
                        Ditolak
                      </span>
                    </td>
                  </tr>

                </tbody>

              </table>

            </div>

            <div className="col-span-12 xl:col-span-4 bg-white dark:bg-gray-800 rounded-2xl shadow p-6">

              <h2 className="text-xl font-bold mb-4">
                Notifikasi
              </h2>

              <div className="space-y-4">

                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  ✅ Pengajuan Proyektor disetujui
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                  ⏳ Pengajuan Laptop sedang diproses
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  📅 Pengembalian Proyektor besok
                </div>

              </div>

            </div>

          </div>

          {/* Barang Populer */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 mb-8">

            <h2 className="text-xl font-bold mb-4">
              Barang yang Sering Dipinjam
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div className="border rounded-xl p-4 hover:shadow-lg transition">
                <div className="text-6xl">📽️</div>
                <h3 className="font-bold mt-3">
                  Proyektor Epson
                </h3>
                <p className="text-gray-500">
                  Tersedia 5 Unit
                </p>

                <button className="mt-4 w-full bg-violet-600 text-white py-2 rounded-lg">
                  Pinjam
                </button>
              </div>

              <div className="border rounded-xl p-4 hover:shadow-lg transition">
                <div className="text-6xl">💻</div>
                <h3 className="font-bold mt-3">
                  Laptop Asus
                </h3>
                <p className="text-gray-500">
                  Tersedia 10 Unit
                </p>

                <button className="mt-4 w-full bg-violet-600 text-white py-2 rounded-lg">
                  Pinjam
                </button>
              </div>

              <div className="border rounded-xl p-4 hover:shadow-lg transition">
                <div className="text-6xl">📷</div>
                <h3 className="font-bold mt-3">
                  Kamera Canon
                </h3>
                <p className="text-gray-500">
                  Tersedia 3 Unit
                </p>

                <button className="mt-4 w-full bg-violet-600 text-white py-2 rounded-lg">
                  Pinjam
                </button>
              </div>

            </div>

          </div>

          {/* Jadwal */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">

            <h2 className="text-xl font-bold mb-4">
              Jadwal Pengembalian Terdekat
            </h2>

            <div className="space-y-3">

              <div className="flex justify-between p-4 bg-gray-50 rounded-lg">
                <span>💻 Laptop Asus</span>
                <span className="font-semibold">
                  12 Juni 2026
                </span>
              </div>

              <div className="flex justify-between p-4 bg-gray-50 rounded-lg">
                <span>📽️ Proyektor Epson</span>
                <span className="font-semibold">
                  13 Juni 2026
                </span>
              </div>

            </div>

          </div>

        </div>
      </main>

      <Banner />
    </>
  );
}

export default DashboardPeminjam;