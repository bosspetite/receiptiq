import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const linkClass = ({ isActive }) =>
    [
        "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
        isActive
            ? "bg-white/10 text-white ring-1 ring-teal-300/25"
            : "text-slate-300 hover:bg-white/5 hover:text-white",
    ].join(" ");

export function Navbar() {
    const { signOut, user } = useAuth();
    const navigate = useNavigate();

    return (
        <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
            <div className="ri-container flex flex-wrap items-center justify-between gap-4 py-3">
                <div className="flex items-center gap-3">
                    <NavLink
                        to="/"
                        className="flex items-center gap-3 rounded-2xl px-2 py-1"
                    >
                        <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-teal-300/20 bg-white/5 font-display text-sm font-bold text-teal-200">
                            RQ
                        </span>
                        <div>
                            <span className="block text-sm font-semibold tracking-tight text-white sm:text-base">
                                Receipt<span className="text-teal-200">IQ</span>
                            </span>
                            <span className="hidden text-[10px] uppercase tracking-[0.22em] text-slate-500 sm:block">
                                Workspace
                            </span>
                        </div>
                    </NavLink>
                    <span className="hidden h-5 w-px bg-white/10 sm:block" />
                    <nav className="flex flex-wrap items-center gap-1">
                        <NavLink to="/dashboard" className={linkClass}>
                            Dashboard
                        </NavLink>
                        <NavLink to="/upload" className={linkClass}>
                            Upload
                        </NavLink>
                        <NavLink to="/expenses" className={linkClass}>
                            Expenses
                        </NavLink>
                        <NavLink to="/settings" className={linkClass}>
                            Settings
                        </NavLink>
                    </nav>
                </div>
                <div className="flex items-center gap-2">
                    <span
                        className="hidden max-w-[16rem] truncate rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-400 sm:inline"
                        title={user?.email}
                    >
                        {user?.email}
                    </span>
                    <button
                        type="button"
                        onClick={async () => {
                            await signOut();
                            navigate("/login");
                        }}
                        className="ri-btn-secondary"
                    >
                        Sign out
                    </button>
                </div>
            </div>
        </header>
    );
}
