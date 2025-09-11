"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

// 🧑‍🤝‍🧑 Team Data
const team = {
    patron: [
        {
            name: "Dr Shah Khusro",
            role: "Patron-in-Chief",
            subRole: "Chairman, Dept. of Computer Science",
            image: "/images/team/chairman.jpg",
        },
    ],
    chief: [
        {
            name: "Dr Waheed ur Rehman",
            role: "Chief Organizer",
            subRole: "Coordinator, Dept. of Computer Science",
            image: "/images/team/coordinator.jpg",
        },
    ],
    cabinet: [
        { name: "Abubakar Sadiq", role: "President", image: "/images/team/president.jpg" },
        { name: "Muhammad Jawad", role: "Vice President", image: "/images/team/vp.jpg" },
        { name: "Abdullah Ahmed", role: "Chief Secretary", image: "/images/team/default.jpg" },
        { name: "Hashir Ahmed", role: "Information Secretary", image: "/images/team/information-secretary.jpg" },
        { name: "Atiq Ullah Khan", role: "Media Secretary", image: "/images/team/media-secretary.jpg" },
    ],
    clubs: [
        { name: "Muhammad Mamoon Khan", role: "Software Engineering Club Lead", image: "/images/team/default.jpg" },
        { name: "Jafar Ali", role: "Cyber Security Club Lead", image: "/images/team/default.jpg" },
        { name: "Muhammad Ilyas", role: "AI & DS Club Lead", image: "/images/team/ai-lead.jpg" },
        { name: "Hamza Ahmed Khan", role: "App Development Club Lead", image: "/images/team/default.jpg" },
        { name: "Fatima Ijaz", role: "Management Head", image: "/images/team/management-lead.jpg" },
        { name: "Shahab Saqib", role: "PR Head", image: "/images/team/default.jpg" },
        { name: "Iqra Noor", role: "Content & Graphics Head", image: "/images/team/default.jpg" },
    ],
};

// 🎴 Member Card
function MemberCard({ member, delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay }}
            className="group relative rounded-2xl p-6 flex flex-col items-center text-center
        bg-white backdrop-blur-sm border border-gray-100 shadow-lg hover:shadow-xl
        hover:-translate-y-2 transition-all duration-300 w-full max-w-xs mx-auto
        overflow-hidden h-full"
        >
            {/* Background Decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Avatar */}
            <div className="relative w-28 h-28 mb-5 z-10 flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                </div>
            </div>

            {/* Info */}
            <div className="flex flex-col items-center z-10 flex-grow justify-start w-full">
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors min-h-[56px] flex items-center justify-center w-full px-1">
                    {member.name}
                </h3>
                <p className="text-sm font-medium text-indigo-600 mt-1 min-h-[40px] flex items-center justify-center w-full px-1">
                    {member.role}
                </p>
                {member.subRole && (
                    <p className="text-xs text-gray-500 mt-2 bg-gray-100 px-2 py-1 rounded-full w-full">
                        {member.subRole}
                    </p>
                )}
            </div>
        </motion.div>
    );
}

// 📌 Section Wrapper
function Section({ title, members, colorClass }) {
    return (
        <div className="mt-16 md:mt-24">
            <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className={`text-3xl font-bold text-center mb-10 ${colorClass} relative pb-3`}
            >
                {title}
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full"></span>
            </motion.h3>
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 max-w-7xl mx-auto justify-items-center">
                {members.map((m, i) => (
                    <div key={i} className="w-full flex justify-center">
                        <MemberCard member={m} delay={i * 0.1} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function OurTeam() {
    return (
        <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 text-gray-800 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-4">
                        Meet Our Team
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        The passionate people driving our mission forward with dedication and expertise.
                    </p>
                </motion.div>

                {/* Patron & Chief */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row justify-center gap-10 md:gap-16 mb-20"
                >
                    <div className="text-center w-full max-w-xs mx-auto">
                        <h3 className="text-xl font-semibold mb-6 text-blue-700">Patron-in-Chief</h3>
                        <MemberCard member={team.patron[0]} />
                    </div>
                    <div className="text-center w-full max-w-xs mx-auto">
                        <h3 className="text-xl font-semibold mb-6 text-blue-700">Chief Organizer</h3>
                        <MemberCard member={team.chief[0]} />
                    </div>
                </motion.div>

                {/* Sections */}
                <Section
                    title="Cabinet Members"
                    members={team.cabinet}
                    colorClass="text-indigo-700"
                />
                <Section
                    title="Club Leads & Heads"
                    members={team.clubs}
                    colorClass="text-purple-700"
                />
            </div>
        </section>
    );
}