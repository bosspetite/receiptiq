import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ScanLine, ShieldCheck, Wallet } from "lucide-react";
import { gsap } from "gsap";
import { IntroOverlay } from "../components/IntroOverlay";
import { MarketingShell } from "../components/MarketingShell";
import { useAuth } from "../hooks/useAuth";
import heroImage from "../assets/hero.png";

const highlights = [
    { label: "Made for", value: "Freelancers", icon: Wallet },
    { label: "Best fit", value: "Small business", icon: ShieldCheck },
    { label: "Workflow", value: "Scan to saved", icon: ScanLine },
];

const stories = [
    {
        title: "For freelancers",
        body: "Keep business spending organized without pausing your day to manually enter every receipt.",
    },
    {
        title: "For small businesses",
        body: "Give owners a simple record of daily expenses before they grow into accounting problems.",
    },
    {
        title: "For better decisions",
        body: "Turn scattered receipt photos into a clean trail of spending you can actually review later.",
    },
];

const heroNotes = [
    "Upload the receipt image",
    "Review the extracted fields",
    "Save and watch the dashboard update",
];

export function Landing() {
    const rootRef = useRef(null);
    const { session } = useAuth();
    const primaryHref = session ? "/dashboard" : "/signup";
    const secondaryHref = session ? "/dashboard" : "/login";

    useLayoutEffect(() => {
        const root = rootRef.current;
        if (!root) return undefined;

        const reduceMotion = window.matchMedia?.(
            "(prefers-reduced-motion: reduce)",
        )?.matches;
        if (reduceMotion) return undefined;

        const ctx = gsap.context(() => {
            gsap.from("[data-ri-hero-copy]", {
                opacity: 0,
                y: 24,
                duration: 0.7,
                stagger: 0.07,
                ease: "power3.out",
            });

            gsap.from("[data-ri-hero-art]", {
                opacity: 0,
                scale: 0.98,
                y: 14,
                duration: 0.8,
                ease: "power3.out",
                delay: 0.1,
            });
        }, root);

        return () => ctx.revert();
    }, []);

    return (
        <MarketingShell>
            <IntroOverlay />
            <main ref={rootRef}>
                <section className="ri-container py-10 sm:py-16">
                    <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.05fr),minmax(420px,0.95fr)]">
                        <div className="space-y-7">
                            <div data-ri-hero-copy className="flex flex-wrap gap-2">
                                <span className="ri-badge-accent">Scan. Track. Save.</span>
                                <span className="ri-badge">Built in Nigeria</span>
                            </div>
                            <div data-ri-hero-copy className="space-y-4">
                                <h1 className="ri-landing-title">
                                    AI receipt capture for freelancers and small businesses.
                                </h1>
                                <p className="ri-landing-copy">
                                    ReceiptIQ uses AI to instantly extract and log
                                    expense data from receipt photos so you can
                                    stop losing track of spending and start keeping
                                    clean, usable records.
                                </p>
                            </div>
                            <div data-ri-hero-copy className="flex flex-wrap gap-3">
                                <Link to={primaryHref} className="ri-action-btn ri-action-btn-primary">
                                    <span>{session ? "Open dashboard" : "Get started"}</span>
                                    <ArrowRight size={16} strokeWidth={1.75} />
                                </Link>
                                <Link to={secondaryHref} className="ri-action-btn">
                                    {session ? "Go to app" : "Sign in"}
                                </Link>
                            </div>
                            <div
                                data-ri-hero-copy
                                className="grid gap-4 sm:grid-cols-3"
                            >
                                {highlights.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <div key={item.label} className="ri-panel p-5">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <Icon size={15} strokeWidth={1.75} />
                                                <p className="text-xs font-medium uppercase tracking-[0.18em]">
                                                    {item.label}
                                                </p>
                                            </div>
                                            <p className="mt-4 text-lg font-semibold tracking-tight text-white">
                                                {item.value}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div data-ri-hero-art className="ri-panel p-4 sm:p-5">
                            <div className="ri-hero-frame">
                                <div className="ri-hero-orb" />
                                <div className="ri-hero-glass-card">
                                    <img
                                        src={heroImage}
                                        alt="ReceiptIQ visual identity artwork"
                                        className="ri-hero-graphic"
                                    />
                                </div>
                                <div className="ri-hero-preview">
                                    <img
                                        src="/hero-mosaic.svg"
                                        alt="ReceiptIQ dashboard and workflow preview"
                                        className="w-full rounded-xl border border-white/5 bg-slate-950/40 p-3"
                                    />
                                </div>
                                <div className="ri-hero-caption">
                                    {heroNotes.map((note) => (
                                        <p key={note}>{note}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="ri-container py-8 sm:py-12">
                    <div className="ri-panel p-6 sm:p-8">
                        <div className="grid gap-8 lg:grid-cols-[0.9fr,1.1fr] lg:items-start">
                            <div className="space-y-4">
                                <h2 className="text-3xl font-semibold tracking-tighter text-white sm:text-4xl">
                                    Built from a real business problem, not a trend.
                                </h2>
                                <p className="text-sm leading-7 text-slate-300 sm:text-base">
                                    ReceiptIQ was built by Bassey Emmanuel Obeys
                                    through Petite Media Co. after seeing how often
                                    local business owners and freelancers lost track
                                    of daily expenses simply because the recording
                                    process was too manual.
                                </p>
                            </div>
                            <div className="grid gap-4 md:grid-cols-3">
                                {stories.map((story) => (
                                    <article
                                        key={story.title}
                                        className="ri-surface-inner p-5"
                                    >
                                        <h3 className="text-xl font-semibold tracking-tight text-white">
                                            {story.title}
                                        </h3>
                                        <p className="mt-3 text-sm leading-7 text-slate-300">
                                            {story.body}
                                        </p>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </MarketingShell>
    );
}
