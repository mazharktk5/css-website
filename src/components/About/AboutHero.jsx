export default function AboutHero() {
  return (
    <section className="relative py-32 bg-slate-50 overflow-hidden">

      {/* subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle,_#000_1px,_transparent_1px)] bg-[size:40px_40px]" />

      {/* background glow shapes */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-120px] left-[20%] w-[500px] h-[500px] bg-[#1e3a8a]/15 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-120px] right-[20%] w-[500px] h-[500px] bg-blue-300/20 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-6 text-center">

        {/* small label */}
        <span
          className="text-sm text-[#1e3a8a] font-medium tracking-wide animate-[fadeInUp_0.6s_ease_both]"
        >
          Computing Students Society
        </span>

        {/* heading */}
        <h1
          className="mt-4 text-4xl md:text-5xl lg:text-6xl font-semibold text-slate-900 leading-tight animate-[fadeInUp_0.7s_ease_0.1s_both]"
        >
          About Our
          <span className="block text-[#1e3a8a]">
            Computing Students Society
          </span>
        </h1>

        {/* description */}
        <p
          className="mt-6 text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed animate-[fadeIn_0.8s_ease_0.2s_both]"
        >
          A community of students passionate about technology, programming,
          and innovation. Through workshops, events, and collaborative
          projects, we create opportunities for students to learn, build
          real skills, and grow together.
        </p>

        {/* stats */}
        <div
          className="mt-16 grid grid-cols-3 max-w-xl mx-auto gap-10 text-center animate-[fadeInUp_0.7s_ease_0.3s_both]"
        >
          <div>
            <p className="text-3xl font-semibold text-[#1e3a8a]">20+</p>
            <p className="text-sm text-slate-600">Events Organized</p>
          </div>

          <div>
            <p className="text-3xl font-semibold text-[#1e3a8a]">200+</p>
            <p className="text-sm text-slate-600">Students Engaged</p>
          </div>

          <div>
            <p className="text-3xl font-semibold text-[#1e3a8a]">5+</p>
            <p className="text-sm text-slate-600">Workshops</p>
          </div>
        </div>

        {/* divider */}
        <div
          className="flex justify-center mt-16 animate-[fadeIn_0.6s_ease_0.5s_both]"
        >
          <div className="w-20 h-[2px] bg-[#1e3a8a]" />
        </div>

      </div>
    </section>
  );
}