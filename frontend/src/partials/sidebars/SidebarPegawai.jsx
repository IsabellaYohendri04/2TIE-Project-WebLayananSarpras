import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import SidebarLinkGroup from "../SidebarLinkGroup";

export default function SidebarPegawai({ setSidebarExpanded }) {
  const { pathname } = useLocation();

  return (
    <div>
      <h3 className="text-xs uppercase text-gray-400 dark:text-gray-500 font-semibold pl-3">
        <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">
          Menu Pegawai Sarpras
        </span>
      </h3>
      <ul className="mt-3">
        <SidebarLinkGroup
          activecondition={pathname === "/" || pathname.includes("dashboard")}
        >
          {() => (
            <NavLink
              end
              to="/"
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
                    pathname === "/"
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
                  Dashboard
                </span>
              </div>
            </NavLink>
          )}
        </SidebarLinkGroup>

        <SidebarLinkGroup activecondition={pathname === "/pegawai"}>
          {() => (
            <NavLink
              to="/pegawai"
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
                    pathname === "/pegawai"
                      ? "text-violet-500"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <path d="M9 6.855A3.502 3.502 0 0 0 8 0a3.5 3.5 0 0 0-1 6.855v1.656L5.534 9.65a3.5 3.5 0 1 0 1.229 1.578L8 10.267l1.238.962a3.5 3.5 0 1 0 1.229-1.578L9 8.511V6.855ZM6.5 3.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm4.803 8.095c.005-.005.01-.01.013-.016l.012-.016a1.5 1.5 0 1 1-.025.032ZM3.5 11c.474 0 .897.22 1.171.563l.013.016.013.017A1.5 1.5 0 1 1 3.5 11Z" />
                </svg>
                <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                  Kelola Pegawai
                </span>
              </div>
            </NavLink>
          )}
        </SidebarLinkGroup>

        <SidebarLinkGroup activecondition={pathname.includes("fasilitas")}>
          {(handleClick, open) => (
            <>
              <a
                href="#0"
                className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                  pathname.includes("fasilitas")
                    ? ""
                    : "hover:text-gray-900 dark:hover:text-white"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleClick();
                  setSidebarExpanded(true);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg
                      className={`shrink-0 fill-current ${
                        pathname.includes("fasilitas")
                          ? "text-violet-500"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                    >
                      <path d="M12 1a1 1 0 1 0-2 0v2a3 3 0 0 0 3 3h2a1 1 0 1 0 0-2h-2a1 1 0 0 1-1-1V1ZM1 10a1 1 0 1 0 0 2h2a1 1 0 0 1 1 1v2a1 1 0 1 0 2 0v-2a3 3 0 0 0-3-3H1ZM5 0a1 1 0 0 1 1 1v2a3 3 0 0 1-3 3H1a1 1 0 0 1 0-2h2a1 1 0 0 0 1-1V1a1 1 0 0 1 1-1ZM12 13a1 1 0 0 1 1-1h2a1 1 0 1 0 0-2h-2a3 3 0 0 0-3 3v2a1 1 0 1 0 2 0v-2Z" />
                    </svg>
                    <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Fasilitas
                    </span>
                  </div>
                  <svg
                    className={`w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500 ${
                      open && "rotate-180"
                    }`}
                    viewBox="0 0 12 12"
                  >
                    <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                  </svg>
                </div>
              </a>
              <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                <ul className={`pl-8 mt-1 ${!open && "hidden"}`}>
                  <li className="mb-1">
                    <NavLink
                      to="/fasilitas/barang"
                      className={({ isActive }) =>
                        `block transition duration-150 truncate text-sm ${
                          isActive
                            ? "text-violet-500"
                            : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700"
                        }`
                      }
                    >
                      Barang
                    </NavLink>
                  </li>
                  <li className="mb-1">
                    <NavLink
                      to="/fasilitas/ruangan"
                      className={({ isActive }) =>
                        `block transition duration-150 truncate text-sm ${
                          isActive
                            ? "text-violet-500"
                            : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700"
                        }`
                      }
                    >
                      Ruangan
                    </NavLink>
                  </li>
                  <li className="mb-1">
                    <NavLink
                      to="/fasilitas/laboratorium"
                      className={({ isActive }) =>
                        `block transition duration-150 truncate text-sm ${
                          isActive
                            ? "text-violet-500"
                            : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700"
                        }`
                      }
                    >
                      Laboratorium
                    </NavLink>
                  </li>
                </ul>
              </div>
            </>
          )}
        </SidebarLinkGroup>

        <SidebarLinkGroup activecondition={pathname.includes("peminjaman")}>
          {(handleClick, open) => (
            <>
              <a
                href="#0"
                className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                  pathname.includes("peminjaman")
                    ? ""
                    : "hover:text-gray-900 dark:hover:text-white"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleClick();
                  setSidebarExpanded(true);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg
                      className={`shrink-0 fill-current ${
                        pathname.includes("peminjaman")
                          ? "text-violet-500"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                    >
                      <path d="M6 0a6 6 0 0 0-6 6c0 1.077.304 2.062.78 2.912a1 1 0 1 0 1.745-.976A3.945 3.945 0 0 1 2 6a4 4 0 0 1 4-4c.693 0 1.344.194 1.936.525A1 1 0 1 0 8.912.779 5.944 5.944 0 0 0 6 0Z" />
                      <path d="M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm-4 6a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z" />
                    </svg>
                    <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Peminjaman
                    </span>
                  </div>
                  <svg
                    className={`w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500 ${
                      open && "rotate-180"
                    }`}
                    viewBox="0 0 12 12"
                  >
                    <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                  </svg>
                </div>
              </a>
              <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                <ul className={`pl-8 mt-1 ${!open && "hidden"}`}>
                  <li className="mb-1">
                    <NavLink
                      to="/peminjaman/barang"
                      className={({ isActive }) =>
                        `block transition duration-150 truncate text-sm ${
                          isActive
                            ? "text-violet-500"
                            : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700"
                        }`
                      }
                    >
                      Barang
                    </NavLink>
                  </li>
                  <li className="mb-1">
                    <NavLink
                      to="/peminjaman/ruangan"
                      className={({ isActive }) =>
                        `block transition duration-150 truncate text-sm ${
                          isActive
                            ? "text-violet-500"
                            : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700"
                        }`
                      }
                    >
                      Ruangan
                    </NavLink>
                  </li>
                  <li className="mb-1">
                    <NavLink
                      to="/peminjaman/laboratorium"
                      className={({ isActive }) =>
                        `block transition duration-150 truncate text-sm ${
                          isActive
                            ? "text-violet-500"
                            : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700"
                        }`
                      }
                    >
                      Laboratorium
                    </NavLink>
                  </li>
                </ul>
              </div>
            </>
          )}
        </SidebarLinkGroup>
      </ul>
    </div>
  );
}
