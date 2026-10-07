"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, Users, Lightbulb, Handshake, TrendingUp, ArrowRight, Loader2 } from "lucide-react";

const PILLARS = [
    { icon: Lightbulb, title: "Bigger Ideas.", text: "Workshops, talks and hands-on sessions that push your thinking." },
    { icon: Handshake, title: "Stronger Connections.", text: "Meet peers, mentors and community partners in one room." },
    { icon: TrendingUp, title: "Greater Opportunities.", text: "Internships, collaborations and career pathways take off here." },
];

export default function TechRiseLanding() {
    const [config, setConfig] = useState(null);

    useEffect(() => {
        fetch("/api/techrise/config")
            .then((r) => r.json())
            .then(setConfig)
            .catch(() => setConfig(null));
    }, []);

    const open = config?.registrationOpen !== false;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-[#14305E]/10 selection:text-[#14305E] pb-32">
            {/* Hero */}
            <header className="relative overflow-hidden pt-32 pb-20 bg-[#14305E]">
                <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle,_#fff_1px,_transparent_1px)] bg-[size:36px_36px]" />
                <div className="absolute -top-32 -right-32 w-[480px] h-[480px] bg-[#C8912A]/20 blur-[130px] rounded-full" />
                <div className="absolute -bottom-40 -left-24 w-[420px] h-[420px] bg-white/10 blur-[120px] rounded-full" />

                <div className="relative max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-block text-xs font-extrabold uppercase tracking-[0.3em] text-[#C8912A] mb-6"
                        >
                            Computing Students Society Presents
                        </motion.span>
                        <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.95]">
                            TECH
                            <span className="text-[#C8912A]">RISE</span>
                            <span className="block text-3xl md:text-4xl mt-3 font-bold tracking-[0.25em] text-white/70">
                                &rsquo;26
                            </span>
                        </h1>
                        <p className="mt-6 text-lg md:text-xl text-[#C8912A] font-bold uppercase tracking-[0.2em]">
                            {config?.tagline || "Learn • Connect • Rise"}
                        </p>
                        <p className="mt-3 text-white/70 max-w-lg">
                            {config?.subtitle || "Where Ideas, Talent & Opportunities Come Together."}
                        </p>

                        <div className="mt-9 flex flex-wrap gap-4">
                            <Link
                                href="/techrise/register"
                                className="group inline-flex items-center gap-2 bg-[#C8912A] hover:bg-[#d6a33c] text-[#14305E] font-black text-sm uppercase tracking-widest px-8 py-4 rounded-xl shadow-lg shadow-[#C8912A]/25 transition-all active:scale-95"
                            >
                                Register Now
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <a
                                href="#details"
                                className="inline-flex items-center gap-2 border border-white/25 hover:bg-white/10 text-white font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-xl transition-colors"
                            >
                                Event Details
                            </a>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.15 }}
                        className="relative hidden md:block"
                    >
                        <div className="absolute -inset-4 bg-[#C8912A]/25 blur-3xl rounded-3xl" />
                        <img
                            src="/images/techrise/techrise26.jpg"
                            alt="TechRise '26 official poster"
                            className="relative rounded-2xl shadow-2xl ring-1 ring-white/15 w-full"
                        />
                    </motion.div>
                </div>
            </header>

            {/* Details strip */}
            <section id="details" className="max-w-6xl mx-auto px-6 -mt-10 relative z-10">
                <div className="grid sm:grid-cols-3 gap-5">
                    {[
                        { icon: CalendarDays, label: "Date", value: config?.dateLabel || "22 October 2026" },
                        { icon: MapPin, label: "Venue", value: config?.venue || "SSAQ Khan Hall, University of Peshawar" },
                        { icon: Users, label: "Organized by", value: "Computing Students Society, Dept. of Computer Science" },
                    ].map(({ icon: Icon, label, value }, i) => (
                        <motion.div
                            key={label}
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <span className="w-9 h-9 rounded-lg bg-[#14305E]/10 text-[#14305E] flex items-center justify-center">
                                    <Icon size={18} />
                                </span>
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</span>
                            </div>
                            <p className="font-bold text-slate-800 leading-snug">{value}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Pillars */}
            <section className="max-w-6xl mx-auto px-6 mt-28">
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900">
                        Bigger Ideas. Stronger Connections.{" "}
                        <span className="text-[#C8912A]">Greater Opportunities.</span>
                    </h2>
                    <div className="w-20 h-1.5 bg-[#C8912A] rounded-full mx-auto mt-5" />
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {PILLARS.map(({ icon: Icon, title, text }, i) => (
                        <motion.div
                            key={title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white border border-slate-200 rounded-2xl p-7 hover:shadow-lg transition-all group"
                        >
                            <span className="w-12 h-12 rounded-xl bg-[#14305E] text-[#C8912A] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                <Icon size={22} />
                            </span>
                            <h3 className="font-black text-lg uppercase tracking-wide text-[#14305E]">{title}</h3>
                            <p className="text-slate-500 text-sm mt-2 leading-relaxed">{text}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="max-w-6xl mx-auto px-6 mt-28">
                <div className="relative overflow-hidden bg-[#14305E] rounded-3xl p-10 md:p-14 text-center">
                    <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle,_#fff_1px,_transparent_1px)] bg-[size:30px_30px]" />
                    <div className="absolute -bottom-24 -right-16 w-72 h-72 bg-[#C8912A]/25 blur-[90px] rounded-full" />
                    <div className="relative">
                        <h2 className="text-3xl md:text-5xl font-black text-white">
                            The Wait Is <span className="text-[#C8912A]">Over.</span>
                        </h2>
                        <p className="text-white/60 mt-4 max-w-xl mx-auto">
                            Grab your entry pass in seconds — register, get your unique TechRise ID and QR ticket,
                            and flash it at the gate on event day.
                        </p>
                        {open ? (
                            <Link
                                href="/techrise/register"
                                className="inline-flex items-center gap-2 mt-8 bg-[#C8912A] hover:bg-[#d6a33c] text-[#14305E] font-black text-sm uppercase tracking-widest px-10 py-4 rounded-xl shadow-lg shadow-[#C8912A]/25 transition-all active:scale-95"
                            >
                                Register for TechRise &rsquo;26
                            </Link>
                        ) : (
                            <p className="mt-8 inline-block bg-white/10 border border-white/20 text-white font-bold px-6 py-3 rounded-xl">
                                Registration is currently closed
                            </p>
                        )}
                        {!config && (
                            <p className="mt-4 text-white/40 text-xs inline-flex items-center gap-2">
                                <Loader2 size={12} className="animate-spin" /> Checking registration status…
                            </p>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
