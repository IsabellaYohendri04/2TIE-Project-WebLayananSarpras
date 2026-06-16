import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
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
  const tanggalKalender = searchParams.get("date");

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
    <PageShell>
      <PageHeader
        title="Form Peminjaman Barang"
        subtitle="Isi data pengajuan peminjaman fasilitas kampus"
        badge={tanggalKalender ? `Tanggal: ${tanggalKalender}` : null}
      />

      <ContentCard>
        <form onSubmit={(e) => e.preventDefault()}>
          <FormSection title="Data Peminjam" icon="👤">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Nama Peminjam</label>
                <input type="text" placeholder="Nama lengkap" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>NIM</label>
                <input type="text" placeholder="Contoh: 233510101" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Program Studi</label>
                <input type="text" placeholder="Contoh: Teknik Informatika" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Nomor HP</label>
                <input type="text" placeholder="08xxxxxxxxxx" className={inputClass} />
              </div>
            </div>
          </FormSection>

          <FormSection title="Organisasi / Himpunan" icon="🏛️">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Organisasi</label>
                <select className={selectClass} defaultValue="">
                  <option value="" disabled>Pilih Organisasi</option>
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
              </div>
              <div>
                <label className={labelClass}>Nama Penanggung Jawab</label>
                <input type="text" placeholder="Nama penanggung jawab" className={inputClass} />
              </div>
            </div>
          </FormSection>

          <FormSection title="Informasi Kegiatan" icon="📋">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Nama Kegiatan</label>
                <input type="text" placeholder="Nama kegiatan" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Sifat Kegiatan</label>
                <input type="text" placeholder="Contoh: Seminar, Workshop" className={inputClass} />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Keperluan</label>
                <textarea rows="4" placeholder="Jelaskan keperluan peminjaman" className={inputClass} />
              </div>
            </div>
          </FormSection>

          <FormSection title="Proposal Kegiatan" icon="📄">
            <div className="bg-violet-50 border-2 border-dashed border-violet-300 rounded-2xl p-6">
              <label className={labelClass}>Upload Proposal (PDF)</label>
              <input type="file" accept=".pdf" className={`${inputClass} bg-white`} />
              <p className="text-sm text-gray-500 mt-2">Format PDF, maksimal 10 MB</p>
            </div>
          </FormSection>

          <FormSection title="Jadwal Peminjaman" icon="📅">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Tanggal Pinjam</label>
                <input
                  type="date"
                  value={tanggalKalender || ""}
                  readOnly
                  className={`${inputClass} bg-slate-100 cursor-not-allowed`}
                />
              </div>
              <div>
                <label className={labelClass}>Tanggal Kembali</label>
                <input type="date" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Jam Mulai</label>
                <input type="time" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Jam Selesai</label>
                <input type="time" className={inputClass} />
              </div>
            </div>
          </FormSection>

          <FormSection title="Lokasi Penggunaan" icon="📍">
            <input
              type="text"
              placeholder="Contoh: GOR, Aula, Ruang Seminar"
              className={inputClass}
            />
          </FormSection>

          <FormSection title="Daftar Barang yang Dipinjam" icon="📦">
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
                    <th className="p-4 text-left font-semibold">Barang</th>
                    <th className="p-4 text-center font-semibold w-32">Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  {barangList.map((barang, index) => (
                    <tr key={index} className="border-b border-slate-100 hover:bg-violet-50/40">
                      <td className="p-4">{barang}</td>
                      <td className="p-4 text-center">
                        <input
                          type="number"
                          min="0"
                          defaultValue="0"
                          className="border border-slate-200 rounded-lg p-2 w-20 text-center focus:ring-2 focus:ring-violet-500/40 focus:outline-none"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FormSection>

          <FormSection title="Catatan Tambahan" icon="💬">
            <textarea
              rows="4"
              className={inputClass}
              placeholder="Tuliskan kebutuhan tambahan jika ada"
            />
          </FormSection>

          <FormActions
            onCancel={() => navigate("/peminjam")}
            submitLabel="Ajukan Peminjaman"
            submitColor="violet"
          />
        </form>
      </ContentCard>
    </PageShell>
  );
}

export default FormPeminjamanBarang;
