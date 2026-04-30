"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export function GalleryCard({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition duration-500"
    >
      <div className="relative aspect-[4/3]">
        <Image
          src={item.image || "/images/placeholder.jpg"}
          alt={item.eventName || "Gallery event"}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      </div>

      <div className="absolute bottom-0 p-6 text-white">
        <span className="text-[10px] uppercase tracking-widest text-blue-300 font-semibold">
          {item.category || "Activity"}
        </span>
        <h3 className="text-lg font-semibold mt-1">
          {item.eventName || "Untitled Event"}
        </h3>
        <p className="text-xs text-white/70 mt-1 line-clamp-2">
          {item.description || "Highlights from our recent event"}
        </p>
      </div>
    </motion.div>
  );
}
