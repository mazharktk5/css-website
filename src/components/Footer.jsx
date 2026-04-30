// components/Footer.jsx
import Link from "next/link";
import Image from "next/image";
import { Linkedin, Facebook, Instagram, Mail, MapPin } from "lucide-react";
import logo from "../../public/images/logo/cssfinallogo.jpeg";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const sections = [
        {
            title: "Navigation",
            links: [
                { name: "Home", href: "/" },
                { name: "About Us", href: "/about" },
                { name: "Events", href: "/events" },
                { name: "Gallery", href: "/gallery" },
            ],
        },
        {
            title: "Community",
            links: [
                { name: "Alumni", href: "/alumni" },
                { name: "Watch", href: "/videos" },
                { name: "Contact", href: "/contact" },
                { name: "Blog", href: "/blog" },
                { name: "Certificates", href: "/certificates" },
            ],
        },
    ];

    const socialLinks = [
        { icon: Linkedin, name: 'Linkedin', href: "https://www.linkedin.com/company/computing-students-society/" },
        { icon: Facebook, name: 'Facebook', href: "https://www.facebook.com/share/1GSrotfswb/" },
        { icon: Instagram, name: 'Instagram', href: "https://www.instagram.com/css.dcs.uop?igsh=Yjh6a2EyZWRjbHRp" },
    ];

    return (
        <footer className="bg-[#1e3a8a] text-white pt-20 pb-10 relative overflow-hidden">
            {/* Subtle Top Border Accent */}
            <div className="absolute top-0 left-0 w-full h-px bg-white/10" />

            <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16">

                    {/* Brand Column */}
                    <div className="lg:col-span-4 space-y-6">
                        <Link href="/" className="flex items-center gap-4 group">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-white transition-all duration-500">
                                <Image
                                    src={logo}
                                    alt="CSS Logo"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-black uppercase tracking-tighter">
                                    CSS <span className="text-blue-300">SOCIETY</span>
                                </span>
                                <span className="text-[9px] font-bold tracking-[0.2em] uppercase opacity-60">
                                    University of Peshawar
                                </span>
                            </div>
                        </Link>
                        <p className="text-white/70 text-sm leading-relaxed max-w-sm font-medium">
                            Empowering the next generation of computer scientists through innovation,
                            collaboration, and technical excellence.
                        </p>
                        <div className="flex gap-3">
                            {socialLinks.map((social, i) => (
                                <a
                                    key={i}
                                    href={social.href}
                                    aria-label={social.name}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white hover:text-[#1e3a8a] hover:-translate-y-1 transition-all duration-300"
                                >
                                    <social.icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    {sections.map((section) => (
                        <div key={section.title} className="lg:col-span-2 space-y-6 pt-2">
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
                                {section.title}
                            </h3>
                            <ul className="space-y-4">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-white/60 hover:text-white transition-colors duration-200 flex items-center group"
                                        >
                                            <span className="w-0 group-hover:w-2 h-px bg-white mr-0 group-hover:mr-2 transition-all duration-300" />
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Contact Column */}
                    <div className="lg:col-span-4 space-y-6 pt-2">
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
                            Reach Out
                        </h3>
                        <div className="space-y-4 text-sm text-white/70">
                            <div className="flex items-start gap-3">
                                <MapPin size={18} className="text-blue-300 shrink-0 mt-0.5" />
                                <span>Department of Computer Science, University of Peshawar, Pakistan</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail size={18} className="text-blue-300 shrink-0" />
                                <span className="font-medium text-white">computing.society@uop.edu.pk</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-widest opacity-70">
                    <p>© {currentYear} CSS Society. All rights reserved.</p>
                    <div className="flex items-center gap-2">
                        <span>Built with love by</span>
                        <span className="text-white opacity-100">
                            CSS Dev Team
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}