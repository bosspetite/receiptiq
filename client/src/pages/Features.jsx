import { Link } from "react-router-dom";
import { MarketingShell } from "../components/MarketingShell";

const featureGroups = [
    {
        title: "Capture without friction",
        points: [
            "Upload screenshots, phone photos, and exported images in seconds.",
            "Preview the receipt before extraction so users know exactly what the AI is reading.",
            "Keep the original workflow simple enough for daily use, not just monthly admin days.",
        ],
    },
    {
        title: "Review before it becomes data",
        points: [
            "AI fills vendor, date, amount, category, currency, and line items into the form.",
            "Users can correct every field before saving anything.",
            "Warnings and fallbacks keep the flow useful even when extraction is incomplete.",
        ],
    },
    {
        title: "Turn rows into visibility",
        points: [
            "Dashboard cards show spend, volume, and top categories.",
            "Recent expenses and chart views help users see activity right after saving.",
            "CSV export keeps the app practical for finance workflows and handoff moments.",
        ],
    },
];

export function Features() {
    return (
        <MarketingShell>
            <main className="ri-container py-16 sm:py-20">
                <section className="ri-page-hero">
                    <div className="relative grid gap-10 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
                        <div className="space-y-5">
                            <p className="ri-kicker">Features</p>
                            <h1 className="ri-h1 max-w-3xl">
                                Built to feel practical on day one and polished
                                enough to trust every week after that.
                            </h1>
                            <p className="ri-subtitle max-w-2xl">
                                ReceiptIQ is designed around the real expense
                                journey: capture, review, save, and understand.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Link to="/signup" className="ri-btn-primary">
                                    Try the full flow
                                </Link>
                                <Link to="/how-it-works" className="ri-btn-secondary">
                                    See the workflow
                                </Link>
                            </div>
                        </div>
                        <img
                            src="/hero-mosaic.svg"
                            alt="ReceiptIQ feature collage"
                            className="w-full rounded-[2rem] border border-white/10 bg-slate-950/40 p-3"
                        />
                    </div>
                </section>

                <section className="mt-10 grid gap-6 lg:grid-cols-3">
                    {featureGroups.map((group) => (
                        <article key={group.title} className="ri-surface ri-surface-pad ri-grid-accent">
                            <p className="ri-kicker">Core capability</p>
                            <h2 className="mt-4 text-2xl font-bold text-white">
                                {group.title}
                            </h2>
                            <ul className="mt-5 space-y-4 text-sm leading-7 text-slate-300">
                                {group.points.map((point) => (
                                    <li key={point} className="flex gap-3">
                                        <span className="mt-2 h-2.5 w-2.5 rounded-full bg-teal-300" />
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </section>
            </main>
        </MarketingShell>
    );
}
