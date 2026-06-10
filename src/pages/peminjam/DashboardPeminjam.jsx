import React, { useState } from "react";
import Banner from "../../partials/Banner";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";


import { useNavigate } from "react-router-dom";

function DashboardPeminjam() {

  const navigate = useNavigate(); 
  const [selectedDate, setSelectedDate] = useState("");
const [showModal, setShowModal] = useState(false);

  const events = [
  // Ketersediaan Sarpras
  {
    title: "Laptop Tersedia",
    date: "2026-06-12",
    color: "#22c55e",
  },
  {
    title: "Ruang Seminar Tersedia",
    date: "2026-06-15",
    color: "#22c55e",
  },
  {
    title: "Lab Komputer Penuh",
    date: "2026-06-18",
    color: "#ef4444",
  },

  // Hari Libur Nasional
  {
    title: "🇮🇩 Tahun Baru",
    date: "2026-01-01",
    color: "#dc2626",
  },
  {
    title: "🇮🇩 Hari Buruh",
    date: "2026-05-01",
    color: "#dc2626",
  },
  {
    title: "🇮🇩 Hari Kemerdekaan RI",
    date: "2026-08-17",
    color: "#dc2626",
  },
  {
    title: "🇮🇩 Hari Natal",
    date: "2026-12-25",
    color: "#dc2626",
  },
];
return (
<> <main className="grow bg-slate-50"> <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

```
      {/* Header */}
      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-800">
          Halo, Nailah 👋
        </h1>

        <p className="text-gray-500 mt-2">
          Selamat datang di Sistem Layanan Sarana dan Prasarana Politeknik Caltex Riau
        </p>

      </div>

      {/* Quick Action */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

        <button className="bg-violet-600 hover:bg-violet-700 text-white rounded-3xl p-6 shadow-lg text-left transition">

          <div className="text-5xl mb-3">📦</div>

          <h3 className="font-bold text-lg">
            Pinjam Barang
          </h3>

          <p className="opacity-80 mt-2">
            Ajukan peminjaman barang
          </p>

        </button>

        <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-3xl p-6 shadow-lg text-left transition">

          <div className="text-5xl mb-3">🏢</div>

          <h3 className="font-bold text-lg">
            Pinjam Ruangan
          </h3>

          <p className="opacity-80 mt-2">
            Reservasi ruang dan fasilitas
          </p>

        </button>

        <button className="bg-green-600 hover:bg-green-700 text-white rounded-3xl p-6 shadow-lg text-left transition">

          <div className="text-5xl mb-3">🧪</div>

          <h3 className="font-bold text-lg">
            Pinjam Laboratorium
          </h3>

          <p className="opacity-80 mt-2">
            Cek ketersediaan laboratorium
          </p>

        </button>

        <button className="bg-red-600 hover:bg-red-700 text-white rounded-3xl p-6 shadow-lg text-left transition">

          <div className="text-5xl mb-3">🔧</div>

          <h3 className="font-bold text-lg">
            Lapor Kerusakan
          </h3>

          <p className="opacity-80 mt-2">
            Laporkan fasilitas yang rusak
          </p>

        </button>

      </div>

      {/* Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

        <div className="bg-white rounded-3xl shadow-lg p-6">
          <p className="text-gray-500">
            Total Pengajuan
          </p>

          <h2 className="text-4xl font-bold text-violet-600 mt-2">
            25
          </h2>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6">
          <p className="text-gray-500">
            Menunggu
          </p>

          <h2 className="text-4xl font-bold text-yellow-500 mt-2">
            3
          </h2>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6">
          <p className="text-gray-500">
            Disetujui
          </p>

          <h2 className="text-4xl font-bold text-green-500 mt-2">
            18
          </h2>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6">
          <p className="text-gray-500">
            Ditolak
          </p>

          <h2 className="text-4xl font-bold text-red-500 mt-2">
            4
          </h2>
        </div>

      </div>

      {/* Ketersediaan Sarpras + Notifikasi */}
     <div className="grid grid-cols-12 gap-6 mb-8">

  <div className="col-span-12 xl:col-span-8 bg-white rounded-3xl shadow-lg p-6">

    <h2 className="text-2xl font-bold mb-4">
      📅 Kalender Ketersediaan Sarpras
    </h2>

    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      locale="id"
      height="650px"
      events={events}
      dateClick={(info) => {
  setSelectedDate(info.dateStr);
  setShowModal(true);
}}
      
    />

  </div>

  <div className="col-span-12 xl:col-span-4 bg-white rounded-3xl shadow-lg p-6">

    <h2 className="text-xl font-bold mb-4">
      📋 Keterangan Kalender
    </h2>

    <div className="space-y-4">

      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
        🟢 Barang atau ruangan tersedia
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        🔵 Sebagian tersedia
      </div>

      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
        🔴 Tidak tersedia / penuh
      </div>

      <div className="bg-violet-50 border-l-4 border-violet-500 p-4 rounded">
        Klik tanggal untuk membuat pengajuan peminjaman
      </div>

    </div>

  </div>

</div>
      {/* Status Peminjaman */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">

        <h2 className="text-xl font-bold mb-4">
          📋 Status Pengajuan Terbaru
        </h2>

        <table className="w-full">

          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Item</th>
              <th className="text-left py-3">Tanggal</th>
              <th className="text-left py-3">Status</th>
            </tr>
          </thead>

          <tbody>

            <tr className="border-b">
              <td className="py-3">Laptop Asus</td>
              <td>10 Juni 2026</td>
              <td>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  Disetujui
                </span>
              </td>
            </tr>

            <tr className="border-b">
              <td className="py-3">Ruang Seminar</td>
              <td>12 Juni 2026</td>
              <td>
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                  Menunggu
                </span>
              </td>
            </tr>

          </tbody>

        </table>

      </div>

      {/* Jadwal Pengembalian */}
      <div className="bg-white rounded-3xl shadow-lg p-6">

        <h2 className="text-xl font-bold mb-4">
          📅 Jadwal Pengembalian Terdekat
        </h2>

        <div className="space-y-3">

          <div className="flex justify-between bg-gray-50 p-4 rounded-xl">
            <span>💻 Laptop Asus</span>
            <span className="font-bold">
              20 Juni 2026
            </span>
          </div>

          <div className="flex justify-between bg-gray-50 p-4 rounded-xl">
            <span>📽️ Proyektor Epson</span>
            <span className="font-bold">
              22 Juni 2026
            </span>
          </div>

        </div>

      </div>

    </div>
  </main>

  {showModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

    <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">

      <h2 className="text-2xl font-bold mb-2">
        📅 {selectedDate}
      </h2>

      <p className="text-gray-500 mb-6">
        Pilih jenis peminjaman yang ingin diajukan
      </p>

      <div className="space-y-4">

        <button
          onClick={() =>
            navigate(
              `/peminjam/peminjaman-barang?date=${selectedDate}`
            )
          }
          className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-2xl p-4 text-left"
        >
          <div className="text-3xl mb-2">📦</div>
          <h3 className="font-bold">
            Peminjaman Barang
          </h3>
          <p className="text-sm opacity-80">
            Laptop, Proyektor, Kamera, dll
          </p>
        </button>

        <button
          onClick={() =>
            navigate(
              `/peminjam/peminjaman-ruangan?date=${selectedDate}`
            )
          }
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-4 text-left"
        >
          <div className="text-3xl mb-2">🏢</div>
          <h3 className="font-bold">
            Peminjaman Ruangan
          </h3>
          <p className="text-sm opacity-80">
            Kelas, Ruang Seminar, Aula
          </p>
        </button>

        <button
          onClick={() =>
            navigate(
              `/peminjam/peminjaman-laboratorium?date=${selectedDate}`
            )
          }
          className="w-full bg-green-600 hover:bg-green-700 text-white rounded-2xl p-4 text-left"
        >
          <div className="text-3xl mb-2">🧪</div>
          <h3 className="font-bold">
            Peminjaman Laboratorium
          </h3>
          <p className="text-sm opacity-80">
            Lab Komputer, Lab Mekatronika, dll
          </p>
        </button>

      </div>

      <button
        onClick={() => setShowModal(false)}
        className="w-full mt-5 border rounded-2xl py-3 hover:bg-gray-100"
      >
        Tutup
      </button>

    </div>

  </div>
)}

  <Banner />
</>


);
}

export default DashboardPeminjam;
