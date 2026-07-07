import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Building2,
  ClipboardList,
  FileText,
  Laptop,
  Projector,
  Mic,
  Clock3,
} from "lucide-react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useAuth } from "../../context/AuthContext";
import { getPegawaiDashboard } from "./services/pegawaiService";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
);

const TIPE_ICON = {
  barang: Laptop,
  ruangan: Projector,
  laboratorium: Mic,
};

function PeminjamanChart({ labels, peminjaman, pengembalian }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Pengajuan",
            data: peminjaman,
            borderColor: "#6366f1",
            backgroundColor: "rgba(99, 102, 241, 0.1)",
            fill: true,
            tension: 0.3,
          },
          {
            label: "Pengembalian (laporan selesai)",
            data: pengembalian,
            borderColor: "#22c55e",
            backgroundColor: "rgba(34, 197, 94, 0.1)",
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "top" },
        },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 } },
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, [labels, peminjaman, pengembalian]);

  return (
    <div className="h-[320px]">
      <canvas ref={canvasRef} />
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    aktif: 0,
    menunggu: 0,
    selesai: 0,
    terlambat: 0,
    totalFasilitas: 0,
    totalPegawai: 0,
    totalPeminjaman: 0,
  });
  const [chart, setChart] = useState({
    labels: [],
    peminjaman: [],
    pengembalian: [],
  });
  const [peminjamanTerbaru, setPeminjamanTerbaru] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setLoading(true);
    setError("");

    getPegawaiDashboard()
      .then((res) => {
        setStats(res.data.stats);
        setChart(res.data.chart);
        setPeminjamanTerbaru(res.data.recentPeminjaman || []);
        setNotifications(res.data.notifications || []);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message ||
            "Gagal memuat dashboard. Pastikan server backend berjalan.",
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      title: "Total Peminjaman Aktif",
      value: stats.aktif,
      desc: "Peminjaman sedang berlangsung",
    },
    {
      title: "Menunggu Persetujuan",
      value: stats.menunggu,
      desc: "Menunggu persetujuan Anda",
    },
    {
      title: "Peminjaman Selesai",
      value: stats.selesai,
      desc: "Periode peminjaman telah selesai",
    },
    {
      title: "Dikembalikan Terlambat",
      value: stats.terlambat,
      desc: "Peminjaman melewati tanggal kembali",
    },
  ];

  const menuCards = [
    {
      icon: <Users size={34} />,
      title: "Kelola Pegawai",
      desc: "Kelola data pegawai dan hak akses sistem",
      color: "from-violet-600 to-purple-700",
      to: "/pegawai",
    },
    {
      icon: <Building2 size={34} />,
      title: "Kelola Sarana Prasarana",
      desc: "Kelola barang, gedung, ruangan, dan laboratorium",
      color: "from-green-500 to-emerald-600",
      to: "/fasilitas/barang",
    },
    {
      icon: <ClipboardList size={34} />,
      title: "Kelola Peminjaman",
      desc: "Kelola semua pengajuan dari peminjam",
      color: "from-blue-500 to-indigo-600",
      to: "/peminjaman/barang",
    },
    {
      icon: <FileText size={34} />,
      title: "Laporan Kondisi",
      desc: "Pantau laporan kondisi fasilitas",
      color: "from-sky-500 to-cyan-600",
      to: "/laporan-kondisi",
    },
  ];

  const getItemIcon = (tipe) => {
    const Icon = TIPE_ICON[tipe] || Laptop;
    return <Icon size={32} />;
  };

  if (loading) {
    return (
      <div className="text-center text-gray-500 py-20">Memuat dashboard...</div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* HERO */}
      <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 p-10">
        <div className="absolute right-10 top-4 opacity-10 text-[220px]">
          🏫
        </div>

        <div className="relative z-10">
          <h1 className="text-white text-4xl md:text-5xl font-bold">
            Halo, {user?.nama || "Pegawai Sarpras"} 👋
          </h1>

          <p className="text-indigo-100 text-lg md:text-xl mt-2">
            Dashboard Pegawai Sarana dan Prasarana — Politeknik Caltex Riau
          </p>

          <div className="flex flex-wrap gap-4 mt-6 text-indigo-100 text-sm">
            <span className="bg-white/10 rounded-full px-4 py-1.5">
              {stats.totalFasilitas} fasilitas terdaftar
            </span>
            <span className="bg-white/10 rounded-full px-4 py-1.5">
              {stats.totalPegawai} pegawai aktif
            </span>
            <span className="bg-white/10 rounded-full px-4 py-1.5">
              {stats.totalPeminjaman} total peminjaman
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mt-10">
            {statCards.map((item) => (
              <div
                key={item.title}
                className="bg-white/15 backdrop-blur-md rounded-3xl p-6"
              >
                <p className="text-indigo-100 text-sm">{item.title}</p>
                <h2 className="text-white text-4xl md:text-5xl font-bold mt-2">
                  {item.value}
                </h2>
                <p className="text-indigo-100 mt-1 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MENU */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {menuCards.map((card) => (
          <Link
            key={card.title}
            to={card.to}
            className={`bg-gradient-to-r ${card.color} rounded-3xl p-6 text-white shadow-lg hover:scale-[1.02] transition transform block`}
          >
            {card.icon}
            <h3 className="font-semibold text-2xl mt-4">{card.title}</h3>
            <p className="mt-2 text-white/90 text-sm leading-relaxed">
              {card.desc}
            </p>
          </Link>
        ))}
      </div>

      {/* BOTTOM SECTION */}
      <div className="grid grid-cols-12 gap-6">
        {/* CHART */}
        <div className="col-span-12 xl:col-span-7 bg-white rounded-3xl shadow-sm p-6">
          <h3 className="font-semibold text-2xl text-gray-800 mb-6">
            📊 Ringkasan Pengajuan Peminjaman (7 Hari Terakhir)
          </h3>

          {chart.labels.length > 0 ? (
            <PeminjamanChart
              labels={chart.labels}
              peminjaman={chart.peminjaman}
              pengembalian={chart.pengembalian}
            />
          ) : (
            <div className="h-[320px] flex items-center justify-center text-gray-400">
              Belum ada data grafik
            </div>
          )}
        </div>

        {/* NOTIFIKASI & PEMINJAMAN TERBARU */}
        <div className="col-span-12 xl:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm p-6">
            <h3 className="font-semibold text-xl text-gray-800 flex items-center gap-2 mb-4">
              🔔 Notifikasi Peminjaman
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              10 pengajuan terbaru dari database
            </p>
            <div className="space-y-3 max-h-[420px] overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Belum ada data peminjaman
                </p>
              ) : (
                notifications.map((n) => (
                  <Link
                    key={n.id}
                    to={n.link}
                    className="flex gap-3 items-start hover:bg-gray-50 p-2 rounded-xl transition"
                  >
                    <div
                      className={`w-2.5 h-2.5 ${n.color} rounded-full mt-2 shrink-0`}
                    />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-gray-800 text-sm truncate">
                        {n.title}
                      </h4>
                      <p className="text-xs text-gray-500">{n.sub}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {n.tanggal}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
