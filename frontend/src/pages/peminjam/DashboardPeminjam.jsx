import React, { useState, useEffect } from "react";
import Banner from "../../partials/Banner";
import { Link, useNavigate } from "react-router-dom";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import { PageShell, ContentCard } from "./components/PeminjamLayout";
import { getPeminjamDashboard } from "./services/peminjamService";

function DashboardPeminjam() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [namaUser, setNamaUser] = useState("Peminjam");
  const [stats, setStats] = useState({
    totalPengajuan: 0,
    menunggu: 0,
    disetujui: 0,
    ditolak: 0,
  });
  const [events, setEvents] = useState([]);
  const [notifikasi, setNotifikasi] = useState([]);
  const [ketersediaan, setKetersediaan] = useState([]);
  const [peminjamanAktif, setPeminjamanAktif] = useState([]);
  const [jadwalPengembalian, setJadwalPengembalian] = useState([]);

  useEffect(() => {
    setLoading(true);
    setError("");

    getPeminjamDashboard()
      .then((res) => {
        const d = res.data;
        setNamaUser(d.namaUser || "Peminjam");
        setStats({
          totalPengajuan: d.totalPengajuan ?? 0,
          menunggu: d.menunggu ?? 0,
          disetujui: d.disetujui ?? 0,
          ditolak: d.ditolak ?? 0,
        });
        setEvents(d.events || []);
        setNotifikasi(d.notifikasi || []);
        setKetersediaan(d.ketersediaan || []);
        setPeminjamanAktif(d.peminjamanAktif || []);
        setJadwalPengembalian(d.jadwalPengembalian || []);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message ||
            "Gagal memuat dashboard. Pastikan server berjalan.",
        );
      })
      .finally(() => setLoading(false));
  }, []);

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

  // Helper: color for notifikasi dot
  const notifColor = (tipe) => {
    if (tipe === "disetujui") return "bg-green-500";
    if (tipe === "diproses") return "bg-yellow-500";
    if (tipe === "pengembalian") return "bg-blue-500";
    if (tipe === "ditolak") return "bg-red-500";
    return "bg-gray-400";
  };

  // Helper: progress bar width & color for status aktif
  const progressInfo = (status) => {
    if (status === "Disetujui" || status === "Sedang Dipinjam")
      return {
        width: "70%",
        color: "bg-green-500",
        borderColor: "border-green-500",
        label: "Sedang Dipinjam",
        labelColor: "text-green-600",
      };
    if (status === "Menunggu")
      return {
        width: "35%",
        color: "bg-yellow-500",
        borderColor: "border-yellow-500",
        label: "Menunggu Persetujuan",
        labelColor: "text-yellow-600",
      };
    if (status === "Ditolak")
      return {
        width: "100%",
        color: "bg-red-500",
        borderColor: "border-red-500",
        label: "Ditolak",
        labelColor: "text-red-600",
      };
    return {
      width: "50%",
      color: "bg-gray-400",
      borderColor: "border-gray-400",
      label: status,
      labelColor: "text-gray-600",
    };
  };

  // Helper: icon for ketersediaan
  const sarprasIcon = (nama) => {
    const n = (nama || "").toLowerCase();
    if (n.includes("laptop")) return "💻";
    if (n.includes("proyektor") || n.includes("projector")) return "📽️";
    if (n.includes("kamera") || n.includes("camera")) return "📷";
    if (n.includes("ruang")) return "🏢";
    if (n.includes("lab")) return "🔬";
    return "📦";
  };

  // Helper: color for ketersediaan value
  const ketersediaanColor = (stok) => {
    if (stok === 0 || stok === "Penuh") return "text-red-600";
    if (typeof stok === "number" && stok <= 2) return "text-yellow-600";
    return "text-green-600";
  };

  const ketersediaanLabel = (stok) => {
    if (stok === 0) return "Penuh";
    if (stok === "Penuh") return "Penuh";
    if (typeof stok === "number") return `${stok} Unit`;
    return stok;
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
            <h1 className="text-4xl font-bold text-white">
              Halo, {namaUser} 👋
            </h1>
            <p className="text-violet-100 mt-2 text-lg">
              Sistem Layanan Sarana dan Prasarana — Politeknik Caltex Riau
            </p>

            {loading ? (
              <div className="mt-8 text-violet-100 text-center py-4">
                Memuat data...
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                {[
                  { label: "Total Pengajuan", value: stats.totalPengajuan },
                  { label: "Menunggu", value: stats.menunggu },
                  { label: "Disetujui", value: stats.disetujui },
                  { label: "Ditolak", value: stats.ditolak },
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
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

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

        {!loading && (
          <>
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
                {/* NOTIFIKASI */}
                <ContentCard>
                  <h2 className="font-bold text-xl mb-5 text-gray-800">
                    🔔 Notifikasi
                  </h2>
                  <div className="space-y-4">
                    {notifikasi.length === 0 ? (
                      <p className="text-sm text-gray-400">
                        Tidak ada notifikasi.
                      </p>
                    ) : (
                      notifikasi.map((n, i) => (
                        <div key={i} className="flex gap-3 items-start">
                          <div
                            className={`w-2.5 h-2.5 ${notifColor(n.tipe)} rounded-full mt-2 shrink-0`}
                          />
                          <div>
                            <h4 className="font-semibold text-gray-800">
                              {n.title}
                            </h4>
                            <p className="text-sm text-gray-500">{n.sub}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ContentCard>

                {/* KETERSEDIAAN HARI INI */}
                {/* <ContentCard>
                  <h2 className="font-bold text-xl mb-5 text-gray-800">
                    📦 Ketersediaan Hari Ini
                  </h2>
                  <div className="space-y-3">
                    {ketersediaan.length === 0 ? (
                      <p className="text-sm text-gray-400">Tidak ada data.</p>
                    ) : (
                      ketersediaan.map((item, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center py-1"
                        >
                          <span className="text-gray-700">
                            {sarprasIcon(item.nama)} {item.nama}
                          </span>
                          <span
                            className={`font-bold ${ketersediaanColor(item.stok)}`}
                          >
                            {ketersediaanLabel(item.stok)}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </ContentCard> */}
              </div>
            </div>

            {/* STATUS AKTIF */}
            <ContentCard className="mb-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                📋 Status Peminjaman Aktif
              </h2>
              {peminjamanAktif.length === 0 ? (
                <p className="text-gray-400">
                  Tidak ada peminjaman aktif saat ini.
                </p>
              ) : (
                <div className="space-y-6">
                  {peminjamanAktif.map((item, i) => {
                    const p = progressInfo(item.status);
                    return (
                      <div
                        key={i}
                        className={`border-l-4 ${p.borderColor} pl-5 py-1`}
                      >
                        <h3 className="font-bold text-lg">{item.nama}</h3>
                        <p className="text-gray-500">
                          {item.tanggalMulai && item.tanggalSelesai
                            ? `${item.tanggalMulai} — ${item.tanggalSelesai}`
                            : item.status === "Menunggu"
                              ? "Menunggu Persetujuan"
                              : item.status}
                        </p>
                        <div className="w-full bg-slate-200 rounded-full h-2.5 mt-4">
                          <div
                            className={`${p.color} h-2.5 rounded-full`}
                            style={{ width: p.width }}
                          />
                        </div>
                        {p.label && (
                          <p
                            className={`text-sm mt-2 font-medium ${p.labelColor}`}
                          >
                            {p.label}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </ContentCard>

            {/* JADWAL PENGEMBALIAN */}
            <ContentCard>
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                📅 Jadwal Pengembalian Terdekat
              </h2>
              {jadwalPengembalian.length === 0 ? (
                <p className="text-gray-400">Tidak ada jadwal pengembalian.</p>
              ) : (
                <div className="space-y-3">
                  {jadwalPengembalian.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center bg-slate-50 hover:bg-violet-50 p-4 rounded-2xl transition"
                    >
                      <span className="text-gray-700">
                        {sarprasIcon(item.nama)} {item.nama}
                      </span>
                      <span className="font-bold text-gray-800">
                        {item.tanggalKembali}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </ContentCard>
          </>
        )}
      </PageShell>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              Pilih Jenis Peminjaman
            </h2>
            <p className="text-gray-500 mb-6">
              Tanggal:{" "}
              <span className="font-semibold text-violet-600">
                {selectedDate}
              </span>
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
