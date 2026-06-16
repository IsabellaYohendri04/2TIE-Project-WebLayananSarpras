import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getRuanganById } from "../../services/fasilitasService";
import { createPeminjamanRuangan } from "../../services/peminjamanService";
import { usePeminjamanBase } from "../../hooks/usePeminjamanBase";
import {
  PageShell,
  PageHeader,
  ContentCard,
  FormActions,
  inputClass,
  selectClass,
  labelClass,
} from "./components/PeminjamLayout";

const GEDUNG_DATA = {
  "gedung-utama": {
    id: "gedung-utama",
    nama: "Gedung Utama",
    icon: "🏛️",
    deskripsi: "Gedung pusat kegiatan akademik & seminar",
    lantai: 4,
    ruangan: [
      {
        id: "ruang-seminar",
        nama: "Ruang Seminar",
        lantai: 2,
        kapasitas: 200,
        fasilitas: ["Proyektor", "AC", "Sound System", "Panggung"],
        status: "tersedia",
      },
      {
        id: "ruang-rapat",
        nama: "Ruang Rapat",
        lantai: 3,
        kapasitas: 30,
        fasilitas: ["TV", "AC", "Whiteboard"],
        status: "tersedia",
      },
      {
        id: "aula-utama",
        nama: "Aula Utama",
        lantai: 1,
        kapasitas: 350,
        fasilitas: ["Proyektor", "AC", "Sound System", "Panggung", "WiFi"],
        status: "terbatas",
      },
      {
        id: "kelas-a101",
        nama: "Ruang Kelas A101",
        lantai: 1,
        kapasitas: 40,
        fasilitas: ["Proyektor", "AC", "Whiteboard"],
        status: "tersedia",
      },
      {
        id: "kelas-a102",
        nama: "Ruang Kelas A102",
        lantai: 1,
        kapasitas: 40,
        fasilitas: ["Proyektor", "AC", "Whiteboard"],
        status: "penuh",
      },
    ],
  },
  gsg: {
    id: "gsg",
    nama: "GSG",
    icon: "🏟️",
    deskripsi: "Gedung Serba Guna — event & olahraga",
    lantai: 2,
    ruangan: [
      {
        id: "hall-gsg",
        nama: "Hall Utama GSG",
        lantai: 1,
        kapasitas: 500,
        fasilitas: ["Sound System", "Panggung", "Lighting", "AC"],
        status: "tersedia",
      },
      {
        id: "ruang-rapat-gsg",
        nama: "Ruang Rapat GSG",
        lantai: 2,
        kapasitas: 25,
        fasilitas: ["TV", "AC", "Whiteboard"],
        status: "tersedia",
      },
      {
        id: "gor-mini",
        nama: "GOR Mini",
        lantai: 1,
        kapasitas: 150,
        fasilitas: ["Sound System", "Scoreboard"],
        status: "terbatas",
      },
    ],
  },
  workshop: {
    id: "workshop",
    nama: "Workshop",
    icon: "🔧",
    deskripsi: "Area praktikum teknik & laboratorium praktik",
    lantai: 2,
    ruangan: [
      {
        id: "ws-mesin",
        nama: "Workshop Mesin",
        lantai: 1,
        kapasitas: 35,
        fasilitas: ["Mesin CNC", "AC", "Alat Keselamatan"],
        status: "tersedia",
      },
      {
        id: "ws-elektro",
        nama: "Workshop Elektro",
        lantai: 1,
        kapasitas: 30,
        fasilitas: ["Oscilloscope", "AC", "Meja Praktikum"],
        status: "tersedia",
      },
      {
        id: "ws-multimedia",
        nama: "Workshop Multimedia",
        lantai: 2,
        kapasitas: 28,
        fasilitas: ["PC Editing", "Proyektor", "AC"],
        status: "penuh",
      },
    ],
  },
};

