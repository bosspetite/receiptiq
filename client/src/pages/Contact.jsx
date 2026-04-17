import { MarketingShell } from "../components/MarketingShell";

const contactCards = [
    {
        label: "Support",
        value: "support@receiptiq.com",
        note: "Best for bug reports, product questions, and account help.",
    },
    {
        label: "Partnerships",
        value: "partners@receiptiq.com",
        note: "For integrations, demos, and collaboration requests.",
    },
    {
        label: "Press",
        value: "press@receiptiq.com",
        note: "For interviews, screenshots, and media requests.",
    },
];

export function Contact() {
    return (
        <MarketingShell>
            <main className="ri-container py-16 sm:py-20">
                <section className="ri-page-hero">
                    <div className="relative grid gap-10 lg:grid-cols-[0.95fr,1.05fr] lg:items-center">
                        <div className="space-y-5">
                            <p className="ri-kicker">Contact</p>
                            <h1 className="ri-h1">
                                Reach the team behind ReceiptIQ.
                            </h1>
                            <p className="ri-subtitle">
                                This page is now structured like a real company
                                contact page. When you send your actual support
                                email, phone, address, socials, or founder info,
                                I can swap these placeholders for your real
                                details in one pass.
                            </p>
                        </div>
                        <div className="ri-surface ri-surface-pad">
                            <div className="space-y-4">
                                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                                    Response expectations
                                </p>
                                <div className="grid gap-3 sm:grid-cols-3">
                                    <div className="ri-surface-inner p-4">
                                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                                            Support
                                        </p>
                                        <p className="mt-3 text-lg font-bold text-white">
                                            Within 1 business day
                                        </p>
                                    </div>
                                    <div className="ri-surface-inner p-4">
                                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                                            Partnerships
                                        </p>
                                        <p className="mt-3 text-lg font-bold text-white">
                                            Within 3 business days
                                        </p>
                                    </div>
                                    <div className="ri-surface-inner p-4">
                                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                                            Status
                                        </p>
                                        <p className="mt-3 text-lg font-bold text-white">
                                            Monitored daily
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-10 grid gap-6 lg:grid-cols-3">
                    {contactCards.map((card) => (
                        <article key={card.label} className="ri-surface ri-surface-pad">
                            <p className="ri-kicker">{card.label}</p>
                            <h2 className="mt-4 text-2xl font-bold text-white">
                                {card.value}
                            </h2>
                            <p className="mt-4 text-sm leading-7 text-slate-300">
                                {card.note}
                            </p>
                        </article>
                    ))}
                </section>
            </main>
        </MarketingShell>
    );
}
