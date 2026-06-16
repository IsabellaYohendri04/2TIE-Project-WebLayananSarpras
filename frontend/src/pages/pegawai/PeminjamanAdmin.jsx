import React, { useState, useEffect, useCallback } from "react";
import { FiTrash2 } from "react-icons/fi";

function PeminjamanAdmin({ title, tipe, fetchFn, updateFn, deleteFn }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      setData(await fetchFn());
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleStatus = async (id, status) => {
    const catatan = window.prompt("Catatan admin (opsional):", "") || "";
    try {
      await updateFn(id, { status, catatanAdmin: catatan });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal update");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus pengajuan ini?")) return;
    await deleteFn(id);
    fetchData();
  };

  const statusColor = (s) => {
    if (s === "Disetujui") return "bg-green-100 text-green-700";
    if (s === "Ditolak") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <main className="grow">
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
          <p className="text-gray-500 mt-1">Kelola pengajuan peminjaman — setujui, tolak, atau hapus</p>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-4">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl shadow"><p className="text-gray-500 text-sm">Total</p><p className="text-2xl font-bold">{data.length}</p></div>
          <div className="bg-white p-5 rounded-2xl shadow"><p className="text-gray-500 text-sm">Menunggu</p><p className="text-2xl font-bold text-yellow-600">{data.filter((d) => d.status === "Menunggu").length}</p></div>
          <div className="bg-white p-5 rounded-2xl shadow"><p className="text-gray-500 text-sm">Disetujui</p><p className="text-2xl font-bold text-green-600">{data.filter((d) => d.status === "Disetujui").length}</p></div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg overflow-x-auto border border-slate-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
                <th className="p-4 text-left font-semibold">Peminjam</th>
                <th className="p-4 text-left font-semibold">Item</th>
                <th className="p-4 text-left font-semibold">Periode</th>
                <th className="p-4 text-left font-semibold">Status</th>
                <th className="p-4 text-center font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center">Memuat...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Belum ada pengajuan</td></tr>
              ) : data.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">
                    <p className="font-medium">{item.nama}</p>
                    <p className="text-xs text-gray-500">{item.nim} · {item.prodi}</p>
                  </td>
                  <td className="p-4">{item.item}</td>
                  <td className="p-4">{item.tanggalPinjam} — {item.tanggalKembali}<br /><span className="text-xs text-gray-500">{item.jamMulai} - {item.jamSelesai}</span></td>
                  <td className="p-4"><span className={`px-3 py-1 rounded-full text-xs ${statusColor(item.status)}`}>{item.status}</span></td>
                  <td className="p-4 text-center whitespace-nowrap">
                    {item.status === "Menunggu" && (
                      <>
                        <button onClick={() => handleStatus(item.id, "Disetujui")} className="text-green-600 text-xs font-medium mr-2">Setujui</button>
                        <button onClick={() => handleStatus(item.id, "Ditolak")} className="text-red-600 text-xs font-medium mr-2">Tolak</button>
                      </>
                    )}
                    <button onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-red-600"><FiTrash2 /></button>
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

export default PeminjamanAdmin;
