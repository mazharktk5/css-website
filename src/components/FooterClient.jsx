"use client";
import { motion } from "framer-motion";

export function AnimatedSocial({ children, i }) {
  return (
    <motion.a
      key={i}
      href={children.props.href}
      aria-label={children.props['aria-label']}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -3, scale: 1.1 }}
      className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white hover:text-[#1e3a8a] transition-all"
    >
      {children}
    </motion.a>
  );
}
