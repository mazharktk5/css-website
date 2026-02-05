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
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Events", href: "/events" },
        { name: "Gallery", href: "/gallery" },
        // { name: "Contact", href: "/contact" },
    ];

    return (
        <nav 
            className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ease-in-out backdrop-blur-md ${
                scrolled || open 
                ? "bg-white md:bg-[#3e76b2]/95 border-b border-gray-100 md:border-white/10 py-1 shadow-xl" 
                : "bg-white/80 py-1 border-b border-gray-100" 
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="flex items-center justify-between h-16">
                    
                    {/* Logo Area */}
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="relative w-[40px] h-[40px] md:w-[45px] md:h-[45px]">
                            <Image
                                src={logo}
                                alt="CSS Logo"
                                fill
                                className="rounded-full transition-transform duration-300 group-hover:scale-110 border-2 border-[#3e76b2]/20 object-cover"
                            />
                        </div>
                        <span className={`font-black tracking-tighter text-xl md:text-2xl transition-colors duration-300 ${
                            scrolled && !open ? "md:text-white text-[#3e76b2]" : "text-[#3e76b2]"
                        }`}>
                            CSS <span className={(scrolled && !open) ? "md:text-blue-200 text-gray-900" : "text-gray-900"}>SOCIETY</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`px-4 py-2 transition-all font-bold text-xs uppercase tracking-widest ${
                                    scrolled 
                                    ? "text-white hover:text-blue-200" 
                                    : "text-gray-600 hover:text-[#3e76b2]"
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        
                        <Link
                            href="/contact"
                            className={`ml-6 px-8 py-3 rounded-full font-black text-xs uppercase tracking-tighter transition-all shadow-lg active:scale-95 ${
                                scrolled 
                                ? "bg-white text-[#3e76b2] hover:bg-blue-50" 
                                : "bg-[#3e76b2] text-white hover:brightness-110 shadow-[#3e76b2]/20"
                            }`}
                        >
                            Join Us
                        </Link>
                    </div>

                    {/* Mobile Toggle */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setOpen(!open)}
                            className="p-2 text-[#3e76b2]"
                        >
                            {open ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay - Sliding White Panel */}
            <div 
                className={`absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-200 overflow-hidden transition-all duration-500 ease-in-out md:hidden ${
                    open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <div className="flex flex-col p-8 space-y-6 shadow-inner">
                    {navLinks.map((link, idx) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`text-2xl font-black text-[#3e76b2] uppercase tracking-tighter transition-all transform ${
                                open ? "translate-x-0" : "-translate-x-4"
                            }`}
                            style={{ transitionDelay: `${idx * 50}ms` }}
                            onClick={() => setOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        href="/contact"
                        className="w-full py-4 bg-[#3e76b2] text-white text-center rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-[#3e76b2]/20"
                        onClick={() => setOpen(false)}
                    >
                        Join Us
                    </Link>
                </div>
            </div>
        </nav>
    ); 
}