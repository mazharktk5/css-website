"use client";
import FadeIn from "@/components/FadeIn";
import Image from "next/image";
import { Linkedin } from "lucide-react";

export function DeveloperCard({ dev, index }) {
  return (
    <FadeIn delay={index * 100} className="text-center group">
      <div className="relative w-36 h-36 mx-auto mb-6 overflow-hidden rounded-2xl shadow-sm">
        <Image
          src={dev.image}
          alt={dev.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 150px, 150px"
        />
      </div>

      <h3 className="text-lg font-semibold text-slate-900">
        {dev.name}
      </h3>

      <p className="text-sm text-blue-700 mt-1">
        {dev.role}
      </p>

      <div className="mt-4 flex justify-center">
        <a
          href={dev.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-700 transition"
        >
          <Linkedin className="w-4 h-4" />
          LinkedIn
        </a>
      </div>
    </FadeIn>
  );
}
