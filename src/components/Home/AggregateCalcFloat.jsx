"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, ArrowRight, Star } from "lucide-react";

export default function AggregateCalcFloat() {
    const [visible, setVisible] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!dismissed) setVisible(true);
        }, 3000);
        return () => clearTimeout(timer);
    }, [dismissed]);

    if (!visible || dismissed) return null;

    return (
        <div
            className="fixed top-20 right-3 sm:top-24 sm:right-5 z-[998] pointer-events-none"
            style={{ animation: "slideInRight 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards" }}
        >
            <style>{`
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(48px) scale(0.92); }
                    to   { opacity: 1; transform: translateX(0)    scale(1); }
                }
            `}</style>

            <div className="relative pointer-events-auto w-[min(calc(100vw-24px),288px)]">

                {/* Dismiss button */}
                <button
                    onClick={() => { setVisible(false); setDismissed(true); }}
                    aria-label="Close"
                    className="absolute -top-2 -left-2 z-10 w-6 h-6 rounded-full bg-[#0a3018] border border-white/20 flex items-center justify-center text-white hover:bg-[#0d5c2a] transition shadow-md"
                >
                    <X className="w-3 h-3" />
                </button>

                {/* Card */}
                <div
                    className="rounded-2xl shadow-2xl shadow-[#0D5E2A]/40 border border-white/15 overflow-hidden"
                    style={{ background: "linear-gradient(135deg, #0a3018 0%, #0D5E2A 100%)" }}
                >
                    {/* Header stripe */}
                    <div className="flex items-center gap-2 bg-black/25 px-4 py-2">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="text-yellow-300 text-[10px] font-bold uppercase tracking-widest">
                            14 August 2026
                        </span>
                    </div>

                    <div className="p-4">
                        <p className="text-white font-black text-sm leading-tight mb-0.5">
                            Jashn-e-Azadi Poster
                        </p>
                        <p className="text-green-300 text-xs mb-3 leading-snug">
                            Create your free personalised Independence Day poster in seconds!
                        </p>

                        <div className="flex gap-1.5 mb-4">
                            {[
                                { label: "Savera", color: "#0d4a22" },
                                { label: "Pehchan", color: "#f7f7f7" },
                                { label: "Parcham", color: "#0D5E2A" },
                            ].map(({ label, color }) => (
                                <div
                                    key={label}
                                    className="flex-1 rounded-lg border border-white/15 px-2 py-1.5 text-center"
                                    style={{ background: color }}
                                >
                                    <p className={`text-[10px] font-bold ${label === "Pehchan" ? "text-[#0D5E2A]" : "text-white"}`}>
                                        {label}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <Link
                            href="/independence-day"
                            className="flex items-center justify-center gap-2 w-full bg-[#c8a84b] hover:bg-[#d6b85c] text-black font-bold text-sm py-2.5 rounded-xl transition-all duration-200 shadow-md group"
                        >
                            Create Poster
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
