import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { formatCurrency, formatDate } from "../utils/formatCurrency";
import { TableRowSkeleton } from "../components/Skeleton";
import { EmptyState } from "../components/EmptyState";

export function Expenses() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("All");
    const [page, setPage] = useState(1);
    const pageSize = 12;

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const { data } = await api.get("/expenses");
                if (!cancelled) setRows(data.expenses || []);
            } catch (e) {
                if (!cancelled) setError(e.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const categories = useMemo(() => {
        const set = new Set();
        for (const r of rows) set.add(r.category || "Uncategorized");
        return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
    }, [rows]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return rows.filter((r) => {
            if (category !== "All" && (r.category || "Uncategorized") !== category) return false;
            if (!q) return true;
            const hay = `${r.vendor || ""} ${(r.category || "")} ${(r.currency || "")}`.toLowerCase();
            return hay.includes(q);
        });
    }, [rows, query, category]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const pageSafe = Math.min(page, totalPages);
    const start = (pageSafe - 1) * pageSize;
    const paged = filtered.slice(start, start + pageSize);

    useEffect(() => {
        setPage(1);
    }, [query, category]);

    function exportCsv() {
        const header = ["vendor", "date", "category", "amount", "currency"];
        const lines = [header.join(",")];
        for (const r of filtered) {
            const values = [
                r.vendor ?? "",
                r.date ?? "",
                r.category ?? "",
                r.amount ?? "",
                r.currency ?? "",
            ].map((v) => `"${String(v).replaceAll('"', '""')}"`);
            lines.push(values.join(","));
        }
        const blob = new Blob([lines.join("\n")], {
            type: "text/csv;charset=utf-8",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `receiptiq-expenses-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }

    if (loading) {
        return (
            <div className="ri-page">
                <h1 className="ri-h1">Expenses</h1>
                <div className="ri-table-wrap">
                    <table className="ri-table">
                        <thead className="ri-thead">
                            <tr>
                                <th className="ri-th">Vendor</th>
                                <th className="ri-th">Date</th>
                                <th className="ri-th">Category</th>
                                <th className="ri-th text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700 bg-navy-light/40">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <TableRowSkeleton key={i} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="ri-callout-warn">
                <p className="font-medium">Could not load expenses</p>
                <p className="mt-1 text-sm">{error}</p>
            </div>
        );
    }

    return (
        <div className="ri-page">
            <div className="ri-page-hero">
                <div className="relative flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="ri-kicker">Saved records</p>
                        <h1 className="ri-h1">Expenses</h1>
                        <p className="ri-subtitle">
                            Search, filter, and export the expenses that belong to your account.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={exportCsv} className="ri-btn-secondary">
                            Export CSV
                        </button>
                        <Link to="/upload" className="ri-btn-primary">
                            Add from receipt
                        </Link>
                    </div>
                </div>
            </div>

            <div className="ri-surface ri-surface-pad">
                <div className="grid gap-4 md:grid-cols-12 md:items-end">
                    <div className="md:col-span-6">
                        <label className="ri-label" htmlFor="expense-search">
                            Search
                        </label>
                        <input
                            id="expense-search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Vendor, category, currency..."
                            className="ri-input"
                        />
                    </div>
                    <div className="md:col-span-4">
                        <label className="ri-label" htmlFor="expense-category">
                            Category
                        </label>
                        <select
                            id="expense-category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="ri-select"
                        >
                            {categories.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                            Results
                        </div>
                        <div className="mt-2 text-2xl font-bold text-white tabular-nums">
                            {filtered.length}
                        </div>
                    </div>
                </div>
            </div>

            {rows.length === 0 ? (
                <EmptyState
                    title="No expenses saved"
                    description="Extract a receipt and save it to see rows here."
                    action={
                        <Link to="/upload" className="ri-btn-primary">
                            Upload receipt
                        </Link>
                    }
                />
            ) : (
                <div className="ri-table-wrap overflow-x-auto">
                    <table className="ri-table min-w-[720px]">
                        <thead className="ri-thead">
                            <tr>
                                <th className="ri-th">Vendor</th>
                                <th className="ri-th">Date</th>
                                <th className="ri-th">Category</th>
                                <th className="ri-th text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="bg-navy-light/40">
                            {paged.map((row) => (
                                <tr key={row.id} className="ri-tr">
                                    <td className="ri-td font-medium text-white">{row.vendor}</td>
                                    <td className="ri-td-muted">{formatDate(row.date)}</td>
                                    <td className="ri-td">
                                        <span className="ri-badge-accent">
                                            {row.category || "Uncategorized"}
                                        </span>
                                    </td>
                                    <td className="ri-td text-right tabular-nums">
                                        {formatCurrency(row.amount, row.currency)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {filtered.length > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-slate-400">
                        Showing <span className="tabular-nums">{start + 1}</span>-
                        <span className="tabular-nums">
                            {Math.min(start + pageSize, filtered.length)}
                        </span>{" "}
                        of <span className="tabular-nums">{filtered.length}</span>
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className="ri-btn-secondary"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={pageSafe <= 1}
                        >
                            Prev
                        </button>
                        <span className="ri-badge">
                            Page <span className="tabular-nums">{pageSafe}</span> /
                            <span className="tabular-nums">{totalPages}</span>
                        </span>
                        <button
                            type="button"
                            className="ri-btn-secondary"
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={pageSafe >= totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
