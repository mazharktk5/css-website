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
        const handleScroll = () => setScrolled(window.scrollY > 50);
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
            className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ease-in-out backdrop-blur-md ${scrolled || open
                ? "bg-gradient-to-r from-[#1e3a8a]/95 via-[#3e76b2]/80 to-[#1e40af]/95 shadow-xl py-2"
                : "bg-[#1e3a8a]/70 py-4"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-16">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3">
                    <div className="relative w-10 h-10 md:w-12 md:h-12">
                        <Image
                            src={logo}
                            alt="CSS Logo"
                            fill
                            className="rounded-full object-cover border-2 border-white/40 transition-transform duration-300 hover:scale-110"
                        />
                    </div>
                    <span className="font-black text-xl md:text-2xl text-white tracking-tight">
                        CSS <span className="text-[#93c5fd]">SOCIETY</span>
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-white font-semibold uppercase tracking-widest hover:text-[#93c5fd] transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        href="/contact"
                        className="ml-4 px-6 py-2 rounded-full bg-[#93c5fd] text-blue-900 font-bold uppercase tracking-wider hover:bg-blue-400 transition-all shadow-md"
                    >
                        Contact Us
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <div className="md:hidden">
                    <button onClick={() => setOpen(!open)} className="text-white p-2">
                        {open ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden bg-gradient-to-b from-[#1e3a8a]/95 to-[#3e76b2]/90 overflow-hidden transition-all duration-500 ${open ? "max-h-[500px] opacity-100 py-4" : "max-h-0 opacity-0"
                    }`}
            >
                <div className="flex flex-col items-center space-y-6 px-6">
                    {navLinks.map((link, idx) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-white font-bold uppercase tracking-widest text-lg hover:text-[#93c5fd] transition-colors"
                            onClick={() => setOpen(false)}
                            style={{ transitionDelay: `${idx * 50}ms` }}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        href="/contact"
                        className="w-full text-center py-3 bg-[#93c5fd] text-blue-900 font-bold uppercase tracking-wider rounded-xl shadow-md hover:bg-blue-400 transition-all"
                        onClick={() => setOpen(false)}
                    >
                        Contact Us
                    </Link>
                </div>
            </div>
        </nav>
    );
}
