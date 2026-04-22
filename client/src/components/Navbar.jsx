import { NavLink, useNavigate } from "react-router-dom";
import {
    CreditCard,
    LayoutDashboard,
    LogOut,
    Menu,
    ReceiptText,
    Settings,
    X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";

const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/upload", label: "Upload", icon: ReceiptText },
    { to: "/expenses", label: "Expenses", icon: CreditCard },
    { to: "/settings", label: "Settings", icon: Settings },
];

function navItemClass(isActive) {
    return [
        "flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition",
        isActive
            ? "border-white/10 bg-white/[0.06] text-white"
            : "border-transparent text-slate-400 hover:border-white/5 hover:bg-white/[0.03] hover:text-white",
    ].join(" ");
}

function BrandMark() {
    return (
        <NavLink to="/" className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-sm font-semibold text-white">
                RQ
            </span>
            <div className="min-w-0">
                <span className="block truncate text-sm font-semibold tracking-tight text-white">
                    ReceiptIQ
                </span>
                <span className="hidden text-xs text-slate-500 sm:block">
                    Scan. Track. Save.
                </span>
            </div>
        </NavLink>
    );
}

function NavItems({ onNavigate }) {
    return navItems.map((item) => {
        const Icon = item.icon;
        return (
            <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => navItemClass(isActive)}
                onClick={onNavigate}
            >
                <Icon size={16} strokeWidth={1.75} />
                <span>{item.label}</span>
            </NavLink>
        );
    });
}

export function Navbar() {
    const { signOut, user } = useAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const initials = useMemo(() => {
        const email = user?.email || "";
        return email ? email[0].toUpperCase() : "R";
    }, [user?.email]);

    async function handleSignOut() {
        await signOut();
        navigate("/login");
    }

    return (
        <>
            <aside className="sticky top-0 hidden h-screen w-[272px] shrink-0 self-start border-r border-white/5 bg-[#090c12] xl:flex">
                <div className="flex h-screen w-full flex-col px-6 py-6">
                    <BrandMark />
                    <div className="mt-10">
                        <nav className="space-y-2">
                            <NavItems />
                        </nav>
                    </div>

                    <div className="mt-auto space-y-4 border-t border-white/5 pt-5">
                        <div className="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-3">
                            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                                Account
                            </p>
                            <div className="mt-3 flex items-center gap-3">
                                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xs font-semibold text-white">
                                    {initials}
                                </span>
                                <div className="min-w-0">
                                    <p
                                        className="truncate text-sm font-medium text-white"
                                        title={user?.email}
                                    >
                                        {user?.email}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        Secure workspace
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleSignOut}
                            className="flex w-full items-center justify-between rounded-xl border border-white/5 px-3 py-2.5 text-sm text-slate-300 transition hover:border-white/10 hover:bg-white/[0.03] hover:text-white"
                        >
                            <span>Sign out</span>
                            <LogOut size={16} strokeWidth={1.75} />
                        </button>
                    </div>
                </div>
            </aside>

            <header className="sticky top-0 z-30 w-full border-b border-white/5 bg-[#090c12]/90 backdrop-blur xl:hidden">
                <div className="flex items-center justify-between px-4 py-3">
                    <BrandMark />
                    <button
                        type="button"
                        onClick={() => setMobileOpen((value) => !value)}
                        className="rounded-xl border border-white/10 p-2 text-slate-300"
                        aria-label="Toggle navigation"
                    >
                        {mobileOpen ? (
                            <X size={18} strokeWidth={1.75} />
                        ) : (
                            <Menu size={18} strokeWidth={1.75} />
                        )}
                    </button>
                </div>
                {mobileOpen ? (
                    <div className="border-t border-white/5 px-4 py-4">
                        <nav className="space-y-2">
                            <NavItems onNavigate={() => setMobileOpen(false)} />
                        </nav>
                        <button
                            type="button"
                            onClick={handleSignOut}
                            className="mt-4 flex w-full items-center justify-between rounded-xl border border-white/5 px-3 py-2.5 text-sm text-slate-300"
                        >
                            <span>Sign out</span>
                            <LogOut size={16} strokeWidth={1.75} />
                        </button>
                    </div>
                ) : null}
            </header>
        </>
    );
}
