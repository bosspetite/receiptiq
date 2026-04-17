import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { IntroOverlay } from "../components/IntroOverlay";
import { MarketingShell } from "../components/MarketingShell";
import { useAuth } from "../hooks/useAuth";
import heroImage from "../assets/hero.png";

const highlights = [
    { label: "Review-first extraction", value: "Human approved" },
    { label: "Private data model", value: "Supabase RLS" },
    { label: "Fast dashboard loop", value: "Save to insight" },
];

const stories = [
    {
        title: "For operators",
        body: "Turn admin overhead into a clean weekly rhythm instead of a painful catch-up sprint.",
    },
    {
        title: "For solo teams",
        body: "Keep expenses visible without building a full finance ops stack too early.",
    },
    {
        title: "For personal clarity",
        body: "Understand what happened, what it cost, and where it belongs in one glance.",
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
                y: 28,
                duration: 0.8,
                stagger: 0.08,
                ease: "power3.out",
            });

            gsap.from("[data-ri-hero-art]", {
                opacity: 0,
                scale: 0.96,
                y: 18,
                duration: 0.95,
                ease: "power3.out",
                delay: 0.12,
            });

            gsap.from("[data-ri-story-card]", {
                opacity: 0,
                y: 24,
                stagger: 0.1,
                duration: 0.7,
                ease: "power2.out",
                delay: 0.35,
            });
        }, root);

        return () => ctx.revert();
    }, []);

    return (
        <MarketingShell>
            <IntroOverlay />
            <main ref={rootRef}>
                <section className="ri-container py-10 sm:py-14">
                    <div className="grid gap-8 lg:grid-cols-[1.02fr,0.98fr] lg:items-center">
                        <div className="space-y-6">
                            <div data-ri-hero-copy className="flex flex-wrap gap-2">
                                <span className="ri-badge-accent">
                                    AI receipt intelligence
                                </span>
                                <span className="ri-badge">
                                    Live dashboard workflow
                                </span>
                            </div>
                            <p data-ri-hero-copy className="ri-kicker">
                                Built to feel calm, quick, and trustworthy
                            </p>
                            <h1 data-ri-hero-copy className="ri-h1 max-w-4xl text-5xl sm:text-6xl">
                                The receipt tracker that actually finishes the job.
                            </h1>
                            <p data-ri-hero-copy className="ri-subtitle max-w-2xl text-base sm:text-lg">
                                Upload a receipt, let AI draft the record, review
                                it with confidence, save it to your personal
                                workspace, and see the result reflected instantly.
                            </p>
                            <div data-ri-hero-copy className="flex flex-wrap gap-3">
                                <Link to={primaryHref} className="ri-btn-primary">
                                    {session ? "Open dashboard" : "Get started"}
                                </Link>
                                <Link to={secondaryHref} className="ri-btn-secondary">
                                    {session ? "Go to app" : "Sign in"}
                                </Link>
                            </div>
                            <div
                                data-ri-hero-copy
                                className="grid gap-4 sm:grid-cols-3"
                            >
                                {highlights.map((item) => (
                                    <div key={item.label} className="ri-stat">
                                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                                            {item.label}
                                        </p>
                                        <p className="ri-stat-value text-2xl">
                                            {item.value}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div data-ri-hero-art className="ri-surface ri-surface-pad">
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
                                        className="w-full rounded-[1.55rem] border border-white/10 bg-slate-950/35 p-3"
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
                    <div className="ri-page-hero">
                        <div className="relative grid gap-8 lg:grid-cols-[0.9fr,1.1fr] lg:items-center">
                            <div className="space-y-4">
                                <p className="ri-kicker">The full story</p>
                                <h2 className="text-3xl font-bold text-white sm:text-4xl">
                                    More than scanning. It is a full receipt-to-dashboard loop.
                                </h2>
                                <p className="text-sm leading-7 text-slate-300 sm:text-base">
                                    ReceiptIQ exists to reduce the annoying gap
                                    between "I have a receipt image" and "I have
                                    a trusted expense record I can actually use."
                                </p>
                            </div>
                            <div className="grid gap-4 md:grid-cols-3">
                                {stories.map((story) => (
                                    <article
                                        key={story.title}
                                        data-ri-story-card
                                        className="ri-surface-inner p-5"
                                    >
                                        <h3 className="text-xl font-bold text-white">
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
