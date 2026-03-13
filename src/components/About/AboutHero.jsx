"use client";

import { motion } from "framer-motion";

export default function AboutHero() {
  return (
    <section className="relative py-32 bg-slate-50 overflow-hidden">

      {/* subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle,_#000_1px,_transparent_1px)] bg-[size:40px_40px]" />

      {/* background glow shapes */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-120px] left-[20%] w-[500px] h-[500px] bg-[#1e3a8a]/15 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-120px] right-[20%] w-[500px] h-[500px] bg-blue-300/20 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-6 text-center">

        {/* small label */}
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-sm text-[#1e3a8a] font-medium tracking-wide"
        >
          Computing Students Society
        </motion.span>

        {/* heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-4 text-4xl md:text-5xl lg:text-6xl font-semibold text-slate-900 leading-tight"
        >
          About Our
          <span className="block text-[#1e3a8a]">
            Computing Students Society
          </span>
        </motion.h1>

        {/* description */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
        >
          A community of students passionate about technology, programming,
          and innovation. Through workshops, events, and collaborative
          projects, we create opportunities for students to learn, build
          real skills, and grow together.
        </motion.p>

        {/* stats */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 grid grid-cols-3 max-w-xl mx-auto gap-10 text-center"
        >
          <div>
            <p className="text-3xl font-semibold text-[#1e3a8a]">20+</p>
            <p className="text-sm text-slate-600">Events Organized</p>
          </div>

          <div>
            <p className="text-3xl font-semibold text-[#1e3a8a]">200+</p>
            <p className="text-sm text-slate-600">Students Engaged</p>
          </div>

          <div>
            <p className="text-3xl font-semibold text-[#1e3a8a]">5+</p>
            <p className="text-sm text-slate-600">Workshops</p>
          </div>
        </motion.div>

        {/* divider */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center mt-16"
        >
          <div className="w-20 h-[2px] bg-[#1e3a8a]" />
        </motion.div>

      </div>
    </section>
  );
}