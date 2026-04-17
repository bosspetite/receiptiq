import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const STORAGE_KEY = "receiptiq-intro-seen";

export function IntroOverlay() {
    const rootRef = useRef(null);
    const [visible, setVisible] = useState(() => {
        if (typeof window === "undefined") return false;
        return !window.sessionStorage.getItem(STORAGE_KEY);
    });

    useLayoutEffect(() => {
        if (!visible || !rootRef.current) return undefined;

        const reduceMotion = window.matchMedia?.(
            "(prefers-reduced-motion: reduce)",
        )?.matches;
        if (reduceMotion) {
            window.sessionStorage.setItem(STORAGE_KEY, "1");
            setVisible(false);
            return undefined;
        }

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                defaults: { ease: "power3.out" },
                onComplete: () => {
                    window.sessionStorage.setItem(STORAGE_KEY, "1");
                    setVisible(false);
                },
            });

            tl.fromTo(
                "[data-ri-intro-panel]",
                { scale: 0.96, opacity: 0, y: 24 },
                { scale: 1, opacity: 1, y: 0, duration: 0.7 },
            )
                .fromTo(
                    "[data-ri-intro-glow]",
                    { opacity: 0, scale: 0.85 },
                    { opacity: 1, scale: 1, duration: 0.65, stagger: 0.06 },
                    0.06,
                )
                .fromTo(
                    "[data-ri-intro-line]",
                    { yPercent: 100, opacity: 0 },
                    { yPercent: 0, opacity: 1, duration: 0.6, stagger: 0.08 },
                    0.12,
                )
                .fromTo(
                    "[data-ri-intro-badge]",
                    { opacity: 0, scale: 0.88 },
                    { opacity: 1, scale: 1, duration: 0.45, stagger: 0.06 },
                    0.22,
                )
                .to(rootRef.current, {
                    opacity: 0,
                    duration: 0.45,
                    delay: 0.6,
                });
        }, rootRef);

        return () => ctx.revert();
    }, [visible]);

    if (!visible) return null;

    return (
        <div
            ref={rootRef}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/96 px-4"
        >
            <div
                data-ri-intro-panel
                className="relative w-full max-w-3xl overflow-hidden rounded-[1.4rem] border border-white/10 bg-slate-950/88 px-8 py-14 shadow-[0_24px_90px_rgba(0,0,0,0.38)]"
            >
                <div
                    data-ri-intro-glow
                    className="absolute -left-10 top-0 h-52 w-52 rounded-full bg-teal-300/15 blur-3xl"
                />
                <div
                    data-ri-intro-glow
                    className="absolute right-0 top-10 h-44 w-44 rounded-full bg-amber-300/12 blur-3xl"
                />
                <div className="relative space-y-8">
                    <div className="flex flex-wrap gap-3">
                        <span data-ri-intro-badge className="ri-badge-accent">
                            Scan. Track. Save.
                        </span>
                        <span data-ri-intro-badge className="ri-badge">
                            Review-first workflow
                        </span>
                        <span data-ri-intro-badge className="ri-badge">
                            Private by design
                        </span>
                    </div>
                    <div className="space-y-3 overflow-hidden">
                        <p data-ri-intro-line className="ri-kicker">
                            ReceiptIQ
                        </p>
                        <h1
                            data-ri-intro-line
                            className="max-w-2xl text-4xl font-bold leading-tight text-white sm:text-6xl"
                        >
                            Keep expense tracking clean from the first receipt.
                        </h1>
                        <p
                            data-ri-intro-line
                            className="max-w-xl text-base leading-7 text-slate-300 sm:text-lg"
                        >
                            Built for freelancers and small businesses that want
                            faster records without losing control of the details.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
