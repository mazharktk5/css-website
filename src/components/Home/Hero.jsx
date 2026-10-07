import Image from "next/image";
import Link from "next/link";
import { HeroContent, HeroImage } from "./HeroClient";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white pt-20 md:pt-28">

      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden hidden md:block">

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
            {/* TechRise fire badge */}
            <div>
              <Link
                href="/techrise/register"
                className="font-display inline-flex items-center gap-2 md:gap-2.5 whitespace-nowrap bg-gradient-to-r from-[#b8841f] via-[#C8912A] to-[#b8841f] text-[#122a52] text-[12px] md:text-[15px] font-extrabold uppercase tracking-[0.04em] md:tracking-[0.04em] px-3.5 md:px-4 py-2 rounded-full shadow-[0_6px_24px_-8px_rgba(184,132,31,0.55)] ring-1 ring-[#8a6317]/40 hover:brightness-105 transition"
                aria-label="Register for TechRise 2026"
              >
                <span className="relative inline-flex items-center justify-center w-6 h-6 md:w-7 md:h-7" aria-hidden="true">
                  <span className="animate-ember absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(251,146,60,0.85),transparent_70%)] blur-[6px]" />
                  <span className="animate-fire relative text-base md:text-xl leading-none">🔥</span>
                </span>
                TechRise &rsquo;26 · Registrations Open
                <span className="animate-arrow" aria-hidden="true">→</span>
              </Link>
            </div>

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
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/events"
                className="bg-[#1e3a8a] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#172e6b] transition inline-block"
              >
                Explore Events
              </Link>
              <Link
                href="/techrise/register"
                className="font-display bg-gradient-to-r from-[#C8912A] to-[#b8841f] text-[#122a52] px-8 py-4 rounded-full font-extrabold tracking-wide hover:brightness-105 transition inline-block shadow-[0_10px_30px_-10px_rgba(184,132,31,0.6)]"
              >
                Register TechRise &rsquo;26 🔥
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
            <div className="relative rounded-[36px] overflow-hidden shadow-xl h-[520px]">
              <Image
                src="/images/team/core.jpeg"
                alt="Computing students collaboration"
                fill
                priority
                className="object-cover"
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
