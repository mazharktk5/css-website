"use client";

import { motion } from "framer-motion";

export default function MissionVision() {
  return (
    <section className="relative w-full py-24 bg-white overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 rounded-[3rem] overflow-hidden border border-slate-100 shadow-2xl bg-slate-50 relative z-10">

          {/* Vision Section */}
          <div className="flex flex-col">
            <div className="relative h-[400px] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200"
                alt="Student Collaboration"
                className="w-full h-full object-cover grayscale opacity-80"
              />
              <div className="absolute inset-0 bg-[#1e3a8a]/20 mix-blend-multiply" />
            </div>

            <div className="flex-1 p-12 md:p-16 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-block px-3 py-1 rounded-sm bg-[#1e3a8a]/5 text-[#1e3a8a] text-[9px] font-black uppercase tracking-[0.4em] mb-6">
                  Forward Vision
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-8 uppercase italic">
                  Digital <span className="text-[#1e3a8a]">Horizon.</span>
                </h2>
                <div className="w-16 h-[2px] bg-[#1e3a8a] mb-8" />
                <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium">
                  Constructing an elite ecosystem where technical mastery and collaborative innovation redefine the boundaries of engineering.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Mission Section */}
          <div className="flex flex-col lg:border-l border-slate-200">
            <div className="flex-1 p-12 md:p-16 flex flex-col justify-center order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-block px-3 py-1 rounded-sm bg-[#1e3a8a]/5 text-[#1e3a8a] text-[9px] font-black uppercase tracking-[0.4em] mb-6">
                  Core Execution
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-8 uppercase italic">
                  The <span className="text-[#1e3a8a]">Mission.</span>
                </h2>
                <div className="w-16 h-[2px] bg-[#1e3a8a] mb-8" />
                <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium">
                  Architecting professional pathways through high-end workshops, competitive hackathons, and community-driven excellence.
                </p>
              </motion.div>
            </div>

            <div className="relative h-[400px] overflow-hidden order-1 lg:order-2">
              <img
                src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200"
                alt="Student Projects"
                className="w-full h-full object-cover grayscale opacity-80"
              />
              <div className="absolute inset-0 bg-[#1e3a8a]/20 mix-blend-multiply" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
