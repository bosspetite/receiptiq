import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const navItems = [
    { to: "/features", label: "Features" },
    { to: "/how-it-works", label: "How it works" },
    { to: "/why-receiptiq", label: "Why ReceiptIQ" },
    { to: "/contact", label: "Contact" },
];

const socials = [
    { href: "https://github.com/bosspetite", label: "GitHub" },
    { href: "https://linkedin.com/in/bassey-emmanuel-obeys-2a69663b4", label: "LinkedIn" },
    { href: "https://x.com/BasseyObey15213", label: "X" },
    { href: "https://instagram.com/BasseyObeys", label: "Instagram" },
];

export function MarketingShell({ children }) {
    const { session } = useAuth();
    const primaryHref = session ? "/dashboard" : "/signup";
    const secondaryHref = session ? "/dashboard" : "/login";

    return (
        <div className="ri-shell isolate overflow-x-clip text-slate-100">
            <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
                <div className="ri-container flex items-center gap-3 py-4 lg:grid lg:grid-cols-[auto,1fr,auto] lg:gap-6">
                    <Link to="/" className="flex min-w-0 flex-1 items-center gap-3 lg:flex-none">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-teal-300/20 bg-white/5 font-display text-sm font-bold text-teal-200">
                            RQ
                        </span>
                        <div className="min-w-0">
                            <p className="truncate font-display text-lg font-bold text-white">
                                ReceiptIQ
                            </p>
                            <p className="hidden text-xs uppercase tracking-[0.24em] text-slate-500 sm:block">
                                Expense intelligence
                            </p>
                        </div>
                    </Link>
                    <nav className="hidden min-w-0 items-center justify-center gap-1 lg:flex">
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
                    <div className="ml-auto flex shrink-0 items-center justify-end gap-2">
                        <Link
                            to={secondaryHref}
                            className="ri-btn-ghost hidden sm:inline-flex"
                        >
                            {session ? "Dashboard" : "Sign in"}
                        </Link>
                        <Link to={primaryHref} className="ri-btn-primary shrink-0">
                            {session ? "Open app" : "Get started"}
                        </Link>
                    </div>
                </div>
            </header>

            <div className="relative z-0 overflow-x-clip">
                {children}
            </div>

            <footer className="ri-marketing-footer relative overflow-hidden border-t border-white/10 bg-slate-950/50 py-12">
                <div className="ri-container relative z-10 grid gap-8 lg:grid-cols-[1.4fr,1fr,1fr]">
                    <div className="space-y-4">
                        <p className="text-2xl font-semibold tracking-tight text-white">
                            ReceiptIQ
                        </p>
                        <p className="max-w-md text-sm leading-7 text-slate-400">
                            Scan. Track. Save. ReceiptIQ uses AI to extract and
                            log expense data from receipt photos so freelancers
                            and small businesses can keep spending records without
                            manual admin.
                        </p>
                        <div className="space-y-1 text-sm text-slate-400">
                            <p>Ibadan, Oyo State, Nigeria</p>
                            <a href="mailto:hello@receiptiq.com" className="hover:text-white">
                                hello@receiptiq.com
                            </a>
                            <p>+234 811 207 5017</p>
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm text-slate-300">
                            {socials.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hover:text-white"
                                >
                                    {social.label}
                                </a>
                            ))}
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
                        <p className="pt-3 text-sm leading-6 text-slate-400">
                            Built by Bassey Emmanuel Obeys, founder of ReceiptIQ
                            and full-stack developer at Petite Media Co.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
