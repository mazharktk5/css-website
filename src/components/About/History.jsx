"use client";

import { motion } from "framer-motion";

const history = [
  {
    year: "Sept 2024",
    title: "Foundation",
    description: "Computing Students Society was founded to empower students through innovation.",
    position: "top",
  },
  {
    year: "Nov 2024",
    title: "First Event",
    description: "Organized our orientation session, giving students a glimpse into CSS.",
    position: "bottom",
  },
  {
   year: "29 December 2025",
    title: "Web development",
    description: "Sir tatheer guided the audience about how to start web dev , what to learn , when and why",
    position: "top",
  },
  {
    year: "3rd January 2026",
    title: "Your first steps towards AI",
    description: "Raees Azam help students to understand the basics of AI and choose the tight learning path",
    position: "bottom",
  },
  {
    year: "January 2026",
    title: "n8n masterclass two day session",
    description: "Nida delieverd a session on agentic ai and how to make workflows using n8n",
    position: "top",
  },
];

export default function History() {
  return (
    <section className="relative py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title Section from Reference */}
        <div className="flex flex-col items-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-[#3e76b2] mb-4">
            CSS History Timeline
          </h2>
          <div className="w-16 h-8 bg-[#3e76b2] rounded-full relative">
             <div className="absolute right-1 top-1 w-6 h-6 bg-white rounded-full shadow-sm" />
          </div>
        </div>

        <div className="relative">
          {/* Horizontal Wave Connector (SVG) */}
          <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 hidden md:block">
            <svg viewBox="0 0 1200 120" fill="none" className="w-full">
              <path 
                d="M0 60 C 150 120, 300 0, 450 60 C 600 120, 750 0, 900 60 C 1050 120, 1200 60" 
                stroke="#e2e8f0" 
                strokeWidth="2" 
                strokeDasharray="8 8"
              />
            </svg>
          </div>

          {/* Timeline Items Container */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
            {history.map((event, idx) => (
              <div key={idx} className="flex flex-col items-center group">
                
                {/* Content - Top Position */}
                {event.position === "top" && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="mb-8 text-center hidden md:block"
                  >
                    <span className="text-[#3e76b2] font-bold text-xl">{event.year}</span>
                    <h3 className="font-bold text-gray-800 text-lg my-1">{event.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed max-w-[150px] mx-auto">
                      {event.description}
                    </p>
                    <div className="w-[1px] h-8 bg-gray-300 mx-auto mt-4 border-dashed border-l" />
                  </motion.div>
                )}

                {/* The Circle Number Indicator */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="w-20 h-20 rounded-full border-4 border-white shadow-xl flex items-center justify-center bg-white relative z-20 group-hover:scale-110 transition-transform cursor-default"
                >
                  <div className="w-14 h-14 rounded-full border-4 border-[#3e76b2] flex items-center justify-center">
                    <span className="text-2xl font-bold text-[#3e76b2]">{idx + 1}</span>
                  </div>
                </motion.div>

                {/* Content - Bottom Position */}
                {(event.position === "bottom" || typeof window !== 'undefined' && window.innerWidth < 768) && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="mt-8 text-center"
                  >
                     <div className="w-[1px] h-8 bg-gray-300 mx-auto mb-4 border-dashed border-l hidden md:block" />
                    <span className="text-[#3e76b2] font-bold text-xl block md:inline">{event.year}</span>
                    <h3 className="font-bold text-gray-800 text-lg my-1">{event.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed max-w-[150px] mx-auto">
                      {event.description}
                    </p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Decorative background squiggles from reference */}
        <div className="absolute bottom-0 left-0 -z-10 opacity-20 hidden lg:block">
           <svg width="200" height="200" viewBox="0 0 200 200">
              <path d="M0 100 Q 50 50, 100 100 T 200 100" stroke="#3e76b2" fill="transparent" strokeWidth="20" strokeLinecap="round" />
           </svg>
        </div>
      </div>
    </section>
  );
}