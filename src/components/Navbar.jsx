"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
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
    ];

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-[100] transition-all duration-700 ease-in-out border-b ${scrolled || open
                ? "bg-[#1e3a8a] border-white/10 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                : "bg-[#1e3a8a]/90 backdrop-blur-md border-white/5 py-6"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-16">
                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-4 group">
                    <div className="relative w-12 h-12">
                        <Image
                            src={logo}
                            alt="CSS Logo"
                            fill
                            className="rounded-full object-cover border-2 border-white/20 transition-all duration-500 group-hover:border-[#93c5fd]/50 group-hover:scale-110 shadow-2xl"
                        />
                        <div className="absolute inset-0 rounded-full bg-slate-950/40 group-hover:bg-transparent transition-colors" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-2xl text-white tracking-tighter leading-none uppercase italic">
                            CSS <span className="text-[#93c5fd] not-italic">SOCIETY</span>
                        </span>
                        <span className="text-[7px] font-black tracking-[0.4em] text-white/60 uppercase mt-1">Dep Of Computer Science</span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center space-x-10">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="relative text-[10px] font-black uppercase tracking-[0.3em] text-white/80 hover:text-white transition-all duration-300 group"
                        >
                            {link.name}
                            <span className="absolute -bottom-2 left-0 w-0 h-px bg-[#93c5fd] transition-all duration-500 group-hover:w-full" />
                        </Link>
                    ))}

                    <Link
                        href="/contact"
                        className="group relative px-8 py-3 overflow-hidden rounded-xl bg-white transition-all duration-500 hover:scale-105 active:scale-95 shadow-2xl shadow-white/10"
                    >
                        <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.2em] text-[#1e3a8a] group-hover:text-white transition-colors duration-500">
                            Initialize Contact
                        </span>
                        <div className="absolute inset-0 bg-slate-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    </Link>
                </div>

                {/* Mobile Trigger */}
                <div className="lg:hidden">
                    <button
                        onClick={() => setOpen(!open)}
                        className={`p-3 rounded-2xl transition-all duration-500 ${open ? "bg-white text-[#1e3a8a]" : "bg-white/5 text-white border border-white/10"}`}
                    >
                        {open ? <X size={24} strokeWidth={3} /> : <Menu size={24} strokeWidth={3} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Interface */}
            <div
                className={`lg:hidden fixed inset-0 top-[81px] bg-slate-950/95 backdrop-blur-3xl transition-all duration-700 ease-in-out ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
            >
                <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12 px-8">
                    {navLinks.map((link, idx) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`text-3xl font-black uppercase tracking-tighter italic transition-all duration-700 ${open ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"} hover:text-[#93c5fd] text-white`}
                            onClick={() => setOpen(false)}
                            style={{ transitionDelay: `${idx * 100}ms` }}
                        >
                            {link.name}
                        </Link>
                    ))}

                    <Link
                        href="/contact"
                        className={`w-full text-center py-6 bg-white text-[#1e3a8a] font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl shadow-2xl transition-all duration-700 ${open ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}
                        onClick={() => setOpen(false)}
                        style={{ transitionDelay: "400ms" }}
                    >
                        Establish Connection
                    </Link>
                </div>

                {/* Decorative Bottom Pattern */}
                <div className="absolute bottom-10 left-0 w-full flex justify-center opacity-10">
                    <span className="text-[12vw] font-black uppercase italic tracking-tighter text-white">CSS SOCIETY</span>
                </div>
            </div>
        </nav>
    );
}
