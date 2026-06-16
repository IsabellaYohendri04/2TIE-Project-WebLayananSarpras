import api from "../../../services/authService";

export const getPegawai = (params = {}) =>
  api.get("/pegawai", { params }).then((res) => res.data);

export const getPegawaiById = (id) =>
  api.get(`/pegawai/${id}`).then((res) => res.data);

export const createPegawai = (data) =>
  api.post("/pegawai", data).then((res) => res.data);

export const updatePegawai = (id, data) =>
  api.put(`/pegawai/${id}`, data).then((res) => res.data);

export const deletePegawai = (id) =>
  api.delete(`/pegawai/${id}`).then((res) => res.data);
