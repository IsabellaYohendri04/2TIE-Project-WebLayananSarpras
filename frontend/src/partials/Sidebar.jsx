import React from "react";
import { useAuth } from "../context/AuthContext";
import SidebarPegawai from "./sidebars/SidebarPegawai";
import SidebarJanitor from "./sidebars/SidebarJanitor";
import SidebarPeminjam from "./sidebars/SidebarPeminjam";
import SidebarShell from "./SidebarShell";

function Sidebar({ homePath, ...shellProps }) {
  const { user } = useAuth();

  const renderNav = () => {
    switch (user?.role) {
      case "janitor":
        return <SidebarJanitor />;
      case "peminjam":
        return <SidebarPeminjam />;
      case "pegawai_sarpras":
      default:
        return (
          <SidebarPegawai setSidebarExpanded={shellProps.setSidebarExpanded} />
        );
    }
  };

  return (
    <SidebarShell homePath={homePath} {...shellProps}>
      {renderNav()}
    </SidebarShell>
  );
}

export default Sidebar;
