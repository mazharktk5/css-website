"use client";
import { LazyMotion, domAnimation, m } from "framer-motion";
import Image from "next/image";

export default function HeroVisual() {
    return (
        <LazyMotion features={domAnimation}>
            <m.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative flex justify-center lg:justify-end items-center"
            >
                <div className="relative w-full max-w-[450px] aspect-square">

                    {/* Rotating ring — CSS animation, hidden on mobile */}
                    <div className="absolute inset-0 border-2 border-dashed border-blue-200/50 rounded-full animate-[spin_20s_linear_infinite] hidden md:block" />

                    {/* Main Logo — CSS float on desktop, static on mobile */}
                    <div className="absolute inset-0 m-auto w-72 h-72 z-20 md:animate-[float_6s_ease-in-out_infinite]">
                        <div className="relative w-full h-full rounded-3xl overflow-hidden border-[12px] border-white shadow-2xl md:rotate-3 md:hover:rotate-0 transition-transform duration-500">
                            <Image
                                src="/images/logo/cssfinallogo.jpeg"
                                alt="CSS Logo"
                                fill
                                sizes="288px"
                                priority
                                className="object-cover"
                            />
                        </div>
                    </div>

                    {/* Floating badges — desktop only, CSS animations */}
                    <div className="hidden md:block absolute top-0 right-0 bg-blue-600 text-white p-4 rounded-2xl shadow-lg z-30 animate-[floatUp_4s_ease-in-out_0.5s_infinite]">
                        <code className="text-xs font-mono">{"<Code />"}</code>
                    </div>

                    <div className="hidden md:block absolute bottom-12 left-0 bg-white p-4 rounded-2xl shadow-lg border border-slate-100 z-30 animate-[floatDown_5s_ease-in-out_0.2s_infinite]">
                        <span className="text-blue-600 font-bold">Innovation</span>
                    </div>
                </div>
            </m.div>
        </LazyMotion>
    );
}
