import React, { useState } from "react";

function LaporanKondisiSarpras() {

  const dataPeminjaman = [
    {
      id: 1,
      barang: "Laptop Asus VivoBook",
      tanggalPinjam: "2026-06-13",
      tanggalKembali: "2026-06-15",
      statusLaporan: false,
    },
    {
      id: 2,
      barang: "Proyektor Epson",
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
    <main className="grow bg-slate-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Laporan Kondisi Sarpras
          </h1>

          <p className="text-gray-500 mt-2">
            Isi kondisi sarana dan prasarana setelah digunakan.
          </p>
        </div>

        {dataSelesai.length === 0 ? (
          <div className="bg-white rounded-3xl shadow p-8 text-center">

            <div className="text-6xl mb-4">
              📋
            </div>

            <h2 className="text-xl font-bold">
              Belum Ada Laporan
            </h2>

            <p className="text-gray-500 mt-2">
              Laporan kondisi hanya dapat diisi setelah masa
              peminjaman berakhir.
            </p>

          </div>
        ) : (

          <div className="grid md:grid-cols-2 gap-6">

            {dataSelesai.map((item) => (

              <div
                key={item.id}
                className="bg-white rounded-3xl shadow-lg p-6"
              >

                <h2 className="text-xl font-bold mb-2">
                  {item.barang}
                </h2>

                <p className="text-gray-500">
                  {item.tanggalPinjam} - {item.tanggalKembali}
                </p>

                <div className="mt-4">

                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                    Menunggu Laporan
                  </span>

                </div>

                <button
                  onClick={() => setSelectedItem(item)}
                  className="mt-5 bg-violet-600 hover:bg-violet-700 text-white px-5 py-2 rounded-xl"
                >
                  Isi Laporan Kondisi
                </button>

              </div>

            ))}

          </div>

        )}

        {/* Modal */}
        {selectedItem && (

          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

            <div className="bg-white rounded-3xl p-8 w-full max-w-2xl">

              <h2 className="text-2xl font-bold mb-2">
                Laporan Kondisi Sarpras
              </h2>

              <p className="text-gray-500 mb-6">
                {selectedItem.barang}
              </p>

              <div className="space-y-5">

                <div>

                  <label className="font-semibold block mb-2">
                    Kondisi Barang
                  </label>

                  <select className="w-full border rounded-xl p-3">

                    <option>Sangat Baik</option>
                    <option>Baik</option>
                    <option>Cukup</option>
                    <option>Rusak Ringan</option>
                    <option>Rusak Berat</option>

                  </select>

                </div>

                <div>

                  <label className="font-semibold block mb-2">
                    Kelengkapan
                  </label>

                  <div className="space-y-2">

                    <label className="flex gap-2">
                      <input type="checkbox" />
                      Lengkap
                    </label>

                    <label className="flex gap-2">
                      <input type="checkbox" />
                      Berfungsi Normal
                    </label>

                    <label className="flex gap-2">
                      <input type="checkbox" />
                      Bersih
                    </label>

                  </div>

                </div>

                <div>

                  <label className="font-semibold block mb-2">
                    Upload Foto
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    className="w-full border rounded-xl p-3"
                  />

                </div>

                <div>

                  <label className="font-semibold block mb-2">
                    Catatan
                  </label>

                  <textarea
                    rows="4"
                    className="w-full border rounded-xl p-3"
                    placeholder="Tuliskan kondisi barang setelah digunakan..."
                  />

                </div>

              </div>

              <div className="flex gap-3 mt-6">

                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-5 py-3 bg-gray-200 rounded-xl"
                >
                  Batal
                </button>

                <button
                  className="px-5 py-3 bg-green-600 text-white rounded-xl"
                >
                  Kirim Laporan
                </button>

              </div>

            </div>

          </div>

        )}

      </div>
    </main>
  );
}

export default LaporanKondisiSarpras;