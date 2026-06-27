import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SidebarLinkGroup from "./SidebarLinkGroup";

const GEDUNG_DROPDOWN = [
  { slug: "gedung-utama", label: "Gedung Utama", pathType: "ruangan" },
  { slug: "gedung-serba-guna", label: "Gedung Serba Guna", pathType: "ruangan" },
  { slug: "gedung-olahraga", label: "Gedung Olahraga", pathType: "olahraga" },
  { slug: "workshop-listrik", label: "Workshop Listrik", pathType: "ruangan" },
  { slug: "workshop-mesin", label: "Workshop Mesin", pathType: "ruangan" },
  { slug: "dormitori", label: "Dormitori", pathType: "dormitori" },
];

function gedungLink(base, g) {
  if (g.pathType === "olahraga") return `${base}/peminjaman-olahraga`;
  if (g.pathType === "dormitori") return `${base}/peminjaman-dormitori`;
  return `${base}/peminjaman-ruangan?gedung=${g.slug}`;
}

function gedungLinkPegawai(g) {
  if (g.pathType === "olahraga") return `/peminjaman/ruangan?tipe=olahraga`;
  if (g.pathType === "dormitori") return `/peminjaman/ruangan?tipe=dormitori`;
  if (g.pathType === "lab") return `/peminjaman/laboratorium?gedung=${g.slug}`;
  return `/peminjaman/ruangan?gedung=${g.slug}`;
}

