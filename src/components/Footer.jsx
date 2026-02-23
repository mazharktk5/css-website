// components/Footer.jsx
import Link from "next/link";
import Image from "next/image";
import { Mail, Linkedin, Facebook, Instagram } from "lucide-react";
import logo from "../../public/images/logo/css-logo.jpg";

export default function Footer() {
    return (
        <footer className="bg-slate-950 text-gray-300">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 grid gap-10 sm:grid-cols-2 md:grid-cols-4">

                {/* Left - Logo / Intro */}
                <div className="space-y-6">
                    <Link href="/" className="flex items-center gap-3">
                        <Image
                            src={logo}
                            alt="CSS Logo"
                            width={50}
                            height={50}
                            className="rounded-full border-2 border-white/10"
                        />
                        <span className="text-xl font-black text-white tracking-tighter uppercase italic">
                            CSS SOCIETY
                        </span>
                    </Link>
                    <p className="text-xs leading-relaxed text-gray-500 max-w-xs font-medium uppercase tracking-wider">
                        The elite engineering community defining the future of digital architecture.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white mb-6">Quick Links</h4>
                    <ul className="space-y-4 text-[10px] font-black uppercase tracking-widest">
                        <li><Link href="/about" className="text-gray-500 hover:text-[#93c5fd] transition-colors">About Us</Link></li>
                        <li><Link href="/events" className="text-gray-500 hover:text-[#93c5fd] transition-colors">Event Archive</Link></li>
                        <li><Link href="/gallery" className="text-gray-500 hover:text-[#93c5fd] transition-colors">Visual Gallery</Link></li>
                        <li><Link href="/contact" className="text-gray-500 hover:text-[#93c5fd] transition-colors">Member Access</Link></li>
                    </ul>
                </div>

                {/* Resources */}
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white mb-6">Resources</h4>
                    <ul className="space-y-4 text-[10px] font-black uppercase tracking-widest">
                        <li><Link href="/faq" className="text-gray-500 hover:text-[#93c5fd] transition-colors">Knowledge Base</Link></li>
                        <li><Link href="/blog" className="text-gray-500 hover:text-[#93c5fd] transition-colors">Tech Journal</Link></li>
                        <li><Link href="/contact" className="text-gray-500 hover:text-[#93c5fd] transition-colors">Direct Contact</Link></li>
                    </ul>
                </div>

                {/* Connect */}
                <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white mb-6">Connect</h4>
                    <a
                        href="mailto:computing.society@uop.edu.pk"
                        className="flex items-center gap-3 text-gray-500 hover:text-[#93c5fd] transition-all group"
                    >
                        <Mail size={16} className="text-[#1e3a8a]" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Email Intelligence</span>
                    </a>

                    <div className="flex gap-4 pt-4">
                        {[
                            { icon: Linkedin, href: "https://www.linkedin.com/company/computing-students-society/" },
                            { icon: Facebook, href: "https://www.facebook.com/share/1GSrotfswb/" },
                            { icon: Instagram, href: "https://www.instagram.com/css.dcs.uop?igsh=Yjh6a2EyZWRjbHRp" }
                        ].map((social, i) => (
                            <a
                                key={i}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-500 hover:bg-[#1e3a8a] hover:text-white hover:border-[#93c5fd]/30 transition-all active:scale-95"
                            >
                                <social.icon size={18} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/5 mt-10 py-8 text-center">
                <p className="text-[9px] font-black uppercase tracking-[0.5em] text-gray-600">
                    © {new Date().getFullYear()} Computing Students Society. All Systems Operational.
                </p>
            </div>
        </footer>
    );
}
