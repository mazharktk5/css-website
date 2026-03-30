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
                name: "Muhammad Jawad",
                role: "Ex-Vice President",
                image: "/images/team/jawad.jpg",
                chapter: "2024-25"
            },

            {
                name: "Abdullah Ahmad",
                role: "Ex-Information Secretary",
                image: "/images/team/vp.jpg",
                chapter: "2024-25"
            },

            {
                name: "Hashir Ahmad",
                role: "Ex-Chief Secretary",
                image: "/images/team/cyber-lead.jpg",
                chapter: "2024-25"
            },

            {
                name: "Fatima",
                role: "Ex-Management Head",
                image: "/images/team/management-lead.jpg",
                chapter: "2024-25"
            },

            {
                name: "Hanzallah Khan",
                role: "Ex-Management Co-ordinator",
                image: "/images/developers/hanzala.jpg",
                chapter: "2024-25"
            },


            {
                name: "Safia Zulfiqar",
                role: "Ex-Management Member",
                image: "/images/developers/safia.jpg",
                chapter: "2024-25"
            },
            {
                name: "Muhammad Ilyas",
                role: "Ex-AI & DS Lead",
                image: "/images/team/president.jpg",
                chapter: "2024-25"
            },

            {
                name: "Aamna Malik",
                role: "Ex-AI & DS Member",
                image: "/images/team/amna_malik.PNG",
                chapter: "2024-25"
            },
            {
                name: "Hazrat Umer",
                role: "Ex-AI & DS Member",
                image: "/images/team/Hazrat_umer.jpeg",
                chapter: "2024-25"
            },
            {
                name: "Mamoon Khan",
                role: "Ex-Software Lead",
                image: "/images/developers/mamoon.jpg",
                chapter: "2024-25"
            },
            {
                name: "Mazhar Ahmad",
                role: "Ex-Software Co Lead",
                image: "/images/team/software-lead.jpg",
                chapter: "2024-25"
            },



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
            {/* <Navbar /> */}

            <section className="relative py-28 bg-slate-50 overflow-hidden">
                {/* background pattern */}
                <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle,_#000_1px,_transparent_1px)] bg-[size:40px_40px]" />

                {/* subtle glow */}
                <div className="absolute top-[-100px] left-[10%] w-[400px] h-[400px] bg-[#1e3a8a]/10 blur-[100px] rounded-full" />
                <div className="absolute bottom-[-100px] right-[10%] w-[400px] h-[400px] bg-blue-300/10 blur-[100px] rounded-full" />

                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

                    {/* LEFT CONTENT */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-sm text-[#1e3a8a] font-semibold tracking-wider uppercase">
                            Computing Students Society
                        </span>

                        <h1 className="mt-4 text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight">
                            Our Alumni
                            <span className="block text-[#1e3a8a]">Network</span>
                        </h1>

                        <p className="mt-6 text-lg text-slate-600 max-w-xl leading-relaxed">
                            The people who built the foundation of CSS. Leaders, developers, and thinkers who shaped what we are today.
                        </p>

                        {/* Stats */}
                        <div className="flex gap-10 mt-10">
                            <div>
                                <h3 className="text-3xl font-bold text-slate-900">50+</h3>
                                <p className="text-sm text-slate-500">Members</p>
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-slate-900">5+</h3>
                                <p className="text-sm text-slate-500">Domains</p>
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-slate-900">2024</h3>
                                <p className="text-sm text-slate-500">Founded</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT VISUAL */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative flex justify-center lg:justify-end items-center"
                    >
                        <div className="relative group max-w-[420px] w-full">

                            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-slate-950 shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-slate-800 transition-all duration-700">

                                {/* subtle background glow */}
                                <div className="absolute inset-0 opacity-20 blur-2xl scale-125">
                                    <Image
                                        src="/images/team/ex-president.jpeg"
                                        alt=""
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* main image */}
                                <Image
                                    src="/images/team/ex-president.jpeg"
                                    alt="Ex President"
                                    fill
                                    className="object-cover relative z-10 transition-transform duration-700 group-hover:scale-[1.03]"
                                    priority
                                />

                                {/* cleaner overlay */}
                                <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                                {/* bottom label */}
                                <div className="absolute bottom-0 inset-x-0 z-30 pt-10 pb-8 px-6 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="flex items-center gap-3 w-full justify-center">
                                            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
                                            <span className="text-white text-[10px] font-black tracking-[0.35em] uppercase">
                                                Ex President
                                            </span>
                                            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
                                        </div>
                                        <h3 className="text-white text-lg font-semibold tracking-tight">
                                            CSS Foundation
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            {/* badge (fixed position) */}
                            <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-xl shadow-xl rounded-xl px-4 py-2 border border-white/50 z-40">
                                <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">
                                    Leadership
                                </p>
                                <h4 className="text-sm font-bold text-[#1e3a8a]">
                                    2024-25
                                </h4>
                            </div>

                            {/* subtle decorative blobs */}
                            <div className="absolute -z-10 -top-6 -right-6 w-28 h-28 bg-blue-600/10 blur-2xl rounded-full" />
                            <div className="absolute -z-10 -bottom-6 -left-6 w-28 h-28 bg-indigo-600/10 blur-2xl rounded-full" />
                        </div>
                    </motion.div>

                </div>
            </section >

            {/* Alumni List */}
            < section className="py-24" >
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
            </section >

        </main >
    );
}
