"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const teamMembers = [
    { name: "Dr Shah Khusro", role: "Patron-in-Chief", img: "/images/team/chairman.jpg" },
    { name: "Dr Waheed ur Rehman", role: "Chief Organizer", img: "/images/team/coordinator.jpg" },
    { name: "Ilyas", role: "President", img: "/images/team/president.jpg" },
    { name: "Abdullah", role: "Vice President", img: "/images/team/vp.jpg" },
    { name: "Fatima", role: "Female Vice President", img: "/images/team/fatima.png" },
];

export default function AboutPreview() {
    const scrollRef = useRef(null);
    const sectionRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const xPos = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

    const nextMember = () => {
        if (scrollRef.current) {
            const card = scrollRef.current.querySelector('.team-card');
            const gap = 24;
            const scrollBy = (card?.offsetWidth ?? 272) + gap;
            scrollRef.current.scrollBy({ left: scrollBy, behavior: 'smooth' });
        }
    };

    const prevMember = () => {
        if (scrollRef.current) {
            const card = scrollRef.current.querySelector('.team-card');
            const gap = 24;
            const scrollBy = (card?.offsetWidth ?? 272) + gap;
            scrollRef.current.scrollBy({ left: -scrollBy, behavior: 'smooth' });
        }
    };

    return (
        <section
            id="about"
            ref={sectionRef}
            className="py-20 bg-white overflow-hidden relative min-h-[70vh] flex items-center"
        >
            {/* Immersive Background Text */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 select-none pointer-events-none opacity-[0.02] whitespace-nowrap z-0">
                <motion.h2
                    style={{ x: xPos }}
                    className="text-[30vw] font-black italic tracking-tighter uppercase text-slate-900"
                >
                    ABOUT SOCIETY
                </motion.h2>
            </div>

            {/* Background Glows - Subtler for Light Theme */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div
                    className="absolute -bottom-[20%] -left-[10%] w-[800px] h-[800px] rounded-full opacity-[0.05] blur-[150px]"
                    style={{
                        background: `radial-gradient(circle, #1e3a8a 0%, transparent 70%)`
                    }}
                />
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">

                    {/* Left Space: Filled with a clean society visual */}
                    <div className="lg:col-span-5 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                            className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-slate-200 shadow-2xl"
                        >
                            <img
                                src="/images/gallery/sportsweek1.JPG"
                                alt="Society Community"
                                className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 transition-all duration-700 hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-40" />

                            {/* Overlay Meta */}
                            <div className="absolute bottom-12 left-12">
                                <span className="text-8xl font-black text-slate-900/5 italic tracking-tighter block mb-4 uppercase">CSS.</span>
                                <p className="text-[10px] font-black tracking-[0.4em] uppercase text-[#1e3a8a] max-w-[150px] leading-relaxed">
                                    THE ARCHITECTS OF DIGITAL TRANSFORMATION
                                </p>
                            </div>
                        </motion.div>

                        {/* Decorative Badge */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-slate-900 shadow-2xl rounded-full flex items-center justify-center border-8 border-white z-20 hidden md:flex">
                            <div className="text-center">
                                <span className="block text-3xl font-black text-white leading-none tracking-tighter lowercase italic">css.</span>
                                <span className="text-[8px] font-black uppercase tracking-widest text-white/30">EST 2024</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="lg:col-span-7">
                        <motion.div
                            variants={container}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            className="space-y-12"
                        >
                            <div>
                                <motion.div variants={item} className="flex items-center gap-4 mb-6 text-[#1e3a8a]">
                                    <span className="w-8 h-px bg-[#1e3a8a]" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">The Core Mission</span>
                                </motion.div>

                                <motion.h2 variants={item} className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.9] mb-8">
                                    We empower <br />
                                    <span className="text-[#1e3a8a]">future architects.</span>
                                </motion.h2>

                                <motion.p variants={item} className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium max-w-xl">
                                    A community designed to bridge the gap between academic theory and high-end engineering. We grow future leaders through community-driven excellence.
                                </motion.p>
                            </div>

                            {/* Team Carousel Section */}
                            <motion.div variants={item} className="pt-4">
                                <div className="flex items-center justify-between mb-8">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">LEADERSHIP BOARD</span>
                                    <div className="flex gap-4">
                                        <button onClick={prevMember} className="p-3 border border-slate-200 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all">
                                            <ArrowLeft className="w-4 h-4" />
                                        </button>
                                        <button onClick={nextMember} className="p-3 border border-slate-200 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all">
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div ref={scrollRef} className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth -mx-4 px-4 no-scrollbar">
                                    {teamMembers.map((member, idx) => (
                                        <div key={idx} className="team-card group relative flex-shrink-0 w-64 h-80 rounded-[2rem] overflow-hidden cursor-pointer snap-center border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500">
                                            <img
                                                src={member.img}
                                                alt={member.name}
                                                className="w-full h-full object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-8 flex flex-col justify-end">
                                                <p className="text-white font-black italic uppercase tracking-tighter text-lg">{member.name}</p>
                                                <p className="text-[#93c5fd] text-[9px] font-black uppercase tracking-widest mt-1">{member.role}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-12">
                                    <Link
                                        href="/about"
                                        className="group inline-flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] text-slate-900 hover:text-[#1e3a8a] transition-all"
                                    >
                                        Our Full Story
                                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                    </Link>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
