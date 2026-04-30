"use client";
import { motion } from "framer-motion";

export function AnimatedLeader({ children, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="grid md:grid-cols-2 gap-10 items-center"
    >
      {children}
    </motion.div>
  );
}
