import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";


function FormPeminjamanBarang() {
const [searchParams] = useSearchParams();

const tanggalKalender = searchParams.get("date");
   
  const [formData, setFormData] = useState({
    nama: "",
    nim: "",
    prodi: "",
    noHp: "",
    kegiatan: "",
    sifat: "",
    keperluan: "",
    tanggalMulai: "",
    tanggalSelesai: "",
    jamMulai: "",
    jamSelesai: "",
    ruangan: "",
  });

  const barangList = [
    "Kursi",
    "Sofa Panjang",
    "Sofa Pendek",
    "Meja Kaca Panjang",
    "Meja Kecil Kaca",
    "Alas Meja Kaca",
    "Blower",
    "Papan Backdrop",
    "Sound System",
    "Mic",
    "Cok Sambung",
    "Meja Putih Panjang",
    "Meja Putih Bulat",
    "Tandu",
    "Tabung Oksigen",
    "Pick Up",
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">

      <div className="bg-white rounded-3xl shadow-lg p-8">

        <h1 className="text-3xl font-bold mb-2">
          Form Peminjaman Barang
        </h1>

        <p className="text-gray-500 mb-8">
          Isi data peminjaman fasilitas kampus
        </p>

        {/* Data Peminjam */}
        <h2 className="text-xl font-bold mb-4">
          Data Peminjam
        </h2>

        <div className="grid md:grid-cols-2 gap-4 mb-8">

          <input
            type="text"
            placeholder="Nama Peminjam"
            className="border rounded-xl p-3"
          />

          <input
            type="text"
            placeholder="NIM"
            className="border rounded-xl p-3"
          />

          <input
            type="text"
            placeholder="Program Studi"
            className="border rounded-xl p-3"
          />

          <input
            type="text"
            placeholder="Nomor HP"
            className="border rounded-xl p-3"
          />

        </div>

        {/* Organisasi */}
<h2 className="text-xl font-bold mb-4">
  Organisasi / Himpunan
</h2>

<div className="grid md:grid-cols-2 gap-4 mb-8">

  <select className="border rounded-xl p-3">

    <option value="">
      Pilih Organisasi
    </option>

    <option>HIMA Teknik Informatika</option>
    <option>HIMA Teknik Elektro</option>
    <option>HIMA Teknik Mesin</option>
    <option>HIMA Akuntansi</option>
    <option>HIMA Akuntansi Perpajakan</option>
    <option>BEM Politeknik Caltex Riau</option>
    <option>ITSA</option>
    <option>UKM</option>
    <option>Dosen</option>
    <option>Unit Kerja PCR</option>
    <option>Lainnya</option>

  </select>

  <input
    type="text"
    placeholder="Nama Penanggung Jawab"
    className="border rounded-xl p-3"
  />

</div>

        {/* Kegiatan */}
        <h2 className="text-xl font-bold mb-4">
          Informasi Kegiatan
        </h2>

        <div className="grid md:grid-cols-2 gap-4 mb-8">

          <input
            type="text"
            placeholder="Nama Kegiatan"
            className="border rounded-xl p-3"
          />

          <input
            type="text"
            placeholder="Sifat Kegiatan"
            className="border rounded-xl p-3"
          />

          <textarea
            rows="4"
            placeholder="Keperluan"
            className="border rounded-xl p-3 md:col-span-2"
          />

        </div>

        {/* Upload Proposal */}
<h2 className="text-xl font-bold mb-4">
  Proposal Kegiatan
</h2>

<div className="bg-slate-50 border-2 border-dashed border-violet-300 rounded-2xl p-6 mb-8">

  <label className="block font-semibold mb-3">
    Upload Proposal (PDF)
  </label>

  <input
    type="file"
    accept=".pdf"
    className="w-full border rounded-xl p-3 bg-white"
  />

  <p className="text-sm text-gray-500 mt-2">
    Format PDF, maksimal 10 MB
  </p>

</div>

     <h2 className="text-xl font-bold mb-4">
  Jadwal Peminjaman
</h2>

<div className="grid md:grid-cols-2 gap-6 mb-8">

  <div>
    <label className="block font-semibold mb-2">
      Tanggal Pinjam
    </label>

    <input
      type="date"
      value={tanggalKalender || ""}
      readOnly
      className="w-full border rounded-xl p-3 bg-gray-100"
    />
  </div>

  <div>
    <label className="block font-semibold mb-2">
      Tanggal Kembali
    </label>

    <input
      type="date"
      className="w-full border rounded-xl p-3"
    />
  </div>

  <div>
    <label className="block font-semibold mb-2">
      Jam Mulai
    </label>

    <input
      type="time"
      className="w-full border rounded-xl p-3"
    />
  </div>

  <div>
    <label className="block font-semibold mb-2">
      Jam Selesai
    </label>

    <input
      type="time"
      className="w-full border rounded-xl p-3"
    />
  </div>

</div>

        {/* Ruangan */}
        <h2 className="text-xl font-bold mb-4">
          Lokasi Penggunaan
        </h2>

        <input
          type="text"
          placeholder="Contoh: GOR, Aula, Ruang Seminar"
          className="border rounded-xl p-3 w-full mb-8"
        />

        {/* Barang */}
        <h2 className="text-xl font-bold mb-4">
          Daftar Barang yang Dipinjam
        </h2>

        <div className="overflow-x-auto mb-8">

          <table className="w-full border">

            <thead className="bg-violet-600 text-white">

              <tr>
                <th className="p-3 text-left">
                  Barang
                </th>

                <th className="p-3">
                  Jumlah
                </th>
              </tr>

            </thead>

            <tbody>

              {barangList.map((barang, index) => (
                <tr key={index} className="border-b">

                  <td className="p-3">
                    {barang}
                  </td>

                  <td className="p-3">

                    <input
                      type="number"
                      min="0"
                      defaultValue="0"
                      className="border rounded-lg p-2 w-24"
                    />

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

        {/* Catatan */}
        <div className="mb-8">

          <label className="font-semibold block mb-2">
            Catatan Tambahan
          </label>

          <textarea
            rows="4"
            className="w-full border rounded-xl p-3"
            placeholder="Tuliskan kebutuhan tambahan jika ada"
          />

        </div>

        {/* Tombol */}
        <div className="flex gap-3">

          <button className="px-6 py-3 bg-gray-200 rounded-xl">
            Batal
          </button>

          <button className="px-6 py-3 bg-violet-600 text-white rounded-xl">
            Ajukan Peminjaman
          </button>

        </div>

      </div>

    </div>
  );
}

export default FormPeminjamanBarang;