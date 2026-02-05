"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

const team = {
    executive: [
        {
            name: "Dr Shah Khusro",
            role: "Patron-in-Chief",
            subRole: "Chairman, Dept. of CS",
            image: "/images/team/chairman.jpg",
        },
        {
            name: "Dr Waheed ur Rehman",
            role: "Chief Organizer",
            subRole: "Coordinator, Dept. of CS",
            image: "/images/team/coordinator.jpg",
        },
    ],
    cabinet: [
        { name: "Abubakar Sadiq", role: "President", image: "/images/team/president.jpg" },
        { name: "Muhammad Jawad", role: "Vice President", image: "/images/team/vp.jpg" },
        { name: "Abdullah Ahmed", role: "Chief Secretary", image: "/images/team/cheif-secretary.jpg" },
        { name: "Hashir Ahmed", role: "Information Secretary", image: "/images/team/information-secretary.jpg" },
        { name: "Atiq Ullah Khan", role: "Media Secretary", image: "/images/team/media-secretary.jpg" },
    ],
    clubs: [
        { name: "Fatima Ijaz", role: "Management Head", image: "/images/team/management-lead.jpg" },
        { name: "Muhammad Mamoon Khan", role: "Software Engineering Lead", image: "/images/developers/mamoon.jpg" },
        { name: "Jafar Ali", role: "Cyber Security Lead", image: "/images/team/cyber-lead.jpg" },
        { name: "Muhammad Ilyas", role: "AI & DS Lead", image: "/images/team/ai-lead.jpg" },
        { name: "Hamza Ahmed Khan", role: "App Dev Lead", image: "/images/team/app-lead2.jpg" },
        { name: "Shahab Saqib", role: "PR Head", image: "/images/team/pr-lead-2.jpg" },
        { name: "Iqra Noor", role: "Content & Graphics Head", image: "/images/team/graphic-head.jpg" },
    ],
};

function MemberCard({ member, delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className="group relative w-full aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 cursor-pointer shadow-sm border border-gray-200 select-none"
        >
            {/* Image logic: B&W to Color */}
            <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover grayscale group-hover:grayscale-0 group-active:grayscale-0 group-hover:scale-105 group-active:scale-105 transition-all duration-700 ease-in-out"
            />

            {/* Hover Text Reveal */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-500" />

            <div className="absolute inset-0 p-5 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 group-active:translate-y-0 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-all duration-500">
                <div className="w-10 h-[2px] bg-[#3e76b2] mb-3" />
                <h3 className="text-lg font-bold text-white leading-tight">
                    {member.name}
                </h3>
                <p className="text-xs font-bold text-[#3e76b2] uppercase tracking-widest mt-1">
                    {member.role}
                </p>
                {member.subRole && (
                    <p className="text-[10px] text-gray-400 mt-2 font-medium">
                        {member.subRole}
                    </p>
                )}
            </div>
 
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[9px] text-[#3e76b2] font-black uppercase tracking-tighter group-hover:opacity-0 transition-opacity">
                {member.role}
            </div>
        </motion.div>
    );
}

function GridSection({ title, members }) {
    return (
        <div className="mt-20">
            <div className="flex items-center gap-4 mb-10">
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter ">
                    {title}
                </h3>
                <div className="flex-1 h-[1px] bg-gray-200" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {members.map((m, i) => (
                    <MemberCard key={i} member={m} delay={i * 0.05} />
                ))}
            </div>
        </div>
    );
}

export default function OurTeam() {
    return (
        <section className="py-24 bg-white text-gray-900 min-h-screen">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Clean, Modern Header */}
                <div className="max-w-2xl mb-24">
                    <h2 className="text-3xl sm:text-3xl md:text-3xl lg:text-6xl font-black text-[#3e76b2] tracking-tighter uppercase leading-[0.9]">
                        Our <br />
                        <span className="text-gray-100 drop-shadow-[1px_1px_0_#3e76b2] ">Collective</span>
                    </h2>
                    <p className="mt-6 text-gray-500 font-medium text-sm border-l-2 border-[#3e76b2] pl-4">
                        Meet the architects of the Computing Students Society. 
                        Bridging innovation with leadership.
                    </p>
                </div>

                <GridSection title="Executive Board" members={team.executive} />
                
                <GridSection title="Cabinet" members={team.cabinet} />
                
                <GridSection title="Club Leads" members={team.clubs} />

            </div>
        </section>
    );
}