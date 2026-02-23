"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const history = [
  {
    year: "Sept 2024",
    title: "Foundation",
    description: "Computing Students Society was founded to empower students through innovation.",
    position: "top",
  },
  {
    year: "Nov 2024",
    title: "First Event",
    description: "Organized our orientation session, giving students a glimpse into CSS.",
    position: "bottom",
  },
  {
    year: "Dec 2025",
    title: "Web Development",
    description: "Sir Tatheer guided the audience about how to start web dev and the learning path.",
    position: "top",
  },
  {
    year: "Jan 2026",
    title: "Basics of AI",
    description: "Raees Azam helped students understand AI basics and the right learning path.",
    position: "bottom",
  },
  {
    year: "Jan 2026",
    title: "n8n Masterclass",
    description: "Two-day session on Agentic AI and workflows using n8n by Nida.",
    position: "top",
  },
];

export default function History() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section className="relative py-32 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* Title Section */}
        <div className="flex flex-col items-center mb-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter uppercase italic">
              ENGINEERING <span className="text-[#1e3a8a]">LEGACY.</span>
            </h2>
            <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#1e3a8a] to-transparent" />
          </motion.div>
        </div>

        <div className="relative">
          {/* Central Line - Desktop */}
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-200 hidden md:block" />

          {/* Central Line - Mobile */}
          <div className="absolute top-0 left-8 w-[1px] h-full bg-slate-200 md:hidden" />

          {/* Timeline Items */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-16 md:gap-0 relative z-10">
            {history.map((event, idx) => (
              <div key={idx} className="flex flex-col md:items-center relative">

                {/* Desktop Layout */}
                {!isMobile && (
                  <div className="flex flex-col items-center w-full min-h-[350px] justify-center">
                    {/* Top Content */}
                    <div className="h-1/2 flex flex-col justify-end pb-12 w-full text-center px-6">
                      {event.position === "top" && (
                        <motion.div
                          initial={{ opacity: 0, y: -20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                        >
                          <span className="text-[#1e3a8a] font-black text-[9px] uppercase tracking-[0.3em] block mb-4">{event.year}</span>
                          <h3 className="font-black text-slate-900 text-sm mb-3 uppercase tracking-tight italic">{event.title}</h3>
                          <p className="text-[10px] text-slate-500 leading-relaxed max-w-[180px] mx-auto font-medium">
                            {event.description}
                          </p>
                        </motion.div>
                      )}
                    </div>

                    {/* The Point */}
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="w-12 h-12 rounded-full border border-slate-100 bg-white shadow-xl flex items-center justify-center relative z-20"
                    >
                      <div className="w-3 h-3 rounded-full bg-[#1e3a8a] shadow-[0_0_15px_rgba(30,58,138,0.3)]" />
                    </motion.div>

                    {/* Bottom Content */}
                    <div className="h-1/2 flex flex-col justify-start pt-12 w-full text-center px-6">
                      {event.position === "bottom" && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                        >
                          <span className="text-[#1e3a8a] font-black text-[9px] uppercase tracking-[0.3em] block mb-4">{event.year}</span>
                          <h3 className="font-black text-slate-900 text-sm mb-3 uppercase tracking-tight italic">{event.title}</h3>
                          <p className="text-[10px] text-slate-500 leading-relaxed max-w-[180px] mx-auto font-medium">
                            {event.description}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}

                {/* Mobile Layout */}
                {isMobile && (
                  <div className="flex gap-8 group">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      className="shrink-0 w-16 h-16 rounded-full border border-slate-100 bg-white shadow-lg flex items-center justify-center relative z-20"
                    >
                      <div className="w-2 h-2 rounded-full bg-[#1e3a8a]" />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      className="flex-1 pb-16"
                    >
                      <span className="text-[#1e3a8a] font-black text-[9px] uppercase tracking-[0.3em] block mb-3">{event.year}</span>
                      <h3 className="font-black text-slate-900 text-2xl mb-4 italic uppercase tracking-tighter">{event.title}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed font-medium">
                        {event.description}
                      </p>
                    </motion.div>
                  </div>
                )}

              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
