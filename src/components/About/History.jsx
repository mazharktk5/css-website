"use client";

import FadeIn from "@/components/FadeIn";
import { useEffect, useState } from "react";

const history = [
  {
    year: "Nov 2024",
    title: "Foundation",
    description:
      "Computing Students Society was founded to empower students through innovation.",
    position: "top",
  },
  {
    year: "Nov 2024",
    title: "First Event",
    description:
      "Organized our orientation session, giving students a glimpse into CSS.",
    position: "bottom",
  },
  {
    year: "Dec 2025",
    title: "Web Development Workshop",
    description:
      "Sir Tatheer guided students on how to start web development and the learning path.",
    position: "top",
  },
  {
    year: "Jan 2026",
    title: "Basics of AI",
    description:
      "Raees Azam introduced students to the fundamentals of AI and the right learning path.",
    position: "bottom",
  },
  {
    year: "Jan 2026",
    title: "n8n Masterclass",
    description:
      "Two-day session on Agentic AI and workflows using n8n by Nida.",
    position: "top",
  },
];

export default function History() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section className="relative py-28 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* Title */}
        <div className="flex flex-col items-center mb-24">
          <FadeIn className="text-center">
            <h2 className="text-4xl md:text-5xl font-semibold text-slate-900 mb-6">
              Our <span className="text-[#1e3a8a]">Journey</span>
            </h2>
            <div className="w-24 h-[2px] bg-[#1e3a8a]" />
          </FadeIn>
        </div>

        <div className="relative">

          {/* Desktop line */}
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-200 hidden md:block" />

          {/* Mobile line */}
          <div className="absolute top-0 left-8 w-[1px] h-full bg-slate-200 md:hidden" />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-16 md:gap-0 relative z-10">

            {history.map((event, idx) => (
              <div key={idx} className="flex flex-col md:items-center relative">

                {/* Desktop */}
                {!isMobile && (
                  <div className="flex flex-col items-center w-full min-h-[320px] justify-center">

                    {/* Top */}
                    <div className="h-1/2 flex flex-col justify-end pb-10 w-full text-center px-6">
                      {event.position === "top" && (
                        <FadeIn>
                          <span className="text-[#1e3a8a] text-sm font-medium block mb-2">
                            {event.year}
                          </span>

                          <h3 className="font-semibold text-slate-900 text-lg mb-2">
                            {event.title}
                          </h3>

                          <p className="text-sm text-slate-600 leading-relaxed max-w-[220px] mx-auto">
                            {event.description}
                          </p>
                        </FadeIn>
                      )}
                    </div>

                    {/* Dot */}
                    <div
                      className="w-10 h-10 rounded-full border border-slate-200 bg-white shadow-md flex items-center justify-center relative z-20"
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-[#1e3a8a]" />
                    </div>

                    {/* Bottom */}
                    <div className="h-1/2 flex flex-col justify-start pt-10 w-full text-center px-6">
                      {event.position === "bottom" && (
                        <FadeIn>
                          <span className="text-[#1e3a8a] text-sm font-medium block mb-2">
                            {event.year}
                          </span>

                          <h3 className="font-semibold text-slate-900 text-lg mb-2">
                            {event.title}
                          </h3>

                          <p className="text-sm text-slate-600 leading-relaxed max-w-[220px] mx-auto">
                            {event.description}
                          </p>
                        </FadeIn>
                      )}
                    </div>

                  </div>
                )}

                {/* Mobile */}
                {isMobile && (
                  <div className="flex gap-6">

                    <div
                      className="shrink-0 w-14 h-14 rounded-full border border-slate-200 bg-white shadow flex items-center justify-center"
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-[#1e3a8a]" />
                    </div>

                    <div className="flex-1 pb-12">
                      <span className="text-[#1e3a8a] text-sm font-medium block mb-1">
                        {event.year}
                      </span>

                      <h3 className="font-semibold text-slate-900 text-xl mb-2">
                        {event.title}
                      </h3>

                      <p className="text-sm text-slate-600 leading-relaxed">
                        {event.description}
                      </p>
                    </div>

                  </div>
                )}

              </div>
            ))}

          </div>
        </div>
      </div>
    </section>
  );
}