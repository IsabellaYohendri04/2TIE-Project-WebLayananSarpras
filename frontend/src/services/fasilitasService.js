import api from "./authService";
import {
  MOCK_GEDUNG,
  filterMockRuangan,
  filterMockLaboratorium,
  getMockRuanganById,
  getMockLaboratoriumById,
} from "../config/fasilitasMockData";

async function withFallback(apiCall, fallback) {
  try {
    return await apiCall();
  } catch {
    return fallback();
  }
}

export const getGedung = () =>
  withFallback(
    () => api.get("/gedung").then((r) => r.data),
    () => MOCK_GEDUNG
  );

export const createGedung = (data) => api.post("/gedung", data).then((r) => r.data);
export const updateGedung = (id, data) => api.put(`/gedung/${id}`, data).then((r) => r.data);
export const deleteGedung = (id) => api.delete(`/gedung/${id}`).then((r) => r.data);

export const getRuangan = (params) =>
  withFallback(
    () => api.get("/ruangan", { params }).then((r) => r.data),
    () => filterMockRuangan(params)
  );

export const getRuanganById = (id) =>
  withFallback(
    () => api.get(`/ruangan/${id}`).then((r) => r.data),
    () => getMockRuanganById(id)
  );

export const createRuangan = (data) => api.post("/ruangan", data).then((r) => r.data);
export const updateRuangan = (id, data) => api.put(`/ruangan/${id}`, data).then((r) => r.data);
export const deleteRuangan = (id) => api.delete(`/ruangan/${id}`).then((r) => r.data);

export const getLaboratorium = (params) =>
  withFallback(
    () => api.get("/laboratorium", { params }).then((r) => r.data),
    () => filterMockLaboratorium(params)
  );

export const getLaboratoriumById = (id) =>
  withFallback(
    () => api.get(`/laboratorium/${id}`).then((r) => r.data),
    () => getMockLaboratoriumById(id)
  );

export const createLaboratorium = (data) => api.post("/laboratorium", data).then((r) => r.data);
export const updateLaboratorium = (id, data) => api.put(`/laboratorium/${id}`, data).then((r) => r.data);
export const deleteLaboratorium = (id) => api.delete(`/laboratorium/${id}`).then((r) => r.data);

export const getBarangMaster = () => api.get("/barang").then((r) => r.data);
export const createBarangMaster = (data) => api.post("/barang", data).then((r) => r.data);
export const updateBarangMaster = (id, data) => api.put(`/barang/${id}`, data).then((r) => r.data);
export const deleteBarangMaster = (id) => api.delete(`/barang/${id}`).then((r) => r.data);
