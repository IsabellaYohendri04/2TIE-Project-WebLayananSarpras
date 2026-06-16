import api from "./authService";

export const getPeminjamanBarang = (params) =>
  api.get("/peminjaman/barang", { params }).then((r) => r.data);
export const getPeminjamanBarangById = (id) =>
  api.get(`/peminjaman/barang/${id}`).then((r) => r.data);
export const createPeminjamanBarang = (data) =>
  api.post("/peminjaman/barang", data).then((r) => r.data);
export const updatePeminjamanBarang = (id, data) =>
  api.put(`/peminjaman/barang/${id}`, data).then((r) => r.data);
export const deletePeminjamanBarang = (id) =>
  api.delete(`/peminjaman/barang/${id}`).then((r) => r.data);

export const getPeminjamanRuangan = (params) =>
  api.get("/peminjaman/ruangan", { params }).then((r) => r.data);
export const createPeminjamanRuangan = (data) =>
  api.post("/peminjaman/ruangan", data).then((r) => r.data);
export const updatePeminjamanRuangan = (id, data) =>
  api.put(`/peminjaman/ruangan/${id}`, data).then((r) => r.data);
export const deletePeminjamanRuangan = (id) =>
  api.delete(`/peminjaman/ruangan/${id}`).then((r) => r.data);

export const getPeminjamanLaboratorium = (params) =>
  api.get("/peminjaman/laboratorium", { params }).then((r) => r.data);
export const createPeminjamanLaboratorium = (data) =>
  api.post("/peminjaman/laboratorium", data).then((r) => r.data);
export const updatePeminjamanLaboratorium = (id, data) =>
  api.put(`/peminjaman/laboratorium/${id}`, data).then((r) => r.data);
export const deletePeminjamanLaboratorium = (id) =>
  api.delete(`/peminjaman/laboratorium/${id}`).then((r) => r.data);

export const getRiwayatPeminjaman = () =>
  api.get("/peminjaman/riwayat").then((r) => r.data);

export const getLaporanKondisiPending = () =>
  api.get("/peminjaman/laporan-kondisi").then((r) => r.data);

export const submitLaporanKondisi = (data) =>
  api.post("/peminjaman/laporan-kondisi", data).then((r) => r.data);

export const getAllPeminjamanJanitor = async () => {
  const [barang, ruangan, lab] = await Promise.all([
    getPeminjamanBarang(),
    getPeminjamanRuangan(),
    getPeminjamanLaboratorium(),
  ]);
  return [
    ...barang.map((i) => ({ ...i, tipe: "barang" })),
    ...ruangan.map((i) => ({ ...i, tipe: "ruangan" })),
    ...lab.map((i) => ({ ...i, tipe: "laboratorium" })),
  ];
};
