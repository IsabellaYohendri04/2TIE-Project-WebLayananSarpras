import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { PageShell, PageHeader, ContentCard } from "./components/PeminjamLayout";
import { ModernCard, FloorPicker } from "./components/StepWizard";
import { getGedung, getRuangan, getLaboratorium } from "../../services/fasilitasService";
import { usePeminjamanBase } from "../../hooks/usePeminjamanBase";
import {
  MULTI_FLOOR_GEDUNG,
  DIRECT_FORM_GEDUNG,
  GEDUNG_FLOOR_CONFIG,
} from "../../config/gedungPeminjamanConfig";

const statusConfig = {
  tersedia: { label: "Tersedia", cls: "bg-emerald-100 text-emerald-700" },
  terbatas: { label: "Terbatas", cls: "bg-amber-100 text-amber-700" },
  penuh: { label: "Penuh", cls: "bg-red-100 text-red-700" },
};

function PilihRuangan() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { base } = usePeminjamanBase();

  const gedungSlug = searchParams.get("gedung") || "";
  const tipe = searchParams.get("tipe") || "";
  const lantai = searchParams.get("lantai") || "";

  const [gedungList, setGedungList] = useState([]);
  const [ruanganList, setRuanganList] = useState([]);
  const [labList, setLabList] = useState([]);
  const [loading, setLoading] = useState(true);

  const gedungTerpilih = gedungList.find((g) => g.slug === gedungSlug);
  const floorConfig = GEDUNG_FLOOR_CONFIG[gedungSlug];

  useEffect(() => {
    getGedung().then(setGedungList).catch(console.error);
  }, []);

  useEffect(() => {
    if (!gedungSlug) {
      setLoading(false);
      return;
    }
    const direct = DIRECT_FORM_GEDUNG[gedungSlug];
    if (direct === "olahraga") {
      navigate(`${base}/peminjaman-olahraga`, { replace: true });
      return;
    }
    if (direct === "dormitori") {
      navigate(`${base}/peminjaman-dormitori`, { replace: true });
      return;
    }
    setLoading(true);
    Promise.all([
      getRuangan({ gedung: gedungSlug }),
      getLaboratorium({ gedung: gedungSlug }),
    ])
      .then(([ruang, lab]) => {
        setRuanganList(ruang);
        setLabList(lab);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [gedungSlug, base, navigate]);

  const setParams = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => {
      if (v) next.set(k, String(v));
      else next.delete(k);
    });
    setSearchParams(next);
  };

  const kelasCount = ruanganList.filter((r) => r.tipe === "kelas").length;
  const labCount = labList.length;

  const handleKelas = () => {
    if (MULTI_FLOOR_GEDUNG.includes(gedungSlug) && floorConfig) {
      setParams({ tipe: "kelas", lantai: "" });
    } else {
      setParams({ tipe: "kelas", lantai: "1" });
    }
  };

  const handleLaboratorium = () => {
    navigate(`${base}/peminjaman-lab/form?gedung=${gedungSlug}`);
  };

  const filteredKelas =
    lantai
      ? ruanganList.filter((r) => r.tipe === "kelas" && r.lantai === Number(lantai))
      : [];

  const availableKelasFloors = floorConfig?.kelasFloors || [1, 2];
  const availableLabFloors = floorConfig?.labFloors || [3];

  return (
    <PageShell>
      <PageHeader
        title="Peminjaman Ruangan"
        subtitle="Pilih gedung, jenis fasilitas, lantai, lalu ruangan yang tersedia"
      />

      {/* Gedung grid */}
      {!gedungSlug && (
        <ContentCard className="bg-gradient-to-br from-white via-violet-50/30 to-indigo-50/40 border-0 shadow-xl shadow-slate-200/60">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Pilih Gedung</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {gedungList.map((g) => (
              <ModernCard
                key={g.id}
                icon={g.icon || "🏢"}
                title={g.nama}
                subtitle={g.deskripsi}
                accent="violet"
                onClick={() => setParams({ gedung: g.slug })}
              />
            ))}
          </div>
        </ContentCard>
      )}

      {/* Kelas vs Laboratorium */}
      {gedungSlug && !tipe && !DIRECT_FORM_GEDUNG[gedungSlug] && (
        <ContentCard className="border-0 shadow-xl shadow-slate-200/50">
          <button type="button" onClick={() => setSearchParams({})} className="text-sm font-medium text-violet-600 hover:text-violet-800 mb-6 flex items-center gap-1">
            ← Ganti Gedung
          </button>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {gedungTerpilih?.icon} {gedungTerpilih?.nama}
            </h2>
            <p className="text-gray-500 mt-1">Pilih jenis fasilitas yang ingin dipinjam</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <ModernCard
              icon="🎓"
              title="Kelas"
              subtitle={`Ruang kelas per lantai — ${kelasCount} ruangan tersedia`}
              badge="Form Ruangan"
              accent="blue"
              onClick={handleKelas}
            />
            <ModernCard
              icon="🧪"
              title="Laboratorium"
              subtitle={`Lab praktikum — ${labCount} lab tersedia · langsung ke form lab`}
              badge="Form Lab"
              accent="emerald"
              onClick={handleLaboratorium}
            />
          </div>
        </ContentCard>
      )}

      {/* Kelas: pilih lantai */}
      {gedungSlug && tipe === "kelas" && !lantai && (
        <ContentCard className="border-0 shadow-xl">
          <button type="button" onClick={() => setParams({ tipe: "" })} className="text-sm text-violet-600 mb-6">← Kembali</button>
          <h2 className="text-xl font-bold mb-6">Pilih Lantai — Kelas</h2>
          <FloorPicker
            floors={availableKelasFloors}
            selected={null}
            onSelect={(f) => setParams({ lantai: f })}
            label={`Lantai dengan ruang kelas (${gedungTerpilih?.nama})`}
          />
          {floorConfig?.kelasRange && (
            <p className="text-sm text-gray-500 mt-6">
              Lt.1: ruang 130–150 · Lt.2: ruang 210–240 · Lt.3: laboratorium
            </p>
          )}
        </ContentCard>
      )}

      {/* Kelas: list ruangan per lantai */}
      {gedungSlug && tipe === "kelas" && lantai && (
        <ContentCard className="border-0 shadow-xl">
          <button type="button" onClick={() => setParams({ lantai: "" })} className="text-sm text-violet-600 mb-4">← Ganti Lantai</button>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Kelas Lantai {lantai} — {gedungTerpilih?.nama}
          </h2>
          <p className="text-gray-500 mb-6">Klik ruangan untuk membuka form peminjaman</p>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
            </div>
          ) : filteredKelas.length === 0 ? (
            <p className="text-center text-gray-500 py-12">Belum ada kelas di lantai ini.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredKelas.map((ruang) => {
                const st = statusConfig[ruang.status] || statusConfig.tersedia;
                return (
                  <button
                    key={ruang.id}
                    type="button"
                    disabled={ruang.status === "penuh"}
                    onClick={() =>
                      navigate(`${base}/peminjaman-ruangan/form?ruanganId=${ruang.id}&gedung=${gedungSlug}`)
                    }
                    className={`group p-5 rounded-2xl border-2 text-left transition-all duration-300 ${
                      ruang.status === "penuh"
                        ? "opacity-40 cursor-not-allowed border-slate-100"
                        : "border-slate-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-100 bg-white hover:-translate-y-0.5"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">
                        {ruang.kode}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${st.cls}`}>{st.label}</span>
                    </div>
                    <p className="text-sm text-gray-600">{ruang.nama}</p>
                    <p className="text-xs text-gray-400 mt-2">👥 {ruang.kapasitas} orang</p>
                  </button>
                );
              })}
            </div>
          )}
        </ContentCard>
      )}
    </PageShell>
  );
}

export default PilihRuangan;
