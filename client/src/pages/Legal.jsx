import { MarketingShell } from "../components/MarketingShell";

function LegalLayout({ title, summary, children }) {
    return (
        <MarketingShell>
            <main className="ri-container py-16 sm:py-20">
                <section className="ri-page-hero">
                    <div className="relative max-w-4xl space-y-5">
                        <p className="ri-kicker">Legal</p>
                        <h1 className="ri-h1">{title}</h1>
                        <p className="ri-subtitle">{summary}</p>
                        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                            Last updated April 17, 2026
                        </p>
                    </div>
                </section>
                <section className="mt-10 ri-surface ri-surface-pad">
                    <div className="ri-legal-prose">{children}</div>
                </section>
            </main>
        </MarketingShell>
    );
}

export function Terms() {
    return (
        <LegalLayout
            title="Terms of Service"
            summary="These terms explain how users may access and use ReceiptIQ, what responsibilities apply to uploaded content, and the limits of the service."
        >
            <h2>Company information</h2>
            <p>
                ReceiptIQ is operated from Nigeria under the public brand name
                ReceiptIQ. Questions about these terms may be sent to
                support@receiptiq.com.
            </p>
            <h2>Using the service</h2>
            <p>
                ReceiptIQ is designed to help users extract, review, save, and
                analyze receipt information. Users may only use the service in
                compliance with applicable law and may not use the platform to
                upload unlawful, harmful, or deceptive content.
            </p>
            <h2>Accounts</h2>
            <p>
                Users are responsible for maintaining the confidentiality of
                their login credentials and for activities that occur under
                their account. If you believe your account has been compromised,
                contact support promptly.
            </p>
            <h2>AI-assisted extraction</h2>
            <p>
                ReceiptIQ includes AI-assisted extraction tools. Those tools are
                intended to accelerate structured data entry, but they may make
                mistakes. Users remain responsible for reviewing extracted
                content before saving, exporting, or relying on it.
            </p>
            <h2>Acceptable use</h2>
            <ul>
                <li>Do not upload content you do not have the right to use.</li>
                <li>Do not attempt to interfere with platform security or availability.</li>
                <li>Do not use the service to store prohibited or unlawful material.</li>
            </ul>
            <h2>Service changes</h2>
            <p>
                We may update, improve, suspend, or remove parts of the service
                from time to time. We may also update these terms as the product
                evolves.
            </p>
            <h2>Contact</h2>
            <p>
                For support, account concerns, or legal questions, contact
                support@receiptiq.com.
            </p>
        </LegalLayout>
    );
}

export function Privacy() {
    return (
        <LegalLayout
            title="Privacy Policy"
            summary="This policy describes what information ReceiptIQ processes, why it is processed, and the choices available to users."
        >
            <h2>Who we are</h2>
            <p>
                ReceiptIQ is a Nigeria-based expense tracking product built to
                help freelancers and small businesses extract and organize receipt
                data more efficiently.
            </p>
            <h2>Information we process</h2>
            <ul>
                <li>Account details such as email address and account identifier.</li>
                <li>Expense records saved by the user, including receipt-related metadata.</li>
                <li>Receipt images and extracted fields when users run the extraction workflow.</li>
                <li>Operational logs necessary to keep the service stable and secure.</li>
            </ul>
            <h2>How data is used</h2>
            <p>
                ReceiptIQ uses account and expense data to provide receipt
                extraction, expense storage, dashboard summaries, search,
                filtering, and export features. Data may also be used to
                troubleshoot product issues and improve service quality.
            </p>
            <h2>AI processing</h2>
            <p>
                When a user requests receipt extraction, the uploaded image may
                be sent to the configured AI provider for structured field
                extraction. Users should review saved records before relying on
                them for accounting or reporting purposes.
            </p>
            <h2>Storage and access control</h2>
            <p>
                ReceiptIQ uses secure account authentication and access controls
                so users only access data that belongs to their own account.
            </p>
            <h2>User choices</h2>
            <p>
                Users can review, update, or delete their own expense entries
                through the application. Users may also request broader data
                access or deletion by emailing support@receiptiq.com.
            </p>
            <h2>Privacy requests</h2>
            <p>
                Questions about privacy, data access, or deletion requests can
                be sent to support@receiptiq.com.
            </p>
        </LegalLayout>
    );
}
