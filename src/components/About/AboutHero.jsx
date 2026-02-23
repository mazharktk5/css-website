"use client";

import { motion } from "framer-motion";

export default function AboutHero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-[#0a192f]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/gallery/sportsweek3.JPG"
          alt="Computing Students Society"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f]/80 via-[#0a192f]/40 to-[#0a192f]" />
      </div>

      {/* Animated Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-[#3e76b2] rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-[#6ea3d8] rounded-full blur-[120px]"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 flex flex-col items-center text-center">
        {/* Breadcrumb/Meta */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <span className="px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[#6ea3d8] text-xs font-bold tracking-[0.3em] uppercase">
            Our Journey Since 2024
          </span>
        </motion.div>

        {/* Hero Content Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative max-w-4xl p-8 md:p-16 rounded-[2rem] md:rounded-[3rem] border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden"
        >
          {/* Inner glass highlight */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-8 italic">
            CSS <br /> <span className="text-[#6ea3d8]">SOCIETY</span>
          </h1>

          <p className="text-xl md:text-2xl text-blue-100/80 max-w-2xl mx-auto leading-relaxed font-medium">
            The Computing Students Society is a vibrant tech community focused on
            bridging the gap between academia and industry. Through workshops,
            hackathons, and collaborative projects, we empower students to build
            future-ready skills.
          </p>

          <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="h-[1px] w-12 bg-[#6ea3d8]" />
            <p className="text-[#6ea3d8] uppercase tracking-[0.4em] text-xs font-bold">
              Innovate • Collaborate • Lead
            </p>
            <div className="h-[1px] w-12 bg-[#6ea3d8]" />
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="w-px h-12 bg-gradient-to-b from-[#6ea3d8] to-transparent" />
          <span className="text-[10px] text-white/40 uppercase tracking-widest font-black">Scroll Down</span>
        </motion.div>
      </div>
    </section>
  );
}
