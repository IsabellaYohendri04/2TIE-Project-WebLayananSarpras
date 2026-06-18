import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { createPeminjamanRuangan } from "../../services/peminjamanService";
import { usePeminjamanBase } from "../../hooks/usePeminjamanBase";
import {
  PageShell,
  PageHeader,
  ContentCard,
  inputClass,
  selectClass,
  labelClass,
} from "./components/PeminjamLayout";
import { StepWizard } from "./components/StepWizard";

const FASILITAS_OLAHRAGA = [
  { id: "gor", nama: "GOR / Hall Olahraga", icon: "🏟️", kapasitas: 500 },
  { id: "futsal", nama: "Lapangan Futsal", icon: "⚽", kapasitas: 20 },
  { id: "basket", nama: "Lapangan Basket", icon: "🏀", kapasitas: 30 },
  { id: "voli", nama: "Lapangan Voli", icon: "🏐", kapasitas: 24 },
  { id: "badminton", nama: "Lapangan Badminton", icon: "🏸", kapasitas: 8 },
];

const STEPS = [
  { id: 1, label: "Peminjam", icon: "👤" },
  { id: 2, label: "Fasilitas", icon: "🏀" },
  { id: 3, label: "Jadwal", icon: "📅" },
  { id: 4, label: "Konfirmasi", icon: "✅" },
];

export default function FormPeminjamanOlahraga() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { base } = usePeminjamanBase();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fasilitasId, setFasilitasId] = useState("");
  const [form, setForm] = useState({
    nama: user?.nama || "",
    nim: user?.nim || "",
    prodi: user?.prodi || "",
    noHp: user?.no_hp || "",
    organisasi: "",
    namaKegiatan: "",
    tanggalMulai: "",
    tanggalSelesai: "",
    jamMulai: "",
    jamSelesai: "",
    pernyataan: false,
  });

  const fasilitas = FASILITAS_OLAHRAGA.find((f) => f.id === fasilitasId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fasilitas || !form.pernyataan) return;
    setSubmitting(true);
    try {
      await createPeminjamanRuangan({
        nama: form.nama,
        nim: form.nim,
        prodi: form.prodi,
        ruangan: `${fasilitas.nama} (Gedung Olahraga)`,
        kategori: "Olahraga",
        tanggalPinjam: form.tanggalMulai,
        tanggalKembali: form.tanggalSelesai || form.tanggalMulai,
        jamMulai: form.jamMulai,
        jamSelesai: form.jamSelesai,
        organisasi: form.organisasi,
        detail: {
          fasilitasId,
          namaKegiatan: form.namaKegiatan,
          noHp: form.noHp,
          gedung: "Gedung Olahraga",
        },
      });
      setSubmitted(true);
    } catch (err) {
      alert(err.response?.data?.message || "Gagal mengirim");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <PageShell>
        <ContentCard className="max-w-xl mx-auto text-center py-20 border-0 shadow-2xl bg-gradient-to-br from-white to-emerald-50">
          <div className="text-6xl mb-4 animate-bounce">🏆</div>
          <h2 className="text-2xl font-bold mb-2">Pengajuan Olahraga Berhasil!</h2>
          <p className="text-gray-500 mb-6">Pengajuan langsung masuk ke dashboard Janitor untuk dipantau.</p>
          <button onClick={() => navigate(`${base}/riwayat-peminjaman`)} className="px-6 py-3 bg-violet-600 text-white rounded-xl mr-2 hover:bg-violet-700 transition">Riwayat</button>
          <button onClick={() => navigate(base)} className="px-6 py-3 bg-slate-100 rounded-xl hover:bg-slate-200 transition">Dashboard</button>
        </ContentCard>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader title="Peminjaman Gedung Olahraga" subtitle="Form step-by-step fasilitas olahraga" badge="🏀 Olahraga" />
      <ContentCard className="border-0 shadow-xl shadow-slate-200/60">
        <StepWizard steps={STEPS} currentStep={step} />
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className={labelClass}>Nama</label><input required className={inputClass} value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} /></div>
              <div><label className={labelClass}>NIM</label><input required className={inputClass} value={form.nim} onChange={(e) => setForm({ ...form, nim: e.target.value })} /></div>
              <div><label className={labelClass}>Prodi</label><input className={inputClass} value={form.prodi} onChange={(e) => setForm({ ...form, prodi: e.target.value })} /></div>
              <div><label className={labelClass}>No HP</label><input className={inputClass} value={form.noHp} onChange={(e) => setForm({ ...form, noHp: e.target.value })} /></div>
              <div className="md:col-span-2"><label className={labelClass}>Organisasi</label><input className={inputClass} value={form.organisasi} onChange={(e) => setForm({ ...form, organisasi: e.target.value })} /></div>
            </div>
          )}
          {step === 2 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {FASILITAS_OLAHRAGA.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFasilitasId(f.id)}
                  className={`p-6 rounded-2xl border-2 text-left transition-all ${
                    fasilitasId === f.id ? "border-amber-500 bg-amber-50 shadow-lg" : "border-slate-200 hover:border-amber-300"
                  }`}
                >
                  <span className="text-3xl">{f.icon}</span>
                  <p className="font-bold mt-2">{f.nama}</p>
                  <p className="text-xs text-gray-500">Kapasitas ~{f.kapasitas}</p>
                </button>
              ))}
            </div>
          )}
          {step === 3 && (
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className={labelClass}>Nama Kegiatan</label><input className={inputClass} value={form.namaKegiatan} onChange={(e) => setForm({ ...form, namaKegiatan: e.target.value })} /></div>
              <div><label className={labelClass}>Tanggal Mulai</label><input required type="date" className={inputClass} value={form.tanggalMulai} onChange={(e) => setForm({ ...form, tanggalMulai: e.target.value })} /></div>
              <div><label className={labelClass}>Tanggal Selesai</label><input type="date" className={inputClass} value={form.tanggalSelesai} onChange={(e) => setForm({ ...form, tanggalSelesai: e.target.value })} /></div>
              <div><label className={labelClass}>Jam Mulai</label><input type="time" className={inputClass} value={form.jamMulai} onChange={(e) => setForm({ ...form, jamMulai: e.target.value })} /></div>
              <div><label className={labelClass}>Jam Selesai</label><input type="time" className={inputClass} value={form.jamSelesai} onChange={(e) => setForm({ ...form, jamSelesai: e.target.value })} /></div>
            </div>
          )}
          {step === 4 && (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-2xl p-5 text-sm space-y-2">
                <p><strong>Fasilitas:</strong> {fasilitas?.nama}</p>
                <p><strong>Jadwal:</strong> {form.tanggalMulai} — {form.tanggalSelesai || form.tanggalMulai}</p>
                <p><strong>Waktu:</strong> {form.jamMulai} - {form.jamSelesai}</p>
              </div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={form.pernyataan} onChange={(e) => setForm({ ...form, pernyataan: e.target.checked })} className="mt-1" />
                <span className="text-sm text-gray-600">Saya bertanggung jawab atas keamanan dan kebersihan fasilitas olahraga.</span>
              </label>
            </div>
          )}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button type="button" onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)} className="px-6 py-3 bg-slate-100 rounded-xl font-medium">← Kembali</button>
            {step < 4 ? (
              <button type="button" onClick={() => setStep(step + 1)} className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium shadow-lg">Lanjut →</button>
            ) : (
              <button type="submit" disabled={submitting || !form.pernyataan} className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-medium disabled:opacity-50">
                {submitting ? "Mengirim..." : "Ajukan Peminjaman"}
              </button>
            )}
          </div>
        </form>
      </ContentCard>
    </PageShell>
  );
}
