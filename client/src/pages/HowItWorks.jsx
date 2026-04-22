import { Link } from "react-router-dom";
import { LineChart, PencilLine, ScanLine, ShieldCheck, Sparkles } from "lucide-react";
import { MarketingShell } from "../components/MarketingShell";

const steps = [
    {
        icon: ScanLine,
        label: "Capture",
        title: "Start with a receipt image",
        body: "Upload a clear receipt photo, screenshot, or export. The preview helps the user confirm the right file before extraction begins.",
    },
    {
        icon: Sparkles,
        label: "Extract",
        title: "AI proposes structured fields",
        body: "ReceiptIQ sends the image to Gemini and asks for clean JSON, then places the results straight into the review form.",
    },
    {
        icon: PencilLine,
        label: "Review",
        title: "Human review keeps the data trustworthy",
        body: "Users can edit vendor, amount, category, currency, and line items before the record ever touches the database.",
    },
    {
        icon: ShieldCheck,
        label: "Protect",
        title: "Saved records stay personal",
        body: "Each saved expense stays tied to the signed-in account so records remain private and account-specific.",
    },
    {
        icon: LineChart,
        label: "Track",
        title: "The dashboard updates immediately",
        body: "Recent expenses, total spend, and category breakdowns all reflect the newly saved data so the workflow feels closed and complete.",
    },
];

export function HowItWorks() {
    return (
        <MarketingShell>
            <main className="ri-container py-16 sm:py-20">
                <section className="grid gap-10 lg:grid-cols-[0.95fr,1.05fr] lg:items-center">
                    <div className="space-y-5">
                        <p className="ri-kicker">How it works</p>
                        <h1 className="ri-h1">
                            A simple workflow that turns receipt images
                            into reliable expense records.
                        </h1>
                        <p className="ri-subtitle">
                            The workflow is intentionally review-first. AI handles
                            extraction, the user confirms the details, and the saved
                            record becomes part of a clean expense history.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Link to="/signup" className="ri-btn-primary">
                                Run the workflow
                            </Link>
                            <Link to="/features" className="ri-btn-secondary">
                                Explore features
                            </Link>
                        </div>
                    </div>
                    <div className="ri-surface ri-surface-pad">
                        <img
                            src="/receipt-stack.svg"
                            alt="ReceiptIQ receipt stack illustration"
                            className="w-full rounded-[1rem] border border-white/10 bg-slate-950/30 p-3"
                        />
                    </div>
                </section>

                <section className="mt-12 grid gap-5">
                    {steps.map((step) => {
                        const Icon = step.icon;
                        return (
                        <article key={step.title} className="ri-surface ri-surface-pad flex flex-col gap-4 sm:flex-row sm:items-start">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-teal-200">
                                <Icon size={20} strokeWidth={1.75} />
                            </div>
                            <div>
                                <p className="ri-kicker">{step.label}</p>
                                <h2 className="text-2xl font-bold text-white">
                                    {step.title}
                                </h2>
                                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                                    {step.body}
                                </p>
                            </div>
                        </article>
                    )})}
                </section>
            </main>
        </MarketingShell>
    );
}
