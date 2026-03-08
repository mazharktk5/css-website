// components/Footer.jsx
import Link from "next/link";
import Image from "next/image";
import { Mail, Linkedin, Facebook, Instagram } from "lucide-react";
import { motion } from "framer-motion";
import logo from "../../public/images/logo/css-logo.jpg";

export default function Footer() {
    const socialLinks = [
        { icon: Linkedin, href: "https://www.linkedin.com/company/computing-students-society/" },
        { icon: Facebook, href: "https://www.facebook.com/share/1GSrotfswb/" },
        { icon: Instagram, href: "https://www.instagram.com/css.dcs.uop?igsh=Yjh6a2EyZWRjbHRp" },
    ];

    return (
        <footer className="bg-[#1e3a8a] text-white relative overflow-hidden">
            {/* Top Section */}
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 grid md:grid-cols-3 gap-10">
                {/* Logo + Description */}
                <div className="space-y-4">
                    <Link href="/" className="flex items-center gap-4">
                        <Image
                            src={logo}
                            alt="CSS Logo"
                            width={50}
                            height={50}
                            className="rounded-full border-2 border-white/20"
                        />
                        <span className="text-xl font-extrabold uppercase italic tracking-tight">
                            CSS <span className="text-[#93c5fd] not-italic">SOCIETY</span>
                        </span>
                    </Link>
                    <p className="text-sm font-medium text-white/70 max-w-xs">
                        Empowering coders, innovators, and tech enthusiasts — shaping the future of computing.
                    </p>

                    <a
                        href="mailto:computing.society@uop.edu.pk"
                        className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#93c5fd] hover:text-white transition"
                    >
                        <Mail size={18} /> Reach Out
                    </a>

                    {/* Social Icons */}
                    <div className="flex gap-4 mt-2">
                        {socialLinks.map((social, i) => (
                            <motion.a
                                key={i}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.2 }}
                                className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-gradient-to-br from-[#3b82f6] to-[#facc15] hover:text-[#1e3a8a] transition-all"
                            >
                                <social.icon size={18} />
                            </motion.a>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div className="space-y-4">
                    <h4 className="uppercase font-bold text-sm tracking-widest text-[#93c5fd]">Quick Links</h4>
                    <ul className="space-y-3 text-white/80">
                        <li>
                            <Link href="/about" className="hover:text-[#facc15] transition">
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link href="/events" className="hover:text-[#facc15] transition">
                                Event Archive
                            </Link>
                        </li>
                        <li>
                            <Link href="/gallery" className="hover:text-[#facc15] transition">
                                Visual Gallery
                            </Link>
                        </li>
                        <li>
                            <Link href="/videos" className="hover:text-[#facc15] transition">
                                Watch
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Resources / Extra */}
                <div className="space-y-4">
                    <h4 className="uppercase font-bold text-sm tracking-widest text-[#93c5fd]">Resources</h4>
                    <ul className="space-y-3 text-white/80">
                        <li>
                            <Link href="/faq" className="hover:text-[#facc15] transition">
                                Knowledge Base
                            </Link>
                        </li>
                        <li>
                            <Link href="/blog" className="hover:text-[#facc15] transition">
                                Tech Journal
                            </Link>
                        </li>
                        <li>
                            <Link href="/contact" className="hover:text-[#facc15] transition">
                                Member Access
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/20 mt-10 py-6 text-center text-sm text-white/50 uppercase tracking-widest">
                © {new Date().getFullYear()} CSS Society — Crafting Coders, Building Futures
            </div>
        </footer>
    );
}