"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/gallery/heroimage.png')" }}
    >
      {/* Base overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Bottom fade for grounding */}
      <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-black/70 to-transparent"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 min-h-screen flex items-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl"
        >
          {/* Meta line */}
          <p className="mb-6 text-xs tracking-[0.35em] uppercase text-white/70">
            Computing Students Society • Est. 2024
          </p>

          {/* Content with guide line */}
          <div className="flex gap-6">
            <div className="w-px bg-white/40"></div>

            <div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05]">
                Innovate.
                <br />
                Collaborate.
                <span className="block text-[#6ea3d8]">Lead.</span>
              </h1>

              <p className="mt-8 text-xl text-white/90 max-w-2xl">
                A community where ideas turn into products,
                students grow into leaders, and technology meets purpose.
              </p>

              <p className="mt-4 text-sm uppercase tracking-widest text-white/70">
                — Sir Waheed
              </p>

              <div className="mt-10 flex gap-8 flex-wrap">
                <Link
                  href="#events"
                  className="text-white font-semibold underline underline-offset-8 hover:text-[#6ea3d8] transition"
                >
                  Explore Events
                </Link>

                <Link
                  href="/contact"
                  className="text-white font-semibold underline underline-offset-8 hover:text-[#6ea3d8] transition"
                >
                  Join Community
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
