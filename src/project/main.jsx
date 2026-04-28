import React from "react";
import ReactDOM from "react-dom/client";

// Import dashboard utama dari template
import MainDashboard from "../components/dashboard/main-dashboard";

// Import CSS (kalau ada styling dari template)
import "./tailwind.css";

function App() {
  return (
    <React.StrictMode>
      <MainDashboard />
    </React.StrictMode>
  );
}

// Render ke root HTML (Vite default: index.html di /public)
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
