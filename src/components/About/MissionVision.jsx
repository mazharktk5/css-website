"use client";

import { motion } from "framer-motion";

export default function MissionVision() {
  return (
    <section className="relative w-full min-h-screen bg-white overflow-hidden">
      <div className="flex flex-col md:grid md:grid-cols-2">

        {/* Vision */}
        <div className="relative h-[400px] md:h-[500px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200"
            alt="Student Collaboration"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#3e76b2]/20 mix-blend-multiply" />
        </div>

        <div className="bg-[#3e76b2] flex flex-col justify-center p-12 lg:p-24 text-white relative">
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]" />
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <h2 className="text-4xl md:text-5xl font-serif tracking-tight mb-8 uppercase">Our Vision</h2>
            <p className="text-lg md:text-xl leading-relaxed font-light opacity-90 border-l-2 border-white/30 pl-6">
              To build a thriving student community where innovation, collaboration, and learning drive impactful tech projects and growth.
            </p>
          </motion.div>
        </div>

        {/* Mission */}
        <div className="bg-[#f4f1ee] flex flex-col justify-center p-12 lg:p-24 text-[#3e76b2] md:order-3 relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-serif tracking-tight mb-8 uppercase">Our Mission</h2>
            <p className="text-lg md:text-xl leading-relaxed font-medium opacity-80 border-l-2 border-[#3e76b2]/30 pl-6">
              To empower students with technical knowledge, hands-on experience, and leadership skills to succeed in technology and beyond.
            </p>
          </motion.div>
        </div>

        <div className="relative h-[400px] md:h-[500px] overflow-hidden md:order-4">
          <img
            src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200"
            alt="Student Projects"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#3e76b2]/10 mix-blend-screen" />
        </div>
      </div>
    </section>
  );
}
