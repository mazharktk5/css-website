"use client";
import FadeIn from "@/components/FadeIn";

export function AnimatedLeader({ children, index }) {
  return (
    <FadeIn delay={index * 100} className="grid md:grid-cols-2 gap-10 items-center">
      {children}
    </FadeIn>
  );
}
