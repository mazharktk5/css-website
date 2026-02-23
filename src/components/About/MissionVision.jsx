"use client";

import { motion } from "framer-motion";

export default function MissionVision() {
  return (
    <section className="relative w-full py-24 bg-[#0a192f] overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl bg-white/5 backdrop-blur-sm">

          {/* Vision Section */}
          <div className="flex flex-col">
            <div className="relative h-[300px] md:h-[400px] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200"
                alt="Student Collaboration"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#3e76b2]/30 mix-blend-multiply" />
            </div>

            <div className="flex-1 p-10 md:p-16 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-block px-3 py-1 rounded-sm bg-[#6ea3d8]/20 text-[#6ea3d8] text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                  Forward Thinking
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-8 uppercase italic">
                  Our <span className="text-[#6ea3d8]">Vision</span>
                </h2>
                <div className="w-12 h-[2px] bg-[#6ea3d8] mb-8" />
                <p className="text-lg md:text-xl text-blue-100/70 leading-relaxed font-medium">
                  To build a thriving student community where innovation, collaboration, and learning drive impactful tech projects and growth.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Mission Section */}
          <div className="flex flex-col lg:border-l border-white/10">
            <div className="flex-1 p-10 md:p-16 flex flex-col justify-center order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-block px-3 py-1 rounded-sm bg-[#6ea3d8]/20 text-[#6ea3d8] text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                  Empowering Youth
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-8 uppercase italic">
                  Our <span className="text-[#6ea3d8]">Mission</span>
                </h2>
                <div className="w-12 h-[2px] bg-[#6ea3d8] mb-8" />
                <p className="text-lg md:text-xl text-blue-100/70 leading-relaxed font-medium">
                  To empower students with technical knowledge, hands-on experience, and leadership skills to succeed in technology and beyond.
                </p>
              </motion.div>
            </div>

            <div className="relative h-[300px] md:h-[400px] overflow-hidden order-1 lg:order-2">
              <img
                src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200"
                alt="Student Projects"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#3e76b2]/30 mix-blend-multiply" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
