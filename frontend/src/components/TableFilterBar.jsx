import React from "react";

export default function TableFilterBar({
  search,
  onSearchChange,
  searchPlaceholder = "Cari...",
  filterValue,
  onFilterChange,
  filterOptions,
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-end gap-3 mb-6">
      {filterOptions && onFilterChange && (
        <select
          value={filterValue}
          onChange={(e) => onFilterChange(e.target.value)}
          className="border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-2xl px-4 py-3"
        >
          {filterOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}
      <div className="relative w-full sm:w-72">
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <span className="absolute left-4 top-3 text-lg">🔍</span>
      </div>
    </div>
  );
}
