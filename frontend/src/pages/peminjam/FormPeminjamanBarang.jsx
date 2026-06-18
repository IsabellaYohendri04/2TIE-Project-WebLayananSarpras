import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getBarangMaster } from "../../services/fasilitasService";
import { createPeminjamanBarang } from "../../services/peminjamanService";
import { usePeminjamanBase } from "../../hooks/usePeminjamanBase";
import {
  PageShell,
  PageHeader,
  ContentCard,
  FormSection,
  FormActions,
  inputClass,
  selectClass,
  labelClass,
} from "./components/PeminjamLayout";

function FormPeminjamanBarang() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { base } = usePeminjamanBase();
  const tanggalKalender = searchParams.get("date");

  const [barangList, setBarangList] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    nama: user?.nama || "",
    nim: user?.nim || "",
    prodi: user?.prodi || "",
    noHp: user?.no_hp || "",
    organisasi: "",
    barang: "",
    tanggalPinjam: tanggalKalender || "",
    tanggalKembali: "",
    keperluan: "",
  });

  useEffect(() => {
    getBarangMaster().then(setBarangList).catch(console.error);
  }, []);

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        nama: prev.nama || user.nama || "",
        nim: prev.nim || user.nim || "",
        prodi: prev.prodi || user.prodi || "",
        noHp: prev.noHp || user.no_hp || "",
      }));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.barang || !form.tanggalPinjam) {
      alert("Barang dan tanggal pinjam wajib diisi");
      return;
    }
    setSubmitting(true);
    try {
      await createPeminjamanBarang({
        nama: form.nama,
        nim: form.nim,
        prodi: form.prodi,
        barang: form.barang,
        kategori: "Barang",
        tanggalPinjam: form.tanggalPinjam,
        tanggalKembali: form.tanggalKembali || form.tanggalPinjam,
        organisasi: form.organisasi,
        detail: { keperluan: form.keperluan, noHp: form.noHp },
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
          <h2 className="text-2xl font-bold mb-4">Pengajuan Barang Berhasil!</h2>
          <button onClick={() => navigate(`${base}/riwayat-peminjaman`)} className="px-6 py-3 bg-violet-600 text-white rounded-xl mr-3">Lihat Riwayat</button>
          <button onClick={() => navigate(base)} className="px-6 py-3 bg-slate-100 rounded-xl">Dashboard</button>
        </ContentCard>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader
        title="Form Peminjaman Barang"
        subtitle="Isi data pengajuan peminjaman fasilitas kampus"
        badge={tanggalKalender ? `Tanggal: ${tanggalKalender}` : null}
      />

      <ContentCard>
        <form onSubmit={handleSubmit}>
          <FormSection title="Data Peminjam" icon="👤">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Nama Peminjam</label>
                <input required type="text" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>NIM</label>
                <input required type="text" value={form.nim} onChange={(e) => setForm({ ...form, nim: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Program Studi</label>
                <input required type="text" value={form.prodi} onChange={(e) => setForm({ ...form, prodi: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Nomor HP</label>
                <input type="text" value={form.noHp} onChange={(e) => setForm({ ...form, noHp: e.target.value })} className={inputClass} />
              </div>
            </div>
          </FormSection>

          <FormSection title="Detail Peminjaman" icon="📦">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Organisasi</label>
                <input type="text" value={form.organisasi} onChange={(e) => setForm({ ...form, organisasi: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Barang *</label>
                <select required value={form.barang} onChange={(e) => setForm({ ...form, barang: e.target.value })} className={selectClass}>
                  <option value="">Pilih Barang</option>
                  {barangList.map((b) => (
                    <option key={b.id} value={b.nama}>{b.nama} (stok: {b.stok})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Tanggal Pinjam *</label>
                <input required type="date" value={form.tanggalPinjam} onChange={(e) => setForm({ ...form, tanggalPinjam: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Tanggal Kembali</label>
                <input type="date" value={form.tanggalKembali} onChange={(e) => setForm({ ...form, tanggalKembali: e.target.value })} className={inputClass} />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Keperluan</label>
                <textarea rows={3} value={form.keperluan} onChange={(e) => setForm({ ...form, keperluan: e.target.value })} className={inputClass} />
              </div>
            </div>
          </FormSection>

          <FormActions>
            <button type="button" onClick={() => navigate(base)} className="px-6 py-3 bg-slate-100 rounded-xl">Batal</button>
            <button type="submit" disabled={submitting} className="px-6 py-3 bg-violet-600 text-white rounded-xl disabled:opacity-50">
              {submitting ? "Mengirim..." : "Ajukan Peminjaman"}
            </button>
          </FormActions>
        </form>
      </ContentCard>
    </PageShell>
  );
}

export default FormPeminjamanBarang;