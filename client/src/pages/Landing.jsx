import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { IntroOverlay } from "../components/IntroOverlay";
import { MarketingShell } from "../components/MarketingShell";
import { useAuth } from "../hooks/useAuth";
import heroImage from "../assets/hero.png";

const highlights = [
    { label: "Made for", value: "Freelancers" },
    { label: "Best fit", value: "Small business" },
    { label: "Workflow", value: "Scan to saved" },
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
                                    Scan. Track. Save.
                                </span>
                                <span className="ri-badge">Built in Nigeria</span>
                            </div>
                            <p data-ri-hero-copy className="ri-kicker">
                                Expense tracking without the manual work
                            </p>
                            <h1 data-ri-hero-copy className="ri-h1 max-w-4xl text-5xl sm:text-6xl">
                                AI receipt capture for freelancers and small businesses.
                            </h1>
                            <p data-ri-hero-copy className="ri-subtitle max-w-2xl text-base sm:text-lg">
                                ReceiptIQ uses AI to instantly extract and log
                                expense data from receipt photos so you can stop
                                losing track of spending and start keeping clean,
                                usable records.
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
                                        className="w-full rounded-[1rem] border border-white/10 bg-slate-950/35 p-3"
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
                                <p className="ri-kicker">Why it exists</p>
                                <h2 className="text-3xl font-bold text-white sm:text-4xl">
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
