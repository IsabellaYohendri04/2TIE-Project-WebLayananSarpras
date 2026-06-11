import React, { useState, useEffect } from "react";
import Banner from "../../partials/Banner";
import axios from "axios";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import googleCalendarPlugin from "@fullcalendar/google-calendar";

import { useNavigate } from "react-router-dom";

function DashboardPeminjam() {

  const [holidayEvents, setHolidayEvents] = useState([]);

useEffect(() => {
  axios
    .get("https://api-harilibur.vercel.app/api")
    .then((res) => {

      const events = res.data.map((item) => ({
        title: item.keterangan,
        date: item.holiday_date,
        color: "#dc2626",
      }));

      setHolidayEvents(events);

    });
}, []);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const events = [
    {
      title: "💻 Laptop Tersedia",
      date: "2026-06-12",
      color: "#22c55e",
    },
    {
      title: "🏢 Ruang Seminar Tersedia",
      date: "2026-06-15",
      color: "#22c55e",
    },
    {
      title: "🧪 Lab Komputer Penuh",
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
      title: "🇮🇩 Kemerdekaan RI",
      date: "2026-08-17",
      color: "#dc2626",
    },
    {
      title: "🇮🇩 Hari Natal",
      date: "2026-12-25",
      color: "#dc2626",
    },
  ];

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setShowModal(true);
  };

  return (
    <>
    <main className="
grow
min-h-screen
bg-[radial-gradient(circle_at_top_left,_#eef2ff,_#f8fafc_40%,_#ffffff_80%)]
">
<div
  className="
  fixed
  inset-0
  -z-10
  opacity-[0.03]
  bg-[linear-gradient(to_right,#6366f1_1px,transparent_1px),linear-gradient(to_bottom,#6366f1_1px,transparent_1px)]
  bg-[size:50px_50px]
"
/>
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

          {/* HERO DASHBOARD */}
<div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-violet-700 via-indigo-700 to-blue-700 p-8 shadow-2xl mb-8">

  <div className="absolute right-0 top-0 opacity-10 text-[220px]">
    🏫
  </div>

  <div className="relative z-10">

    <h1 className="text-4xl font-bold text-white">
      Halo, Nailah 👋
    </h1>

    <p className="text-violet-100 mt-2 text-lg">
      Sistem Layanan Sarana dan Prasarana
      Politeknik Caltex Riau
    </p>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-8">

      <div className="bg-white/20 backdrop-blur rounded-3xl p-5">

        <p className="text-violet-100">
          Total Pengajuan
        </p>

        <h2 className="text-4xl font-bold text-white mt-2">
          25
        </h2>

      </div>

      <div className="bg-white/20 backdrop-blur rounded-3xl p-5">

        <p className="text-violet-100">
          Menunggu
        </p>

        <h2 className="text-4xl font-bold text-white mt-2">
          3
        </h2>

      </div>

      <div className="bg-white/20 backdrop-blur rounded-3xl p-5">

        <p className="text-violet-100">
          Disetujui
        </p>

        <h2 className="text-4xl font-bold text-white mt-2">
          18
        </h2>

      </div>

      <div className="bg-white/20 backdrop-blur rounded-3xl p-5">

        <p className="text-violet-100">
          Ditolak
        </p>

        <h2 className="text-4xl font-bold text-white mt-2">
          4
        </h2>

      </div>

    </div>

  </div>

</div>

          
          <div className="grid grid-cols-12 gap-6 mb-8">

  {/* KALENDER */}
  <div className="col-span-12 xl:col-span-9 bg-white rounded-[32px] shadow-xl p-6">

    <div className="flex justify-between items-center mb-5">

      <h2 className="text-2xl font-bold">
        📅 Kalender Ketersediaan Sarpras
      </h2>

      <div className="flex gap-3">

        <span className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          Tersedia
        </span>

        <span className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          Penuh
        </span>

      </div>

    </div>

    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      locale="id"
      height="750px"
      events={events}
      dateClick={handleDateClick}
    />

  </div>

  {/* SIDEBAR */}
  <div className="col-span-12 xl:col-span-3 flex flex-col gap-6">

    {/* NOTIFIKASI */}
    <div className="bg-white rounded-[32px] shadow-xl p-6">

      <h2 className="font-bold text-xl mb-5">
        🔔 Notifikasi
      </h2>

      <div className="space-y-5">

        <div className="flex gap-3">

          <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>

          <div>

            <h4 className="font-semibold">
              Laptop Asus Disetujui
            </h4>

            <p className="text-sm text-gray-500">
              2 jam yang lalu
            </p>

          </div>

        </div>

        <div className="flex gap-3">

          <div className="w-3 h-3 bg-yellow-500 rounded-full mt-2"></div>

          <div>

            <h4 className="font-semibold">
              Ruang Seminar Diproses
            </h4>

            <p className="text-sm text-gray-500">
              1 hari yang lalu
            </p>

          </div>

        </div>

        <div className="flex gap-3">

          <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>

          <div>

            <h4 className="font-semibold">
              Pengembalian Besok
            </h4>

            <p className="text-sm text-gray-500">
              Proyektor Epson
            </p>

          </div>

        </div>

      </div>

    </div>

    {/* SARPRAS TERSEDIA */}
    <div className="bg-white rounded-[32px] shadow-xl p-6">

      <h2 className="font-bold text-xl mb-5">
        📦 Ketersediaan Hari Ini
      </h2>

      <div className="space-y-4">

        <div className="flex justify-between">
          <span>💻 Laptop</span>
          <span className="font-bold text-green-600">
            5 Unit
          </span>
        </div>

        <div className="flex justify-between">
          <span>📽️ Proyektor</span>
          <span className="font-bold text-green-600">
            3 Unit
          </span>
        </div>

        <div className="flex justify-between">
          <span>📷 Kamera</span>
          <span className="font-bold text-yellow-600">
            2 Unit
          </span>
        </div>

        <div className="flex justify-between">
          <span>🏢 Ruang Seminar</span>
          <span className="font-bold text-red-600">
            Penuh
          </span>
        </div>

      </div>

    </div>

  </div>

</div>
         {/* STATUS PEMINJAMAN */}
<div className="bg-white rounded-[32px] shadow-xl p-6 mb-8">

  <h2 className="text-2xl font-bold mb-6">
    📋 Status Peminjaman Aktif
  </h2>

  <div className="space-y-6">

    <div className="border-l-4 border-green-500 pl-5">

      <h3 className="font-bold text-lg">
        💻 Laptop Asus
      </h3>

      <p className="text-gray-500">
        13 Juni 2026 - 20 Juni 2026
      </p>

      <div className="w-full bg-gray-200 rounded-full h-3 mt-4">

        <div className="bg-green-500 h-3 rounded-full w-[70%]"></div>

      </div>

      <p className="text-sm mt-2 text-green-600">
        Sedang Dipinjam
      </p>

    </div>

    <div className="border-l-4 border-yellow-500 pl-5">

      <h3 className="font-bold text-lg">
        🏢 Ruang Seminar
      </h3>

      <p className="text-gray-500">
        Menunggu Persetujuan
      </p>

      <div className="w-full bg-gray-200 rounded-full h-3 mt-4">

        <div className="bg-yellow-500 h-3 rounded-full w-[35%]"></div>

      </div>

    </div>

  </div>

</div>
          {/* JADWAL */}
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

      {/* MODAL PILIH PEMINJAMAN */}
      {showModal && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white rounded-3xl p-8 w-[400px]">

            <h2 className="text-2xl font-bold mb-2">
              Pilih Jenis Peminjaman
            </h2>

            <p className="text-gray-500 mb-6">
              Tanggal: {selectedDate}
            </p>

            <div className="space-y-3">

              <button
                onClick={() =>
                  navigate(`/peminjam/peminjaman-barang?date=${selectedDate}`)
                }
                className="w-full bg-violet-600 text-white py-3 rounded-xl"
              >
                📦 Peminjaman Barang
              </button>

              <button
                onClick={() =>
                  navigate(`/peminjam/peminjaman-ruangan?date=${selectedDate}`)
                }
                className="w-full bg-blue-600 text-white py-3 rounded-xl"
              >
                🏢 Peminjaman Ruangan
              </button>

              <button
                onClick={() =>
                  navigate(`/peminjam/peminjaman-lab?date=${selectedDate}`)
                }
                className="w-full bg-green-600 text-white py-3 rounded-xl"
              >
                🧪 Peminjaman Laboratorium
              </button>

            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-4 bg-gray-200 py-3 rounded-xl"
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