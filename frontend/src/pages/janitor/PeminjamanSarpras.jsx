import React, { useState } from "react";

export default function PeminjamanSarpras() {
  const [data] = useState([
    {
      id: 1,
      item: "Laptop Asus",
      peminjam: "Budi",
      tanggal: "2026-06-12",
      status: "APPROVED",
    },
    {
      id: 2,
      item: "Proyektor Epson",
      peminjam: "Siti",
      tanggal: "2026-06-13",
      status: "APPROVED",
    },
    {
      id: 3,
      item: "Ruang Seminar",
      peminjam: "Andi",
      tanggal: "2026-06-14",
      status: "PENDING", // ❌ ini tidak akan ditampilkan
    },
  ]);

  const approvedData = data.filter(
    (item) => item.status === "APPROVED"
  );

  return (
    <main className="grow bg-slate-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Peminjaman Sarpras 📑
          </h1>
          <p className="text-gray-500 mt-2">
            Hanya menampilkan peminjaman yang sudah disetujui pegawai
          </p>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

          <table className="w-full">

            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4">Item</th>
                <th className="text-left p-4">Peminjam</th>
                <th className="text-left p-4">Tanggal</th>
                <th className="text-left p-4">Status</th>
              </tr>
            </thead>

            <tbody>

              {approvedData.map((item) => (
                <tr key={item.id} className="border-t">

                  <td className="p-4 font-medium">
                    {item.item}
                  </td>

                  <td className="p-4">
                    {item.peminjam}
                  </td>

                  <td className="p-4">
                    {item.tanggal}
                  </td>

                  <td className="p-4">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                      APPROVED
                    </span>
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