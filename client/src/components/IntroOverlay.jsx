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
                { scale: 0.94, opacity: 0, y: 28 },
                { scale: 1, opacity: 1, y: 0, duration: 0.7 },
            )
                .fromTo(
                    "[data-ri-intro-line]",
                    { yPercent: 100, opacity: 0 },
                    { yPercent: 0, opacity: 1, duration: 0.6, stagger: 0.08 },
                    0.1,
                )
                .fromTo(
                    "[data-ri-intro-badge]",
                    { opacity: 0, scale: 0.85 },
                    { opacity: 1, scale: 1, duration: 0.45, stagger: 0.06 },
                    0.25,
                )
                .to(rootRef.current, {
                    opacity: 0,
                    duration: 0.45,
                    delay: 0.5,
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
                className="relative w-full max-w-3xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-950/85 px-8 py-14 shadow-[0_30px_120px_rgba(0,0,0,0.45)]"
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(72,204,191,0.22),transparent_24%),radial-gradient(circle_at_80%_15%,rgba(245,185,66,0.18),transparent_20%)]" />
                <div className="relative space-y-8">
                    <div className="flex flex-wrap gap-3">
                        <span data-ri-intro-badge className="ri-badge-accent">
                            AI expense intelligence
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
                            Turn receipt chaos into a calm operating system.
                        </h1>
                        <p
                            data-ri-intro-line
                            className="max-w-xl text-base leading-7 text-slate-300 sm:text-lg"
                        >
                            Extract, review, save, and understand every expense
                            in one beautifully focused workflow.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
