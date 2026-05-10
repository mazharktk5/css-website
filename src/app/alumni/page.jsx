import Image from "next/image";
import HeroVisual from "./HeroVisual";
import FadeIn from "@/components/FadeIn";

const foundersData = [
    {
        name: "Dr. Waheed ur Rehman",
        role: "Cheif organizer & Co-Founder",
        image: "/images/team/coordinator.jpeg",
    },
    {
        name: "Abubakar Sadiq",
        role: "Founder & Ex-President",
        image: "/images/founders/ex-president.jpeg",
    },
    {
        name: "Muhammad Jawad",
        role: "Co-Founder & Ex-Vice President",
        image: "/images/founders/jawad.jpg",
    }
];

const alumniData = [
    {
        chapter: "2024-25",
        members: [
            // {
            //     name: "Muhammad Jawad",
            //     role: "Ex-Vice President",
            //     image: "/images/team/jawad.jpg",
            //     chapter: "2024-25"
            // },

            {
                name: "Abdullah Ahmad",
                role: "Ex-Information Secretary",
                image: "/images/team/vp.jpg",
                chapter: "2024-25"
            },

            {
                name: "Hashir Ahmad",
                role: "Ex-Chief Secretary",
                image: "/images/team/cyber-lead.jpg",
                chapter: "2024-25"
            },

            {
                name: "Fatima",
                role: "Ex-Management Head",
                image: "/images/team/management-lead.jpg",
                chapter: "2024-25"
            },

            {
                name: "Hanzallah Khan",
                role: "Ex-Management Co-ordinator",
                image: "/images/developers/hanzala.jpg",
                chapter: "2024-25"
            },


            {
                name: "Safia Zulfiqar",
                role: "Ex-Management Member",
                image: "/images/developers/safia.jpg",
                chapter: "2024-25"
            },
            {
                name: "Muhammad Ilyas",
                role: "Ex-AI & DS Lead",
                image: "/images/team/president.jpg",
                chapter: "2024-25"
            },

            {
                name: "Aamna Malik",
                role: "Ex-AI & DS Member",
                image: "/images/team/amna_malik.PNG",
                chapter: "2024-25"
            },
            {
                name: "Mustafa Zahid Shahsawar",
                role: "Ex-AI & DS Member",
                image: "/images/team/mustafa.jpeg",
                chapter: "2024-25"
            },
            {
                name: "Hazrat Umer",
                role: "Ex-AI & DS Member",
                image: "/images/team/Hazrat_umer.jpeg",
                chapter: "2024-25"
            },
            {
                name: "Mamoon Khan",
                role: "Ex-Software Lead",
                image: "/images/developers/mamoon.jpg",
                chapter: "2024-25"
            },
            {
                name: "Mazhar Ahmad",
                role: "Ex-Software Co Lead",
                image: "/images/team/software-lead.jpg",
                chapter: "2024-25"
            },

            {
                name: "Muhammad Hasnain",
                role: "Ex-Software Member",
                image: "/images/team/Hasnain.jpeg",
                chapter: "2024-25"
            },



        ]
    }
];

