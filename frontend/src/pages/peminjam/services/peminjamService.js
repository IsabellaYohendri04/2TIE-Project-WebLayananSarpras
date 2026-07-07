import api from "../../../services/authService";

export const getPeminjamDashboard = () =>
  api.get("/peminjam/DashboardPeminjam").then((res) => res.data);
