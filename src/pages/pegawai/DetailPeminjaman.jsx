import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function DetailPeminjaman() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get(`/api/peminjaman/barang/${id}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [id]);

  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="bg-white px-5 py-3 rounded-2xl shadow hover:shadow-lg transition">
            ← Kembali
          </button>

          <span className={`px-5 py-2 rounded-full font-semibold ${data.status === "Disetujui" ? "bg-green-100 text-green-700" : data.status === "Ditolak" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>{data.status}</span>
        </div>

        {/* Hero Card */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl mb-8">
          <div className="relative">
            <img src={data.image} alt={data.barang} className="w-full h-[450px] object-cover" />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

            <div className="absolute bottom-8 left-8 text-white">
              <span className="bg-violet-600 px-4 py-2 rounded-full text-sm">{data.kategori}</span>

              <h1 className="text-5xl font-bold mt-4">{data.barang}</h1>
            </div>
          </div>
        </div>

        {/* Statistik */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <p className="text-gray-500 mb-2">Nama Peminjam</p>

            <h2 className="text-2xl font-bold">{data.nama}</h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <p className="text-gray-500 mb-2">NIM</p>

            <h2 className="text-2xl font-bold">{data.nim}</h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <p className="text-gray-500 mb-2">Program Studi</p>

            <h2 className="text-xl font-bold">{data.prodi}</h2>
          </div>
        </div>

        {/* Detail */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Informasi Barang */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">📦 Informasi Barang</h2>

            <div className="space-y-4">
              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-500">Nama Barang</span>

                <span className="font-semibold">{data.barang}</span>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-500">Kategori</span>

                <span className="font-semibold">{data.kategori}</span>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-500">Status</span>

                <span className="font-semibold">{data.status}</span>
              </div>
            </div>
          </div>

          {/* Informasi Peminjaman */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">📅 Informasi Peminjaman</h2>

            <div className="space-y-4">
              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-500">Tanggal Pinjam</span>

                <span className="font-semibold">{data.tanggalPinjam}</span>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-500">Tanggal Kembali</span>

                <span className="font-semibold">{data.tanggalKembali}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Catatan Admin */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mt-6">
          <h2 className="text-2xl font-bold mb-4">📝 Catatan Admin</h2>

          <textarea rows="5" defaultValue={data.catatanAdmin} placeholder="Tulis pesan untuk peminjam..." className="w-full border rounded-2xl p-4 focus:ring-2 focus:ring-violet-500 outline-none" />
        </div>

        {/* Notifikasi */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mt-6">
          <h2 className="text-2xl font-bold mb-4">🔔 Pengiriman Notifikasi</h2>

          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked />
              Kirim ke Email
            </label>

            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked />
              Kirim ke WhatsApp
            </label>
          </div>
        </div>

        {/* Action */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <button className="bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-semibold shadow-lg transition">❌ Tolak Pengajuan</button>

          <button className="bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-semibold shadow-lg transition">✅ Setujui Pengajuan</button>

          <button className="bg-violet-600 hover:bg-violet-700 text-white py-4 rounded-2xl font-semibold shadow-lg transition">📩 Kirim Notifikasi</button>
        </div>
      </div>
    </main>
  );
}

export default DetailPeminjaman;
