"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ArrowRight, Instagram, Linkedin, Mail } from "lucide-react"; // Added icons for flair
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../public/images/logo/cssfinallogo.jpeg";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        // Prevent scrolling when mobile menu is open
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => window.removeEventListener("scroll", handleScroll);
    }, [open]);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Events", href: "/events" },
        { name: "Gallery", href: "/gallery" },
        { name: "Alumni", href: "/alumni" },
        { name: "Blog", href: "/blog" },
        { name: "Watch", href: "/videos" },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${scrolled
                ? "bg-[#1e3a8a]/90 backdrop-blur-md py-3 shadow-xl"
                : "bg-[#1e3a8a] py-5"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

                {/* LOGO SECTION */}
                <Link href="/" className="flex items-center gap-3 group shrink-0">
                    <div className="relative w-11 h-11 transition-transform duration-300 group-hover:scale-105">
                        <Image
                            src={logo}
                            alt="CSS Logo"
                            fill
                            className="rounded-full object-cover border-2 border-white/20 shadow-inner"
                        />
                    </div>
                    <div className="flex flex-col justify-center">
                        <h1 className="font-black text-sm sm:text-lg text-white tracking-tight leading-tight uppercase">
                            Computing Students <span className="text-blue-300 block sm:inline">Society</span>
                        </h1>
                    </div>
                </Link>

                {/* Desktop Links (No changes here, kept as you liked them) */}
                <div className="hidden lg:flex items-center space-x-10">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="group relative text-[13px] font-extrabold uppercase tracking-widest text-white hover:text-blue-200 transition-colors"
                        >
                            {link.name}
                            <span className="absolute -bottom-2 left-0 w-0 h-[3px] bg-blue-300 transition-all duration-300 group-hover:w-full rounded-full" />
                        </Link>
                    ))}

                    <Link
                        href="/contact"
                        className="group flex items-center gap-2 px-8 py-3 bg-white text-[#1e3a8a] rounded-full font-black text-[13px] tracking-widest uppercase transition-all duration-300 hover:scale-105 shadow-lg active:scale-95"
                    >
                        Contact
                        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* MOBILE MENU TOGGLE - Cleaner Style */}
                <button
                    onClick={() => setOpen(!open)}
                    className="lg:hidden relative z-[150] p-2 text-white bg-white/10 hover:bg-white/20 rounded-full transition-all active:scale-90"
                >
                    {open ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>



            {/* MOBILE NAV OVERLAY - Centered Minimalist Version */}
            <AnimatePresence>
                {open && (
                    <>
                        {/* Soft Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpen(false)}
                            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[130] lg:hidden"
                        />

                        {/* Side Drawer */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 h-full w-[80%] max-w-[320px] bg-[#1e3a8a] z-[140] lg:hidden flex flex-col shadow-2xl"
                        >
                            <div className="flex flex-col h-full pt-32 px-6 pb-12">

                                {/* Nav Links - Centered and Spaced */}
                                <div className="flex flex-col items-center space-y-8">
                                    {navLinks.map((link, i) => (
                                        <motion.div
                                            key={link.name}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <Link
                                                href={link.href}
                                                className="text-2xl font-extrabold text-white uppercase tracking-[0.15em] hover:text-blue-300 transition-all active:scale-95"
                                                onClick={() => setOpen(false)}
                                            >
                                                {link.name}
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Bottom Section */}
                                <div className="mt-auto">
                                    <Link
                                        href="/contact"
                                        className="flex items-center justify-center gap-2 w-full py-4 bg-white text-[#1e3a8a] rounded-full font-black uppercase tracking-widest text-xs shadow-xl transition-transform active:scale-95"
                                        onClick={() => setOpen(false)}
                                    >
                                        Contact Us <ArrowRight size={16} />
                                    </Link>

                                    {/* Simple Social Row */}
                                    <div className="flex justify-center gap-8 mt-10 text-white/40">
                                        <Instagram size={20} />
                                        <Linkedin size={20} />
                                        <Mail size={20} />
                                    </div>

                                    <p className="text-center text-[8px] text-white/20 mt-6 tracking-[0.3em] uppercase font-bold">
                                        Computing Students Society
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
}