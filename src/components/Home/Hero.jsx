"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function Hero() {
  return (
    <section
      className="relative min-h-screen bg-slate-50 overflow-hidden pt-32 pb-20 flex flex-col justify-center"
    >
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Mesh Glows */}
        <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-[#1e3a8a]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#93c5fd]/5 rounded-full blur-[100px]" />

        {/* Subtle Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(#0f172a 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full flex flex-col flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center my-auto">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-8 space-y-12"
          >
            {/* Brand Tag */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4"
            >
              <span className="w-12 h-px bg-[#1e3a8a]" />
              <p className="text-[10px] font-black tracking-[0.5em] uppercase text-[#1e3a8a]/60">
                Computing Students Society // Digital Architects
              </p>
            </motion.div>

            <div className="space-y-10">
              <h1 className="text-6xl sm:text-8xl lg:text-[9.5rem] font-black text-slate-900 leading-[0.85] tracking-tighter uppercase">
                Build <br />
                The <span className="text-[#1e3a8a] italic">Legacy.</span>
              </h1>

              <p className="text-xl md:text-2xl text-slate-500 max-w-xl font-medium leading-tight">
                A high-end engineering community where code meets purpose,
                and students evolve into the architects of tomorrow.
              </p>

              <div className="flex flex-wrap gap-8 items-center pt-4">
                <Link
                  href="/events"
                  className="bg-slate-900 text-white px-10 py-5 rounded-full text-[11px] font-black uppercase tracking-[0.3em] hover:bg-[#1e3a8a] transition-all active:scale-95 shadow-2xl shadow-slate-200"
                >
                  Explore Archive
                </Link>

                <Link
                  href="/contact"
                  className="group flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-slate-900 hover:text-[#1e3a8a] transition-all"
                >
                  Join Society
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Right Visual Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="lg:col-span-4 hidden lg:block relative"
          >
            <div className="relative aspect-[4/5] rounded-[4rem] overflow-hidden border-8 border-white shadow-[-40px_40px_80px_rgba(0,0,0,0.05)]">
              <img
                src="/images/gallery/heroimage.png"
                alt="Engineering Concept"
                className="w-full h-full object-cover grayscale opacity-90 transition-all duration-1000 hover:grayscale-0 hover:scale-110"
              />
              <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay" />
            </div>

            {/* Floating Chip - Repositioned to avoid overflow */}
            <div className="absolute bottom-10 -left-12 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 z-20">
              <span className="block text-[10px] font-black text-[#1e3a8a] uppercase tracking-widest mb-1">Status</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-bold text-slate-900">SYSTEMS READY</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar - Made part of the normal flow for better spacing */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-20 pt-10 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-8"
        >
          <div className="flex items-center gap-6">
            <div className="w-px h-10 bg-slate-200" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Guiding Vision</span>
              <span className="text-sm font-bold text-slate-900 italic tracking-tight">— Sir Waheed Ur Rehman</span>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-2 h-2 rounded-full bg-slate-200" />
            <div className="w-2 h-2 rounded-full bg-[#1e3a8a]" />
            <div className="w-2 h-2 rounded-full bg-slate-200" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
