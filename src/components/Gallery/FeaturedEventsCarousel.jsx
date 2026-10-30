"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Images, CalendarDays } from "lucide-react";

const AUTOPLAY_MS = 5000;

function buildSlides(items) {
    const byEvent = new Map();
    for (const item of items) {
        const key = item.eventName || "Untitled Event";
        const list = byEvent.get(key) || [];
        list.push(item);
        byEvent.set(key, list);
    }
    return [...byEvent.entries()]
        .map(([eventName, photos]) => {
            const sorted = [...photos].sort(
                (a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)
            );
            const latest = sorted[0] || {};
            const rawDate = latest.date || latest.createdAt;
            let displayDate = "";
            if (rawDate && !Number.isNaN(new Date(rawDate).getTime())) {
                displayDate = new Date(rawDate).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric", timeZone: "UTC",
                });
            }
            return {
                eventName,
                cover: latest.image || "/images/team/placeholder.jpg",
                category: latest.category || "",
                description: latest.description || "",
                count: photos.length,
                date: displayDate,
                ts: rawDate ? new Date(rawDate).getTime() : 0,
            };
        })
        .sort((a, b) => b.ts - a.ts)
        .slice(0, 3);
}

export default function FeaturedEventsCarousel({ items, onViewPhotos }) {
    const slides = useMemo(() => buildSlides(items || []), [items]);
    const [index, setIndex] = useState(0);

    const safeIndex = slides.length ? index % slides.length : 0;

    useEffect(() => {
        if (slides.length < 2) return undefined;
        const t = setTimeout(() => setIndex((i) => (i + 1) % slides.length), AUTOPLAY_MS);
        return () => clearTimeout(t);
    }, [index, slides.length]);

    const prev = useCallback(() => {
        if (!slides.length) return;
        setIndex((i) => (i - 1 + slides.length) % slides.length);
    }, [slides.length]);

    const next = useCallback(() => {
        if (!slides.length) return;
        setIndex((i) => (i + 1) % slides.length);
    }, [slides.length]);

    if (slides.length === 0) return null;
    const slide = slides[safeIndex];

    return (
        <section
            className="max-w-7xl mx-auto px-6 mt-10"
            aria-label="Featured recent events"
        >
            <motion.div
                className="relative h-[460px] md:h-[560px] rounded-3xl overflow-hidden bg-slate-900 shadow-2xl shadow-slate-900/10 ring-1 ring-slate-900/5 select-none"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.12}
                onDragEnd={(_, info) => {
                    if (info.offset.x < -60) next();
                    else if (info.offset.x > 60) prev();
                }}
            >
                {/* Slides (crossfade + slow Ken Burns) */}
                <AnimatePresence initial={false}>
                    <motion.div
                        key={safeIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="absolute inset-0"
                    >
                        <motion.div
                            initial={{ scale: 1 }}
                            animate={{ scale: 1.12 }}
                            transition={{ duration: 12, ease: "linear" }}
                            className="absolute inset-0"
                        >
                            <Image
                                src={slide.cover}
                                alt={slide.eventName}
                                fill
                                priority={safeIndex === 0}
                                sizes="(max-width: 1280px) 100vw, 1280px"
                                className="object-cover"
                                draggable={false}
                            />
                        </motion.div>
                    </motion.div>
                </AnimatePresence>

                {/* Legibility gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />

                {/* Progress bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-white/15 z-20">
                    <div
                        key={`bar-${safeIndex}`}
                        className="h-full bg-[#C8912A] origin-left"
                        style={{
                            animation: `progressFill ${AUTOPLAY_MS}ms linear forwards`,
                        }}
                    />
                </div>

                {/* Arrows */}
                {slides.length > 1 && (
                    <>
                        <button
                            onClick={prev}
                            aria-label="Previous event"
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-sm transition-all"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={next}
                            aria-label="Next event"
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-sm transition-all"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </>
                )}

                {/* Text overlay */}
                <div className="absolute bottom-0 left-0 right-0 z-10 p-7 md:p-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`meta-${safeIndex}`}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="max-w-2xl"
                        >
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                                {slide.category && (
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] bg-[#C8912A]/90 text-slate-900 px-3 py-1.5 rounded-full">
                                        {slide.category}
                                    </span>
                                )}
                                {slide.date && (
                                    <span className="flex items-center gap-1.5 text-xs font-semibold text-white/80">
                                        <CalendarDays className="w-3.5 h-3.5" />
                                        {slide.date}
                                    </span>
                                )}
                                <span className="flex items-center gap-1.5 text-xs font-semibold text-white/70">
                                    <Images className="w-3.5 h-3.5" />
                                    {slide.count} photo{slide.count !== 1 ? "s" : ""}
                                </span>
                            </div>

                            <h3 className="text-3xl md:text-4xl font-black text-white leading-tight mb-2">
                                {slide.eventName}
                            </h3>

                            {slide.description && (
                                <p className="text-sm md:text-base text-white/75 leading-relaxed mb-5 line-clamp-2">
                                    {slide.description}
                                </p>
                            )}

                            <button
                                onClick={() => onViewPhotos?.(slide.eventName)}
                                className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-full hover:bg-[#C8912A] transition-colors"
                            >
                                <Images className="w-4 h-4" />
                                View photos
                            </button>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Dots */}
                {slides.length > 1 && (
                    <div className="absolute bottom-7 md:bottom-10 right-7 md:right-10 z-10 flex items-center gap-2">
                        {slides.map((s, i) => (
                            <button
                                key={s.eventName}
                                onClick={() => setIndex(i)}
                                aria-label={`Go to ${s.eventName}`}
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    i === safeIndex ? "w-7 bg-[#C8912A]" : "w-2 bg-white/40 hover:bg-white/70"
                                }`}
                            />
                        ))}
                    </div>
                )}
            </motion.div>
        </section>
    );
}
