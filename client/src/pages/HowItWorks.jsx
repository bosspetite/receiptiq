import { Link } from "react-router-dom";
import { MarketingShell } from "../components/MarketingShell";

const steps = [
    {
        title: "Start with a receipt image",
        body: "The user uploads a clear image from a phone, screenshot, or export. The preview creates confidence before anything runs.",
    },
    {
        title: "AI proposes structured fields",
        body: "ReceiptIQ sends the image to Gemini and asks for clean JSON, then places the results straight into the review form.",
    },
    {
        title: "Human review keeps the data trustworthy",
        body: "Users can edit vendor, amount, category, currency, and line items before the record ever touches the database.",
    },
    {
        title: "Supabase stores user-scoped records",
        body: "Saved rows include the current authenticated user and are protected by Row Level Security policies in Supabase.",
    },
    {
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
                            A simple five-step system that turns receipt images
                            into reliable expense records.
                        </h1>
                        <p className="ri-subtitle">
                            The product is intentionally review-first: AI does
                            the tedious part, the user confirms accuracy, and
                            Supabase keeps the data personal.
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
                            className="w-full rounded-[1.6rem] border border-white/10 bg-slate-950/30 p-3"
                        />
                    </div>
                </section>

                <section className="mt-12 grid gap-5">
                    {steps.map((step, index) => (
                        <article key={step.title} className="ri-surface ri-surface-pad flex flex-col gap-4 md:flex-row md:items-start">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-300 to-amber-300 font-display text-xl font-bold text-slate-950">
                                {index + 1}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    {step.title}
                                </h2>
                                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                                    {step.body}
                                </p>
                            </div>
                        </article>
                    ))}
                </section>
            </main>
        </MarketingShell>
    );
}
