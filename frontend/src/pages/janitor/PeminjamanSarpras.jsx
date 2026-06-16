<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { getAllPeminjamanJanitor } from "../../services/peminjamanService";
=======
import React, { useEffect, useState } from "react";
import { getPeminjaman } from "./services/janitorService";
>>>>>>> 567df8493f6aca7aff1c087ae8364b9b38a2ffac

export default function PeminjamanSarpras() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD

  useEffect(() => {
    getAllPeminjamanJanitor()
      .then(setData)
      .catch(console.error)
=======
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    getPeminjaman({ status: "approved" })
      .then((res) => setData(res.data))
      .catch((err) => {
        setError(
          err.response?.data?.message ||
            "Gagal memuat peminjaman. Pastikan server berjalan."
        );
      })
>>>>>>> 567df8493f6aca7aff1c087ae8364b9b38a2ffac
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="grow bg-slate-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
<<<<<<< HEAD
=======

>>>>>>> 567df8493f6aca7aff1c087ae8364b9b38a2ffac
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Peminjaman Sarpras 📑</h1>
          <p className="text-gray-500 mt-2">Hanya menampilkan peminjaman yang sudah disetujui pegawai sarpras (read-only)</p>
        </div>

<<<<<<< HEAD
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
=======
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500">Memuat data...</div>
          ) : data.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              Belum ada peminjaman yang disetujui.
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4">Item</th>
                  <th className="text-left p-4">Peminjam</th>
                  <th className="text-left p-4">Tanggal</th>
                  <th className="text-left p-4">Tipe</th>
                  <th className="text-left p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={`${item.tipe}-${item.id}`} className="border-t">
                    <td className="p-4 font-medium">{item.item}</td>
                    <td className="p-4">{item.peminjam}</td>
                    <td className="p-4">{item.tanggal}</td>
                    <td className="p-4 capitalize">{item.tipe}</td>
                    <td className="p-4">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
>>>>>>> 567df8493f6aca7aff1c087ae8364b9b38a2ffac
        </div>
      </div>
    </main>
  );
}
