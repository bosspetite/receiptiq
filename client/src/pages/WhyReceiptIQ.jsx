import { MarketingShell } from "../components/MarketingShell";

const reasons = [
    {
        title: "It solves a real local problem",
        body: "ReceiptIQ was created from the everyday reality of freelancers and small business owners who keep receipts but rarely have time to log them properly.",
    },
    {
        title: "It respects review",
        body: "The interface treats AI as a drafting assistant, not the final authority. Users stay in control before anything is saved.",
    },
    {
        title: "It feels credible",
        body: "The product aims to feel calm, finance-aware, and trustworthy instead of flashy or experimental, which matters when money data is involved.",
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
                            Designed for people who want automation without losing trust in the numbers.
                        </h1>
                        <p className="ri-subtitle max-w-3xl">
                            ReceiptIQ is built to make expense tracking lighter,
                            faster, and more believable for everyday users.
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
