import React, { useState, useEffect } from "react";

import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getLaboratoriumById, getGedung, getLaboratorium } from "../../services/fasilitasService";
import { createPeminjamanLaboratorium } from "../../services/peminjamanService";
import { usePeminjamanBase } from "../../hooks/usePeminjamanBase";
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
  const { user } = useAuth();
  const { base } = usePeminjamanBase();
  const tanggalKalender = searchParams.get("date");
  const labIdParam = searchParams.get("labId");
  const gedungParam = searchParams.get("gedung");
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [labFromApi, setLabFromApi] = useState(null);
  const [gedungList, setGedungList] = useState([]);
  const [labList, setLabList] = useState([]);

  const [form, setForm] = useState({
    nama: user?.nama || "",
    nim: user?.nim || "",
    prodi: user?.prodi || "",
    dosenPembimbing: "",
    namaKegiatan: "",
    gedung: "",
    laboratorium: "",
    tanggalMulai: tanggalKalender || "",
    tanggalSelesai: "",
    jamMulai: "",
    jamSelesai: "",
  });

  useEffect(() => {
    getGedung().then(setGedungList).catch(console.error);
  }, []);

  useEffect(() => {
    if (labIdParam) {
      getLaboratoriumById(labIdParam).then(setLabFromApi).catch(console.error);
    }
  }, [labIdParam]);

  useEffect(() => {
    if (form.gedung) {
      const params = { gedung: form.gedung };
      if (["gedung-utama", "gedung-serba-guna"].includes(form.gedung)) {
        params.lantai = 3;
      } else if (["workshop-listrik", "workshop-mesin"].includes(form.gedung)) {
        params.lantai = 2;
      }
      getLaboratorium(params).then(setLabList).catch(console.error);
    }
  }, [form.gedung]);

  useEffect(() => {
    if (gedungParam && !labIdParam) {
      setForm((prev) => ({ ...prev, gedung: gedungParam }));
    }
  }, [gedungParam, labIdParam]);

  useEffect(() => {
    if (labFromApi) {
      setForm((prev) => ({
        ...prev,
        gedung: labFromApi.gedungSlug,
        laboratorium: labFromApi.nama,
      }));
    }
  }, [labFromApi]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.laboratorium || !form.tanggalMulai) {
      alert("Laboratorium dan tanggal wajib diisi");
      return;
    }
    setSubmitting(true);
    try {
      await createPeminjamanLaboratorium({
        nama: form.nama,
        nim: form.nim,
        prodi: form.prodi,
        laboratorium: `${form.laboratorium}${labFromApi ? ` (${labFromApi.kode})` : ""}`,
        kategori: "Laboratorium",
        tanggalPinjam: form.tanggalMulai,
        tanggalKembali: form.tanggalSelesai || form.tanggalMulai,
        jamMulai: form.jamMulai,
        jamSelesai: form.jamSelesai,
        detail: {
          dosenPembimbing: form.dosenPembimbing,
          namaKegiatan: form.namaKegiatan,
          labId: labFromApi?.id,
          gedung: labFromApi?.gedungNama || form.gedung,
        },
      });
      setSubmitted(true);
    } catch (err) {
      alert(err.response?.data?.message || "Gagal mengirim pengajuan");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <PageShell>
        <ContentCard className="max-w-xl mx-auto text-center py-16">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold mb-4">Pengajuan Lab Berhasil!</h2>
          <button onClick={() => navigate(`${base}/riwayat-peminjaman`)} className="px-6 py-3 bg-violet-600 text-white rounded-xl mr-3">Lihat Riwayat</button>
          <button onClick={() => navigate(base)} className="px-6 py-3 bg-slate-100 rounded-xl">Dashboard</button>
        </ContentCard>
      </PageShell>
    );
  }

  const labByGedung = labList.reduce((acc, lab) => {
    const key = lab.gedungNama || form.gedung;
    if (!acc[key]) acc[key] = [];
    acc[key].push(lab.nama);
    return acc;
  }, {});

  // fallback jika belum load dari API
  const fallbackLabByGedung = {
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

  const labsForSelect = Object.keys(labByGedung).length ? labByGedung : fallbackLabByGedung;

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
        <form onSubmit={handleSubmit}>
         {step === 1 && (
          <>
    <FormSection title="Data Peminjam" icon="👤">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Nama Ketua Kegiatan</label>
          <input type="text" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>NIM</label>
          <input type="text" value={form.nim} onChange={(e) => setForm({ ...form, nim: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Program Studi</label>
          <input type="text" value={form.prodi} onChange={(e) => setForm({ ...form, prodi: e.target.value })} className={inputClass} />
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
          <input type="text" value={form.namaKegiatan} onChange={(e) => setForm({ ...form, namaKegiatan: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Dosen Pembimbing</label>
          <input type="text" value={form.dosenPembimbing} onChange={(e) => setForm({ ...form, dosenPembimbing: e.target.value })} className={inputClass} />
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
          <label className={labelClass}>Tanggal Mulai</label>
          <input type="date" value={form.tanggalMulai} onChange={(e) => setForm({ ...form, tanggalMulai: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Tanggal Selesai</label>
          <input type="date" value={form.tanggalSelesai} onChange={(e) => setForm({ ...form, tanggalSelesai: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Jam Mulai</label>
          <input type="time" value={form.jamMulai} onChange={(e) => setForm({ ...form, jamMulai: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Jam Selesai</label>
          <input type="time" value={form.jamSelesai} onChange={(e) => setForm({ ...form, jamSelesai: e.target.value })} className={inputClass} />
        </div>
      </div>
    </FormSection>

    <FormSection title="Laboratorium" icon="🧪">
      {labFromApi ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
          <p className="text-sm text-emerald-700">Laboratorium dipilih:</p>
          <p className="font-bold text-emerald-900">{labFromApi.kode} — {labFromApi.nama}</p>
          <p className="text-sm text-emerald-600">{labFromApi.gedungNama}</p>
        </div>
      ) : (
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Gedung</label>
          <select
            className={selectClass}
            value={form.gedung}
            onChange={(e) => setForm({ ...form, gedung: e.target.value, laboratorium: "" })}
          >
            <option value="">Pilih Gedung</option>
            {gedungList.map((g) => (
              <option key={g.id} value={g.slug}>{g.nama}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Laboratorium</label>
          <select
            className={selectClass}
            disabled={!form.gedung}
            value={form.laboratorium}
            onChange={(e) => setForm({ ...form, laboratorium: e.target.value })}
          >
            <option value="">{form.gedung ? "Pilih Laboratorium" : "Pilih Gedung Terlebih Dahulu"}</option>
            {labList.map((lab) => (
              <option key={lab.id} value={lab.nama}>{lab.kode} — {lab.nama}</option>
            ))}
          </select>
        </div>
      </div>
      )}
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
      disabled={submitting}
      className="
        px-8 py-3
        rounded-xl
        bg-gradient-to-r
        from-green-600
        to-emerald-600
        text-white
        hover:scale-105
        transition
        disabled:opacity-50
      "
    >
      {submitting ? "Mengirim..." : "Ajukan Peminjaman"}
    </button>

  )}

</div>

        </form>
      </ContentCard>
    </PageShell>
  );
}

export default FormPeminjamanLab;