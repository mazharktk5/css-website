"use client";

import { motion } from "framer-motion";

export default function MissionVision() {
  return (
    <section className="relative w-full py-24 bg-white overflow-hidden">

      <div className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 rounded-3xl overflow-hidden border border-slate-100 shadow-lg bg-slate-50">

          {/* Vision */}
          <div className="flex flex-col">
            <div className="relative h-[350px] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200"
                alt="Students collaborating"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#1e3a8a]/20" />
            </div>

            <div className="p-12 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >

                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                  Our Vision
                </h2>

                <p className="text-lg text-slate-600 leading-relaxed">
                  To build a strong computing community where students
                  explore technology, collaborate on ideas, and develop the
                  skills needed to succeed in the digital world.
                </p>

              </motion.div>
            </div>
          </div>

          {/* Mission */}
          <div className="flex flex-col border-l border-slate-200">

            <div className="p-12 flex flex-col justify-center order-2 lg:order-1">

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >

                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                  Our Mission
                </h2>

                <p className="text-lg text-slate-600 leading-relaxed">
                  We aim to support students through technical workshops,
                  industry talks, hackathons, and collaborative projects
                  that encourage learning, creativity, and leadership.
                </p>

              </motion.div>
            </div>

            <div className="relative h-[350px] overflow-hidden order-1 lg:order-2">
              <img
                src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200"
                alt="Student projects"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#1e3a8a]/20" />
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}