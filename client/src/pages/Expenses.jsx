import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Download, Filter, ReceiptText, Search } from "lucide-react";
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
            if (
                category !== "All" &&
                (r.category || "Uncategorized") !== category
            ) {
                return false;
            }
            if (!q) return true;
            const hay =
                `${r.vendor || ""} ${r.category || ""} ${r.currency || ""}`.toLowerCase();
            return hay.includes(q);
        });
    }, [rows, query, category]);

    const totalAmount = useMemo(
        () =>
            filtered.reduce(
                (sum, expense) => sum + (Number(expense.amount) || 0),
                0,
            ),
        [filtered],
    );

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
                <div className="ri-page-header">
                    <div>
                        <h1 className="ri-page-title">Expenses</h1>
                    </div>
                </div>
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
                        <tbody>
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
            <div className="ri-page-header">
                <div>
                    <h1 className="ri-page-title">Expenses</h1>
                    <p className="ri-page-copy">
                        Search, filter, and export the expense records saved to
                        your account.
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={exportCsv}
                        className="ri-action-btn"
                    >
                        <Download size={16} strokeWidth={1.75} />
                        <span>Export CSV</span>
                    </button>
                    <Link to="/upload" className="ri-action-btn ri-action-btn-primary">
                        <ReceiptText size={16} strokeWidth={1.75} />
                        <span>Add expense</span>
                    </Link>
                </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr),280px]">
                <section className="ri-panel p-5">
                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr),220px] lg:items-end">
                        <div className="space-y-4">
                            <label className="ri-label" htmlFor="expense-search">
                                Search
                            </label>
                            <div className="relative">
                                <Search
                                    size={16}
                                    strokeWidth={1.75}
                                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                                />
                                <input
                                    id="expense-search"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Vendor, category, currency"
                                    className="ri-input pl-10"
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="ri-label" htmlFor="expense-category">
                                Filter
                            </label>
                            <div className="relative">
                                <Filter
                                    size={16}
                                    strokeWidth={1.75}
                                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                                />
                                <select
                                    id="expense-category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="ri-select pl-10"
                                >
                                    {categories.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="ri-panel p-5">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                        Total spending
                    </p>
                    <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
                        {formatCurrency(totalAmount)}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                        Across {filtered.length} expense{filtered.length === 1 ? "" : "s"} in the current view.
                    </p>
                </section>
            </div>

            {rows.length === 0 ? (
                <EmptyState
                    title="No expenses saved"
                    description="Extract a receipt and save it to start building your expense history."
                    action={
                        <Link to="/upload" className="ri-action-btn ri-action-btn-primary">
                            Upload receipt
                        </Link>
                    }
                />
            ) : (
                <div className="ri-table-wrap overflow-x-auto">
                    <table className="ri-table min-w-[760px]">
                        <thead className="ri-thead">
                            <tr>
                                <th className="ri-th">Vendor</th>
                                <th className="ri-th">Date</th>
                                <th className="ri-th">Category</th>
                                <th className="ri-th text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paged.map((row) => (
                                <tr key={row.id} className="ri-tr">
                                    <td className="ri-td font-medium text-white">
                                        {row.vendor}
                                    </td>
                                    <td className="ri-td-muted">
                                        {formatDate(row.date)}
                                    </td>
                                    <td className="ri-td">
                                        <span className="ri-inline-pill">
                                            {row.category || "Uncategorized"}
                                        </span>
                                    </td>
                                    <td className="ri-td ri-amount-cell">
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
                    <p className="text-sm leading-6 text-slate-400">
                        Showing <span className="tabular-nums">{start + 1}</span>-
                        <span className="tabular-nums">
                            {Math.min(start + pageSize, filtered.length)}
                        </span>{" "}
                        of <span className="tabular-nums">{filtered.length}</span>
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className="ri-action-btn"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={pageSafe <= 1}
                        >
                            Prev
                        </button>
                        <span className="ri-inline-pill">
                            Page <span className="tabular-nums">{pageSafe}</span> of{" "}
                            <span className="tabular-nums">{totalPages}</span>
                        </span>
                        <button
                            type="button"
                            className="ri-action-btn"
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
