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
        { name: "About", href: "/#about" },
        { name: "Events", href: "/#events" },
        { name: "Gallery", href: "/#gallery" },
        { name: "Contact", href: "/contact" },
    ];

    return (
      <nav 
    className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ease-in-out backdrop-blur-md ${
        scrolled 
        ? "bg-[#0B0E14]/80 border-b border-white/10 py-1 shadow-2xl" 
        : "bg-black/20 py-1 border-b border-white/5" 
    }`}
>
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="flex items-center justify-between h-16">
                    
                    {/* Logo Area */}
                    <Link href="/" className="flex items-center space-x-3 group">
                        <Image
                            src={logo}
                            alt="CSS Logo"
                            width={45}
                            height={45}
                            className="rounded-full transition-transform duration-300 group-hover:scale-105 border border-white/20"
                        />
                        <span className="text-[#F8FAFC] font-bold tracking-tight text-xl drop-shadow-lg">
                            CSS <span className="text-[#3c6da1]">Society</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="px-4 py-2 text-[#F8FAFC] hover:text-[#83b4e9] transition-all font-medium text-sm"
                            >
                                {link.name}
                            </Link>
                        ))}
                        
                        <Link
                            href="/contact"
                            className="ml-6 px-6 py-2.5 bg-[#3c6da1] text-white rounded-full font-bold text-sm hover:brightness-110 transition-all shadow-lg active:scale-95"
                        >
                            Join Us
                        </Link>
                    </div>

                    {/* Mobile Toggle */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setOpen(!open)}
                            className="p-2 text-[#F8FAFC]"
                        >
                            {open ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div 
                className={`fixed inset-0 bg-[#0B0E14] z-[-1] transition-transform duration-500 ease-in-out md:hidden ${
                    open ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex flex-col items-center justify-center h-full space-y-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-2xl font-bold text-[#F8FAFC]"
                            onClick={() => setOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}