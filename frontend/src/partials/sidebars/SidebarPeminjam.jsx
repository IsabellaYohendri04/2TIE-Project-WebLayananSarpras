import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import SidebarLinkGroup from "../SidebarLinkGroup";

export default function SidebarPeminjam() {
  const { pathname } = useLocation();

  return (
    <div>
      <h3 className="text-xs uppercase text-gray-400 dark:text-gray-500 font-semibold pl-3">
        <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">
          Menu Peminjam
        </span>
      </h3>
      <ul className="mt-3">
        <SidebarLinkGroup activecondition={pathname === "/peminjam"}>
          {() => (
            <NavLink
              end
              to="/peminjam"
              className={({ isActive }) =>
                `block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                  isActive
                    ? "text-violet-500"
                    : "hover:text-gray-900 dark:hover:text-white"
                }`
              }
            >
              <div className="flex items-center">
                <svg
                  className={`shrink-0 fill-current ${
                    pathname === "/peminjam"
                      ? "text-violet-500"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <path d="M5.936.278A7.983 7.983 0 0 1 8 0a8 8 0 1 1-8 8c0-.722.104-1.413.278-2.064a1 1 0 1 1 1.932.516A5.99 5.99 0 0 0 2 8a6 6 0 1 0 6-6c-.53 0-1.045.076-1.548.21A1 1 0 1 1 5.936.278Z" />
                  <path d="M6.068 7.482A2.003 2.003 0 0 0 8 10a2 2 0 1 0-.518-3.932L3.707 2.293a1 1 0 0 0-1.414 1.414l3.775 3.775Z" />
                </svg>
                <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                  Dashboard Peminjam
                </span>
              </div>
            </NavLink>
          )}
        </SidebarLinkGroup>

        <SidebarLinkGroup activecondition={pathname.includes("peminjaman-barang")}>
          {() => (
            <NavLink
              to="/peminjam/peminjaman-barang"
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
                  Peminjaman Barang
                </span>
              </div>
            </NavLink>
          )}
        </SidebarLinkGroup>

        <SidebarLinkGroup
          activecondition={pathname.includes("peminjaman-ruangan")}
        >
          {() => (
            <NavLink
              to="/peminjam/peminjaman-ruangan"
              className={({ isActive }) =>
                `block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                  isActive
                    ? "text-violet-500"
                    : "hover:text-gray-900 dark:hover:text-white"
                }`
              }
            >
              <div className="flex items-center">
                <span className="text-lg mr-3">🏢</span>
                <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                  Peminjaman Ruangan
                </span>
              </div>
            </NavLink>
          )}
        </SidebarLinkGroup>
      </ul>
    </div>
  );
}
