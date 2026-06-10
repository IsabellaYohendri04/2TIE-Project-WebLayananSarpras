import React from "react";
import { useSearchParams } from "react-router-dom";

function FormPeminjamanRuangan() {

const [searchParams] = useSearchParams();

const tanggalKalender =
searchParams.get("date");

return ( <div className="max-w-7xl mx-auto p-6">

```
  <div className="bg-white rounded-3xl shadow-lg p-8">

    <h1 className="text-3xl font-bold mb-2">
      Peminjaman Ruangan
    </h1>

    <p className="text-gray-500 mb-8">
      Form pengajuan peminjaman ruangan dan fasilitas kampus
    </p>


    {/* Data Peminjam */}
    <h2 className="text-xl font-bold mb-4">
      Data Peminjam
    </h2>

    <div className="grid md:grid-cols-2 gap-4 mb-8">

      <input
        type="text"
        placeholder="Nama Lengkap"
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

        <option>Pilih Organisasi</option>
        <option>HIMA Teknik Informatika</option>
        <option>HIMA Teknik Elektro</option>
        <option>HIMA Teknik Mesin</option>
        <option>BEM PCR</option>
        <option>UKM</option>
        <option>ITSA</option>

      </select>

      <input
        type="text"
        placeholder="Penanggung Jawab"
        className="border rounded-xl p-3"
      />

    </div>

    {/* Kegiatan */}
    <h2 className="text-xl font-bold mb-4">
      Informasi Kegiatan
    </h2>

    <div className="grid gap-4 mb-8">

      <input
        type="text"
        placeholder="Nama Kegiatan"
        className="border rounded-xl p-3"
      />

      <select className="border rounded-xl p-3">

        <option>Jenis Kegiatan</option>
        <option>Seminar</option>
        <option>Workshop</option>
        <option>Pelatihan</option>
        <option>Rapat</option>
        <option>Lomba</option>

      </select>

      <input
        type="number"
        placeholder="Jumlah Peserta"
        className="border rounded-xl p-3"
      />

      <textarea
        rows="4"
        placeholder="Deskripsi Kegiatan"
        className="border rounded-xl p-3"
      />

    </div>

   {/* Jadwal */}
<h2 className="text-xl font-bold mb-4">
  Jadwal Penggunaan Ruangan
</h2>

<div className="grid md:grid-cols-2 gap-4 mb-8">

  <div>

    <label className="font-semibold block mb-2">
      Tanggal Mulai
    </label>

    <input
      type="date"
      value={tanggalKalender || ""}
      readOnly
      className="w-full border rounded-xl p-3 bg-gray-100 cursor-not-allowed"
    />

    <p className="text-sm text-gray-500 mt-1">
      Diambil otomatis dari kalender yang dipilih.
    </p>

  </div>

  <div>

    <label className="font-semibold block mb-2">
      Tanggal Selesai
    </label>

    <input
      type="date"
      className="w-full border rounded-xl p-3"
    />

    <p className="text-sm text-gray-500 mt-1">
      Isi tanggal terakhir penggunaan ruangan.
    </p>

  </div>

  <div>

    <label className="font-semibold block mb-2">
      Jam Mulai
    </label>

    <input
      type="time"
      className="w-full border rounded-xl p-3"
    />

  </div>

  <div>

    <label className="font-semibold block mb-2">
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
      Pilih Ruangan
    </h2>

    <div className="grid md:grid-cols-2 gap-4 mb-8">

      <select className="border rounded-xl p-3">

        <option>Pilih Gedung</option>

        <option>Gedung Utama</option>

        <option>GSG</option>

        <option>Workshop</option>

      </select>

      <select className="border rounded-xl p-3">

        <option>Pilih Ruangan</option>

        <option>Ruang Seminar</option>
        <option>Ruang Rapat</option>
        <option>Ruang Kelas A101</option>
        <option>Ruang Kelas A102</option>
        <option>Hall Utama GSG</option>
        <option>Workshop Mesin</option>
        <option>Workshop Elektro</option>

      </select>

    </div>

    {/* Proposal */}
    <h2 className="text-xl font-bold mb-4">
      Upload Proposal
    </h2>

    <input
      type="file"
      accept=".pdf"
      className="w-full border rounded-xl p-3 mb-8"
    />

    {/* Tombol */}
    <div className="flex gap-3">

      <button className="px-6 py-3 bg-gray-200 rounded-xl">
        Batal
      </button>

      <button className="px-6 py-3 bg-blue-600 text-white rounded-xl">
        Ajukan Peminjaman
      </button>

    </div>

  </div>

</div>


);
}

export default FormPeminjamanRuangan;
