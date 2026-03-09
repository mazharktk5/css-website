"use client";

import { motion } from "framer-motion";

const leaders = [
    {
        name: "Dr Shah Khusro",
        role: "Patron-in-Chief",
        img: "/images/team/chairman.jpg",
        message:
            "Our mission is to nurture computing talent and provide a platform where students can explore innovation, leadership, and collaboration in the digital age."
    },
    {
        name: "Dr Waheed ur Rehman",
        role: "Chief Organizer",
        img: "/images/team/coordinator.jpg",
        message:
            "The society bridges academic learning with practical experience through workshops, hackathons, and collaborative technology initiatives."
    },
    {
        name: "Ilyas",
        role: "President",
        img: "/images/team/president.jpg",
        message:
            "We believe in empowering students to become creators of technology rather than just consumers of it."
    },
    {
        name: "Abdullah",
        role: "Vice President",
        img: "/images/team/vp.jpg",
        message:
            "My goal is to support students in exploring new technologies and creating opportunities where they can grow their technical and leadership skills."
    },
    {
        name: "Fatima",
        role: "Female Vice President",
        img: "/images/team/fatima.png",
        message:
            "I aim to encourage greater participation in technology and help create an inclusive environment where every student feels confident to learn and contribute."
    }
];

// const team = [
//     { name: "Abdullah", role: "Vice President", img: "/images/team/vp.jpg" },
//     { name: "Fatima", role: "Female Vice President", img: "/images/team/fatima.png" }
// ];

export default function AboutSection() {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <p className="text-xs tracking-[0.35em] uppercase text-[#1e3a8a] font-bold">
                        About CSS Society
                    </p>

                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-4">
                        Computing Students Society
                    </h2>

                    <p className="mt-6 text-lg text-slate-600 leading-relaxed">
                        The CSS Society is a student-led community focused on technology,
                        innovation, and collaboration. We organize workshops, hackathons,
                        seminars, and industry sessions that help students develop real
                        technical skills while building leadership and teamwork.
                    </p>
                </div>

                {/* Main Leaders */}
                <div className="space-y-14">

                    {leaders.map((leader, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="grid md:grid-cols-2 gap-10 items-center"
                        >

                            <div className={`${i % 2 === 1 ? "md:order-2" : ""}`}>
                                <div className="rounded-2xl overflow-hidden shadow-md">
                                    <img
                                        src={leader.img}
                                        alt={leader.name}
                                        className="w-full h-[380px] object-cover"
                                    />
                                </div>
                            </div>

                            <div>
                                <p className="text-sm uppercase tracking-widest text-[#1e3a8a] font-bold mb-2">
                                    {leader.role}
                                </p>

                                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                                    {leader.name}
                                </h3>

                                <p className="text-lg text-slate-600 leading-relaxed">
                                    {leader.message}
                                </p>
                            </div>

                        </motion.div>
                    ))}

                </div>

                {/* Remaining Leadership */}
                {/* <div className="mt-16 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

                    {team.map((member, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -6 }}
                            className="bg-white rounded-2xl shadow-md overflow-hidden border"
                        >

                            <img
                                src={member.img}
                                alt={member.name}
                                className="w-full h-64 object-cover"
                            />

                            <div className="p-5 text-center">

                                <h4 className="font-semibold text-lg text-slate-900">
                                    {member.name}
                                </h4>

                                <p className="text-sm text-[#1e3a8a] font-medium">
                                    {member.role}
                                </p>

                            </div>

                        </motion.div>
                    ))}

                </div> */}

            </div>
        </section>
    );
}