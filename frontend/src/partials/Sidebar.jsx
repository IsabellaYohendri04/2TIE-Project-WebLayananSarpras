import React from "react";
import { useAuth } from "../context/AuthContext";
import SidebarNav from "./SidebarNav";
import SidebarShell from "./SidebarShell";

function Sidebar({ homePath, ...shellProps }) {
  return (
    <SidebarShell homePath={homePath} {...shellProps}>
      <SidebarNav setSidebarExpanded={shellProps.setSidebarExpanded} />
    </SidebarShell>
  );
}

export default Sidebar;
