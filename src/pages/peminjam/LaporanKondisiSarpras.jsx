import React, { useState } from "react";
import {
  PageShell,
  PageHeader,
  ContentCard,
  inputClass,
  selectClass,
  labelClass,
} from "./components/PeminjamLayout";

function LaporanKondisiSarpras() {
  const dataPeminjaman = [
    {
      id: 1,
      barang: "Laptop Asus VivoBook",
      kategori: "Barang",
      tanggalPinjam: "2026-06-13",
      tanggalKembali: "2026-06-15",
      statusLaporan: false,
    },
    {
      id: 2,
      barang: "Proyektor Epson",
      kategori: "Barang",
      tanggalPinjam: "2026-07-20",
      tanggalKembali: "2026-07-25",
      statusLaporan: false,
    },
  ];

  const today = new Date().toISOString().split("T")[0];

  const dataSelesai = dataPeminjaman.filter(
    (item) => item.tanggalKembali <= today
  );

  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <PageShell>
      <PageHeader
        title="Laporan Kondisi Sarpras"
        subtitle="Isi kondisi sarana dan prasarana setelah masa peminjaman berakhir"
      />

      {dataSelesai.length === 0 ? (
        <ContentCard className="text-center py-16">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-xl font-bold text-gray-800">Belum Ada Laporan</h2>
          <p className="text-gray-500 mt-2 max-w-md mx-auto">
            Laporan kondisi hanya dapat diisi setelah masa peminjaman berakhir.
          </p>
        </ContentCard>
      ) : (
        <ContentCard className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
                  <th className="p-4 text-left font-semibold">Barang / Sarpras</th>
                  <th className="p-4 text-left font-semibold">Kategori</th>
                  <th className="p-4 text-left font-semibold">Periode</th>
                  <th className="p-4 text-center font-semibold">Status</th>
                  <th className="p-4 text-center font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {dataSelesai.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-100 hover:bg-violet-50/40 transition"
                  >
                    <td className="p-4 font-medium">{item.barang}</td>
                    <td className="p-4 text-gray-500">{item.kategori}</td>
                    <td className="p-4 text-gray-600">
                      {item.tanggalPinjam} — {item.tanggalKembali}
                    </td>
                    <td className="p-4 text-center">
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">
                        Menunggu Laporan
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                      >
                        Isi Laporan
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ContentCard>
      )}

      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Laporan Kondisi Sarpras
                </h2>
                <p className="text-gray-500 mt-1">{selectedItem.barang}</p>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className={labelClass}>Kondisi Barang</label>
                <select className={selectClass} defaultValue="Baik">
                  <option>Sangat Baik</option>
                  <option>Baik</option>
                  <option>Cukup</option>
                  <option>Rusak Ringan</option>
                  <option>Rusak Berat</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Kelengkapan</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {["Lengkap", "Berfungsi Normal", "Bersih"].map((item) => (
                    <label
                      key={item}
                      className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 hover:bg-violet-50 cursor-pointer"
                    >
                      <input type="checkbox" className="w-4 h-4 accent-violet-600" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>Upload Foto</label>
                <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-4">
                  <input type="file" accept="image/*" className={`${inputClass} bg-white`} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Catatan</label>
                <textarea
                  rows="4"
                  className={inputClass}
                  placeholder="Tuliskan kondisi barang setelah digunakan..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8 pt-6 border-t border-slate-100">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-gray-700 rounded-xl font-medium transition"
              >
                Batal
              </button>
              <button className="px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition">
                Kirim Laporan
              </button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}

export default LaporanKondisiSarpras;
