"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

function MemberCard({ member, delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className="group relative w-full aspect-[3/4] sm:aspect-[4/5] overflow-hidden rounded-2xl bg-white/5 cursor-pointer border border-white/10 select-none shadow-xl transform-gpu hover:shadow-[#3e76b2]/20 transition-all duration-500"
        >
            <Image
                src={member.image || "/images/team/placeholder.jpg"}
                alt={member.name}
                fill
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out group-hover:scale-110"
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-[#0a192f]/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Content */}
            <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-end">
                <div className="w-8 h-[2px] bg-[#6ea3d8] mb-3 group-hover:w-12 transition-all duration-500" />
                <h3 className="text-base sm:text-lg font-bold text-white leading-tight mb-1 group-hover:text-[#6ea3d8] transition-colors truncate">{member.name}</h3>
                <p className="text-[9px] sm:text-[10px] font-black text-white/70 uppercase tracking-[0.15em] truncate">{member.role}</p>

                {/* SubRole - hidden by default, shown on hover on desktop */}
                <div className="overflow-hidden max-h-0 group-hover:max-h-20 transition-all duration-500 ease-in-out">
                    {member.subRole && (
                        <p className="text-[9px] text-[#6ea3d8]/80 mt-2 font-medium line-clamp-2">
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
        <div className="mt-20">
            <div className="flex items-center gap-6 mb-12">
                <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-[0.2em] font-serif">{title}</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
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
        <section className="py-24 sm:py-32 bg-[#0a192f] text-white min-h-screen relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[#3e76b2]/5 rounded-full blur-[120px] -z-10" />

            <div className="max-w-7xl mx-auto px-6">
                <div className="max-w-3xl mb-24 sm:mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.85] italic mb-8">
                            Our <br /><span className="text-[#6ea3d8]">Collective</span>
                        </h2>
                        <div className="flex gap-4 items-start">
                            <div className="w-1 h-12 sm:h-16 bg-[#6ea3d8] shrink-0" />
                            <p className="max-w-md text-blue-100/60 font-medium text-base sm:text-lg leading-relaxed">
                                Meet the architects of the Computing Students Society.
                                Bridging innovation with leadership to build a future-ready community.
                            </p>
                        </div>
                    </motion.div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-32">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-12 h-12 border-2 border-[#6ea3d8]/20 border-t-[#6ea3d8] rounded-full"
                        />
                    </div>
                ) : (
                    <div className="space-y-24 sm:space-y-32">
                        {team.executive.length > 0 && <GridSection title="Board of Experts" members={team.executive} />}
                        {team.cabinet.length > 0 && <GridSection title="The Cabinet" members={team.cabinet} />}
                        {team.clubs.length > 0 && <GridSection title="Innovation Leads" members={team.clubs} />}
                    </div>
                )}
            </div>
        </section>
    );
}
