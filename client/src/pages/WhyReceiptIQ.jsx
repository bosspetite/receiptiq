import { MarketingShell } from "../components/MarketingShell";

const reasons = [
    {
        title: "It closes the loop",
        body: "Many receipt tools stop at extraction. ReceiptIQ keeps going until the expense is saved and visible on the dashboard.",
    },
    {
        title: "It respects review",
        body: "The interface assumes AI is helpful but not sacred. That gives users confidence to correct fields before they become records.",
    },
    {
        title: "It feels personal",
        body: "Supabase auth and RLS keep each user's data private without forcing the app into a heavy enterprise workflow.",
    },
];

export function WhyReceiptIQ() {
    return (
        <MarketingShell>
            <main className="ri-container py-16 sm:py-20">
                <section className="ri-page-hero">
                    <div className="relative space-y-5">
                        <p className="ri-kicker">Why ReceiptIQ</p>
                        <h1 className="ri-h1 max-w-4xl">
                            Designed for people who want modern automation but
                            still need clean, believable finance data.
                        </h1>
                        <p className="ri-subtitle max-w-3xl">
                            The product story is simple: make expense tracking
                            feel lighter without making it feel risky.
                        </p>
                    </div>
                </section>

                <section className="mt-10 grid gap-6 lg:grid-cols-3">
                    {reasons.map((reason) => (
                        <article key={reason.title} className="ri-surface ri-surface-pad">
                            <p className="ri-kicker">Why it matters</p>
                            <h2 className="mt-4 text-2xl font-bold text-white">
                                {reason.title}
                            </h2>
                            <p className="mt-4 text-sm leading-7 text-slate-300">
                                {reason.body}
                            </p>
                        </article>
                    ))}
                </section>
            </main>
        </MarketingShell>
    );
}
