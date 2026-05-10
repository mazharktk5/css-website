export function HeroContent({ children }) {
  return (
    <div
      className="lg:col-span-7 space-y-10 animate-[fadeInUp_0.9s_ease_both]"
    >
      {children}
    </div>
  );
}

export function HeroImage({ children }) {
  return (
    <div
      className="lg:col-span-5 hidden lg:block animate-[fadeInScale_1s_ease_both]"
    >
      {children}
    </div>
  );
}
