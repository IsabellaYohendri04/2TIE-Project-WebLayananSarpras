import React, { useEffect, useState, useMemo } from "react";
import TablePagination, { PAGE_LIMIT } from "../../components/TablePagination";
import { useDebouncedValue } from "../../hooks/usePaginatedFilter";
import { getPeminjaman } from "./services/janitorService";

const statusStyle = {
  Menunggu:
    "bg-amber-100 text-amber-700 border-amber-200",

  Disetujui:
    "bg-blue-100 text-blue-700 border-blue-200",

  Ditolak:
    "bg-red-100 text-red-700 border-red-200",

  APPROVED:
    "bg-blue-100 text-blue-700 border-blue-200",
};

const tipeIcon = {
  barang: "📦",
  ruangan: "🏢",
  laboratorium: "🧪",
};

export default function PeminjamanSarpras() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getPeminjaman();
        setData(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Gagal memuat peminjaman.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [filter, debouncedSearch]);

  const filtered = useMemo(() => {
    let result = data;
    if (filter === "pending") result = result.filter((item) => item.status === "Menunggu");
    else if (filter === "approved") {
      result = result.filter((item) => item.status === "Disetujui" || item.status === "APPROVED");
    }
    if (debouncedSearch.trim()) {
      const term = debouncedSearch.toLowerCase();
      result = result.filter(
        (item) =>
          (item.item || "").toLowerCase().includes(term) ||
          (item.peminjam || item.nama || "").toLowerCase().includes(term) ||
          (item.nim || "").toLowerCase().includes(term)
      );
    }
    return result;
  }, [data, filter, debouncedSearch]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_LIMIT));
  const safePage = Math.min(page, totalPages);
  const paginated = useMemo(() => {
    const start = (safePage - 1) * PAGE_LIMIT;
    return filtered.slice(start, start + PAGE_LIMIT);
  }, [filtered, safePage]);

  const counts = {
    all: data.length,
    pending: data.filter((d) => d.status === "Menunggu").length,
    approved: data.filter((d) => d.status === "Disetujui" || d.status === "APPROVED").length,
  };

  return (
    <main className="grow min-h-screen bg-[#F5F7FB]">
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 p-8 shadow-2xl mb-8">
          <div className="absolute right-0 top-0 opacity-10 text-[160px] select-none">📑</div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-white">Peminjaman Sarpras</h1>
            <p className="text-indigo-100 mt-2">
              Semua pengajuan peminjaman langsung masuk ke sini — pantau real-time
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl mb-6">{error}</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            {
            key: "all",
            label: "Semua Pengajuan",
            value: counts.all,
            color: "from-violet-600 to-indigo-600",
          },
          {
            key: "pending",
            label: "Menunggu",
            value: counts.pending,
            color: "from-amber-400 to-orange-500",
          },
          {
            key: "approved",
            label: "Disetujui",
            value: counts.approved,
            color: "from-blue-500 to-cyan-500",
          },
          ].map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setFilter(c.key)}
              className={`text-left rounded-2xl p-5 transition-all duration-300 ${
                filter === c.key ? "ring-4 ring-indigo-300 scale-[1.02]" : "hover:scale-[1.01]"
              } bg-gradient-to-br ${c.color} text-white shadow-lg`}
            >
              <p className="text-white/80 text-sm">{c.label}</p>
              <p className="text-3xl font-black mt-1">{c.value}</p>
            </button>
          ))}
        </div>

        <div className="flex justify-end mb-6">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari item, peminjam..."
              className="w-full border border-slate-200 rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <span className="absolute left-4 top-3 text-lg">🔍</span>
          </div>
        </div>

        <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
          {loading ? (
            <div className="p-16 text-center">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
              <p className="text-gray-500 mt-4">Memuat data peminjaman...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center text-gray-500">
              <span className="text-5xl block mb-4">📭</span>
              Belum ada pengajuan {filter !== "all" ? "dengan status ini" : ""}.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-violet-600 to-blue-600 text-white">
                    <th className="text-left p-4 font-semibold">Item</th>
                    <th className="text-left p-4 font-semibold">Peminjam</th>
                    <th className="text-left p-4 font-semibold">Periode</th>
                    <th className="text-left p-4 font-semibold">Tipe</th>
                    <th className="text-left p-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((item) => (
                    <tr key={`${item.tipe}-${item.id}`} className="border-t border-slate-100 hover:bg-indigo-50/40 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span>{tipeIcon[item.tipe] || "📋"}</span>
                          <span className="font-medium text-gray-900">{item.item}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-medium">{item.peminjam || item.nama}</p>
                        {item.nim && <p className="text-xs text-gray-500">{item.nim} · {item.prodi}</p>}
                      </td>
                      <td className="p-4 text-gray-600">
                        {item.tanggal}
                        {item.tanggal_kembali && item.tanggal_kembali !== item.tanggal && (
                          <span> — {item.tanggal_kembali}</span>
                        )}
                      </td>
                      <td className="p-4 capitalize text-gray-600">{item.tipe}</td>
                      <td className="p-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${statusStyle[item.status] || "bg-slate-100"}`}>
                          {item.status === "APPROVED" ? "Disetujui" : item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!loading && filtered.length > 0 && (
            <TablePagination
              page={safePage}
              totalPages={totalPages}
              total={filtered.length}
              onPageChange={setPage}
              itemLabel="pengajuan"
            />
          )}
        </div>
      </div>
    </main>
  );
}
