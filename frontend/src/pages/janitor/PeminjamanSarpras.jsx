import React, { useState, useEffect } from "react";
import { getAllPeminjamanJanitor } from "../../services/peminjamanService";

export default function PeminjamanSarpras() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllPeminjamanJanitor()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="grow bg-slate-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Peminjaman Sarpras 📑</h1>
          <p className="text-gray-500 mt-2">Hanya menampilkan peminjaman yang sudah disetujui pegawai sarpras (read-only)</p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4">Item</th>
                <th className="text-left p-4">Tipe</th>
                <th className="text-left p-4">Peminjam</th>
                <th className="text-left p-4">Periode</th>
                <th className="text-left p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Memuat...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Belum ada peminjaman disetujui</td></tr>
              ) : data.map((item) => (
                <tr key={`${item.tipe}-${item.id}`} className="border-t">
                  <td className="p-4 font-medium">{item.item}</td>
                  <td className="p-4 capitalize">{item.tipe}</td>
                  <td className="p-4">{item.nama}</td>
                  <td className="p-4">{item.tanggalPinjam} — {item.tanggalKembali}</td>
                  <td className="p-4">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">Disetujui</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
