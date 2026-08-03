"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calculator, X, GraduationCap, ArrowRight } from "lucide-react";

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
        /* top-right, safe from notch/status-bar on mobile with pt-safe-top */
        <div className="fixed top-20 right-3 sm:top-24 sm:right-5 z-[998] pointer-events-none"
            style={{ animation: "slideInRight 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards" }}>

            <style>{`
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(48px) scale(0.92); }
                    to   { opacity: 1; transform: translateX(0)    scale(1); }
                }
            `}</style>

            {/* max-w keeps it from stretching full-width on small screens */}
            <div className="relative pointer-events-auto w-[min(calc(100vw-24px),280px)]">

                {/* Dismiss button */}
                <button
                    onClick={() => { setVisible(false); setDismissed(true); }}
                    aria-label="Close"
                    className="absolute -top-2 -left-2 z-10 w-6 h-6 rounded-full bg-[#172e6b] border border-white/20 flex items-center justify-center text-white hover:bg-[#1e3a8a] transition shadow-md"
                >
                    <X className="w-3 h-3" />
                </button>

                {/* Card */}
                <div className="bg-[#1e3a8a] rounded-2xl shadow-2xl shadow-[#1e3a8a]/40 border border-white/10 overflow-hidden">

                    {/* Header stripe */}
                    <div className="flex items-center gap-2 bg-black/20 px-4 py-2">
                        <div className="p-1.5 rounded-lg bg-white/15">
                            <GraduationCap className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-blue-200 text-[10px] font-bold uppercase tracking-widest">New Tool</span>
                    </div>

                    <div className="p-4">
                        <p className="text-white font-black text-sm leading-tight mb-0.5">UoP Aggregate Calculator</p>
                        <p className="text-blue-300 text-xs mb-3 leading-snug">
                            Get your admission aggregate in seconds.
                        </p>

                        {/* Mini weight pills */}
                        <div className="flex gap-1.5 mb-4">
                            {[{ label: "Matric", val: "20%" }, { label: "FSc", val: "30%" }, { label: "Test", val: "50%" }].map(({ label, val }) => (
                                <div key={label} className="flex-1 rounded-lg bg-white/10 border border-white/15 px-2 py-1.5 text-center">
                                    <p className="text-white text-xs font-black">{val}</p>
                                    <p className="text-blue-300 text-[9px]">{label}</p>
                                </div>
                            ))}
                        </div>

                        <Link
                            href="/aggregate-calculator"
                            className="flex items-center justify-center gap-2 w-full bg-white hover:bg-blue-50 text-[#1e3a8a] font-bold text-sm py-2.5 rounded-xl transition-all duration-200 shadow-md group"
                        >
                            <Calculator className="w-4 h-4" />
                            Calculate Now
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

