"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import logo from "../../public/images/logo/css-logo.jpg";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    // Smooth scroll handler
    const handleScroll = (e, id) => {
        e.preventDefault();
        const section = document.querySelector(id);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
            setOpen(false); // close mobile menu if open
        }
    };

    return (
        <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <a href="/" className="flex items-center space-x-2">
                        <Image
                            src={logo}
                            alt="CSS Logo"
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                        <span className="hidden sm:block text-blue-900 font-bold">
                            Computing Students Society
                        </span>
                    </a>

                    {/* Spacer to center links */}
                    <div className="flex-1 flex justify-center">
                        <div className="hidden md:flex items-center space-x-8">
                            <a
                                href="/"
                                className="text-blue-900 hover:text-blue-600 transition font-medium"
                            >
                                Home
                            </a>
                            <a
                                href="#about"
                                onClick={(e) => handleScroll(e, "#about")}
                                className="text-blue-900 hover:text-blue-600 transition font-medium cursor-pointer"
                            >
                                About
                            </a>
                            <a
                                href="#events"
                                onClick={(e) => handleScroll(e, "#events")}
                                className="text-blue-900 hover:text-blue-600 transition font-medium cursor-pointer"
                            >
                                Events
                            </a>
                            <a
                                href="#gallery"
                                onClick={(e) => handleScroll(e, "#gallery")}
                                className="text-blue-900 hover:text-blue-600 transition font-medium cursor-pointer"
                            >
                                Gallery
                            </a>
                            <a
                                href="#contact"
                                onClick={(e) => handleScroll(e, "#contact")}
                                className="text-blue-900 hover:text-blue-600 transition font-medium cursor-pointer"
                            >
                                Contact
                            </a>
                        </div>
                    </div>

                    {/* CTA (desktop) */}
                    <div className="hidden md:flex">
                        <a
                            href="/join"
                            className="ml-4 px-4 py-2 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                        >
                            Join Us
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setOpen(!open)}
                            className="text-blue-900 hover:text-blue-600"
                        >
                            {open ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {open && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    <div className="flex flex-col px-4 py-3 space-y-2">
                        <a
                            href="/"
                            className="text-blue-900 hover:text-blue-600 font-medium"
                            onClick={() => setOpen(false)}
                        >
                            Home
                        </a>
                        <a
                            href="#about"
                            onClick={(e) => handleScroll(e, "#about")}
                            className="text-blue-900 hover:text-blue-600 font-medium cursor-pointer"
                        >
                            About
                        </a>
                        <a
                            href="#events"
                            onClick={(e) => handleScroll(e, "#events")}
                            className="text-blue-900 hover:text-blue-600 font-medium cursor-pointer"
                        >
                            Events
                        </a>
                        <a
                            href="#gallery"
                            onClick={(e) => handleScroll(e, "#gallery")}
                            className="text-blue-900 hover:text-blue-600 font-medium cursor-pointer"
                        >
                            Gallery
                        </a>
                        <a
                            href="#contact"
                            onClick={(e) => handleScroll(e, "#contact")}
                            className="text-blue-900 hover:text-blue-600 font-medium cursor-pointer"
                        >
                            Contact
                        </a>
                        <a
                            href="/join"
                            className="mt-2 px-4 py-2 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-700 transition text-center"
                            onClick={() => setOpen(false)}
                        >
                            Join Us
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
}
