"use client";

import { useState } from "react"; 
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

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
    { name: "Sir Waheed", role: "Coordinator", img: "/images/team/coordinator.jpg" },
       { name: "Abdullah", role: "Vice President", img: "/images/team/cheif-secretary.jpg" },
    { name: "Ilyas", role: "President", img: "/images/team/ai-lead.jpg" },
    { name: "Fatima", role: "Female Vice President", img: "/images/team/fatima.png" },
     { name: "Nida", role: "Web Member", img: "/images/developers/nida.png" },
     { name: "Mazhar", role: "Web Lead", img: "/images/developers/mazhar.jpg" },
];

export default function AboutPreview() {
   
    const [currentIndex, setCurrentIndex] = useState(0);


    const nextMember = () => {
        setCurrentIndex((prev) => (prev + 1) % teamMembers.length);
    };

    const prevMember = () => {
        setCurrentIndex((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
    };

    return (
        <section id="about" className="py-24 bg-white overflow-hidden relative min-h-screen flex items-center">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -bottom-24 -left-24 w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-60" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-[#3e76b2]/5 to-transparent blur-3xl" />
            </div>
            {/* Background Glows */}
<div className="absolute inset-0 pointer-events-none overflow-hidden">
    {/* The Bottom-Left Blue Aura */}
    <div 
        className="absolute -bottom-[10%] -left-[10%] w-[600px] h-[600px] rounded-full opacity-40 blur-[120px]"
        style={{
            background: `radial-gradient(circle, #3e76b2 0%, #93c5fd 50%, transparent 70%)`
        }}
    />
</div>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    
                    <div className="lg:col-span-4">
                        <motion.h1 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="text-6xl md:text-7xl font-bold text-[#3e76b2] tracking-tight"
                        >
                            About Us
                        </motion.h1>
                        
                
                    </div>

                    <div className="lg:col-span-8">
                        <motion.div 
                            variants={container}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <div className="max-w-2xl">
                                <motion.h2 variants={item} className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6">
                                    Our team helps students <br />
                                    <span className="text-[#3e76b2]">succeed in computing.</span>
                                </motion.h2>
                                
                                <motion.p variants={item} className="text-lg text-gray-600 leading-relaxed mb-4">
                                    At the Computing Students Society, we believe in the power of community to drive results 
                                    and grow future leaders.
                                </motion.p>

                                <motion.div variants={item}>
                                    <Link
                                        href="/about"
                                        className="group inline-flex items-center gap-3 px-8 py-3 font-semibold text-white transition-all bg-[#3e76b2] rounded-xl hover:bg-[#3e76b2]/90 hover:shadow-xl"
                                    >
                                        Read More 
                                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </motion.div>
                            </div>

                            {/* Team Carousel Section */}
                            <motion.div variants={item} className="pt-2">
                                <div className="relative h-80 w-full overflow-hidden">
                                    {/* Using Framer Motion for smooth sliding transitions */}
                                    <div 
                                        className="flex gap-4 transition-transform duration-500 ease-in-out"
                                        style={{ transform: `translateX(-${currentIndex * 272}px)` }} // 256px(w-64) + 16px(gap-4)
                                    >
                                        {teamMembers.map((member, idx) => (
                                            <div key={idx} className="relative group flex-shrink-0 w-64 h-80 rounded-lg overflow-hidden cursor-pointer">
                                                <img 
                                                    src={member.img} 
                                                    alt={member.name}
                                                    className="w-full h-full object-cover transition-all duration-500 grayscale group-hover:grayscale-0 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                                                    <p className="text-white font-bold uppercase text-sm">{member.name}</p>
                                                    <p className="text-gray-300 text-xs">{member.role}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Navigation Buttons */}
                                <div className="flex gap-3 mt-8">
                                    <button 
                                        onClick={prevMember}
                                        className="p-4 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors active:scale-90"
                                    >
                                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                                    </button>
                                    <button 
                                        onClick={nextMember}
                                        className="p-4 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors active:scale-90"
                                    >
                                        <ArrowRight className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}