function PeminjamanMenu({ base, pathname, setSidebarExpanded, dashboardLabel, hideDashboard }) {
  const ruanganActive =
    pathname.includes("peminjaman-ruangan") ||
    pathname.includes("peminjaman-lab") ||
    pathname.includes("peminjaman-olahraga") ||
    pathname.includes("peminjaman-dormitori");

  return (
    <>
      {!hideDashboard && (
      <SidebarLinkGroup activecondition={pathname === base || pathname === `${base}/`}>
        {() => (
          <NavLink end to={base} className={({ isActive }) => navLinkClass(isActive)}>
            <div className="flex items-center">
              <DashboardIcon active={pathname === base} />
              <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                {dashboardLabel}
              </span>
            </div>
          </NavLink>
        )}
      </SidebarLinkGroup>
      )}

      <SidebarLinkGroup activecondition={pathname.includes("peminjaman-barang")}>
        {() => (
          <NavLink to={`${base}/peminjaman-barang`} className={({ isActive }) => navLinkClass(isActive)}>
            <div className="flex items-center">
              <span className="text-lg mr-3">📦</span>
              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Peminjaman Barang</span>
            </div>
          </NavLink>
        )}
      </SidebarLinkGroup>

      <SidebarLinkGroup activecondition={ruanganActive}>
        {(handleClick, open) => (
          <>
            <a
              href="#0"
              className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${ruanganActive ? "" : "hover:text-gray-900 dark:hover:text-white"}`}
              onClick={(e) => {
                e.preventDefault();
                handleClick();
                setSidebarExpanded?.(true);
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-lg mr-3">🏢</span>
                  <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Peminjaman Ruangan</span>
                </div>
                <svg className={`w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 ${open && "rotate-180"}`} viewBox="0 0 12 12">
                  <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                </svg>
              </div>
            </a>
            <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
              <ul className={`pl-8 mt-1 ${!open && "hidden"}`}>
                {GEDUNG_DROPDOWN.map((g) => (
                  <li key={g.slug} className="mb-1">
                    <NavLink to={gedungLink(base, g)} className={({ isActive }) => subLinkClass(isActive)}>
                      {g.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </SidebarLinkGroup>

      <SidebarLinkGroup activecondition={pathname.includes("riwayat-peminjaman")}>
        {() => (
          <NavLink to={`${base}/riwayat-peminjaman`} className={({ isActive }) => navLinkClass(isActive)}>
            <div className="flex items-center">
              <span className="text-lg mr-3">📜</span>
              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Riwayat Peminjaman</span>
            </div>
          </NavLink>
        )}
      </SidebarLinkGroup>

      <SidebarLinkGroup activecondition={pathname.includes("laporan-kondisi")}>
        {() => (
          <NavLink to={`${base}/laporan-kondisi`} className={({ isActive }) => navLinkClass(isActive)}>
            <div className="flex items-center">
              <span className="text-lg mr-3">📝</span>
              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Laporan Kondisi</span>
            </div>
          </NavLink>
        )}
      </SidebarLinkGroup>
    </>
  );
}

const navLinkClass = (isActive) =>
  `block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
    isActive ? "text-violet-500" : "hover:text-gray-900 dark:hover:text-white"
  }`;

const subLinkClass = (isActive) =>
  `block transition duration-150 truncate text-sm ${
    isActive
      ? "text-violet-500"
      : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700"
  }`;

function DashboardIcon({ active }) {
  return (
    <svg
      className={`shrink-0 fill-current ${
        active ? "text-violet-500" : "text-gray-400 dark:text-gray-500"
      }`}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
    >
      <path d="M5.936.278A7.983 7.983 0 0 1 8 0a8 8 0 1 1-8 8c0-.722.104-1.413.278-2.064a1 1 0 1 1 1.932.516A5.99 5.99 0 0 0 2 8a6 6 0 1 0 6-6c-.53 0-1.045.076-1.548.21A1 1 0 1 1 5.936.278Z" />
      <path d="M6.068 7.482A2.003 2.003 0 0 0 8 10a2 2 0 1 0-.518-3.932L3.707 2.293a1 1 0 0 0-1.414 1.414l3.775 3.775Z" />
    </svg>
  );
}

function PegawaiPeminjamanMenu({ pathname, setSidebarExpanded }) {
  const ruanganActive =
    pathname.includes("/peminjaman/ruangan") ||
    pathname.includes("/peminjaman/laboratorium");

  return (
    <>
      <SidebarLinkGroup activecondition={pathname.includes("/peminjaman/barang")}>
        {() => (
          <NavLink to="/peminjaman/barang" className={({ isActive }) => navLinkClass(isActive)}>
            <div className="flex items-center">
              <span className="text-lg mr-3">📦</span>
              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                Peminjaman Barang
              </span>
            </div>
          </NavLink>
        )}
      </SidebarLinkGroup>

      <SidebarLinkGroup activecondition={ruanganActive}>
        {(handleClick, open) => (
          <>
            <a
              href="#0"
              className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${ruanganActive ? "" : "hover:text-gray-900 dark:hover:text-white"}`}
              onClick={(e) => {
                e.preventDefault();
                handleClick();
                setSidebarExpanded?.(true);
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-lg mr-3">🏢</span>
                  <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                    Peminjaman Ruangan
                  </span>
                </div>
                <svg className={`w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 ${open && "rotate-180"}`} viewBox="0 0 12 12">
                  <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                </svg>
              </div>
            </a>
            <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
              <ul className={`pl-8 mt-1 ${!open && "hidden"}`}>
                {GEDUNG_DROPDOWN.map((g) => (
                  <li key={g.slug} className="mb-1">
                    <NavLink to={gedungLinkPegawai(g)} className={({ isActive }) => subLinkClass(isActive)}>
                      {g.label}
                    </NavLink>
                  </li>
                ))}
                <li className="mb-1">
                  <NavLink to="/peminjaman/laboratorium" className={({ isActive }) => subLinkClass(isActive)}>
                    Laboratorium
                  </NavLink>
                </li>
              </ul>
            </div>
          </>
        )}
      </SidebarLinkGroup>
    </>
  );
}

