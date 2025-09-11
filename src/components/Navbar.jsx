"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import logo from "../../public/images/logo/css-logo.jpg";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
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
                    </Link>

                    {/* Spacer to center links */}
                    <div className="flex-1 flex justify-center">
                        <div className="hidden md:flex items-center space-x-8">
                            <Link
                                href="/"
                                className="text-blue-900 hover:text-blue-600 transition font-medium"
                            >
                                Home
                            </Link>
                            <Link
                                href="/#about"
                                className="text-blue-900 hover:text-blue-600 transition font-medium"
                            >
                                About
                            </Link>
                            <Link
                                href="/#events"
                                className="text-blue-900 hover:text-blue-600 transition font-medium"
                            >
                                Events
                            </Link>
                            <Link
                                href="/#gallery"
                                className="text-blue-900 hover:text-blue-600 transition font-medium"
                            >
                                Gallery
                            </Link>
                            <Link
                                href="/contact"
                                className="text-blue-900 hover:text-blue-600 transition font-medium"
                            >
                                Contact
                            </Link>
                        </div>
                    </div>

                    {/* CTA (desktop) */}
                    <div className="hidden md:flex">
                        <Link
                            href="/join"
                            className="ml-4 px-4 py-2 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                        >
                            Join Us
                        </Link>
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
                        <Link
                            href="/"
                            className="text-blue-900 hover:text-blue-600 font-medium"
                            onClick={() => setOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            href="/#about"
                            className="text-blue-900 hover:text-blue-600 font-medium"
                            onClick={() => setOpen(false)}
                        >
                            About
                        </Link>
                        <Link
                            href="/#events"
                            className="text-blue-900 hover:text-blue-600 font-medium"
                            onClick={() => setOpen(false)}
                        >
                            Events
                        </Link>
                        <Link
                            href="/#gallery"
                            className="text-blue-900 hover:text-blue-600 font-medium"
                            onClick={() => setOpen(false)}
                        >
                            Gallery
                        </Link>
                        <Link
                            href="/contact"
                            className="text-blue-900 hover:text-blue-600 font-medium"
                            onClick={() => setOpen(false)}
                        >
                            Contact
                        </Link>
                        <Link
                            href="/join"
                            className="mt-2 px-4 py-2 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-700 transition text-center"
                            onClick={() => setOpen(false)}
                        >
                            Join Us
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
