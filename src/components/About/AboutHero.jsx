"use client";

import { motion } from "framer-motion";

export default function AboutHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/gallery/sportsweek3.JPG"
          alt="Computing Students Society"
          className="w-full h-full object-cover opacity-30 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/60 to-slate-950" />
      </div>

      {/* Animated Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-[#1e3a8a] rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.05, 0.08, 0.05]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-[#93c5fd] rounded-full blur-[120px]"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 flex flex-col items-center text-center">
        {/* Breadcrumb/Meta */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-10"
        >
          <span className="px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[#93c5fd] text-[9px] font-black tracking-[0.4em] uppercase">
            High-Performance Community // Est. 2024
          </span>
        </motion.div>

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-5xl"
        >
          <h1 className="text-6xl sm:text-8xl lg:text-[10rem] font-black text-white leading-[0.8] tracking-tighter mb-12 uppercase italic">
            THE <br /> <span className="text-[#93c5fd] not-italic">ARCHITECTS.</span>
          </h1>

          <p className="text-xl md:text-2xl text-blue-100/60 max-w-3xl mx-auto leading-relaxed font-medium">
            Bridging the gap between academic theory and industry reality.
            We build the skills, the culture, and the legacy of tomorrow&apos;s engineers.
          </p>

          <div className="mt-20 flex items-center justify-center gap-8">
            <div className="h-[1px] w-16 bg-[#1e3a8a]" />
            <p className="text-[#93c5fd] uppercase tracking-[0.5em] text-[10px] font-black">
              Engineering Excellence
            </p>
            <div className="h-[1px] w-16 bg-[#1e3a8a]" />
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <div className="w-px h-16 bg-gradient-to-b from-[#1e3a8a] to-transparent" />
          <span className="text-[8px] text-white/20 uppercase tracking-[0.4em] font-black">Scroll Depth</span>
        </motion.div>
      </div>
    </section>
  );
}
