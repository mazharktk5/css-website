// components/About/OurTeam.jsx
"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

function MemberCard({ member, delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="group relative w-full aspect-[4/5] overflow-hidden rounded-[2rem] bg-slate-50 cursor-pointer border border-slate-100 select-none shadow-sm hover:shadow-2xl hover:shadow-slate-200 transition-all duration-700"
        >
            <Image
                src={member.image || "/images/team/placeholder.jpg"}
                alt={member.name}
                fill
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 ease-in-out group-hover:scale-105"
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-700" />

            {/* Content */}
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="w-10 h-[2px] bg-[#93c5fd] mb-4 group-hover:w-16 transition-all duration-700" />
                <h3 className="text-xl font-black text-white leading-tight mb-2 group-hover:text-[#93c5fd] transition-colors truncate italic uppercase tracking-tighter">{member.name}</h3>
                <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] truncate">{member.role}</p>

                {/* SubRole */}
                <div className="overflow-hidden max-h-0 group-hover:max-h-24 transition-all duration-700 ease-in-out">
                    {member.subRole && (
                        <p className="text-[11px] text-white/40 mt-4 font-medium leading-relaxed">
                            {member.subRole}
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

function GridSection({ title, members }) {
    return (
        <div className="mt-32">
            <div className="flex items-center gap-8 mb-16">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">{title}</h3>
                <div className="flex-1 h-[1px] bg-slate-100" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {members.map((m, i) => <MemberCard key={m._id || i} member={m} delay={i * 0.05} />)}
            </div>
        </div>
    );
}

export default function OurTeam() {
    const [team, setTeam] = useState({ executive: [], cabinet: [], clubs: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const res = await fetch("/api/team");
                const data = await res.json();
                const members = Array.isArray(data) ? data : [];
                setTeam({
                    executive: members.filter(m => m.section === "executive"),
                    cabinet: members.filter(m => m.section === "cabinet"),
                    clubs: members.filter(m => m.section === "clubs"),
                });
            } catch {
                setTeam({ executive: [], cabinet: [], clubs: [] });
            }
            setLoading(false);
        };
        fetchTeam();
    }, []);

    return (
        <section className="py-32 sm:py-40 bg-white text-slate-900 min-h-screen relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[#1e3a8a]/5 rounded-full blur-[120px] -z-10" />

            <div className="max-w-7xl mx-auto px-6">
                <div className="max-w-4xl mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-6xl md:text-[8rem] font-black text-slate-900 tracking-tighter uppercase leading-[0.8] italic mb-12">
                            THE <br /><span className="text-[#1e3a8a] not-italic">COLLECTIVE.</span>
                        </h2>
                        <div className="flex gap-8 items-start">
                            <div className="w-1.5 h-16 sm:h-24 bg-[#1e3a8a] shrink-0" />
                            <p className="max-w-xl text-slate-500 font-medium text-lg md:text-xl leading-relaxed">
                                Curating high-performance talent and visionary leadership.
                                We are the architects of the Computing Students Society.
                            </p>
                        </div>
                    </motion.div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-40">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-12 h-12 border-2 border-slate-100 border-t-[#1e3a8a] rounded-full"
                        />
                    </div>
                ) : (
                    <div className="space-y-32">
                        {team.executive.length > 0 && <GridSection title="Board of Experts" members={team.executive} />}
                        {team.cabinet.length > 0 && <GridSection title="The Cabinet" members={team.cabinet} />}
                        {team.clubs.length > 0 && <GridSection title="Innovation Leads" members={team.clubs} />}
                    </div>
                )}
            </div>
        </section>
    );
}
