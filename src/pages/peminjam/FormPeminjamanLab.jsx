import React from "react";
import { useSearchParams } from "react-router-dom";

function FormPeminjamanLab() {

const [searchParams] = useSearchParams();

const tanggalKalender =
searchParams.get("date");

return ( <div className="max-w-7xl mx-auto p-6">

```
  <div className="bg-white rounded-3xl shadow-lg p-8">

    <h1 className="text-3xl font-bold mb-2">
      Peminjaman Laboratorium
    </h1>

    <p className="text-gray-500 mb-8">
      Form pengajuan peminjaman laboratorium Politeknik Caltex Riau
    </p>

    {/* Informasi */}
    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-xl mb-8">

      <h3 className="font-semibold text-green-700">
        Informasi Peminjaman Laboratorium
      </h3>

      <ul className="list-disc ml-5 mt-2 text-sm text-gray-600">
        <li>Tanggal mulai diperoleh dari kalender.</li>
        <li>Proposal kegiatan wajib diunggah.</li>
        <li>Dosen pembimbing wajib diisi.</li>
        <li>Peminjam bertanggung jawab atas kebersihan dan keamanan laboratorium.</li>
      </ul>

    </div>

    {/* Data Peminjam */}
    <h2 className="text-xl font-bold mb-4">
      Data Peminjam
    </h2>

    <div className="grid md:grid-cols-2 gap-4 mb-8">

      <input
        type="text"
        placeholder="Nama Ketua Kegiatan"
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
        placeholder="Nomor HP / Email"
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
        <option>ITSA</option>
        <option>HIMA Teknik Informatika</option>
        <option>HIMA Teknik Elektro</option>
        <option>HIMA Teknik Mesin</option>
        <option>BEM PCR</option>
        <option>UKM</option>
        <option>Lainnya</option>
      </select>

      <input
        type="text"
        placeholder="Penanggung Jawab"
        className="border rounded-xl p-3"
      />

    </div>

    {/* Detail Kegiatan */}
    <h2 className="text-xl font-bold mb-4">
      Detail Kegiatan
    </h2>

    <div className="grid gap-4 mb-8">

      <input
        type="text"
        placeholder="Nama Kegiatan"
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
      Jadwal Penggunaan Laboratorium
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
          className="w-full border rounded-xl p-3 bg-gray-100"
        />
      </div>

      <div>
        <label className="font-semibold block mb-2">
          Tanggal Selesai
        </label>

        <input
          type="date"
          className="w-full border rounded-xl p-3"
        />
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

    {/* Laboratorium */}
    <h2 className="text-xl font-bold mb-4">
      Laboratorium yang Dipinjam
    </h2>

    <select className="border rounded-xl p-3 w-full mb-8">

      <option>Pilih Laboratorium</option>

      <option>Lab 151</option>
      <option>Lab 152</option>
      <option>Lab 153</option>
      <option>Lab 154</option>
      <option>Lab Jaringan</option>
      <option>Lab Multimedia</option>
      <option>Lab Komputer Umum</option>

    </select>

    {/* Kebutuhan Alat */}
    <h2 className="text-xl font-bold mb-4">
      Kebutuhan Alat di Laboratorium
    </h2>

    <div className="grid md:grid-cols-2 gap-4 mb-8">

      <label className="flex items-center gap-2">
        <input type="checkbox" />
        PC Komputer
      </label>

      <label className="flex items-center gap-2">
        <input type="checkbox" />
        WiFi Internet
      </label>

      <label className="flex items-center gap-2">
        <input type="checkbox" />
        Proyektor
      </label>

      <label className="flex items-center gap-2">
        <input type="checkbox" />
        Sound System
      </label>

    </div>

    {/* Pembimbing */}
    <h2 className="text-xl font-bold mb-4">
      Dosen Pembimbing
    </h2>

    <input
      type="text"
      placeholder="Nama Dosen Pembimbing"
      className="border rounded-xl p-3 w-full mb-8"
    />

    {/* Proposal */}
    <h2 className="text-xl font-bold mb-4">
      Upload Proposal
    </h2>

    <input
      type="file"
      accept=".pdf"
      className="border rounded-xl p-3 w-full mb-8"
    />

    {/* Tombol */}
    <div className="flex gap-3">

      <button
        type="button"
        className="px-6 py-3 bg-gray-200 rounded-xl"
      >
        Batal
      </button>

      <button
        type="submit"
        className="px-6 py-3 bg-green-600 text-white rounded-xl"
      >
        Ajukan Peminjaman
      </button>

    </div>

  </div>

</div>


);
}

export default FormPeminjamanLab;