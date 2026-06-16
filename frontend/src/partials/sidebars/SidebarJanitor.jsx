import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import SidebarLinkGroup from "../SidebarLinkGroup";

export default function SidebarJanitor() {
  const { pathname } = useLocation();

  return (
    <div>
      <h3 className="text-xs uppercase text-gray-400 dark:text-gray-500 font-semibold pl-3">
        <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">
          Menu Janitor
        </span>
      </h3>
      <ul className="mt-3">
        <SidebarLinkGroup
          activecondition={pathname === "/janitor" || pathname === "/janitor/"}
        >
          {() => (
            <NavLink
              end
              to="/janitor"
              className={({ isActive }) =>
                `block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                  isActive
                    ? "text-violet-500"
                    : "hover:text-gray-900 dark:hover:text-white"
                }`
              }
            >
              <div className="flex items-center">
                <span className="text-lg mr-3">🧹</span>
                <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                  Dashboard Janitor
                </span>
              </div>
            </NavLink>
          )}
        </SidebarLinkGroup>

        <SidebarLinkGroup activecondition={pathname.includes("kelola-sarpras")}>
          {() => (
            <NavLink
              to="/janitor/kelola-sarpras"
              className={({ isActive }) =>
                `block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                  isActive
                    ? "text-violet-500"
                    : "hover:text-gray-900 dark:hover:text-white"
                }`
              }
            >
              <div className="flex items-center">
                <span className="text-lg mr-3">📦</span>
                <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                  Kelola Sarpras
                </span>
              </div>
            </NavLink>
          )}
        </SidebarLinkGroup>

        <SidebarLinkGroup
          activecondition={pathname.includes("monitoring-sarpras")}
        >
          {() => (
            <NavLink
              to="/janitor/monitoring-sarpras"
              className={({ isActive }) =>
                `block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                  isActive
                    ? "text-violet-500"
                    : "hover:text-gray-900 dark:hover:text-white"
                }`
              }
            >
              <div className="flex items-center">
                <span className="text-lg mr-3">📊</span>
                <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                  Monitoring Sarpras
                </span>
              </div>
            </NavLink>
          )}
        </SidebarLinkGroup>

        <SidebarLinkGroup
          activecondition={pathname.includes("peminjaman-sarpras")}
        >
          {() => (
            <NavLink
              to="/janitor/peminjaman-sarpras"
              className={({ isActive }) =>
                `block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                  isActive
                    ? "text-violet-500"
                    : "hover:text-gray-900 dark:hover:text-white"
                }`
              }
            >
              <div className="flex items-center">
                <span className="text-lg mr-3">📋</span>
                <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                  Peminjaman Sarpras
                </span>
              </div>
            </NavLink>
          )}
        </SidebarLinkGroup>

        <SidebarLinkGroup activecondition={pathname.includes("laporan-sarpras")}>
          {() => (
            <NavLink
              to="/janitor/laporan-sarpras"
              className={({ isActive }) =>
                `block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                  isActive
                    ? "text-violet-500"
                    : "hover:text-gray-900 dark:hover:text-white"
                }`
              }
            >
              <div className="flex items-center">
                <span className="text-lg mr-3">🔧</span>
                <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                  Laporan Kerusakan
                </span>
              </div>
            </NavLink>
          )}
        </SidebarLinkGroup>
      </ul>
    </div>
  );
}
