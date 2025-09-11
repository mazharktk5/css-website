"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Linkedin, Mail } from "lucide-react";
import React from "react";

const team = {
    patron: [
        {
            name: "Dr Shah Khusro",
            role: "Patron-in-Chief",
            subRole: "Chairman, Dept. of Computer Science",
            image: "/images/team/chairman.jpg",
            linkedin: "https://linkedin.com",
            email: "patron@university.edu",
        },
    ],
    chief: [
        {
            name: "Dr Waheed ur Rehman",
            role: "Chief Organizer",
            subRole: "Coordinator, Dept. of Computer Science",
            image: "/images/team/coordinator.jpg",
            linkedin: "https://linkedin.com",
            email: "waheed@university.edu",
        },
    ],
    core: [
        {
            name: "Abubakar Sadiq",
            role: "President",
            image: "/images/team/president.jpg",
            linkedin: "https://linkedin.com",
            email: "abu@university.edu",
        },
        {
            name: "Muhammad Jawad",
            role: "Vice President",
            image: "/images/developers/mazhar.jpg",
            linkedin: "https://linkedin.com",
            email: "jawad@university.edu",
        },
    ],
    leads: [
        {
            name: "Mamoon khan",
            role: "Lead –  Software",
            image: "/images/developers/ali.jpg",
            image: "/images/developers/mazhar.jpg",
            email: "ali@university.edu",
        },
        {
            name: "Muhammad Ilyas",
            role: "Lead – AI/DS",
            image: "/images/team/ai-lead.jpg",
            linkedin: "https://linkedin.com",
            email: "fatima@university.edu",
        },
        {
            name: "Jafar Ali",
            role: "Lead – Cyber Security",
            image: "/images/developers/mazhar.jpg",
            linkedin: "https://linkedin.com",
            email: "mazhar@university.edu",
        },
        {
            name: "Fatima",
            role: "Lead – Management",
            image: "/images/developers/mazhar.jpg",
            linkedin: "https://linkedin.com",
            email: "fatima@university.edu",
        },
        {
            name: "Zohaib",
            role: "Lead – Events",
            image: "/images/developers/mazhar.jpg",
            linkedin: "https://linkedin.com",
            email: "mazhar@university.edu",
        },
    ],
};

function MemberCard({ member, highlight = false, delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay }}
            className={`group relative rounded-2xl p-6 flex flex-col items-center text-center 
                bg-gradient-to-br from-white to-blue-50 border border-blue-100 
                shadow-md hover:shadow-2xl hover:scale-[1.03] transition-all duration-500 
                w-full max-w-xs ${highlight ? "ring-4 ring-blue-300" : ""}`}
        >
            {/* Avatar */}
            <div className="relative w-36 h-36">
                <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="rounded-full object-cover border-4 border-white 
                    shadow-md group-hover:shadow-lg group-hover:border-blue-300 transition-all duration-300"
                />
            </div>

            {/* Info */}
            <div className="flex flex-col items-center mt-6">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition">
                    {member.name}
                </h3>
                <p className="text-sm text-blue-700 mt-1 font-medium">{member.role}</p>
                {member.subRole && (
                    <p className="text-xs text-gray-500 mt-0.5">{member.subRole}</p>
                )}
            </div>

            {/* Social Links */}
            <div className="flex gap-3 mt-5">
                <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`LinkedIn profile of ${member.name}`}
                    className="w-9 h-9 flex items-center justify-center rounded-full 
                    bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white 
                    shadow-sm transition-colors duration-300"
                >
                    <Linkedin size={16} />
                </a>
                <a
                    href={`mailto:${member.email}`}
                    aria-label={`Email ${member.name}`}
                    className="w-9 h-9 flex items-center justify-center rounded-full 
                    bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white 
                    shadow-sm transition-colors duration-300"
                >
                    <Mail size={16} />
                </a>
            </div>
        </motion.div>
    );
}

export default function OurTeam() {
    return (
        <section className="py-24 bg-gradient-to-br from-white via-blue-50 to-blue-100 text-gray-900 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                {/* Heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl font-extrabold text-center text-blue-900"
                >
                    Meet Our Team
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-4 text-lg text-gray-700 text-center max-w-2xl mx-auto"
                >
                    The passionate people driving our mission forward.
                </motion.p>

                {/* Patron & Chief Organizer */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 justify-items-center">
                    <div className="w-full max-w-sm">
                        <h3 className="text-2xl font-bold text-center mb-6 text-blue-800">
                            Patron-in-Chief
                        </h3>
                        <MemberCard member={team.patron[0]} highlight />
                    </div>
                    <div className="w-full max-w-sm">
                        <h3 className="text-2xl font-bold text-center mb-6 text-blue-800">
                            Chief Organizer
                        </h3>
                        <MemberCard member={team.chief[0]} highlight />
                    </div>
                </div>

                {/* Core Leadership */}
                <h3 className="mt-20 text-2xl font-bold text-center text-blue-800">
                    Core Leadership
                </h3>
                <div className="mt-8 grid gap-10 sm:grid-cols-2 justify-items-center max-w-3xl mx-auto">
                    {team.core.map((m, i) => (
                        <MemberCard key={i} member={m} delay={i * 0.15} />
                    ))}
                </div>

                {/* Team Leads */}
                <h3 className="mt-20 text-2xl font-bold text-center text-blue-800">
                    Team Leads
                </h3>
                <div className="mt-8 grid gap-10 sm:grid-cols-2 md:grid-cols-3 justify-items-center max-w-5xl mx-auto">
                    {team.leads.map((m, i) => (
                        <MemberCard key={i} member={m} delay={i * 0.15} />
                    ))}
                </div>
            </div>
        </section>
    );
}
