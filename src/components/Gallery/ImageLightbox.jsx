"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Download, Maximize2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ImageLightbox({ images, currentIndex, onClose, onNext, onPrev }) {
    const [isZoomed, setIsZoomed] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight") onNext();
            if (e.key === "ArrowLeft") onPrev();
        };
        window.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        };
    }, [onClose, onNext, onPrev]);

    const currentImage = images[currentIndex];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-10"
                onClick={onClose}
            >
                {/* Header Controls */}
                <div className="absolute top-6 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 pointer-events-none">
                    <div className="flex items-center gap-4 pointer-events-auto">
                        <div className="text-white/80">
                            <h4 className="font-bold text-sm md:text-base truncate max-w-[200px] md:max-w-md">
                                {currentImage.eventName}
                            </h4>
                            <p className="text-[10px] md:text-xs text-blue-400 font-medium uppercase tracking-widest">
                                {currentImage.category}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4 pointer-events-auto">
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsZoomed(!isZoomed); }}
                            className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-all backdrop-blur-md border border-white/10"
                        >
                            <Maximize2 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-3 bg-white/5 hover:bg-blue-600/50 rounded-full text-white/70 hover:text-white transition-all backdrop-blur-md border border-white/10"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <button
                    onClick={(e) => { e.stopPropagation(); onPrev(); }}
                    className="absolute left-4 md:left-10 z-50 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-all backdrop-blur-md border border-white/10 group"
                >
                    <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 group-hover:-translate-x-1 transition-transform" />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onNext(); }}
                    className="absolute right-4 md:right-10 z-50 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-all backdrop-blur-md border border-white/10 group"
                >
                    <ChevronRight className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Image Content */}
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: isZoomed ? 1.2 : 1, y: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    key={currentIndex}
                    className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-zoom-in"
                    onClick={(e) => { e.stopPropagation(); setIsZoomed(!isZoomed); }}
                >
                    <div className="relative w-full max-w-5xl h-[70vh] md:h-[80vh]">
                        <Image
                            src={currentImage.image}
                            alt={currentImage.eventName}
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </motion.div>

                {/* Footer Info */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 text-center pointer-events-none w-full max-w-2xl px-6">
                    <p className="text-white/60 text-sm italic line-clamp-2">
                        &quot;{currentImage.description}&quot;
                    </p>
                    <div className="mt-4 text-white/30 text-[10px] uppercase tracking-widest font-black">
                        {currentIndex + 1} / {images.length}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
