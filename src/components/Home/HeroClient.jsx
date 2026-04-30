"use client";
import { motion } from "framer-motion";

export function HeroContent({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9 }}
      className="lg:col-span-7 space-y-10"
    >
      {children}
    </motion.div>
  );
}

export function HeroImage({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
      className="lg:col-span-5 hidden lg:block"
    >
      {children}
    </motion.div>
  );
}
