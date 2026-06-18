/** Data fallback jika API belum tersedia */

const GEDUNG = [
  { id: 1, slug: "gedung-utama", nama: "Gedung Utama", icon: "🏛️", deskripsi: "Gedung pusat kegiatan akademik", lantai: 3 },
  { id: 2, slug: "gedung-serba-guna", nama: "Gedung Serba Guna", icon: "🏟️", deskripsi: "Event, seminar & kegiatan kampus", lantai: 3 },
  { id: 3, slug: "gedung-olahraga", nama: "Gedung Olahraga", icon: "🏀", deskripsi: "Fasilitas olahraga indoor & outdoor", lantai: 1 },
  { id: 4, slug: "workshop-listrik", nama: "Workshop Listrik", icon: "⚡", deskripsi: "Praktikum teknik elektro", lantai: 2 },
  { id: 5, slug: "workshop-mesin", nama: "Workshop Mesin", icon: "🔧", deskripsi: "Praktikum teknik mesin", lantai: 2 },
  { id: 6, slug: "dormitori", nama: "Dormitori", icon: "🏠", deskripsi: "Asrama mahasiswa", lantai: 3 },
];

function makeKelas(gedungId, slug, lantai, from, to) {
  const rooms = [];
  for (let n = from; n <= to; n++) {
    const kode = String(n);
    rooms.push({
      id: `${slug}-k${kode}`,
      gedungId,
      gedungSlug: slug,
      gedungNama: GEDUNG.find((g) => g.slug === slug)?.nama,
      kode,
      nama: `Ruang Kelas ${kode}`,
      tipe: "kelas",
      lantai,
      kapasitas: 40,
      fasilitas: ["Proyektor", "AC", "Whiteboard"],
      status: n % 7 === 0 ? "terbatas" : n % 11 === 0 ? "penuh" : "tersedia",
    });
  }
  return rooms;
}

function makeLabs(gedungId, slug, lantai, names) {
  return names.map((nama, i) => ({
    id: `${slug}-lab-${lantai}-${i + 1}`,
    gedungId,
    gedungSlug: slug,
    gedungNama: GEDUNG.find((g) => g.slug === slug)?.nama,
    kode: `L${lantai}0${i + 1}`,
    nama,
    lantai,
    kapasitas: 30,
    fasilitas: ["Meja Lab", "AC", "Alat Praktikum"],
    status: i % 4 === 0 ? "terbatas" : "tersedia",
  }));
}

function makeKamar(gedungId, slug, lantai, from, to) {
  const rooms = [];
  for (let n = from; n <= to; n++) {
    const kode = `D${lantai}${String(n).padStart(2, "0")}`;
    rooms.push({
      id: `${slug}-${kode}`,
      gedungId,
      gedungSlug: slug,
      gedungNama: "Dormitori",
      kode,
      nama: `Kamar ${kode}`,
      tipe: "kamar",
      lantai,
      kapasitas: 4,
      fasilitas: ["Kasur", "Lemari", "Kamar Mandi Dalam"],
      status: n % 9 === 0 ? "penuh" : "tersedia",
    });
  }
  return rooms;
}

export const MOCK_GEDUNG = GEDUNG;

export const MOCK_RUANGAN = [
  ...makeKelas(1, "gedung-utama", 1, 130, 150),
  ...makeKelas(1, "gedung-utama", 2, 210, 240),
  ...makeKelas(2, "gedung-serba-guna", 1, 130, 150),
  ...makeKelas(2, "gedung-serba-guna", 2, 210, 240),
  ...makeKelas(4, "workshop-listrik", 1, 101, 110),
  ...makeKelas(5, "workshop-mesin", 1, 101, 110),
  ...makeKamar(6, "dormitori", 1, 1, 12),
  ...makeKamar(6, "dormitori", 2, 1, 12),
  ...makeKamar(6, "dormitori", 3, 1, 12),
];

export const MOCK_LABORATORIUM = [
  ...makeLabs(1, "gedung-utama", 3, [
    "Lab Komputer",
    "Lab Kimia",
    "Lab Fisika",
    "Lab Microbiology",
    "Lab Bahasa",
  ]),
  ...makeLabs(2, "gedung-serba-guna", 3, [
    "Lab Multimedia",
    "Lab Desain",
    "Lab Prototyping",
    "Lab IoT",
  ]),
  ...makeLabs(4, "workshop-listrik", 2, [
    "Lab Elektronika",
    "Lab PLC",
    "Lab Instrumentasi",
  ]),
  ...makeLabs(5, "workshop-mesin", 2, [
    "Lab CNC",
    "Lab Las",
    "Lab Metrologi",
  ]),
];

export function filterMockRuangan(params = {}) {
  let list = [...MOCK_RUANGAN];
  if (params.gedung) list = list.filter((r) => r.gedungSlug === params.gedung);
  if (params.tipe) list = list.filter((r) => r.tipe === params.tipe);
  if (params.lantai) list = list.filter((r) => r.lantai === Number(params.lantai));
  return list;
}

export function filterMockLaboratorium(params = {}) {
  let list = [...MOCK_LABORATORIUM];
  if (params.gedung) list = list.filter((l) => l.gedungSlug === params.gedung);
  if (params.lantai) list = list.filter((l) => l.lantai === Number(params.lantai));
  return list;
}

export function getMockRuanganById(id) {
  return MOCK_RUANGAN.find((r) => String(r.id) === String(id)) || null;
}

export function getMockLaboratoriumById(id) {
  return MOCK_LABORATORIUM.find((l) => String(l.id) === String(id)) || null;
}
