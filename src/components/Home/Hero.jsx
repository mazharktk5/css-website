import Image from "next/image";
import Link from "next/link";
import { HeroContent, HeroImage } from "./HeroClient";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white pt-28">

      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">

        <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] bg-[#1e3a8a]/10 rounded-full blur-[140px]" />

        <div className="absolute bottom-[-200px] left-[-200px] w-[500px] h-[500px] bg-[#1e3a8a]/5 rounded-full blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(#0f172a 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
        <div className="grid lg:grid-cols-12 gap-16 items-center">

          {/* LEFT CONTENT */}
          <HeroContent>
            {/* Label */}
            <p className="uppercase tracking-[0.35em] text-xs font-bold text-[#1e3a8a]">
              Computing Students Society
            </p>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight">
              Building the Next Generation of
              <span className="block text-[#1e3a8a]">
                Developers & Innovators
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed">
              A student-led computing community where passionate learners
              explore technology together. Through workshops, hackathons,
              collaborative projects, and mentorship, we help students build
              practical skills and grow into future software engineers,
              developers, and tech innovators.
            </p>

            {/* CTA */}
            <div>
              <Link
                href="/events"
                className="bg-[#1e3a8a] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#172e6b] transition inline-block"
              >
                Explore Events
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-6 max-w-xl">
              <div>
                <p className="text-3xl font-bold text-slate-900">200+</p>
                <p className="text-sm text-slate-500">Members</p>
              </div>

              <div>
                <p className="text-3xl font-bold text-slate-900">30+</p>
                <p className="text-sm text-slate-500">Events</p>
              </div>

              <div>
                <p className="text-3xl font-bold text-slate-900">10+</p>
                <p className="text-sm text-slate-500">Projects</p>
              </div>
            </div>
          </HeroContent>

          {/* RIGHT IMAGE */}
          <HeroImage>
            <div className="relative rounded-[36px] overflow-hidden shadow-xl">
              <Image
                src="/images/team/core.jpeg"
                alt="Computing students collaboration"
                width={800}
                height={520}
                priority
                className="w-full h-[520px] object-cover"
                sizes="(max-width: 1024px) 100vw, 800px"
              />
              <div className="absolute inset-0 bg-[#1e3a8a]/10" />
            </div>
          </HeroImage>

        </div>
      </div>
    </section>
  );
}
