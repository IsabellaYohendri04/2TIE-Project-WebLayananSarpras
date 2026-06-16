/** Gedung dengan alur lantai (kelas lt 1-2, lab lt 3) */
export const MULTI_FLOOR_GEDUNG = [
  "gedung-utama",
  "gedung-serba-guna",
  "workshop-listrik",
  "workshop-mesin",
];

export const DIRECT_FORM_GEDUNG = {
  "gedung-olahraga": "olahraga",
  dormitori: "dormitori",
};

export const GEDUNG_FLOOR_CONFIG = {
  "gedung-utama": {
    kelasFloors: [1, 2],
    labFloors: [3],
    kelasRange: { 1: [130, 150], 2: [210, 240] },
  },
  "gedung-serba-guna": {
    kelasFloors: [1, 2],
    labFloors: [3],
    kelasRange: { 1: [130, 150], 2: [210, 240] },
  },
  "workshop-listrik": {
    kelasFloors: [1],
    labFloors: [2],
    kelasRange: { 1: [101, 110] },
  },
  "workshop-mesin": {
    kelasFloors: [1],
    labFloors: [2],
    kelasRange: { 1: [101, 110] },
  },
};
