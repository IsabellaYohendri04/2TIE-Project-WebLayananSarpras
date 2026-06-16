import api from "./authService";

export const getGedung = () => api.get("/gedung").then((r) => r.data);
export const createGedung = (data) => api.post("/gedung", data).then((r) => r.data);
export const updateGedung = (id, data) => api.put(`/gedung/${id}`, data).then((r) => r.data);
export const deleteGedung = (id) => api.delete(`/gedung/${id}`).then((r) => r.data);

export const getRuangan = (params) => api.get("/ruangan", { params }).then((r) => r.data);
export const getRuanganById = (id) => api.get(`/ruangan/${id}`).then((r) => r.data);
export const createRuangan = (data) => api.post("/ruangan", data).then((r) => r.data);
export const updateRuangan = (id, data) => api.put(`/ruangan/${id}`, data).then((r) => r.data);
export const deleteRuangan = (id) => api.delete(`/ruangan/${id}`).then((r) => r.data);

export const getLaboratorium = (params) => api.get("/laboratorium", { params }).then((r) => r.data);
export const getLaboratoriumById = (id) => api.get(`/laboratorium/${id}`).then((r) => r.data);
export const createLaboratorium = (data) => api.post("/laboratorium", data).then((r) => r.data);
export const updateLaboratorium = (id, data) => api.put(`/laboratorium/${id}`, data).then((r) => r.data);
export const deleteLaboratorium = (id) => api.delete(`/laboratorium/${id}`).then((r) => r.data);

export const getBarangMaster = () => api.get("/barang").then((r) => r.data);
export const createBarangMaster = (data) => api.post("/barang", data).then((r) => r.data);
export const updateBarangMaster = (id, data) => api.put(`/barang/${id}`, data).then((r) => r.data);
export const deleteBarangMaster = (id) => api.delete(`/barang/${id}`).then((r) => r.data);
