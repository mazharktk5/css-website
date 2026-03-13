"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

function MemberCard({ member }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group relative w-full aspect-[4/5] overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500"
        >
            <Image
                src={member.image || "/images/team/placeholder.jpg"}
                alt={member.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <h3 className="text-lg font-semibold text-white leading-tight mb-1">
                    {member.name}
                </h3>

                <p className="text-sm text-blue-200 font-medium">
                    {member.role}
                </p>

                {member.subRole && (
                    <p className="text-xs text-white/70 mt-2 leading-relaxed">
                        {member.subRole}
                    </p>
                )}
            </div>
        </motion.div>
    );
}

function GridSection({ title, members }) {
    return (
        <div className="mt-24">
            <div className="flex items-center gap-6 mb-12">
                <h3 className="text-xl font-semibold text-slate-800">
                    {title}
                </h3>

                <div className="flex-1 h-[1px] bg-slate-200" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {members.map((m, i) => (
                    <MemberCard key={m._id || i} member={m} />
                ))}
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
        <section className="py-28 bg-white text-slate-900 relative overflow-hidden">

            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[#1e3a8a]/5 rounded-full blur-[120px] -z-10" />

            <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="max-w-3xl mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-semibold text-slate-900 mb-6">
                            Meet Our <span className="text-[#1e3a8a]">Team</span>
                        </h2>

                        <p className="text-lg text-slate-600 leading-relaxed">
                            The people behind the Computing Students Society. Our team works
                            together to organize events, support students, and create
                            opportunities for learning and collaboration within the
                            computing community.
                        </p>
                    </motion.div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-32">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-10 h-10 border-2 border-slate-200 border-t-[#1e3a8a] rounded-full"
                        />
                    </div>
                ) : (
                    <div className="space-y-24">

                        {team.executive.length > 0 && (
                            <GridSection title="Executive Team" members={team.executive} />
                        )}

                        {team.cabinet.length > 0 && (
                            <GridSection title="Core Team" members={team.cabinet} />
                        )}

                        {team.clubs.length > 0 && (
                            <GridSection title="Club Leads" members={team.clubs} />
                        )}

                    </div>
                )}

            </div>
        </section>
    );
}