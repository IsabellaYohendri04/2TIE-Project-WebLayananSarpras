import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getRuangan } from "../../services/fasilitasService";
import { createPeminjamanRuangan } from "../../services/peminjamanService";
import { usePeminjamanBase } from "../../hooks/usePeminjamanBase";
import {
  PageShell,
  PageHeader,
  ContentCard,
  inputClass,
  labelClass,
} from "./components/PeminjamLayout";
import { StepWizard, FloorPicker } from "./components/StepWizard";

const STEPS = [
  { id: 1, label: "Peminjam", icon: "👤" },
  { id: 2, label: "Pilih Kamar", icon: "🛏️" },
  { id: 3, label: "Jadwal", icon: "📅" },
  { id: 4, label: "Konfirmasi", icon: "✅" },
];

export default function FormPeminjamanDormitori() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { base } = usePeminjamanBase();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [kamarList, setKamarList] = useState([]);
  const [selectedLantai, setSelectedLantai] = useState(null);
  const [selectedKamar, setSelectedKamar] = useState([]);
  const [form, setForm] = useState({
    nama: user?.nama || "",
    nim: user?.nim || "",
    prodi: user?.prodi || "",
    noHp: user?.no_hp || "",
    keperluan: "",
    tanggalMulai: "",
    tanggalSelesai: "",
    pernyataan: false,
  });

  useEffect(() => {
    getRuangan({ gedung: "dormitori", tipe: "kamar" })
      .then(setKamarList)
      .catch(console.error);
  }, []);

  const lantaiAvailable = [...new Set(kamarList.map((k) => k.lantai))].sort();
  const kamarFiltered = selectedLantai
    ? kamarList.filter((k) => k.lantai === selectedLantai)
    : [];

  const toggleKamar = (id) => {
    setSelectedKamar((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectedLabels = kamarList.filter((k) => selectedKamar.includes(k.id));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedKamar.length || !form.pernyataan) return;
    setSubmitting(true);
    try {
      const kamarNames = selectedLabels.map((k) => k.kode).join(", ");
      await createPeminjamanRuangan({
        nama: form.nama,
        nim: form.nim,
        prodi: form.prodi,
        ruangan: `Kamar ${kamarNames} (Dormitori)`,
        kategori: "Dormitori",
        tanggalPinjam: form.tanggalMulai,
        tanggalKembali: form.tanggalSelesai || form.tanggalMulai,
        organisasi: form.prodi,
        detail: {
          kamarIds: selectedKamar,
          kamar: selectedLabels.map((k) => ({ id: k.id, kode: k.kode, lantai: k.lantai })),
          keperluan: form.keperluan,
          noHp: form.noHp,
          gedung: "Dormitori",
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
        <ContentCard className="max-w-xl mx-auto text-center py-20 border-0 shadow-2xl bg-gradient-to-br from-white to-violet-50">
          <div className="text-6xl mb-4">🏠</div>
          <h2 className="text-2xl font-bold mb-2">Pengajuan Dormitori Berhasil!</h2>
          <p className="text-gray-500 mb-2">{selectedLabels.length} kamar dipilih</p>
          <p className="text-sm text-violet-600 mb-6">Pengajuan langsung masuk ke dashboard Janitor.</p>
          <button onClick={() => navigate(`${base}/riwayat-peminjaman`)} className="px-6 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition">Riwayat</button>
        </ContentCard>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader title="Peminjaman Dormitori" subtitle="Pinjam beberapa kamar asrama sesuai kebutuhan" badge="🏠 Multi Kamar" />
      <ContentCard className="border-0 shadow-xl">
        <StepWizard steps={STEPS} currentStep={step} />
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className={labelClass}>Nama</label><input required className={inputClass} value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} /></div>
              <div><label className={labelClass}>NIM</label><input required className={inputClass} value={form.nim} onChange={(e) => setForm({ ...form, nim: e.target.value })} /></div>
              <div><label className={labelClass}>Prodi</label><input className={inputClass} value={form.prodi} onChange={(e) => setForm({ ...form, prodi: e.target.value })} /></div>
              <div><label className={labelClass}>No HP</label><input className={inputClass} value={form.noHp} onChange={(e) => setForm({ ...form, noHp: e.target.value })} /></div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-6">
              <FloorPicker floors={lantaiAvailable.length ? lantaiAvailable : [1, 2, 3]} selected={selectedLantai} onSelect={setSelectedLantai} />
              {selectedLantai && (
                <div>
                  <p className="text-sm font-bold text-gray-500 mb-3">Pilih kamar (bisa lebih dari satu)</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {kamarFiltered.map((k) => {
                      const sel = selectedKamar.includes(k.id);
                      return (
                        <button
                          key={k.id}
                          type="button"
                          disabled={k.status === "penuh"}
                          onClick={() => toggleKamar(k.id)}
                          className={`py-4 rounded-xl border-2 font-bold transition-all ${
                            sel ? "border-violet-500 bg-violet-100 text-violet-800 scale-105" : "border-slate-200 hover:border-violet-300"
                          } ${k.status === "penuh" ? "opacity-40" : ""}`}
                        >
                          {k.kode}
                        </button>
                      );
                    })}
                  </div>
                  {selectedKamar.length > 0 && (
                    <p className="mt-4 text-sm text-violet-600 font-medium">{selectedKamar.length} kamar dipilih</p>
                  )}
                </div>
              )}
            </div>
          )}
          {step === 3 && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2"><label className={labelClass}>Keperluan</label><textarea rows={3} className={inputClass} value={form.keperluan} onChange={(e) => setForm({ ...form, keperluan: e.target.value })} /></div>
              <div><label className={labelClass}>Tanggal Mulai</label><input required type="date" className={inputClass} value={form.tanggalMulai} onChange={(e) => setForm({ ...form, tanggalMulai: e.target.value })} /></div>
              <div><label className={labelClass}>Tanggal Selesai</label><input type="date" className={inputClass} value={form.tanggalSelesai} onChange={(e) => setForm({ ...form, tanggalSelesai: e.target.value })} /></div>
            </div>
          )}
          {step === 4 && (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-2xl p-5">
                <p className="font-bold mb-2">Kamar dipilih:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedLabels.map((k) => (
                    <span key={k.id} className="px-3 py-1 bg-violet-100 text-violet-800 rounded-full text-sm font-medium">{k.kode}</span>
                  ))}
                </div>
              </div>
              <label className="flex gap-3 cursor-pointer">
                <input type="checkbox" checked={form.pernyataan} onChange={(e) => setForm({ ...form, pernyataan: e.target.checked })} />
                <span className="text-sm">Saya bertanggung jawab atas kebersihan kamar yang dipinjam.</span>
              </label>
            </div>
          )}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button type="button" onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)} className="px-6 py-3 bg-slate-100 rounded-xl">← Kembali</button>
            {step < 4 ? (
              <button type="button" onClick={() => setStep(step + 1)} disabled={step === 2 && !selectedKamar.length} className="px-8 py-3 bg-violet-600 text-white rounded-xl disabled:opacity-50">Lanjut →</button>
            ) : (
              <button type="submit" disabled={submitting || !form.pernyataan} className="px-8 py-3 bg-emerald-600 text-white rounded-xl disabled:opacity-50">{submitting ? "..." : "Ajukan"}</button>
            )}
          </div>
        </form>
      </ContentCard>
    </PageShell>
  );
}
