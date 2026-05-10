// components/About/CTA.jsx
"use client";

import FadeIn from "@/components/FadeIn";
import Link from "next/link";

export default function CTA() {
    return (
        <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
            <div className="max-w-5xl mx-auto px-6 lg:px-12 text-center">
                <FadeIn>
                    <h2 className="text-3xl md:text-4xl font-bold">
                        Ready to be part of the journey?
                    </h2>
                    <p className="mt-4 text-lg text-gray-200">
                        Join the Computing Students Society and grow with a community of
                        passionate learners and innovators.
                    </p>
                    <div className="mt-8">
                        <Link
                            href="/join"
                            className="px-6 py-3 bg-white text-blue-900 font-semibold rounded-lg shadow hover:bg-gray-200 transition"
                        >
                            Join Us Today
                        </Link>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
