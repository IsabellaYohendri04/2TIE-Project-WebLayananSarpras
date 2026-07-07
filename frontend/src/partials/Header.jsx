import React, { useState } from "react";
import { useLocation } from "react-router-dom";

import SearchModal from "../components/ModalSearch";
import Notifications from "../components/DropdownNotifications";
import Help from "../components/DropdownHelp";
import UserMenu from "../components/DropdownProfile";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth, ROLE_LABEL } from "../context/AuthContext";

const PAGE_TITLES = {
  "/": "Dashboard Pegawai Sarpras",
  "/pegawai": "Kelola Pegawai",
  "/fasilitas/barang": "Kelola Barang",
  "/fasilitas/ruangan": "Kelola Ruangan",
  "/fasilitas/laboratorium": "Kelola Laboratorium",
  "/peminjaman/barang": "Peminjaman Barang",
  "/peminjaman/ruangan": "Peminjaman Ruangan",
  "/peminjaman/laboratorium": "Peminjaman Laboratorium",
  "/laporan-kondisi": "Kelola Laporan Kondisi",
};

function Header({ sidebarOpen, setSidebarOpen, variant = "default" }) {
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const { user } = useAuth();
  const { pathname } = useLocation();

  const pageTitle =
    PAGE_TITLES[pathname] ||
    (user?.role === "pegawai_sarpras" ? "Sistem Layanan Sarpras" : "");

  return (
    <header
      className={`sticky top-0 before:absolute before:inset-0 before:backdrop-blur-md max-lg:before:bg-white/90 dark:max-lg:before:bg-gray-800/90 before:-z-10 z-30 ${variant === "v2" || variant === "v3" ? "before:bg-white after:absolute after:h-px after:inset-x-0 after:top-full after:bg-gray-200 dark:after:bg-gray-700/60 after:-z-10" : "max-lg:shadow-xs lg:before:bg-gray-100/90 dark:lg:before:bg-gray-900/90"} ${variant === "v2" ? "dark:before:bg-gray-800" : ""} ${variant === "v3" ? "dark:before:bg-gray-900" : ""}`}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between h-16 ${variant === "v2" || variant === "v3" ? "" : "lg:border-b border-gray-200 dark:border-gray-700/60"}`}
        >
          {/* Header: Left side */}
          <div className="flex items-center gap-3">
            {/* Hamburger button */}
            <button
              className="text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 lg:hidden"
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
              onClick={(e) => {
                e.stopPropagation();
                setSidebarOpen(!sidebarOpen);
              }}
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="w-6 h-6 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="4" y="5" width="16" height="2" />
                <rect x="4" y="11" width="16" height="2" />
                <rect x="4" y="17" width="16" height="2" />
              </svg>
            </button>

            {user?.role === "pegawai_sarpras" && pageTitle && (
              <div className="hidden sm:block">
                <h1 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  {pageTitle}
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {ROLE_LABEL[user.role]} · PCR
                </p>
              </div>
            )}
          </div>

          {/* Header: Right side */}
          <div className="flex items-center space-x-3">
            
            <Notifications align="right" />
            <ThemeToggle />
            {/*  Divider */}
            <hr className="w-px h-6 bg-gray-200 dark:bg-gray-700/60 border-none" />
            <UserMenu align="right" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
