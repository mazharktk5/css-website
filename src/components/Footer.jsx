// components/Footer.jsx
import Link from "next/link";
import Image from "next/image";
import { Mail, Linkedin, Facebook, Instagram } from "lucide-react";
import logo from "../../public/images/logo/css-logo.jpg";

export default function Footer() {
    return (
        <footer className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 text-gray-300">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 grid gap-10 sm:grid-cols-2 md:grid-cols-4">

                {/* Left - Logo / Intro */}
                <div className="space-y-4">
                    <Link href="/" className="flex items-center gap-3">
                        <Image
                            src={logo}
                            alt="CSS Logo"
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                        <span className="text-lg font-bold text-white">
                            Computing Students Society
                        </span>
                    </Link>
                    <p className="text-sm leading-relaxed text-gray-400 max-w-xs">
                        Empowering students through workshops, hackathons, and
                        collaborative events that build skills and community.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Quick Links</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
                        <li><Link href="/events" className="hover:text-white transition">Events</Link></li>
                        <li><Link href="/gallery" className="hover:text-white transition">Gallery</Link></li>
                        <li><Link href="/contact" className="hover:text-white transition">Join Us</Link></li>
                    </ul>
                </div>

                {/* Resources */}
                <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Resources</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/faq" className="hover:text-white transition">FAQs</Link></li>
                        <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
                        <li><Link href="/support" className="hover:text-white transition">Support</Link></li>
                        <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
                    </ul>
                </div>

                {/* Connect */}
                <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Connect</h4>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                            <Mail size={18} />
                            <a
                                href="mailto:css@university.edu"
                                className="hover:text-white transition"
                            >
                                computing.society@uop.edu.pk
                            </a>
                        </li>
                    </ul>

                    <div className="flex flex-col gap-2 mt-4 text-sm">
                        {/* LinkedIn */}
                        <a
                            href="https://www.linkedin.com/company/computing-students-society/posts/?feedView=all"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 hover:text-white transition transform hover:scale-105"
                        >
                            <Linkedin size={20} />
                            <span>LinkedIn</span>
                        </a>

                        {/* Facebook */}
                        <a
                            href="https://www.facebook.com/share/1GSrotfswb/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 hover:text-white transition transform hover:scale-105"
                        >
                            <Facebook size={20} />
                            <span>Facebook</span>
                        </a>

                        {/* Instagram */}
                        <a
                            href="https://www.instagram.com/css.dcs.uop?igsh=Yjh6a2EyZWRjbHRp"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 hover:text-white transition transform hover:scale-105"
                        >
                            <Instagram size={20} />
                            <span>Instagram</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-blue-800 mt-6 py-4 text-center text-xs text-gray-400">
                © {new Date().getFullYear()} Computing Students Society. Built with ❤️ by CSS Dev Team.
            </div>
        </footer>
    );
}
