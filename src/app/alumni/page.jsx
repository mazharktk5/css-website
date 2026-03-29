"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const alumniData = [
    {
        chapter: "2024-25",
        members: [
            {
                name: "Muhammad Ilyas",
                role: "Ex-AI & DS Lead",
                image: "/images/team/president.jpg",
                chapter: "2024-25"
            },
            {
                name: "Abdullah Ahmad",
                role: "Ex-Information Secretary",
                image: "/images/team/vp.jpg",
                chapter: "2024-25"
            },

            {
                name: "Fatima",
                role: "Ex-Management Head",
                image: "/images/team/management-lead.jpg",
                chapter: "2024-25"
            },

            {
                name: "Safia Zulfiqar",
                role: "Ex-Management Member",
                image: "/images/developers/safia.jpg",
                chapter: "2024-25"
            },
            {
                name: "Mazhar Ahmad",
                role: "Ex-Software Co Lead",
                image: "/images/team/software-lead.jpg",
                chapter: "2024-25"
            },

            {
                name: "Mamoon Khan",
                role: "Ex-Software Lead",
                image: "/images/developers/mamoon.jpg",
                chapter: "2024-25"
            },
            {
                name: "Hanzallah Khan",
                role: "Ex-Management Co-ordinator",
                image: "/images/developers/hanzala.jpg",
                chapter: "2024-25"
            },
            {
                name: "Hashir Ahmad",
                role: "Ex-Chief Secretary",
                image: "/images/team/cyber-lead.jpg",
                chapter: "2024-25"
            }
        ]
    }
];

function MemberCard({ member }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group relative w-full aspect-[3/4] overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-500 ring-1 ring-slate-900/5 group"
        >
            <Image
                src={member.image || "/images/team/placeholder.jpg"}
                alt={member.name}
                fill
                className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
            />

            {/* Premium Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a8a]/90 via-[#1e3a8a]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100 group-hover:opacity-0 transition-opacity duration-500" />

            {/* Content */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end transform transition-transform duration-500 group-hover:translate-y-[-8px]">
                <div className="overflow-hidden">
                    <motion.h3 className="text-xl font-bold text-white leading-tight mb-1">
                        {member.name}
                    </motion.h3>
                </div>

                <p className="text-sm text-blue-300 font-semibold tracking-wider uppercase">
                    {member.role}
                </p>

                <div className="mt-4 pt-4 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="text-[10px] font-bold text-white/60 tracking-[0.2em] uppercase">
                        Chapter {member.chapter}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}

export default function AlumniPage() {
    return (
        <main className="min-h-screen bg-slate-50">
            <Navbar />

            {/* Hero Section */}
            <section className="relative py-32 bg-slate-50 overflow-hidden">
                {/* subtle grid pattern */}
                <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle,_#000_1px,_transparent_1px)] bg-[size:40px_40px]" />

                {/* background glow shapes */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute top-[-120px] left-[20%] w-[500px] h-[500px] bg-[#1e3a8a]/15 blur-[120px] rounded-full" />
                    <div className="absolute bottom-[-120px] right-[20%] w-[500px] h-[500px] bg-blue-300/20 blur-[120px] rounded-full" />
                </div>

                <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* small label */}
                        <motion.span
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-[#1e3a8a] font-medium tracking-wide uppercase"
                        >
                            Computing Students Society
                        </motion.span>

                        <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-semibold text-slate-900 leading-tight">
                            CSS
                            <span className="block text-[#1e3a8a]">
                                Alumni Society
                            </span>
                        </h1>

                        <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                            Celebrating the legacy of the Computing Students Society. Meet the brilliant minds who shaped our first chapters and paved the way for future innovators.
                        </p>

                        {/* divider */}
                        <div className="flex justify-center mt-16">
                            <div className="w-20 h-[2px] bg-[#1e3a8a]" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Alumni List */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    {alumniData.map((section) => (
                        <div key={section.chapter} className="mb-32 last:mb-0">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                                        Chapter <span className="text-[#1e3a8a]">{section.chapter}</span>
                                    </h2>
                                    <div className="w-20 h-1.5 bg-[#1e3a8a] rounded-full" />
                                </div>
                                <p className="text-slate-500 font-medium tracking-wide italic">
                                    The Foundation Years
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                                {section.members.map((member, idx) => (
                                    <MemberCard key={idx} member={member} />
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="mt-20 p-12 rounded-3xl bg-white border border-slate-100 shadow-xl text-center">
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">More Coming Soon</h3>
                        <p className="text-slate-600 max-w-lg mx-auto">
                            We are currently updating our records. If you were a member of a previous CSS chapter and don't see yourself here yet, please reach out to us!
                        </p>
                    </div>
                </div>
            </section>

        </main>
    );
}
