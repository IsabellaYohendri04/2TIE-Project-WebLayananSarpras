import React, { useState, useEffect } from "react";
import Banner from "../../partials/Banner";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import { PageShell, ContentCard } from "./components/PeminjamLayout";

function DashboardPeminjam() {
  const [holidayEvents, setHolidayEvents] = useState([]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

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
      })
      .catch(() => {});
  }, []);

  const events = [
    { title: "💻 Laptop Tersedia", date: "2026-06-12", color: "#22c55e" },
    { title: "🏢 Ruang Seminar Tersedia", date: "2026-06-15", color: "#22c55e" },
    { title: "🧪 Lab Komputer Penuh", date: "2026-06-18", color: "#ef4444" },
    ...holidayEvents,
  ];

  const quickLinks = [
    {
      to: "/peminjam/riwayat-peminjaman",
      icon: "📜",
      label: "Riwayat Peminjaman",
      desc: "Lihat semua pengajuan",
      color: "from-violet-500 to-purple-600",
    },
    {
      to: "/peminjam/laporan-kondisi",
      icon: "📝",
      label: "Laporan Kondisi",
      desc: "Isi setelah peminjaman selesai",
      color: "from-green-500 to-emerald-600",
    },
    {
      to: "/peminjam/peminjaman-barang",
      icon: "📦",
      label: "Pinjam Barang",
      desc: "Ajukan peminjaman barang",
      color: "from-indigo-500 to-blue-600",
    },
    {
      to: "/peminjam/peminjaman-ruangan",
      icon: "🏢",
      label: "Pinjam Ruangan",
      desc: "Ajukan peminjaman ruangan",
      color: "from-blue-500 to-cyan-600",
    },
  ];

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setShowModal(true);
  };

  return (
    <>
      <PageShell>
        {/* HERO */}
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-violet-700 via-indigo-700 to-blue-700 p-8 shadow-2xl mb-8">
          <div className="absolute right-0 top-0 opacity-10 text-[220px] leading-none select-none">
            🏫
          </div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold text-white">Halo, Nailah 👋</h1>
            <p className="text-violet-100 mt-2 text-lg">
              Sistem Layanan Sarana dan Prasarana — Politeknik Caltex Riau
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {[
                { label: "Total Pengajuan", value: "25" },
                { label: "Menunggu", value: "3" },
                { label: "Disetujui", value: "18" },
                { label: "Ditolak", value: "4" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/20 backdrop-blur rounded-3xl p-5"
                >
                  <p className="text-violet-100 text-sm">{stat.label}</p>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mt-1">
                    {stat.value}
                  </h2>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {quickLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`bg-gradient-to-br ${link.color} text-white rounded-[28px] p-5 shadow-lg hover:shadow-xl hover:scale-[1.02] transition transform`}
            >
              <span className="text-3xl">{link.icon}</span>
              <h3 className="font-bold mt-3">{link.label}</h3>
              <p className="text-sm text-white/80 mt-1">{link.desc}</p>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-6 mb-8">
          {/* KALENDER */}
          <ContentCard className="col-span-12 xl:col-span-9">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-5">
              <h2 className="text-2xl font-bold text-gray-800">
                📅 Kalender Ketersediaan Sarpras
              </h2>
              <div className="flex gap-4">
                <span className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  Tersedia
                </span>
                <span className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  Penuh
                </span>
              </div>
            </div>
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              locale="id"
              height="650px"
              events={events}
              dateClick={handleDateClick}
            />
          </ContentCard>

          {/* SIDEBAR */}
          <div className="col-span-12 xl:col-span-3 flex flex-col gap-6">
            <ContentCard>
              <h2 className="font-bold text-xl mb-5 text-gray-800">
                🔔 Notifikasi
              </h2>
              <div className="space-y-4">
                {[
                  { color: "bg-green-500", title: "Laptop Asus Disetujui", sub: "2 jam yang lalu" },
                  { color: "bg-yellow-500", title: "Ruang Seminar Diproses", sub: "1 hari yang lalu" },
                  { color: "bg-blue-500", title: "Pengembalian Besok", sub: "Proyektor Epson" },
                ].map((n) => (
                  <div key={n.title} className="flex gap-3 items-start">
                    <div className={`w-2.5 h-2.5 ${n.color} rounded-full mt-2 shrink-0`} />
                    <div>
                      <h4 className="font-semibold text-gray-800">{n.title}</h4>
                      <p className="text-sm text-gray-500">{n.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ContentCard>

            <ContentCard>
              <h2 className="font-bold text-xl mb-5 text-gray-800">
                📦 Ketersediaan Hari Ini
              </h2>
              <div className="space-y-3">
                {[
                  { icon: "💻", name: "Laptop", val: "5 Unit", cls: "text-green-600" },
                  { icon: "📽️", name: "Proyektor", val: "3 Unit", cls: "text-green-600" },
                  { icon: "📷", name: "Kamera", val: "2 Unit", cls: "text-yellow-600" },
                  { icon: "🏢", name: "Ruang Seminar", val: "Penuh", cls: "text-red-600" },
                ].map((item) => (
                  <div key={item.name} className="flex justify-between items-center py-1">
                    <span className="text-gray-700">
                      {item.icon} {item.name}
                    </span>
                    <span className={`font-bold ${item.cls}`}>{item.val}</span>
                  </div>
                ))}
              </div>
            </ContentCard>
          </div>
        </div>

        {/* STATUS AKTIF */}
        <ContentCard className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            📋 Status Peminjaman Aktif
          </h2>
          <div className="space-y-6">
            <div className="border-l-4 border-green-500 pl-5 py-1">
              <h3 className="font-bold text-lg">💻 Laptop Asus</h3>
              <p className="text-gray-500">13 Juni 2026 — 20 Juni 2026</p>
              <div className="w-full bg-slate-200 rounded-full h-2.5 mt-4">
                <div className="bg-green-500 h-2.5 rounded-full w-[70%]" />
              </div>
              <p className="text-sm mt-2 text-green-600 font-medium">Sedang Dipinjam</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-5 py-1">
              <h3 className="font-bold text-lg">🏢 Ruang Seminar</h3>
              <p className="text-gray-500">Menunggu Persetujuan</p>
              <div className="w-full bg-slate-200 rounded-full h-2.5 mt-4">
                <div className="bg-yellow-500 h-2.5 rounded-full w-[35%]" />
              </div>
            </div>
          </div>
        </ContentCard>

        {/* JADWAL PENGEMBALIAN */}
        <ContentCard>
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            📅 Jadwal Pengembalian Terdekat
          </h2>
          <div className="space-y-3">
            {[
              { icon: "💻", name: "Laptop Asus", date: "20 Juni 2026" },
              { icon: "📽️", name: "Proyektor Epson", date: "22 Juni 2026" },
            ].map((item) => (
              <div
                key={item.name}
                className="flex justify-between items-center bg-slate-50 hover:bg-violet-50 p-4 rounded-2xl transition"
              >
                <span className="text-gray-700">
                  {item.icon} {item.name}
                </span>
                <span className="font-bold text-gray-800">{item.date}</span>
              </div>
            ))}
          </div>
        </ContentCard>
      </PageShell>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              Pilih Jenis Peminjaman
            </h2>
            <p className="text-gray-500 mb-6">
              Tanggal: <span className="font-semibold text-violet-600">{selectedDate}</span>
            </p>

            <div className="space-y-3">
              {[
                {
                  path: "peminjaman-barang",
                  label: "📦 Peminjaman Barang",
                  cls: "bg-violet-600 hover:bg-violet-700",
                },
                {
                  path: "peminjaman-ruangan",
                  label: "🏢 Peminjaman Ruangan",
                  cls: "bg-blue-600 hover:bg-blue-700",
                },
                {
                  path: "peminjaman-lab",
                  label: "🧪 Peminjaman Laboratorium",
                  cls: "bg-green-600 hover:bg-green-700",
                },
              ].map((btn) => (
                <button
                  key={btn.path}
                  onClick={() =>
                    navigate(`/peminjam/${btn.path}?date=${selectedDate}`)
                  }
                  className={`w-full text-white py-3 rounded-xl font-medium transition ${btn.cls}`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-4 bg-slate-100 hover:bg-slate-200 text-gray-700 py-3 rounded-xl font-medium transition"
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
