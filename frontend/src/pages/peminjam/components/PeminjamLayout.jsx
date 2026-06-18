import React from "react";
import { Link } from "react-router-dom";
import { usePeminjamanBase } from "../../../hooks/usePeminjamanBase";

export const inputClass =
  "w-full border border-slate-200 rounded-xl p-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-400 transition";

export const selectClass =
  "w-full border border-slate-200 rounded-xl p-3 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-400 transition";

export const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

export function PageShell({ children }) {
  return (
    <main className="grow min-h-screen bg-[radial-gradient(circle_at_top_left,_#eef2ff,_#f8fafc_40%,_#ffffff_80%)]">
      <div
        className="fixed inset-0 -z-10 opacity-[0.03] bg-[linear-gradient(to_right,#6366f1_1px,transparent_1px),linear-gradient(to_bottom,#6366f1_1px,transparent_1px)] bg-[size:50px_50px]"
        aria-hidden
      />
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        {children}
      </div>
    </main>
  );
}

export function PageHeader({ title, subtitle, badge, backTo }) {
  const { base } = usePeminjamanBase();
  const dashboardPath = backTo || base;
  return (
    <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-violet-700 via-indigo-700 to-blue-700 p-8 shadow-2xl mb-8">
      <div className="absolute right-0 top-0 opacity-10 text-[180px] leading-none select-none">
        🏫
      </div>
      <div className="relative z-10">
        <Link
          to={dashboardPath}
          className="inline-flex items-center gap-2 text-violet-100 hover:text-white text-sm mb-4 transition"
        >
          ← Kembali ke Dashboard
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">{title}</h1>
            {subtitle && (
              <p className="text-violet-100 mt-2 text-lg">{subtitle}</p>
            )}
          </div>
          {badge && (
            <span className="bg-white/20 backdrop-blur text-white px-4 py-2 rounded-2xl text-sm font-medium">
              {badge}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function StatCard({ label, value, color = "violet" }) {
  const colors = {
    violet: "from-violet-500 to-violet-700",
    green: "from-green-500 to-emerald-600",
    yellow: "from-yellow-400 to-amber-500",
    red: "from-red-500 to-rose-600",
    blue: "from-blue-500 to-indigo-600",
  };

  return (
    <div
      className={`bg-gradient-to-r ${colors[color]} text-white rounded-[28px] p-6 shadow-lg`}
    >
      <p className="text-white/80 text-sm">{label}</p>
      <h2 className="text-4xl font-bold mt-2">{value}</h2>
    </div>
  );
}

export function ContentCard({ children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-[32px] shadow-xl border border-slate-100 p-6 md:p-8 ${className}`}
    >
      {children}
    </div>
  );
}

export function FormSection({ title, icon, children }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        {icon && <span className="text-xl">{icon}</span>}
        {title}
      </h2>
      {children}
    </section>
  );
}

export function FormActions({ onCancel, submitLabel, submitColor = "violet" }) {
  const submitColors = {
    violet: "bg-violet-600 hover:bg-violet-700",
    blue: "bg-blue-600 hover:bg-blue-700",
    green: "bg-green-600 hover:bg-green-700",
  };

  return (
    <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100">
      <button
        type="button"
        onClick={onCancel}
        className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-gray-700 rounded-xl font-medium transition"
      >
        Batal
      </button>
      <button
        type="submit"
        className={`px-6 py-3 text-white rounded-xl font-medium transition ${submitColors[submitColor]}`}
      >
        {submitLabel}
      </button>
    </div>
  );
}

export function DataTable({ columns, data, emptyMessage = "Tidak ada data." }) {
  if (!data.length) {
    return (
      <div className="text-center py-12 text-gray-500">{emptyMessage}</div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`p-4 font-semibold ${col.align === "center" ? "text-center" : "text-left"}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={row.id ?? i}
              className="border-b border-slate-100 hover:bg-violet-50/50 transition"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`p-4 ${col.align === "center" ? "text-center" : ""}`}
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