function PegawaiNav({ pathname, setSidebarExpanded }) {
  return (
    <div>
      <h3 className="text-xs uppercase text-gray-400 dark:text-gray-500 font-semibold pl-3">
        <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">
          Menu Pegawai Sarpras
        </span>
      </h3>
      <ul className="mt-3">
        <SidebarLinkGroup activecondition={pathname === "/"}>
          {() => (
            <NavLink end to="/" className={({ isActive }) => navLinkClass(isActive)}>
              <div className="flex items-center">
                <DashboardIcon active={pathname === "/"} />
                <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                  Dashboard
                </span>
              </div>
            </NavLink>
          )}
        </SidebarLinkGroup>

        <SidebarLinkGroup activecondition={pathname === "/pegawai"}>
          {() => (
            <NavLink to="/pegawai" className={({ isActive }) => navLinkClass(isActive)}>
              <div className="flex items-center">
                <span className="text-lg mr-3">👥</span>
                <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
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
                  pathname.includes("fasilitas") ? "" : "hover:text-gray-900 dark:hover:text-white"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleClick();
                  setSidebarExpanded?.(true);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-lg mr-3">🏗️</span>
                    <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Kelola Fasilitas
                    </span>
                  </div>
                  <svg className={`w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 ${open && "rotate-180"}`} viewBox="0 0 12 12">
                    <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                  </svg>
                </div>
              </a>
              <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                <ul className={`pl-8 mt-1 ${!open && "hidden"}`}>
                  <li className="mb-1">
                    <NavLink to="/fasilitas/barang" className={({ isActive }) => subLinkClass(isActive)}>Barang</NavLink>
                  </li>
                  <li className="mb-1">
                    <NavLink to="/fasilitas/ruangan" className={({ isActive }) => subLinkClass(isActive)}>Ruangan</NavLink>
                  </li>
                  <li className="mb-1">
                    <NavLink to="/fasilitas/laboratorium" className={({ isActive }) => subLinkClass(isActive)}>Laboratorium</NavLink>
                  </li>
                </ul>
              </div>
            </>
          )}
        </SidebarLinkGroup>
      </ul>

      <h3 className="text-xs uppercase text-gray-400 dark:text-gray-500 font-semibold pl-3 mt-6">
        <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">
          Kelola Peminjaman
        </span>
      </h3>
      <ul className="mt-3">
        <PegawaiPeminjamanMenu pathname={pathname} setSidebarExpanded={setSidebarExpanded} />
      </ul>
    </div>
  );
}

function JanitorNav({ pathname, setSidebarExpanded }) {
  const opsItems = [
    {
      to: "/janitor/kelola-sarpras",
      icon: "📦",
      label: "Kelola Sarpras",
      match: pathname.includes("kelola-sarpras"),
    },
    {
      to: "/janitor/monitoring-sarpras",
      icon: "📊",
      label: "Monitoring Sarpras",
      match: pathname.includes("monitoring-sarpras"),
    },
    {
      to: "/janitor/peminjaman-sarpras",
      icon: "📋",
      label: "Lihat Peminjaman",
      match: pathname.includes("peminjaman-sarpras"),
    },
    {
      to: "/janitor/laporan-sarpras",
      icon: "🔧",
      label: "Laporan Kerusakan",
      match: pathname.includes("laporan-sarpras"),
    },
  ];

  return (
    <div>
      <h3 className="text-xs uppercase text-gray-400 dark:text-gray-500 font-semibold pl-3">
        <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">
          Menu Janitor
        </span>
      </h3>

      <ul className="mt-3">
        <SidebarLinkGroup activecondition={pathname === "/janitor" || pathname === "/janitor/"}>
          {() => (
            <NavLink end to="/janitor" className={({ isActive }) => navLinkClass(isActive)}>
              <div className="flex items-center">
                <span className="text-lg mr-3">🧹</span>
                <span className="text-sm font-medium ml-4">
                  Dashboard Janitor
                </span>
              </div>
            </NavLink>
          )}
        </SidebarLinkGroup>

        {opsItems.map((item) => (
          <SidebarLinkGroup key={item.to} activecondition={item.match}>
            {() => (
              <NavLink to={item.to} className={({ isActive }) => navLinkClass(isActive)}>
                <div className="flex items-center">
                  <span className="text-lg mr-3">{item.icon}</span>
                  <span className="text-sm font-medium">
                    {item.label}
                  </span>
                </div>
              </NavLink>
            )}
          </SidebarLinkGroup>
        ))}
      </ul>
    </div>
  );
};

function PeminjamNav({ pathname, setSidebarExpanded }) {
  return (
    <div>
      <h3 className="text-xs uppercase text-gray-400 dark:text-gray-500 font-semibold pl-3">
        <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">Menu Peminjam</span>
      </h3>
      <ul className="mt-3">
        <PeminjamanMenu base="/peminjam" pathname={pathname} setSidebarExpanded={setSidebarExpanded} dashboardLabel="Dashboard Peminjam" />
      </ul>
    </div>
  );
}

export default function SidebarNav({ setSidebarExpanded }) {
  const { user } = useAuth();
  const { pathname } = useLocation();

  switch (user?.role) {
    case "janitor":
      return <JanitorNav pathname={pathname} setSidebarExpanded={setSidebarExpanded} />;
    case "peminjam":
      return <PeminjamNav pathname={pathname} setSidebarExpanded={setSidebarExpanded} />;
    case "pegawai_sarpras":
    default:
      return <PegawaiNav pathname={pathname} setSidebarExpanded={setSidebarExpanded} />;
  }
}

export { GEDUNG_DROPDOWN };