export default function AlumniPage() {
    return (
        <main className="min-h-screen bg-slate-50">

            <section className="relative py-28 bg-slate-50 overflow-hidden">
                {/* background pattern */}
                <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle,_#000_1px,_transparent_1px)] bg-[size:40px_40px]" />

                {/* subtle glow */}
                <div className="absolute top-[-100px] left-[10%] w-[400px] h-[400px] bg-[#1e3a8a]/10 blur-[100px] rounded-full" />
                <div className="absolute bottom-[-100px] right-[10%] w-[400px] h-[400px] bg-blue-300/10 blur-[100px] rounded-full" />

                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

                    {/* LEFT CONTENT — CSS-only entrance animation */}
                    <div className="animate-[fadeInUp_0.8s_ease_both]">
                        <span className="text-sm text-[#1e3a8a] font-semibold tracking-wider uppercase">
                            Computing Students Society
                        </span>

                        <h1 className="mt-4 text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight">
                            Our Alumni
                            <span className="block text-[#1e3a8a]">Network</span>
                        </h1>

                        <p className="mt-6 text-lg text-slate-600 max-w-xl leading-relaxed">
                            The people who built the foundation of CSS. Leaders, developers, and thinkers who shaped what we are today.
                        </p>

                        {/* Stats */}
                        <div className="flex gap-10 mt-10">
                            <div>
                                <h3 className="text-3xl font-bold text-slate-900">50+</h3>
                                <p className="text-sm text-slate-500">Members</p>
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-slate-900">5+</h3>
                                <p className="text-sm text-slate-500">Domains</p>
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-slate-900">2024</h3>
                                <p className="text-sm text-slate-500">Founded</p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT VISUAL — Client component (LazyMotion + CSS animations) */}
                    <HeroVisual />
                </div>
            </section>

            {/* Founders Showcase Section */}
            <section className="py-24 bg-white relative border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <span className="text-sm text-[#1e3a8a] font-bold tracking-[0.2em] uppercase">The Visionaries</span>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mt-4 tracking-tight">Our Founders</h2>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mt-6 rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
                        {foundersData.map((founder, idx) => (
                            <FadeIn key={idx} delay={idx * 100}>
                                <div className="group relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border-4 border-white ring-1 ring-slate-900/5 bg-slate-100">
                                    <Image
                                        src={founder.image}
                                        alt={founder.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 350px"
                                        className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                    />

                                    {/* Base Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a8a]/90 via-[#1e3a8a]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:opacity-0 transition-opacity duration-500 z-10" />

                                    {/* Content */}
                                    <div className="absolute inset-x-0 bottom-0 p-8 text-center transform transition-transform duration-500 group-hover:-translate-y-2 z-20">
                                        <h3 className="text-2xl font-bold text-white mb-2 leading-tight">{founder.name}</h3>
                                        <div className="w-12 h-0.5 bg-white/30 mx-auto mb-3 transition-colors group-hover:bg-[#93c5fd]" />
                                        <p className="text-blue-200 group-hover:text-white text-xs font-bold tracking-[0.15em] uppercase transition-colors">{founder.role}</p>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* Alumni List */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    {alumniData.map((section) => (
                        <div key={section.chapter} className="mb-32 last:mb-0">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                                        Chapter <span className="text-[#1e3a8a]">{section.chapter}</span>
                                    </h2>
                                    <div className="w-20 h-1.5 bg-[#1e3a8a] rounded-full" />
                                </div>
                                <p className="text-slate-500 font-medium tracking-wide italic">
                                    The Foundation Years
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                                {section.members.map((member, idx) => (
                                    <FadeIn key={idx}>
                                        <div className="group relative w-full aspect-[4/5] overflow-hidden rounded-[2rem] bg-slate-100 shadow-xl hover:shadow-2xl transition-all duration-500 border-4 border-white ring-1 ring-slate-900/5">
                                            <Image
                                                src={member.image || "/images/team/placeholder.jpg"}
                                                alt={member.name}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 300px"
                                                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                            />

                                            {/* Premium Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a8a]/90 via-[#1e3a8a]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:opacity-0 transition-opacity duration-500 z-10" />

                                            {/* Content */}
                                            <div className="absolute inset-x-0 bottom-0 h-28 p-6 flex flex-col items-center justify-end text-center transform transition-transform duration-500 group-hover:-translate-y-2 z-20">
                                                <h3 className="text-lg font-bold text-white leading-tight line-clamp-2">
                                                    {member.name}
                                                </h3>
                                                <div className="w-10 h-0.5 bg-white/30 mx-auto my-2 transition-colors group-hover:bg-[#93c5fd]" />
                                                <p className="text-blue-200 group-hover:text-white text-[10px] font-bold tracking-[0.15em] uppercase transition-colors line-clamp-1">
                                                    {member.role}
                                                </p>
                                            </div>
                                        </div>
                                    </FadeIn>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="mt-20 p-12 rounded-3xl bg-white border border-slate-100 shadow-xl text-center">
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">More Coming Soon</h3>
                        <p className="text-slate-600 max-w-lg mx-auto">
                            We are currently updating our records. If you were a member of a previous CSS chapter and don't see yourself here yet, please reach out to us!
                        </p>
                    </div>
                </div>
            </section>

        </main>
    );
}
