import React from "react";

export const PAGE_LIMIT = 10;

export function getRowNumber(page, index, limit = PAGE_LIMIT) {
  return (page - 1) * limit + index + 1;
}

export default function TablePagination({
  page,
  totalPages,
  total,
  limit = PAGE_LIMIT,
  onPageChange,
  itemLabel = "data",
}) {
  if (total <= 0) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-100 dark:border-gray-700">
      <p className="text-sm text-gray-500">
        Menampilkan {start}–{end} dari {total} {itemLabel}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-medium disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Prev
        </button>
        <span className="text-sm text-gray-600 dark:text-gray-300 px-2">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-medium disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Next
        </button>
      </div>
    </div>
  );
}
