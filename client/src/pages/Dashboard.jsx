import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    ArrowRight,
    CreditCard,
    LayoutDashboard,
    ReceiptText,
    Wallet,
} from "lucide-react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    LineChart,
    Line,
} from "recharts";
import gsap from "gsap";
import { api } from "../services/api";
import { formatCurrency, formatDate } from "../utils/formatCurrency";
import { CardSkeleton, Skeleton } from "../components/Skeleton";
import { EmptyState } from "../components/EmptyState";
import toast from "react-hot-toast";

export function Dashboard() {
    const rootRef = useRef(null);
    const location = useLocation();
    const [summary, setSummary] = useState(null);
    const [recent, setRecent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [testingSheetSync, setTestingSheetSync] = useState(false);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const [summaryRes, listRes] = await Promise.allSettled([
                    api.get("/expenses/summary"),
                    api.get("/expenses"),
                ]);

                const expenses =
                    listRes.status === "fulfilled"
                        ? listRes.value.data?.expenses || []
                        : [];

                const totalAmount = expenses.reduce(
                    (sum, expense) => sum + (Number(expense.amount) || 0),
                    0,
                );

                const categoryTotals = expenses.reduce((map, expense) => {
                    const category = expense.category || "Uncategorized";
                    map.set(category, (map.get(category) || 0) + (Number(expense.amount) || 0));
                    return map;
                }, new Map());

                const summaryData =
                    summaryRes.status === "fulfilled"
                        ? summaryRes.value.data
                        : null;

                const byCategory =
                    summaryData?.byCategory ||
                    Array.from(categoryTotals.entries()).map(([category, total]) => ({
                        category,
                        total,
                    }));

                if (!cancelled) {
                    setSummary({
                        totalSpend: summaryData?.totalSpend ?? totalAmount,
                        expenseCount:
                            summaryData?.expenseCount ?? expenses.length,
                        byCategory: [...byCategory].sort(
                            (a, b) => (Number(b.total) || 0) - (Number(a.total) || 0),
                        ),
                        byTaxCategory:
                            summaryData?.byTaxCategory?.length
                                ? summaryData.byTaxCategory
                                : [],
                        monthlyTrend:
                            summaryData?.monthlyTrend?.length
                                ? summaryData.monthlyTrend
                                : [],
                        googleSheetUrl: summaryData?.googleSheetUrl || null,
                        googleSheetSyncEnabled: Boolean(
                            summaryData?.googleSheetSyncEnabled,
                        ),
                    });
                    setRecent(expenses.slice(0, 6));

                    if (
                        summaryRes.status === "rejected" &&
                        listRes.status === "rejected"
                    ) {
                        setError(
                            summaryRes.reason?.message ||
                                listRes.reason?.message,
                        );
                    } else {
                        setError(null);
                    }
                }
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

    useEffect(() => {
        const root = rootRef.current;
        if (!root || loading) return;

        const cards = root.querySelectorAll("[data-ri-card]");
        gsap.from(cards, {
            opacity: 0,
            y: 18,
            stagger: 0.08,
            duration: 0.55,
            ease: "power3.out",
        });
    }, [loading]);

    const justSavedVendor = location.state?.savedExpense?.vendor;

    async function handleTestGoogleSheetSync() {
        setTestingSheetSync(true);
        try {
            const { data } = await api.post("/expenses/google-sheet/test");
            toast.success(data?.message || "Google Sheets sync test succeeded");
        } catch (e) {
            toast.error(e.message || "Google Sheets sync test failed");
        } finally {
            setTestingSheetSync(false);
        }
    }

    const dashboardSummary = useMemo(() => {
        const totalSpend = Number(summary?.totalSpend) || 0;
        const expenseCount = Number(summary?.expenseCount) || 0;
        const byCategory = summary?.byCategory || [];
        const byTaxCategory = summary?.byTaxCategory || [];
        const monthlyTrend = summary?.monthlyTrend || [];
        return {
            totalSpend,
            expenseCount,
            byCategory,
            byTaxCategory,
            monthlyTrend,
            topCategory: byCategory[0]?.category || "None yet",
            averageSpend: expenseCount > 0 ? totalSpend / expenseCount : 0,
            googleSheetUrl: summary?.googleSheetUrl || null,
            googleSheetSyncEnabled: Boolean(summary?.googleSheetSyncEnabled),
        };
    }, [summary]);

    if (loading) {
        return (
            <div className="space-y-8">
                <Skeleton className="h-10 w-64" />
                <div className="grid gap-4 lg:grid-cols-3">
                    <CardSkeleton />
                    <CardSkeleton />
                    <CardSkeleton />
                </div>
                <Skeleton className="h-72 w-full rounded-xl" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="ri-callout-warn">
                <p className="font-medium">Could not load dashboard</p>
                <p className="mt-1 text-sm opacity-90">{error}</p>
            </div>
        );
    }

    const {
        totalSpend,
        expenseCount,
        byCategory,
        byTaxCategory,
        monthlyTrend,
        topCategory,
        averageSpend,
        googleSheetUrl,
        googleSheetSyncEnabled,
    } =
        dashboardSummary;
    const hasData = expenseCount > 0;

    return (
        <div ref={rootRef} className="ri-page">
            {justSavedVendor ? (
                <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/[0.07] p-4 text-sm text-emerald-100">
                    Saved <span className="font-semibold">{justSavedVendor}</span>.
                    Your totals and recent expenses are up to date.
                </div>
            ) : null}

            <div className="ri-page-header">
                <div>
                    <h1 className="ri-page-title">Dashboard</h1>
                    <p className="ri-page-copy">
                        A clean overview of total spending, activity, and where
                        your money is going.
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {googleSheetSyncEnabled ? (
                        <span className="ri-inline-pill">Auto-sync active</span>
                    ) : null}
                    {googleSheetSyncEnabled ? (
                        <button
                            type="button"
                            onClick={handleTestGoogleSheetSync}
                            disabled={testingSheetSync}
                            className="ri-action-btn"
                        >
                            <span>{testingSheetSync ? "Testing sync..." : "Test sheet sync"}</span>
                        </button>
                    ) : null}
                    <Link to="/upload" className="ri-action-btn ri-action-btn-primary">
                        <ReceiptText size={16} strokeWidth={1.75} />
                        <span>Upload receipt</span>
                    </Link>
                    <Link to="/expenses" className="ri-action-btn">
                        <span>View expenses</span>
                        <ArrowRight size={16} strokeWidth={1.75} />
                    </Link>
                    {googleSheetUrl ? (
                        <a
                            href={googleSheetUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="ri-action-btn"
                        >
                            <span>Open Google Sheet</span>
                        </a>
                    ) : null}
                </div>
            </div>

            {!hasData ? (
                <EmptyState
                    title="No expenses yet"
                    description="Upload a receipt to save your first expense and start building a usable spending history."
                    action={
                        <Link to="/upload" className="ri-action-btn ri-action-btn-primary">
                            Upload receipt
                        </Link>
                    }
                />
            ) : (
                <>
                    <div className="grid gap-4 xl:grid-cols-3">
                        <section data-ri-card className="ri-panel p-5">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                                        Total spending
                                    </p>
                                    <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
                                        {formatCurrency(totalSpend)}
                                    </p>
                                </div>
                                <div className="ri-icon-wrap">
                                    <Wallet size={18} strokeWidth={1.75} />
                                </div>
                            </div>
                            <p className="mt-3 text-sm leading-6 text-slate-400">
                                The sum of all saved expenses in your workspace.
                            </p>
                        </section>

                        <section data-ri-card className="ri-panel p-5">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                                        Total records
                                    </p>
                                    <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
                                        {expenseCount}
                                    </p>
                                </div>
                                <div className="ri-icon-wrap">
                                    <LayoutDashboard size={18} strokeWidth={1.75} />
                                </div>
                            </div>
                            <p className="mt-3 text-sm leading-6 text-slate-400">
                                Every expense that has been reviewed and saved.
                            </p>
                        </section>

                        <section data-ri-card className="ri-panel p-5">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                                        Average expense
                                    </p>
                                    <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
                                        {formatCurrency(averageSpend)}
                                    </p>
                                </div>
                                <div className="ri-icon-wrap">
                                    <CreditCard size={18} strokeWidth={1.75} />
                                </div>
                            </div>
                            <p className="mt-3 text-sm leading-6 text-slate-400">
                                Current top category: {topCategory}.
                            </p>
                        </section>
                    </div>

                    <section className="ri-panel p-5">
                        <div className="flex flex-wrap items-end justify-between gap-3">
                            <div>
                                <h2 className="text-lg font-semibold tracking-tight text-white">
                                    Financial overview
                                </h2>
                                <p className="mt-1 text-sm leading-6 text-slate-400">
                                    Category and tax-ready breakdown for auditing and reporting.
                                </p>
                            </div>
                            <span className="ri-inline-pill">
                                {byCategory.length} categories
                            </span>
                        </div>
                        <div className="mt-6 grid gap-4 xl:grid-cols-2">
                            <div className="space-y-3">
                                {byCategory.slice(0, 5).map((entry) => (
                                    <div key={entry.category} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
                                        <span className="text-sm text-slate-300">{entry.category}</span>
                                        <span className="ri-amount-cell text-sm">
                                            {formatCurrency(entry.total)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-3">
                                {byTaxCategory.slice(0, 5).map((entry) => (
                                    <div key={entry.category} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
                                        <span className="text-sm text-slate-300">{entry.category}</span>
                                        <span className="ri-amount-cell text-sm">
                                            {formatCurrency(entry.total)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr),minmax(0,1.2fr),380px]">
                        <section className="ri-panel p-5">
                            <div className="flex flex-wrap items-end justify-between gap-3">
                                <div>
                                    <h2 className="text-lg font-semibold tracking-tight text-white">
                                        Spend by category
                                    </h2>
                                    <p className="mt-1 text-sm leading-6 text-slate-400">
                                        A simple category view built from your saved expenses.
                                    </p>
                                </div>
                                <span className="ri-inline-pill">
                                    {byCategory.length} categories
                                </span>
                            </div>
                            <div className="mt-6 h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={byCategory}
                                        margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                                        <XAxis
                                            dataKey="category"
                                            stroke="#64748b"
                                            tick={{ fill: "#94a3b8", fontSize: 12 }}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#64748b"
                                            tick={{ fill: "#94a3b8", fontSize: 12 }}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "#090c12",
                                                border: "1px solid rgba(255,255,255,0.08)",
                                                borderRadius: "12px",
                                            }}
                                            labelStyle={{ color: "#f8fafc" }}
                                        />
                                        <Bar
                                            dataKey="total"
                                            fill="#14b8a6"
                                            radius={[8, 8, 0, 0]}
                                            name="Amount"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </section>

                        <section className="ri-panel p-5">
                            <div className="flex flex-wrap items-end justify-between gap-3">
                                <div>
                                    <h2 className="text-lg font-semibold tracking-tight text-white">
                                        Monthly trend
                                    </h2>
                                    <p className="mt-1 text-sm leading-6 text-slate-400">
                                        A month-by-month view of how total spend is moving.
                                    </p>
                                </div>
                            </div>
                            <div className="mt-6 h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={monthlyTrend}
                                        margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                                        <XAxis
                                            dataKey="month"
                                            stroke="#64748b"
                                            tick={{ fill: "#94a3b8", fontSize: 12 }}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#64748b"
                                            tick={{ fill: "#94a3b8", fontSize: 12 }}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "#090c12",
                                                border: "1px solid rgba(255,255,255,0.08)",
                                                borderRadius: "12px",
                                            }}
                                            labelStyle={{ color: "#f8fafc" }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="total"
                                            stroke="#10b981"
                                            strokeWidth={2}
                                            dot={{ r: 3, fill: "#10b981" }}
                                            activeDot={{ r: 5 }}
                                            name="Spend"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </section>

                        <section className="ri-panel overflow-hidden">
                            <div className="border-b border-white/5 px-5 py-4">
                                <h2 className="text-lg font-semibold tracking-tight text-white">
                                    Recent expenses
                                </h2>
                                <p className="mt-1 text-sm leading-6 text-slate-400">
                                    The latest reviewed records in your account.
                                </p>
                            </div>
                            <div className="divide-y divide-white/5">
                                {recent.length === 0 ? (
                                    <div className="px-5 py-6 text-sm text-slate-400">
                                        No recent expenses found.
                                    </div>
                                ) : (
                                    recent.map((row) => (
                                        <div
                                            key={row.id}
                                            className="flex items-center justify-between gap-4 px-5 py-4"
                                        >
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-white">
                                                    {row.vendor}
                                                </p>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    {formatDate(row.date)} {" · "}
                                                    {row.tax_category || row.category || "General"}
                                                </p>
                                            </div>
                                            <p className="ri-amount-cell text-sm">
                                                {formatCurrency(row.amount, row.currency)}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>
                </>
            )}
        </div>
    );
}