const ORGANISASI_LIST = [
  "HIMA Teknik Informatika",
  "HIMA Teknik Elektro",
  "HIMA Teknik Mesin",
  "HIMA Akuntansi",
  "BEM Politeknik Caltex Riau",
  "ITSA",
  "UKM",
  "Dosen",
  "Unit Kerja PCR",
  "Lainnya",
];

const JENIS_KEGIATAN = ["Seminar", "Workshop", "Pelatihan", "Rapat", "Lomba", "Sosialisasi", "Ujian"];

const FASILITAS_TAMBAHAN = [
  "Sound System Ekstra",
  "Kursi Tambahan",
  "Meja Registrasi",
  "Backdrop",
  "Operator AV",
];

const STEPS = [
  { id: 1, label: "Data Peminjam", icon: "👤" },
  { id: 2, label: "Kegiatan", icon: "📋" },
  { id: 3, label: "Ruangan", icon: "🏢" },
  { id: 4, label: "Konfirmasi", icon: "✅" },
];

const statusConfig = {
  tersedia: { label: "Tersedia", cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  terbatas: { label: "Terbatas", cls: "bg-amber-100 text-amber-700 border-amber-200" },
  penuh: { label: "Penuh", cls: "bg-red-100 text-red-700 border-red-200" },
};

function StepIndicator({ currentStep }) {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200 -z-0" />
        <div
          className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 -z-0 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        />
        {STEPS.map((step) => {
          const active = currentStep === step.id;
          const done = currentStep > step.id;
          return (
            <div key={step.id} className="flex flex-col items-center z-10 flex-1">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                  active
                    ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-110"
                    : done
                      ? "bg-emerald-500 text-white"
                      : "bg-white border-2 border-slate-200 text-slate-400"
                }`}
              >
                {done ? "✓" : step.icon}
              </div>
              <span
                className={`text-xs mt-2 font-medium hidden sm:block ${
                  active ? "text-blue-600" : done ? "text-emerald-600" : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FormPeminjamanRuangan() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { base } = usePeminjamanBase();
  const tanggalKalender = searchParams.get("date");
  const ruanganIdParam = searchParams.get("ruanganId");
  const gedungParam = searchParams.get("gedung");

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [proposalName, setProposalName] = useState("");
  const [ruanganFromApi, setRuanganFromApi] = useState(null);

  const [form, setForm] = useState({
    nama: user?.nama || "",
    nim: user?.nim || "",
    prodi: user?.prodi || "",
    noHp: user?.no_hp || "",
    email: user?.email || "",
    organisasi: "",
    penanggungJawab: "",
    namaKegiatan: "",
    jenisKegiatan: "",
    jumlahPeserta: "",
    deskripsi: "",
    tanggalMulai: tanggalKalender || "",
    tanggalSelesai: "",
    jamMulai: "",
    jamSelesai: "",
    gedungId: gedungParam || "",
    ruanganId: ruanganIdParam || "",
    fasilitasTambahan: [],
    pernyataan: false,
  });

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        nama: prev.nama || user.nama || "",
        nim: prev.nim || user.nim || "",
        prodi: prev.prodi || user.prodi || "",
        noHp: prev.noHp || user.no_hp || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    if (ruanganIdParam) {
      getRuanganById(ruanganIdParam)
        .then((data) => {
          setRuanganFromApi(data);
          setForm((prev) => ({
            ...prev,
            gedungId: data.gedungSlug,
            ruanganId: String(data.id),
          }));
        })
        .catch(console.error);
    }
  }, [ruanganIdParam]);

  const gedungTerpilih = form.gedungId ? GEDUNG_DATA[form.gedungId] : null;

  const ruanganList = useMemo(() => {
    if (ruanganFromApi && ruanganIdParam) return [ruanganFromApi];
    return gedungTerpilih?.ruangan ?? [];
  }, [gedungTerpilih, ruanganFromApi, ruanganIdParam]);

  const ruanganTerpilih = useMemo(() => {
    if (ruanganFromApi) return ruanganFromApi;
    return ruanganList.find((r) => r.id === form.ruanganId || String(r.id) === form.ruanganId) ?? null;
  }, [ruanganList, form.ruanganId, ruanganFromApi]);

  const kapasitasWarning = useMemo(() => {
    if (!ruanganTerpilih || !form.jumlahPeserta) return null;
    const peserta = Number(form.jumlahPeserta);
    if (peserta > ruanganTerpilih.kapasitas) {
      return `Jumlah peserta (${peserta}) melebihi kapasitas ruangan (${ruanganTerpilih.kapasitas} orang).`;
    }
    if (peserta > ruanganTerpilih.kapasitas * 0.9) {
      return `Kapasitas hampir penuh — sisa ${ruanganTerpilih.kapasitas - peserta} kursi.`;
    }
    return null;
  }, [ruanganTerpilih, form.jumlahPeserta]);

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleGedungChange = (gedungId) => {
    setForm((prev) => ({
      ...prev,
      gedungId,
      ruanganId: "",
    }));
    setErrors((prev) => ({ ...prev, gedungId: "", ruanganId: "" }));
  };

  const toggleFasilitas = (item) => {
    setForm((prev) => ({
      ...prev,
      fasilitasTambahan: prev.fasilitasTambahan.includes(item)
        ? prev.fasilitasTambahan.filter((f) => f !== item)
        : [...prev.fasilitasTambahan, item],
    }));
  };

  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!form.nama.trim()) newErrors.nama = "Nama wajib diisi";
      if (!form.nim.trim()) newErrors.nim = "NIM wajib diisi";
      if (!form.prodi.trim()) newErrors.prodi = "Program studi wajib diisi";
      if (!form.noHp.trim()) newErrors.noHp = "Nomor HP wajib diisi";
      if (!form.organisasi) newErrors.organisasi = "Pilih organisasi";
      if (!form.penanggungJawab.trim()) newErrors.penanggungJawab = "Penanggung jawab wajib diisi";
    }

    if (currentStep === 2) {
      if (!form.namaKegiatan.trim()) newErrors.namaKegiatan = "Nama kegiatan wajib diisi";
      if (!form.jenisKegiatan) newErrors.jenisKegiatan = "Pilih jenis kegiatan";
      if (!form.jumlahPeserta || Number(form.jumlahPeserta) < 1) {
        newErrors.jumlahPeserta = "Jumlah peserta minimal 1";
      }
      if (!form.deskripsi.trim()) newErrors.deskripsi = "Deskripsi wajib diisi";
      if (!form.tanggalMulai) newErrors.tanggalMulai = "Tanggal mulai wajib diisi";
      if (!form.tanggalSelesai) newErrors.tanggalSelesai = "Tanggal selesai wajib diisi";
      if (form.tanggalSelesai && form.tanggalMulai && form.tanggalSelesai < form.tanggalMulai) {
        newErrors.tanggalSelesai = "Tanggal selesai tidak boleh sebelum tanggal mulai";
      }
      if (!form.jamMulai) newErrors.jamMulai = "Jam mulai wajib diisi";
      if (!form.jamSelesai) newErrors.jamSelesai = "Jam selesai wajib diisi";
      if (form.jamSelesai && form.jamMulai && form.jamSelesai <= form.jamMulai) {
        newErrors.jamSelesai = "Jam selesai harus setelah jam mulai";
      }
    }

    if (currentStep === 3) {
      if (!ruanganFromApi && !form.gedungId) newErrors.gedungId = "Pilih gedung terlebih dahulu";
      if (!form.ruanganId && !ruanganFromApi) newErrors.ruanganId = "Pilih ruangan";
      if (ruanganTerpilih?.status === "penuh") {
        newErrors.ruanganId = "Ruangan ini sedang penuh, pilih ruangan lain";
      }
      if (!proposalName) newErrors.proposal = "Upload proposal wajib (PDF)";
    }

    if (currentStep === 4) {
      if (!form.pernyataan) newErrors.pernyataan = "Anda harus menyetujui pernyataan";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, 4));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(4)) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const ruangLabel = ruanganTerpilih?.nama || ruanganTerpilih?.kode || "Ruangan";
      await createPeminjamanRuangan({
        nama: form.nama,
        nim: form.nim,
        prodi: form.prodi,
        ruangan: `${ruangLabel} (${ruanganTerpilih?.kode || ""})`,
        kategori: ruanganTerpilih?.tipe === "kelas" ? "Kelas" : "Ruangan",
        tanggalPinjam: form.tanggalMulai,
        tanggalKembali: form.tanggalSelesai,
        jamMulai: form.jamMulai,
        jamSelesai: form.jamSelesai,
        organisasi: form.organisasi,
        detail: {
          namaKegiatan: form.namaKegiatan,
          jenisKegiatan: form.jenisKegiatan,
          jumlahPeserta: form.jumlahPeserta,
          deskripsi: form.deskripsi,
          penanggungJawab: form.penanggungJawab,
          noHp: form.noHp,
          email: form.email,
          fasilitasTambahan: form.fasilitasTambahan,
          proposal: proposalName,
          ruanganId: ruanganTerpilih?.id,
          gedung: ruanganTerpilih?.gedungNama || gedungTerpilih?.nama,
        },
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Gagal mengirim pengajuan");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <PageShell>
        <ContentCard className="max-w-2xl mx-auto text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full flex items-center justify-center text-4xl text-white mx-auto mb-6 shadow-lg shadow-emerald-500/30">
            ✓
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Pengajuan Berhasil Dikirim!</h2>
          <p className="text-gray-500 mb-2">
            Peminjaman <strong>{ruanganTerpilih?.nama}</strong> di{" "}
            <strong>{ruanganTerpilih?.gedungNama || gedungTerpilih?.nama}</strong>
          </p>
          <p className="text-gray-500 mb-8">
            {form.tanggalMulai} — {form.tanggalSelesai} · {form.jamMulai} - {form.jamSelesai}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => navigate(`${base}/riwayat-peminjaman`)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition"
            >
              Lihat Riwayat
            </button>
            <button
              onClick={() => navigate(base)}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-gray-700 rounded-xl font-medium transition"
            >
              Kembali ke Dashboard
            </button>
          </div>
        </ContentCard>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader
        title="Peminjaman Ruangan"
        subtitle="Form pengajuan peminjaman ruangan dan fasilitas kampus"
        badge={tanggalKalender ? `Tanggal: ${tanggalKalender}` : null}
      />

      <ContentCard>
        <StepIndicator currentStep={step} />

        <form onSubmit={handleSubmit}>
          {/* STEP 1 — Data Peminjam */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl text-white shadow-md">
                  👤
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Data Peminjam</h2>
                  <p className="text-sm text-gray-500">Informasi identitas dan kontak peminjam</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {[
                  { key: "nama", label: "Nama Lengkap", placeholder: "Nama lengkap", type: "text" },
                  { key: "nim", label: "NIM", placeholder: "Contoh: 233510101", type: "text" },
                  { key: "prodi", label: "Program Studi", placeholder: "Teknik Informatika", type: "text" },
                  { key: "noHp", label: "Nomor HP", placeholder: "08xxxxxxxxxx", type: "tel" },
                  { key: "email", label: "Email (opsional)", placeholder: "email@student.pcr.ac.id", type: "email" },
                ].map((field) => (
                  <div key={field.key} className={field.key === "email" ? "md:col-span-2" : ""}>
                    <label className={labelClass}>{field.label}</label>
                    <input
                      type={field.type}
                      value={form[field.key]}
                      onChange={(e) => updateForm(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className={`${inputClass} ${errors[field.key] ? "border-red-400 ring-red-200" : ""}`}
                    />
                    {errors[field.key] && (
                      <p className="text-red-500 text-xs mt-1">{errors[field.key]}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-5 pt-2">
                <div>
                  <label className={labelClass}>Organisasi / Himpunan</label>
                  <select
                    value={form.organisasi}
                    onChange={(e) => updateForm("organisasi", e.target.value)}
                    className={`${selectClass} ${errors.organisasi ? "border-red-400" : ""}`}
                  >
                    <option value="" disabled>
                      Pilih Organisasi
                    </option>
                    {ORGANISASI_LIST.map((org) => (
                      <option key={org} value={org}>
                        {org}
                      </option>
                    ))}
                  </select>
                  {errors.organisasi && (
                    <p className="text-red-500 text-xs mt-1">{errors.organisasi}</p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Penanggung Jawab</label>
                  <input
                    type="text"
                    value={form.penanggungJawab}
                    onChange={(e) => updateForm("penanggungJawab", e.target.value)}
                    placeholder="Nama penanggung jawab kegiatan"
                    className={`${inputClass} ${errors.penanggungJawab ? "border-red-400" : ""}`}
                  />
                  {errors.penanggungJawab && (
                    <p className="text-red-500 text-xs mt-1">{errors.penanggungJawab}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 — Kegiatan & Jadwal */}
          {step === 2 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-2xl text-white shadow-md">
                  📋
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Informasi Kegiatan & Jadwal</h2>
                  <p className="text-sm text-gray-500">Detail kegiatan dan waktu penggunaan ruangan</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className={labelClass}>Nama Kegiatan</label>
                  <input
                    type="text"
                    value={form.namaKegiatan}
                    onChange={(e) => updateForm("namaKegiatan", e.target.value)}
                    placeholder="Contoh: Seminar Nasional IT 2026"
                    className={`${inputClass} ${errors.namaKegiatan ? "border-red-400" : ""}`}
                  />
                  {errors.namaKegiatan && (
                    <p className="text-red-500 text-xs mt-1">{errors.namaKegiatan}</p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Jenis Kegiatan</label>
                  <select
                    value={form.jenisKegiatan}
                    onChange={(e) => updateForm("jenisKegiatan", e.target.value)}
                    className={`${selectClass} ${errors.jenisKegiatan ? "border-red-400" : ""}`}
                  >
                    <option value="" disabled>
                      Pilih jenis kegiatan
                    </option>
                    {JENIS_KEGIATAN.map((j) => (
                      <option key={j} value={j}>
                        {j}
                      </option>
                    ))}
                  </select>
                  {errors.jenisKegiatan && (
                    <p className="text-red-500 text-xs mt-1">{errors.jenisKegiatan}</p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Estimasi Jumlah Peserta</label>
                  <input
                    type="number"
                    min="1"
                    value={form.jumlahPeserta}
                    onChange={(e) => updateForm("jumlahPeserta", e.target.value)}
                    placeholder="Contoh: 50"
                    className={`${inputClass} ${errors.jumlahPeserta ? "border-red-400" : ""}`}
                  />
                  {errors.jumlahPeserta && (
                    <p className="text-red-500 text-xs mt-1">{errors.jumlahPeserta}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass}>Deskripsi Kegiatan</label>
                  <textarea
                    rows="4"
                    value={form.deskripsi}
                    onChange={(e) => updateForm("deskripsi", e.target.value)}
                    placeholder="Jelaskan tujuan, rundown, dan kebutuhan khusus kegiatan..."
                    className={`${inputClass} ${errors.deskripsi ? "border-red-400" : ""}`}
                  />
                  {errors.deskripsi && (
                    <p className="text-red-500 text-xs mt-1">{errors.deskripsi}</p>
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-[24px] p-6 border border-slate-100">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  📅 Jadwal Penggunaan
                </h3>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Tanggal Mulai</label>
                    <input
                      type="date"
                      value={form.tanggalMulai}
                      readOnly={!!tanggalKalender}
                      onChange={(e) => updateForm("tanggalMulai", e.target.value)}
                      className={`${inputClass} ${tanggalKalender ? "bg-slate-100 cursor-not-allowed" : ""} ${errors.tanggalMulai ? "border-red-400" : ""}`}
                    />
                    {tanggalKalender && (
                      <p className="text-xs text-blue-600 mt-1">✓ Dari kalender dashboard</p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>Tanggal Selesai</label>
                    <input
                      type="date"
                      value={form.tanggalSelesai}
                      min={form.tanggalMulai}
                      onChange={(e) => updateForm("tanggalSelesai", e.target.value)}
                      className={`${inputClass} ${errors.tanggalSelesai ? "border-red-400" : ""}`}
                    />
                    {errors.tanggalSelesai && (
                      <p className="text-red-500 text-xs mt-1">{errors.tanggalSelesai}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>Jam Mulai</label>
                    <input
                      type="time"
                      value={form.jamMulai}
                      onChange={(e) => updateForm("jamMulai", e.target.value)}
                      className={`${inputClass} ${errors.jamMulai ? "border-red-400" : ""}`}
                    />
                    {errors.jamMulai && (
                      <p className="text-red-500 text-xs mt-1">{errors.jamMulai}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>Jam Selesai</label>
                    <input
                      type="time"
                      value={form.jamSelesai}
                      onChange={(e) => updateForm("jamSelesai", e.target.value)}
                      className={`${inputClass} ${errors.jamSelesai ? "border-red-400" : ""}`}
                    />
                    {errors.jamSelesai && (
                      <p className="text-red-500 text-xs mt-1">{errors.jamSelesai}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 — Pilih Ruangan */}
          {step === 3 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl text-white shadow-md">
                  🏢
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Pilih Gedung & Ruangan</h2>
                  <p className="text-sm text-gray-500">
                    Ruangan ditampilkan sesuai gedung yang dipilih
                  </p>
                </div>
              </div>

              {/* Pilih Gedung — Card Grid */}
              <div>
                <label className={labelClass}>Pilih Gedung</label>
                <div className="grid sm:grid-cols-3 gap-4">
                  {Object.values(GEDUNG_DATA).map((gedung) => {
                    const selected = form.gedungId === gedung.id;
                    return (
                      <button
                        key={gedung.id}
                        type="button"
                        onClick={() => handleGedungChange(gedung.id)}
                        className={`relative text-left p-5 rounded-[24px] border-2 transition-all duration-300 group ${
                          selected
                            ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg shadow-blue-500/10 scale-[1.02]"
                            : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-md"
                        }`}
                      >
                        {selected && (
                          <span className="absolute top-3 right-3 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
                            ✓
                          </span>
                        )}
                        <span className="text-3xl block mb-2">{gedung.icon}</span>
                        <h3 className="font-bold text-gray-800">{gedung.nama}</h3>
                        <p className="text-xs text-gray-500 mt-1">{gedung.deskripsi}</p>
                        <p className="text-xs text-blue-600 font-medium mt-2">
                          {gedung.ruangan.length} ruangan · {gedung.lantai} lantai
                        </p>
                      </button>
                    );
                  })}
                </div>
                {errors.gedungId && (
                  <p className="text-red-500 text-xs mt-2">{errors.gedungId}</p>
                )}
              </div>

              {/* Ruangan — Filtered by Gedung */}
              {gedungTerpilih ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className={labelClass}>
                      Ruangan di {gedungTerpilih.nama}
                    </label>
                    <span className="text-xs text-gray-500 bg-slate-100 px-3 py-1 rounded-full">
                      {ruanganList.length} ruangan tersedia
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ruanganList.map((ruang) => {
                      const selected = form.ruanganId === ruang.id;
                      const disabled = ruang.status === "penuh";
                      const status = statusConfig[ruang.status];

                      return (
                        <button
                          key={ruang.id}
                          type="button"
                          disabled={disabled}
                          onClick={() => updateForm("ruanganId", ruang.id)}
                          className={`relative text-left p-5 rounded-[24px] border-2 transition-all duration-300 ${
                            disabled
                              ? "opacity-50 cursor-not-allowed border-slate-200 bg-slate-50"
                              : selected
                                ? "border-indigo-500 bg-gradient-to-br from-indigo-50 to-violet-50 shadow-lg shadow-indigo-500/10 ring-2 ring-indigo-500/20"
                                : "border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md cursor-pointer"
                          }`}
                        >
                          {selected && !disabled && (
                            <span className="absolute top-3 right-3 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs">
                              ✓
                            </span>
                          )}

                          <div className="flex items-start justify-between gap-2 mb-3">
                            <h4 className="font-bold text-gray-800 leading-tight">{ruang.nama}</h4>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${status.cls}`}>
                              {status.label}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                            <span>👥 {ruang.kapasitas} orang</span>
                            <span>🏢 Lt. {ruang.lantai}</span>
                          </div>

                          <div className="flex flex-wrap gap-1.5">
                            {ruang.fasilitas.slice(0, 3).map((f) => (
                              <span
                                key={f}
                                className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                              >
                                {f}
                              </span>
                            ))}
                            {ruang.fasilitas.length > 3 && (
                              <span className="text-[10px] text-indigo-600 font-medium">
                                +{ruang.fasilitas.length - 3} lainnya
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {errors.ruanganId && (
                    <p className="text-red-500 text-xs mt-2">{errors.ruanganId}</p>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-[24px] border-2 border-dashed border-slate-200">
                  <span className="text-4xl block mb-3">🏢</span>
                  <p className="text-gray-500 font-medium">Pilih gedung terlebih dahulu</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Daftar ruangan akan muncul sesuai gedung yang dipilih
                  </p>
                </div>
              )}

              {/* Preview Ruangan Terpilih */}
              {ruanganTerpilih && (
                <div className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-[24px] p-6 text-white shadow-xl">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-indigo-200 text-sm">Ruangan Dipilih</p>
                      <h3 className="text-2xl font-bold mt-1">{ruanganTerpilih.nama}</h3>
                      <p className="text-indigo-100 mt-1">
                        {gedungTerpilih.nama} · Lantai {ruanganTerpilih.lantai}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-indigo-200 text-sm">Kapasitas</p>
                      <p className="text-3xl font-bold">{ruanganTerpilih.kapasitas}</p>
                      <p className="text-indigo-200 text-xs">orang</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <p className="text-sm text-indigo-200 mb-2">Fasilitas:</p>
                    <div className="flex flex-wrap gap-2">
                      {ruanganTerpilih.fasilitas.map((f) => (
                        <span
                          key={f}
                          className="text-xs bg-white/20 backdrop-blur px-3 py-1 rounded-full"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                  {kapasitasWarning && (
                    <div className="mt-4 bg-amber-500/20 border border-amber-400/30 rounded-xl p-3 text-sm text-amber-100">
                      ⚠️ {kapasitasWarning}
                    </div>
                  )}
                </div>
              )}

              {/* Fasilitas Tambahan */}
              {ruanganTerpilih && (
                <div>
                  <label className={labelClass}>Fasilitas Tambahan (opsional)</label>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {FASILITAS_TAMBAHAN.map((item) => (
                      <label
                        key={item}
                        className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition ${
                          form.fasilitasTambahan.includes(item)
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-200 hover:border-blue-200"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={form.fasilitasTambahan.includes(item)}
                          onChange={() => toggleFasilitas(item)}
                          className="w-4 h-4 accent-blue-600"
                        />
                        <span className="text-sm text-gray-700">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Proposal */}
              <div>
                <label className={labelClass}>Proposal Kegiatan (PDF) *</label>
                <div
                  className={`relative bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed rounded-[24px] p-8 text-center transition ${
                    errors.proposal ? "border-red-400" : "border-blue-300 hover:border-blue-400"
                  }`}
                >
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      setProposalName(file?.name ?? "");
                      setErrors((prev) => ({ ...prev, proposal: "" }));
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <span className="text-4xl block mb-3">📄</span>
                  {proposalName ? (
                    <>
                      <p className="font-semibold text-blue-700">{proposalName}</p>
                      <p className="text-sm text-gray-500 mt-1">Klik untuk ganti file</p>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-gray-700">
                        Seret file atau klik untuk upload
                      </p>
                      <p className="text-sm text-gray-500 mt-1">PDF maksimal 10 MB</p>
                    </>
                  )}
                </div>
                {errors.proposal && (
                  <p className="text-red-500 text-xs mt-1">{errors.proposal}</p>
                )}
              </div>
            </div>
          )}

          {/* STEP 4 — Konfirmasi */}
          {step === 4 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-2xl text-white shadow-md">
                  ✅
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Konfirmasi Pengajuan</h2>
                  <p className="text-sm text-gray-500">Periksa kembali data sebelum mengirim</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {[
                  { title: "Peminjam", items: [
                    ["Nama", form.nama],
                    ["NIM", form.nim],
                    ["Prodi", form.prodi],
                    ["Organisasi", form.organisasi],
                    ["Penanggung Jawab", form.penanggungJawab],
                  ]},
                  { title: "Kegiatan", items: [
                    ["Nama", form.namaKegiatan],
                    ["Jenis", form.jenisKegiatan],
                    ["Peserta", `${form.jumlahPeserta} orang`],
                    ["Jadwal", `${form.tanggalMulai} — ${form.tanggalSelesai}`],
                    ["Waktu", `${form.jamMulai} - ${form.jamSelesai}`],
                  ]},
                  { title: "Ruangan", items: [
                    ["Gedung", gedungTerpilih?.nama ?? "-"],
                    ["Ruangan", ruanganTerpilih?.nama ?? "-"],
                    ["Kapasitas", ruanganTerpilih ? `${ruanganTerpilih.kapasitas} orang` : "-"],
                    ["Lantai", ruanganTerpilih ? `Lt. ${ruanganTerpilih.lantai}` : "-"],
                  ]},
                  { title: "Lampiran", items: [
                    ["Proposal", proposalName || "-"],
                    ["Fasilitas Extra", form.fasilitasTambahan.length
                      ? form.fasilitasTambahan.join(", ")
                      : "Tidak ada"],
                  ]},
                ].map((section) => (
                  <div
                    key={section.title}
                    className="bg-slate-50 rounded-[24px] p-5 border border-slate-100"
                  >
                    <h3 className="font-bold text-gray-800 mb-4 pb-2 border-b border-slate-200">
                      {section.title}
                    </h3>
                    <dl className="space-y-2">
                      {section.items.map(([key, val]) => (
                        <div key={key} className="flex justify-between gap-4 text-sm">
                          <dt className="text-gray-500 shrink-0">{key}</dt>
                          <dd className="font-medium text-gray-800 text-right">{val || "-"}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-[24px] p-5">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.pernyataan}
                    onChange={(e) => updateForm("pernyataan", e.target.checked)}
                    className="w-5 h-5 accent-amber-600 mt-0.5 shrink-0"
                  />
                  <span className="text-sm text-amber-900">
                    Saya menyatakan bahwa data yang diisi benar, bertanggung jawab atas kebersihan
                    dan keamanan ruangan selama masa peminjaman, serta akan mengembalikan ruangan
                    dalam kondisi semula.
                  </span>
                </label>
                {errors.pernyataan && (
                  <p className="text-red-500 text-xs mt-2 ml-8">{errors.pernyataan}</p>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-8 mt-8 border-t border-slate-100">
            <div>
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-gray-700 rounded-xl font-medium transition"
                >
                  ← Sebelumnya
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate(base)}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-gray-700 rounded-xl font-medium transition"
                >
                  Batal
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400 hidden sm:block">
                Langkah {step} dari {STEPS.length}
              </span>
              {step < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 transition"
                >
                  Lanjutkan →
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl font-medium shadow-lg shadow-emerald-500/25 transition"
                >
                  Ajukan Peminjaman
                </button>
              )}
            </div>
          </div>
        </form>
      </ContentCard>
    </PageShell>
  );
}

export default FormPeminjamanRuangan;
