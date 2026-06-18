import api from "../../../services/authService";

export const getJanitorDashboard = () =>
  api.get("/janitor/dashboard").then((res) => res.data);

export const getSarpras = (params = {}) =>
  api.get("/sarpras", { params }).then((res) => res.data);

export const getSarprasMonitoring = () =>
  api.get("/sarpras/monitoring").then((res) => res.data);

export const createSarpras = (formData) =>
  api.post("/sarpras", formData).then((res) => res.data);

export const updateSarpras = (id, formData) =>
  api.put(`/sarpras/${id}`, formData).then((res) => res.data);

export const deleteSarpras = (id) =>
  api.delete(`/sarpras/${id}`).then((res) => res.data);

export const getPeminjaman = (params = {}) =>
  api.get("/peminjaman", { params }).then((res) => res.data);

export const getLaporan = (params = {}) =>
  api.get("/laporan", { params }).then((res) => res.data);

export const updateLaporanStatus = (id, status) =>
  api.put(`/laporan/${id}`, { status }).then((res) => res.data);
