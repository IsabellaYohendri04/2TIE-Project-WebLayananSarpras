import React, { useState } from "react";

import { useSearchParams, useNavigate } from "react-router-dom";
import {
  PageShell,
  PageHeader,
  ContentCard,
  FormSection,
  inputClass,
  selectClass,
  labelClass,
} from "./components/PeminjamLayout";

function FormPeminjamanLab() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tanggalKalender = searchParams.get("date");
  const [step, setStep] = useState(1);

  const [gedung, setGedung] = useState("");
const [tanggalSelesai, setTanggalSelesai] = useState("");
const [jamMulai, setJamMulai] = useState("");
const [jamSelesai, setJamSelesai] = useState("");

const labByGedung = {
  "Gedung Utama": [
    "Lab 151",
    "Lab 152",
    "Lab 153",
    "Lab 154",
  ],

  Workshop: [
    "Lab Mekatronika",
    "Lab Mesin CNC",
    "Lab PLC",
  ],

  GSG: [
    "Lab Multimedia",
    "Lab Komputer Umum",
    "Lab Jaringan",
  ],
};

  const kebutuhanAlat = [
    "PC Komputer",
    "WiFi Internet",
    "Proyektor",
    "Sound System",
  ];

  return (
    <PageShell>
      <PageHeader
        title="Peminjaman Laboratorium"
        subtitle="Form pengajuan peminjaman laboratorium Politeknik Caltex Riau"
        badge={tanggalKalender ? `Tanggal: ${tanggalKalender}` : null}
      />

      <div className="bg-white rounded-[32px] p-8 shadow-lg mb-8">

  <div className="flex items-center justify-between">

    <div className="flex flex-col items-center flex-1">
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg
        ${step >= 1 ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white" : "bg-gray-100"}
        `}
      >
        👤
      </div>

      <p className="mt-3 font-semibold">
        Data Peminjam
      </p>
    </div>

    <div className="h-1 bg-slate-200 flex-1 mx-4"></div>

    <div className="flex flex-col items-center flex-1">
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg
        ${step >= 2 ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white" : "bg-gray-100"}
        `}
      >
        📋
      </div>

      <p className="mt-3 font-semibold">
        Kegiatan
      </p>
    </div>

    <div className="h-1 bg-slate-200 flex-1 mx-4"></div>

    <div className="flex flex-col items-center flex-1">
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg
        ${step >= 3 ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white" : "bg-gray-100"}
        `}
      >
        🧪
      </div>

      <p className="mt-3 font-semibold">
        Laboratorium
      </p>
    </div>

    <div className="h-1 bg-slate-200 flex-1 mx-4"></div>

    <div className="flex flex-col items-center flex-1">
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg
        ${step >= 4 ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white" : "bg-gray-100"}
        `}
      >
        ✅
      </div>

      <p className="mt-3 font-semibold">
        Konfirmasi
      </p>
    </div>

  </div>

</div>

      <div className="bg-green-50 border border-green-200 rounded-[28px] p-5 mb-8 shadow-sm">
        <h3 className="font-semibold text-green-800 flex items-center gap-2">
          ℹ️ Informasi Peminjaman Laboratorium
        </h3>
        <ul className="list-disc ml-6 mt-2 text-sm text-green-700 space-y-1">
          <li>Tanggal mulai diperoleh dari kalender.</li>
          <li>Proposal kegiatan wajib diunggah.</li>
          <li>Dosen pembimbing wajib diisi.</li>
          <li>Peminjam bertanggung jawab atas kebersihan dan keamanan laboratorium.</li>
        </ul>
      </div>

      <ContentCard>
        <form onSubmit={(e) => e.preventDefault()}>
         {step === 1 && (
          <>
    <FormSection title="Data Peminjam" icon="👤">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Nama Ketua Kegiatan</label>
          <input type="text" placeholder="Nama ketua kegiatan" className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>NIM</label>
          <input type="text" placeholder="233510101" className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Program Studi</label>
          <input type="text" placeholder="Teknik Informatika" className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Nomor HP</label>
          <input type="text" placeholder="08xxxxxxxxxx" className={inputClass} />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Email</label>
          <input type="email" placeholder="email@student.pcr.ac.id" className={inputClass} />
        </div>
      </div>
    </FormSection>

    <FormSection title="Organisasi / Himpunan" icon="🏛️">
      <div className="grid md:grid-cols-2 gap-4">

        <div>
          <label className={labelClass}>Organisasi</label>

          <select className={selectClass}>
            <option>Pilih Organisasi</option>
            <option>ITSA</option>
            <option>HIMA Teknik Informatika</option>
            <option>HIMA Teknik Elektro</option>
            <option>BEM PCR</option>
            <option>UKM</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Penanggung Jawab</label>

          <input
            type="text"
            placeholder="Nama penanggung jawab kegiatan"
            className={inputClass}
          />
        </div>

      </div>
    </FormSection>
  </>
)}

{step === 2 && (
  <>
    <FormSection title="Data Kegiatan" icon="📋">

      <div className="space-y-4">

        <div>
          <label className={labelClass}>Nama Kegiatan</label>
          <input
            type="text"
            placeholder="Nama kegiatan"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Deskripsi Kegiatan</label>
          <textarea
            rows="4"
            placeholder="Deskripsi kegiatan"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Dosen Pembimbing</label>

          <input
            type="text"
            placeholder="Nama dosen pembimbing"
            className={inputClass}
          />
        </div>

      </div>

    </FormSection>
  </>
)}

{step === 3 && (
  <>
    <FormSection title="Jadwal Penggunaan Laboratorium" icon="📅">

      <div className="grid md:grid-cols-2 gap-4">

        <div>
          <label className={labelClass}>
            Tanggal Mulai
          </label>

          <input
            type="date"
            value={tanggalKalender || ""}
            readOnly
            className={`${inputClass} bg-slate-100`}
          />
        </div>

        <div>
          <label className={labelClass}>
            Tanggal Selesai
          </label>

          <input
            type="date"
            value={tanggalSelesai}
            onChange={(e) =>
              setTanggalSelesai(e.target.value)
            }
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            Jam Mulai
          </label>

          <input
            type="time"
            value={jamMulai}
            onChange={(e) =>
              setJamMulai(e.target.value)
            }
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            Jam Selesai
          </label>

          <input
            type="time"
            value={jamSelesai}
            min={
              tanggalKalender === tanggalSelesai
                ? jamMulai
                : undefined
            }
            onChange={(e) =>
              setJamSelesai(e.target.value)
            }
            className={inputClass}
          />
        </div>

      </div>

    </FormSection>

    <FormSection title="Laboratorium" icon="🧪">

      <div className="grid md:grid-cols-2 gap-4">

        <div>
          <label className={labelClass}>Gedung</label>

          <select
            className={selectClass}
            value={gedung}
            onChange={(e) =>
              setGedung(e.target.value)
            }
          >
            <option value="">
              Pilih Gedung
            </option>

            <option value="Gedung Utama">
              Gedung Utama
            </option>

            <option value="Workshop">
              Workshop
            </option>

            <option value="GSG">
              GSG
            </option>
          </select>
        </div>

        <div>
          <label className={labelClass}>
            Laboratorium
          </label>

          <select
            className={selectClass}
            disabled={!gedung}
          >
            <option>
              {gedung
                ? "Pilih Laboratorium"
                : "Pilih Gedung Terlebih Dahulu"}
            </option>

            {gedung &&
              labByGedung[gedung].map((lab) => (
                <option
                  key={lab}
                  value={lab}
                >
                  {lab}
                </option>
              ))}
          </select>
        </div>

      </div>

    </FormSection>

    <FormSection title="Kebutuhan Alat" icon="🔧">

      <div className="grid md:grid-cols-2 gap-4">

        {kebutuhanAlat.map((alat) => (
          <label
            key={alat}
            className="
              flex
              items-center
              gap-3
              p-4
              border
              rounded-2xl
              hover:bg-green-50
              cursor-pointer
            "
          >
            <input type="checkbox" />
            <span>{alat}</span>
          </label>
        ))}

      </div>

    </FormSection>
  </>
)}

    {step === 4 && (
  <>
    <FormSection title="Upload Proposal" icon="📄">

      <div className="bg-green-50 border-2 border-dashed border-green-300 rounded-2xl p-6">

        <label className={labelClass}>
          Proposal Kegiatan (PDF)
        </label>

        <input
          type="file"
          accept=".pdf"
          className={`${inputClass} bg-white`}
        />

      </div>

    </FormSection>

    <div className="bg-green-50 rounded-2xl p-6 border border-green-200">

      <h3 className="font-bold text-lg mb-2">
        Konfirmasi Pengajuan
      </h3>

      <p className="text-gray-600">
        Pastikan seluruh data yang telah diisi sudah benar.
        Setelah pengajuan dikirim, data akan diproses oleh
        pihak Sarana dan Prasarana.
      </p>

    </div>
  </>
)}

{/* Tombol Navigasi Step */}
<div className="flex justify-between mt-8">

  <button
    type="button"
    onClick={() => setStep(step - 1)}
    disabled={step === 1}
    className="
      px-6 py-3
      rounded-xl
      bg-gray-200
      disabled:opacity-50
      disabled:cursor-not-allowed
      hover:bg-gray-300
      transition
    "
  >
    ← Kembali
  </button>

  {step < 4 ? (

    <button
      type="button"
      onClick={() => setStep(step + 1)}
      className="
        px-8 py-3
        rounded-xl
        bg-gradient-to-r
        from-blue-600
        to-indigo-600
        text-white
        hover:scale-105
        transition
      "
    >
      Lanjutkan →
    </button>

  ) : (

    <button
      type="submit"
      className="
        px-8 py-3
        rounded-xl
        bg-gradient-to-r
        from-green-600
        to-emerald-600
        text-white
        hover:scale-105
        transition
      "
    >
      Ajukan Peminjaman
    </button>

  )}

</div>

        </form>
      </ContentCard>
    </PageShell>
  );
}

export default FormPeminjamanLab;