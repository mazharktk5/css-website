// components/About/CTA.jsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CTA() {
    return (
        <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
            <div className="max-w-5xl mx-auto px-6 lg:px-12 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl md:text-4xl font-bold"
                >
                    Ready to be part of the journey?
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="mt-4 text-lg text-gray-200"
                >
                    Join the Computing Students Society and grow with a community of
                    passionate learners and innovators.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="mt-8"
                >
                    <Link
                        href="/join"
                        className="px-6 py-3 bg-white text-blue-900 font-semibold rounded-lg shadow hover:bg-gray-200 transition"
                    >
                        Join Us Today
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
