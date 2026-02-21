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
            className="group relative w-full aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 cursor-pointer shadow-sm border border-gray-200 select-none"
        >
            <Image
                src={member.image || "/images/team/placeholder.jpg"}
                alt={member.name}
                fill
                className="object-cover grayscale group-hover:grayscale-0 group-active:grayscale-0 group-hover:scale-105 group-active:scale-105 transition-all duration-700 ease-in-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 p-5 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 group-active:translate-y-0 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-all duration-500">
                <div className="w-10 h-[2px] bg-[#3e76b2] mb-3" />
                <h3 className="text-lg font-bold text-white leading-tight">{member.name}</h3>
                <p className="text-xs font-bold text-[#3e76b2] uppercase tracking-widest mt-1">{member.role}</p>
                {member.subRole && <p className="text-[10px] text-gray-400 mt-2 font-medium">{member.subRole}</p>}
            </div>
        </motion.div>
    );
}

function GridSection({ title, members }) {
    return (
        <div className="mt-20">
            <div className="flex items-center gap-4 mb-10">
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">{title}</h3>
                <div className="flex-1 h-[1px] bg-gray-200" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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
        <section className="py-24 bg-white text-gray-900 min-h-screen">
            <div className="max-w-7xl mx-auto px-6">
                <div className="max-w-2xl mb-24">
                    <h2 className="text-3xl sm:text-3xl md:text-3xl lg:text-6xl font-black text-[#3e76b2] tracking-tighter uppercase leading-[0.9]">
                        Our <br /><span className="text-gray-100 drop-shadow-[1px_1px_0_#3e76b2]">Collective</span>
                    </h2>
                    <p className="mt-6 text-gray-500 font-medium text-sm border-l-2 border-[#3e76b2] pl-4">
                        Meet the architects of the Computing Students Society.
                        Bridging innovation with leadership.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-16">
                        <div className="w-10 h-10 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                    </div>
                ) : (
                    <>
                        {team.executive.length > 0 && <GridSection title="Executive Board" members={team.executive} />}
                        {team.cabinet.length > 0 && <GridSection title="Cabinet" members={team.cabinet} />}
                        {team.clubs.length > 0 && <GridSection title="Club Leads" members={team.clubs} />}
                    </>
                )}
            </div>
        </section>
    );
}
