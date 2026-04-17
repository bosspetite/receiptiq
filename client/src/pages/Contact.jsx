import { MarketingShell } from "../components/MarketingShell";

const contactCards = [
    {
        label: "Support",
        value: "support@receiptiq.com",
        note: "Best for bug reports, privacy requests, product questions, and account help.",
    },
    {
        label: "Business",
        value: "hello@receiptiq.com",
        note: "For partnerships, demos, business enquiries, and general communication.",
    },
    {
        label: "Phone",
        value: "+234 811 207 5017",
        note: "For direct enquiries during working hours in Nigeria.",
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
                                ReceiptIQ is based in Ibadan, Oyo State, Nigeria
                                and is built by Bassey Emmanuel Obeys under
                                Petite Media Co. Reach out for product support,
                                partnerships, or general business enquiries.
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
                                            Business
                                        </p>
                                        <p className="mt-3 text-lg font-bold text-white">
                                            Within 2 business days
                                        </p>
                                    </div>
                                    <div className="ri-surface-inner p-4">
                                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                                            Status
                                        </p>
                                        <p className="mt-3 text-lg font-bold text-white">
                                            Monitored weekly
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

                <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
                    <article className="ri-surface ri-surface-pad">
                        <p className="ri-kicker">Founder</p>
                        <h2 className="mt-4 text-2xl font-bold text-white">
                            Bassey Emmanuel Obeys
                        </h2>
                        <p className="mt-2 text-sm text-slate-400">
                            Founder & Full-Stack Developer
                        </p>
                        <p className="mt-4 text-sm leading-7 text-slate-300">
                            Bassey Emmanuel Obeys is a freelance web developer and
                            digital entrepreneur based in Ibadan, Nigeria.
                            Operating under Petite Media Co., he builds practical
                            digital tools for small businesses and freelancers
                            across Nigeria. ReceiptIQ was born from a real need:
                            helping local business owners stop losing track of
                            expenses and start making smarter financial decisions.
                        </p>
                    </article>
                    <article className="ri-surface ri-surface-pad">
                        <p className="ri-kicker">Public links</p>
                        <div className="mt-4 grid gap-3 text-sm text-slate-300">
                            <a href="https://github.com/bosspetite" target="_blank" rel="noreferrer" className="hover:text-white">
                                GitHub
                            </a>
                            <a href="https://linkedin.com/in/bassey-emmanuel-obeys-2a69663b4" target="_blank" rel="noreferrer" className="hover:text-white">
                                LinkedIn
                            </a>
                            <a href="https://x.com/BasseyObey15213" target="_blank" rel="noreferrer" className="hover:text-white">
                                X
                            </a>
                            <a href="https://instagram.com/BasseyObeys" target="_blank" rel="noreferrer" className="hover:text-white">
                                Instagram
                            </a>
                        </div>
                    </article>
                </section>
            </main>
        </MarketingShell>
    );
}
