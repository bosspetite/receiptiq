import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";
import gsap from "gsap";
import { api } from "../services/api";
import { formatCurrency, formatDate } from "../utils/formatCurrency";
import { CardSkeleton, Skeleton } from "../components/Skeleton";
import { EmptyState } from "../components/EmptyState";

export function Dashboard() {
    const rootRef = useRef(null);
    const location = useLocation();
    const [summary, setSummary] = useState(null);
    const [recent, setRecent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                const summaryData =
                    summaryRes.status === "fulfilled"
                        ? summaryRes.value.data
                        : null;
                const fallbackSummary = expenses.reduce(
                    (acc, expense) => {
                        const amount = Number(expense.amount) || 0;
                        const category = expense.category || "Uncategorized";
                        acc.totalSpend += amount;
                        acc.expenseCount += 1;
                        acc.byCategoryMap.set(
                            category,
                            (acc.byCategoryMap.get(category) || 0) + amount,
                        );
                        return acc;
                    },
                    {
                        totalSpend: 0,
                        expenseCount: 0,
                        byCategoryMap: new Map(),
                    },
                );

                const rawByCategory =
                    summaryData?.byCategory ||
                    Array.from(fallbackSummary.byCategoryMap.entries()).map(
                        ([category, total]) => ({
                            category,
                            total,
                        }),
                    );

                const sortedCategories = [...rawByCategory].sort(
                    (a, b) => (Number(b.total) || 0) - (Number(a.total) || 0),
                );

                if (!cancelled) {
                    setSummary({
                        totalSpend:
                            summaryData?.totalSpend ??
                            fallbackSummary.totalSpend,
                        expenseCount:
                            summaryData?.expenseCount ??
                            fallbackSummary.expenseCount,
                        byCategory: sortedCategories,
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
            stagger: 0.1,
            duration: 0.65,
            ease: "power3.out",
        });
    }, [loading]);

    if (loading) {
        return (
            <div className="space-y-8">
                <Skeleton className="h-10 w-64" />
                <div className="grid gap-4 sm:grid-cols-3">
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

    const { totalSpend = 0, expenseCount = 0, byCategory = [] } = summary || {};
    const hasData = expenseCount > 0;
    const topCategory = byCategory[0]?.category || "-";
    const topCategories = byCategory.slice(0, 3);
    const justSavedVendor = location.state?.savedExpense?.vendor;

    return (
        <div ref={rootRef} className="ri-page">
            {justSavedVendor ? (
                <div className="rounded-[1.4rem] border border-emerald-700/40 bg-emerald-950/30 p-4 text-sm text-emerald-100">
                    Saved <span className="font-semibold">{justSavedVendor}</span>. Your dashboard and recent expenses have been refreshed.
                </div>
            ) : null}

            <div className="ri-page-hero">
                <div className="relative flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="ri-kicker">Live overview</p>
                        <h1 className="ri-h1">Dashboard</h1>
                        <p className="ri-subtitle">
                            A calm view of what has already been captured, saved,
                            and categorized.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Link to="/upload" className="ri-btn-primary">
                            Upload receipt
                        </Link>
                        <Link to="/expenses" className="ri-btn-secondary">
                            View expenses
                        </Link>
                    </div>
                </div>
            </div>

            {!hasData ? (
                <EmptyState
                    title="No expenses yet"
                    description="Upload a receipt to extract the details, save it, and start building your dashboard."
                    action={
                        <Link to="/upload" className="ri-btn-primary">
                            Upload receipt
                        </Link>
                    }
                />
            ) : (
                <>
                    <div className="grid gap-4 lg:grid-cols-12">
                        <div
                            data-ri-card
                            className="ri-surface ri-surface-pad ri-grid-accent lg:col-span-4"
                        >
                            <p className="ri-kicker">Spend to date</p>
                            <p className="ri-stat-value">
                                {formatCurrency(totalSpend)}
                            </p>
                            <p className="mt-3 text-sm text-slate-400">
                                Across {expenseCount} saved expenses.
                            </p>
                        </div>
                        <div
                            data-ri-card
                            className="ri-surface ri-surface-pad ri-grid-accent lg:col-span-4"
                        >
                            <p className="ri-kicker">Receipt volume</p>
                            <p className="ri-stat-value">{expenseCount}</p>
                            <p className="mt-3 text-sm text-slate-400">
                                New records appear here the moment they are saved.
                            </p>
                        </div>
                        <div
                            data-ri-card
                            className="ri-surface ri-surface-pad ri-grid-accent lg:col-span-4"
                        >
                            <p className="ri-kicker">Top category</p>
                            <p className="ri-stat-value">{topCategory}</p>
                            <p className="mt-3 text-sm text-slate-400">
                                The strongest spending cluster in your workspace.
                            </p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {topCategories.map((c) => (
                                    <span key={c.category} className="ri-badge">
                                        {c.category}
                                        <span className="ml-2 tabular-nums text-slate-400">
                                            {formatCurrency(c.total)}
                                        </span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-12">
                        <div className="ri-surface ri-surface-pad lg:col-span-8">
                            <div className="flex flex-wrap items-end justify-between gap-3">
                                <div>
                                    <p className="ri-kicker">Spend map</p>
                                    <h2 className="text-2xl font-bold text-white">
                                        Spend by category
                                    </h2>
                                    <p className="mt-2 text-sm text-slate-400">
                                        Hover to inspect how your saved expenses are distributed.
                                    </p>
                                </div>
                                <span className="ri-badge-accent">Live data</span>
                            </div>
                            <div className="mt-6 h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={byCategory}
                                        margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                        <XAxis
                                            dataKey="category"
                                            stroke="#94a3b8"
                                            tick={{ fill: "#94a3b8", fontSize: 12 }}
                                        />
                                        <YAxis
                                            stroke="#94a3b8"
                                            tick={{ fill: "#94a3b8", fontSize: 12 }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "#1e293b",
                                                border: "1px solid #475569",
                                                borderRadius: "14px",
                                            }}
                                            labelStyle={{ color: "#f1f5f9" }}
                                        />
                                        <Bar
                                            dataKey="total"
                                            fill="#48ccbf"
                                            radius={[10, 10, 0, 0]}
                                            name="Amount"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="ri-surface overflow-hidden lg:col-span-4">
                            <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-6 py-4">
                                <div>
                                    <p className="ri-kicker">Recent activity</p>
                                    <p className="text-lg font-bold text-white">
                                        Recent expenses
                                    </p>
                                </div>
                                <Link
                                    to="/expenses"
                                    className="text-sm text-slate-300 hover:text-teal-200"
                                >
                                    View all
                                </Link>
                            </div>
                            <div className="divide-y divide-white/5">
                                {recent.length === 0 ? (
                                    <div className="p-6 text-sm text-slate-400">
                                        No recent expenses found.
                                    </div>
                                ) : (
                                    recent.map((row) => (
                                        <div
                                            key={row.id}
                                            className="flex items-center justify-between gap-3 px-6 py-4 hover:bg-white/5"
                                        >
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-white">
                                                    {row.vendor}
                                                </p>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    {formatDate(row.date)} | {row.category || "Uncategorized"}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="tabular-nums text-sm font-semibold text-slate-100">
                                                    {formatCurrency(row.amount, row.currency)}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="border-t border-white/10 bg-white/5 px-6 py-4">
                                <Link
                                    to="/upload"
                                    className="ri-btn-primary w-full justify-center"
                                >
                                    Upload another receipt
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
