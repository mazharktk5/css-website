"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../public/images/logo/css-logo.jpg";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Events", href: "/events" },
        { name: "Gallery", href: "/gallery" },
        { name: "Alumni", href: "/alumni" },
        { name: "Watch", href: "/videos" },
    ];

    return (
        <nav className="fixed top-0 left-0 w-full z-[100] bg-[#1e3a8a] py-4 shadow-lg transition-all duration-500">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-4">
                    <div className="relative w-12 h-12">
                        <Image
                            src={logo}
                            alt="CSS Logo"
                            fill
                            className="rounded-full object-cover border-2 border-white/30"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-extrabold text-2xl text-white tracking-tight uppercase italic">
                            CSS <span className="text-[#93c5fd] not-italic">SOCIETY</span>
                        </span>
                        <span className="text-[8px] font-bold tracking-widest text-white/80 uppercase mt-1">
                            Dept of Computer Science
                        </span>
                    </div>
                </Link>

                {/* Desktop Links */}
                <div className="hidden lg:flex items-center space-x-12">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="relative text-sm font-bold uppercase tracking-widest text-white hover:text-[#93c5fd] transition"
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#93c5fd] transition-all group-hover:w-full" />
                        </Link>
                    ))}

                    <Link
                        href="/contact"
                        className="group inline-flex items-center gap-2 px-7 py-2.5 bg-white text-[#1e3a8a] rounded-full font-bold text-sm tracking-wide uppercase transition-all duration-300 hover:scale-105 shadow-md hover:shadow-white/30 active:scale-95"
                    >
                        <span>Contact</span>
                        <ArrowRight
                            size={16}
                            className="transform group-hover:translate-x-1 transition-transform duration-300"
                        />
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <div className="lg:hidden relative z-[110]">
                    <button
                        onClick={() => setOpen(!open)}
                        className={`p-3 rounded-2xl transition ${open
                            ? "bg-white text-[#1e3a8a] shadow-lg"
                            : "bg-white/10 text-white border border-white/20"
                            }`}
                    >
                        {open ? <X size={20} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {open && (
                    <>
                        <div
                            className="fixed inset-0 bg-black opacity-30 z-40 lg:hidden"
                            onClick={() => setOpen(false)}
                        ></div>
                        <motion.div
                            initial={{ opacity: 0, y: -30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            className="w-65 lg:hidden fixed right-0 top-0 h-screen bg-[#1e3a8a]/95 backdrop-blur-lg z-50 flex flex-col justify-center items-center space-y-8"
                        >
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-xl font-bold uppercase text-white hover:text-[#93c5fd]"
                                    onClick={() => setOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link
                                href="/contact"
                                className="group flex items-center justify-center gap-3 px-10 py-4 bg-white rounded-full font-bold text-[#1e3a8a] shadow-lg active:scale-95 transition-all w-full max-w-[200px]"
                                onClick={() => setOpen(false)}
                            >
                                <span className="uppercase tracking-widest text-sm ">
                                    Contact
                                </span>
                                <ArrowRight
                                    size={20}
                                    className="group-hover:translate-x-1 transition-transform"
                                />
                            </Link>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
}
