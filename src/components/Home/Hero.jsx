"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function Hero() {
  return (
    <section 
      className="relative text-gray-900 overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/gallery/heroback.png')",backgroundSize:"100%",backgroundPosition:"center" }} 
    >
      
      <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 items-center gap-12 w-full py-32 lg:min-h-[80vh]">
        
     
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          variants={fadeUp}
          className="space-y-8 z-10 text-center lg:text-left flex flex-col justify-center h-full"
        >
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-4xl font-black tracking-tight leading-[1.1] text-blue-950">
              Innovate. <span className="text-blue-400 text-glow">Collaborate.</span> Lead.
            </h1>
            
   
            <div className="relative pl-4 border-l-4 border-blue-500 py-2 italic text-gray-600 bg-blue-50/50 rounded-r-lg">
              <p className="text-lg sm:text-xl font-medium">
                &quot;Join our community to turn your ideas into reality. Stay connected, 
                keep learning, and build the future of tech, together.&quot;
              </p>
              <footer className="mt-2 text-sm font-bold text-blue-400 uppercase tracking-widest">
                — Sir Waheed
              </footer>
            </div>
          </div>

          <p className="text-base sm:text-lg text-gray-700 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            The Computing Students Society is more than just a club; it&apos;s a launchpad 
            for the next generation of digital pioneers.
          </p>

          <div className="flex flex-wrap justify-center lg:justify-start gap-5">
            <Link
              href="#events"
              className="px-6 py-3 bg-blue-400 text-white rounded-2xl font-semibold hover:bg-blue-500 hover:-translate-y-1 transition-all shadow-xl shadow-blue-200"
            >
              Explore Events
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 border-2 border-blue-400 text-blue-900 rounded-2xl font-semibold hover:bg-blue-50 hover:-translate-y-1 transition-all"
            >
              Join Our Community
            </Link>
          </div>
        </motion.div>

        {/* Right image Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative w-full h-[350px] sm:h-[450px] lg:h-[400px] flex justify-center"
        >
          {/* Subtle Floating Animation Wrapper */}
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-full h-full max-w-xl"
          >
            <Image
              src="/images/gallery/heroimage.png"
              alt="CSS Community Collaboration"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
            />
            
            <div className="absolute inset-0 rounded-[2.5rem] backdrop-blur-[1px]"></div>
            
            {/* Decorative Blue Glow behind the image */}
            <div className="absolute -z-10 -inset-4 bg-blue-400/20 blur-3xl rounded-full opacity-50"></div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}