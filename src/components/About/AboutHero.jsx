"use client";

import { motion } from "framer-motion";

export default function AboutHero() {
  return (
    <section className="relative min-h-[70vh] md:min-h-screen bg-white flex flex-col md:flex-row items-stretch overflow-hidden">

      {/* Sidebar Vertical Title */}
      <div className="flex flex-col md:w-1/3 lg:w-1/4 px-6 md:px-12 py-10 md:py-0 items-start md:items-center justify-start md:justify-center bg-white z-20">
        <div className="flex flex-row md:flex-row-reverse items-end md:items-stretch gap-4 md:gap-6 h-auto md:h-[500px]">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-7xl font-bold text-[#3e76b2] md:[writing-mode:vertical-rl] md:rotate-180 leading-none whitespace-nowrap"
          >
            CSS Society
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center border-r-2 border-[#3e76b2] pl-0 md:pl-4"
          >
            <p className="text-sm md:text-base text-gray-500 font-medium md:[writing-mode:vertical-rl] md:rotate-180 uppercase tracking-widest leading-tight">
              Empowering the next generation of innovators.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Image + Floating Card */}
      <div className="relative flex-1 flex items-center justify-center p-4 md:p-0 bg-gray-50 md:bg-white gap-6 md:gap-0">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-full md:flex-1 h-[300px] sm:h-[450px] md:h-[600px] lg:h-[700px] max-w-5xl overflow-hidden shadow-2xl"
        >
          <img
            src="/images/gallery/sportsweek3.JPG"
            alt="Computing Students Society"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#3e76b2]/8 md:bg-[#3e76b2]/5" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="relative md:absolute mt-0 md:mt-0 md:bottom-20 md:right-10 lg:right-20 bg-[#3e76b2] text-white p-6 md:p-12 rounded-2xl md:rounded-3xl shadow-2xl w-full sm:w-96 md:w-auto md:h-auto max-w-full md:max-w-md lg:max-w-lg z-30"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">About Us</h2>
          <p className="text-blue-50 leading-relaxed text-sm md:text-lg opacity-90">
            The Computing Students Society is a vibrant tech community focused on
            bridging the gap between academia and industry. Through workshops,
            hackathons, and collaborative projects, we empower students to build
            future-ready skills.
          </p>
          <div className="mt-10 h-10 w-3/4 bg-white/10 rounded-full flex items-center px-4">
            <div className="h-1 w-12 bg-white/20 rounded-full" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
