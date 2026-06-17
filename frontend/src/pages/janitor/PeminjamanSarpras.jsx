import React, { useEffect, useState } from "react";
// pastikan path ini sesuai struktur project kamu
import { getPeminjaman } from "./services/janitorService";

export default function PeminjamanSarpras() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await getPeminjaman({ status: "approved" });
        setData(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Gagal memuat peminjaman. Pastikan server berjalan."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="grow bg-slate-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Peminjaman Sarpras 📑
          </h1>
          <p className="text-gray-500 mt-2">
            Hanya menampilkan peminjaman yang sudah disetujui (read-only)
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500">
              Memuat data...
            </div>
          ) : data.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              Belum ada peminjaman yang disetujui.
            </div>
          ) : (
            <table className="w-full text-sm">
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
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}