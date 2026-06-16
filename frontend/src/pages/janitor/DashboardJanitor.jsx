import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useNavigate } from "react-router-dom";
import { getJanitorDashboard } from "./services/janitorService";

export default function DashboardJanitor() {
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalSarpras: 0,
    totalPeminjamanAktif: 0,
    totalLaporan: 0,
  });
  const [events, setEvents] = useState([]);
  const [peminjamanByDate, setPeminjamanByDate] = useState({});

  useEffect(() => {
    setLoading(true);
    setError("");

    getJanitorDashboard()
      .then((res) => {
        setStats({
          totalSarpras: res.data.totalSarpras,
          totalPeminjamanAktif: res.data.totalPeminjamanAktif,
          totalLaporan: res.data.totalLaporan,
        });
        setEvents(res.data.events || []);
        setPeminjamanByDate(res.data.peminjamanByDate || {});
      })
      .catch((err) => {
        setError(
          err.response?.data?.message ||
            "Gagal memuat dashboard. Pastikan server berjalan."
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const selectedItems = peminjamanByDate[selectedDate] || [];

  return (
    <main className="grow bg-slate-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Dashboard Janitor 🧹
          </h1>
          <p className="text-gray-500 mt-2">
            Monitoring sarana prasarana, peminjaman, dan kondisi barang
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-3xl shadow-lg p-6">
                <p className="text-gray-500">Total Sarpras</p>
                <h2 className="text-4xl font-bold text-blue-600 mt-2">
                  {stats.totalSarpras}
                </h2>
              </div>

              <div className="bg-white rounded-3xl shadow-lg p-6">
                <p className="text-gray-500">Peminjaman Aktif</p>
                <h2 className="text-4xl font-bold text-orange-500 mt-2">
                  {stats.totalPeminjamanAktif}
                </h2>
              </div>

              <div className="bg-white rounded-3xl shadow-lg p-6">
                <p className="text-gray-500">Laporan Kerusakan</p>
                <h2 className="text-4xl font-bold text-red-500 mt-2">
                  {stats.totalLaporan}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <button
                onClick={() => navigate("/janitor/kelola-sarpras")}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-3xl p-6 shadow-lg text-left"
              >
                <div className="text-4xl mb-2">📦</div>
                <h3 className="font-bold">Kelola Sarpras</h3>
                <p className="text-sm opacity-80">Tambah & update barang</p>
              </button>

              <button
                onClick={() => navigate("/janitor/peminjaman-sarpras")}
                className="bg-orange-600 hover:bg-orange-700 text-white rounded-3xl p-6 shadow-lg text-left"
              >
                <div className="text-4xl mb-2">📑</div>
                <h3 className="font-bold">Peminjaman</h3>
                <p className="text-sm opacity-80">Monitoring peminjaman</p>
              </button>

              <button
                onClick={() => navigate("/janitor/monitoring-sarpras")}
                className="bg-green-600 hover:bg-green-700 text-white rounded-3xl p-6 shadow-lg text-left"
              >
                <div className="text-4xl mb-2">📊</div>
                <h3 className="font-bold">Monitoring</h3>
                <p className="text-sm opacity-80">Status penggunaan</p>
              </button>

              <button
                onClick={() => navigate("/janitor/laporan-sarpras")}
                className="bg-red-600 hover:bg-red-700 text-white rounded-3xl p-6 shadow-lg text-left"
              >
                <div className="text-4xl mb-2">🔧</div>
                <h3 className="font-bold">Laporan</h3>
                <p className="text-sm opacity-80">Kerusakan barang</p>
              </button>
            </div>

            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 xl:col-span-8 bg-white rounded-3xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4">
                  📅 Kalender Peminjaman Sarpras
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
                <h2 className="text-xl font-bold mb-4">📋 Keterangan</h2>

                <div className="space-y-4 text-sm">
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    🔴 Barang sedang dipinjam
                  </div>
                  <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                    🟠 Laboratorium sedang dipakai
                  </div>
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    🔵 Ruangan digunakan
                  </div>
                  <div className="bg-gray-50 border-l-4 border-gray-500 p-4 rounded">
                    Klik tanggal untuk detail peminjaman
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-2">📅 {selectedDate}</h2>
            <p className="text-gray-500 mb-4">Barang yang sedang dipinjam</p>

            <div className="space-y-2 text-sm">
              {selectedItems.length === 0 ? (
                <div className="bg-gray-100 p-3 rounded-xl text-gray-500">
                  Tidak ada peminjaman pada tanggal ini
                </div>
              ) : (
                selectedItems.map((item, index) => (
                  <div key={index} className="bg-gray-100 p-3 rounded-xl">
                    {item.tipe === "ruangan" ? "🏢" : item.tipe === "laboratorium" ? "🔬" : "💻"}{" "}
                    {item.item} - {item.peminjam}
                  </div>
                ))
              )}
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
    </main>
  );
}
