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
    <section className="relative py-24 bg-[#0a192f] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* Title Section */}
        <div className="flex flex-col items-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter uppercase italic">
              Our <span className="text-[#6ea3d8]">Legacy</span>
            </h2>
            <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-[#6ea3d8] to-transparent" />
          </motion.div>
        </div>

        <div className="relative">
          {/* Central Line - Desktop */}
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/10 hidden md:block" />

          {/* Central Line - Mobile */}
          <div className="absolute top-0 left-8 w-[2px] h-full bg-white/10 md:hidden" />

          {/* Timeline Items */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-16 md:gap-0 relative z-10">
            {history.map((event, idx) => (
              <div key={idx} className="flex flex-col md:items-center relative">

                {/* Desktop Layout */}
                {!isMobile && (
                  <div className="flex flex-col items-center w-full min-h-[300px] justify-center">
                    {/* Top Content */}
                    <div className="h-1/2 flex flex-col justify-end pb-8 w-full text-center px-4">
                      {event.position === "top" && (
                        <motion.div
                          initial={{ opacity: 0, y: -20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                        >
                          <span className="text-[#6ea3d8] font-black text-[10px] uppercase tracking-widest block mb-2">{event.year}</span>
                          <h3 className="font-bold text-white text-base mb-2">{event.title}</h3>
                          <p className="text-[11px] text-blue-100/60 leading-relaxed max-w-[160px] mx-auto">
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
                      className="w-10 h-10 rounded-full border border-white/20 bg-[#0a192f] flex items-center justify-center relative z-20"
                    >
                      <div className="w-3 h-3 rounded-full bg-[#6ea3d8] shadow-[0_0_15px_rgba(110,163,216,0.8)]" />
                    </motion.div>

                    {/* Bottom Content */}
                    <div className="h-1/2 flex flex-col justify-start pt-8 w-full text-center px-4">
                      {event.position === "bottom" && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                        >
                          <span className="text-[#6ea3d8] font-black text-[10px] uppercase tracking-widest block mb-2">{event.year}</span>
                          <h3 className="font-bold text-white text-base mb-2">{event.title}</h3>
                          <p className="text-[11px] text-blue-100/60 leading-relaxed max-w-[160px] mx-auto">
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
                      className="shrink-0 w-16 h-16 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm flex items-center justify-center relative z-20"
                    >
                      <div className="w-2 h-2 rounded-full bg-[#6ea3d8] shadow-[0_0_10px_rgba(110,163,216,0.8)]" />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      className="flex-1 pb-12"
                    >
                      <span className="text-[#6ea3d8] font-black text-[10px] uppercase tracking-widest block mb-2">{event.year}</span>
                      <h3 className="font-bold text-white text-xl mb-2">{event.title}</h3>
                      <p className="text-sm text-blue-100/60 leading-relaxed">
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
