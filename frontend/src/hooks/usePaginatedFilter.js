import { useState, useEffect, useMemo } from "react";
import { PAGE_LIMIT } from "../components/TablePagination";

export function useDebouncedValue(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debounced;
}

export function usePaginatedFilter(items, { search = "", filterFn = null, limit = PAGE_LIMIT } = {}) {
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search);

  const filtered = useMemo(() => {
    let result = items;
    if (filterFn) result = result.filter(filterFn);
    if (debouncedSearch.trim()) {
      const term = debouncedSearch.toLowerCase();
      result = result.filter((item) =>
        Object.values(item).some(
          (val) => val != null && String(val).toLowerCase().includes(term)
        )
      );
    }
    return result;
  }, [items, filterFn, debouncedSearch]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, totalPages);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filterFn]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paginatedItems = useMemo(() => {
    const start = (safePage - 1) * limit;
    return filtered.slice(start, start + limit);
  }, [filtered, safePage, limit]);

  return {
    paginatedItems,
    filtered,
    page: safePage,
    setPage,
    total,
    totalPages,
    debouncedSearch,
  };
}
