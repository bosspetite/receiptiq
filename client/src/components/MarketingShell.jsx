import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const navItems = [
    { to: "/features", label: "Features" },
    { to: "/how-it-works", label: "How it works" },
    { to: "/why-receiptiq", label: "Why ReceiptIQ" },
    { to: "/contact", label: "Contact" },
];

export function MarketingShell({ children }) {
    const { session } = useAuth();
    const primaryHref = session ? "/dashboard" : "/signup";
    const secondaryHref = session ? "/dashboard" : "/login";

    return (
        <div className="ri-shell text-slate-100">
            <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
                <div className="ri-container flex items-center justify-between py-4">
                    <Link to="/" className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-teal-300/20 bg-white/5 font-display text-sm font-bold text-teal-200">
                            RQ
                        </span>
                        <div>
                            <p className="font-display text-lg font-bold text-white">
                                ReceiptIQ
                            </p>
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                                Expense intelligence
                            </p>
                        </div>
                    </Link>
                    <nav className="hidden items-center gap-1 lg:flex">
                        {navItems.map((item) => (
                            <Link
                                key={item.to}
                                to={item.to}
                                className="ri-marketing-link"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="flex items-center gap-2">
                        <Link
                            to={secondaryHref}
                            className="ri-btn-ghost hidden sm:inline-flex"
                        >
                            {session ? "Dashboard" : "Sign in"}
                        </Link>
                        <Link to={primaryHref} className="ri-btn-primary">
                            {session ? "Open app" : "Get started"}
                        </Link>
                    </div>
                </div>
            </header>

            {children}

            <footer className="border-t border-white/10 bg-slate-950/50 py-12">
                <div className="ri-container grid gap-8 lg:grid-cols-[1.4fr,1fr,1fr]">
                    <div className="space-y-4">
                        <p className="font-display text-2xl font-bold text-white">
                            ReceiptIQ
                        </p>
                        <p className="max-w-md text-sm leading-7 text-slate-400">
                            A review-first expense platform that helps people
                            turn receipt images into trusted financial records.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="ri-badge-accent">GSAP motion</span>
                            <span className="ri-badge">Gemini extraction</span>
                            <span className="ri-badge">Supabase + RLS</span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                            Product
                        </p>
                        <div className="flex flex-col gap-3 text-sm text-slate-300">
                            <Link to="/features" className="hover:text-teal-200">
                                Features
                            </Link>
                            <Link to="/how-it-works" className="hover:text-teal-200">
                                How it works
                            </Link>
                            <Link to="/why-receiptiq" className="hover:text-teal-200">
                                Why ReceiptIQ
                            </Link>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                            Company
                        </p>
                        <div className="flex flex-col gap-3 text-sm text-slate-300">
                            <Link to="/contact" className="hover:text-teal-200">
                                Contact
                            </Link>
                            <Link to="/privacy" className="hover:text-teal-200">
                                Privacy
                            </Link>
                            <Link to="/terms" className="hover:text-teal-200">
                                Terms
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
