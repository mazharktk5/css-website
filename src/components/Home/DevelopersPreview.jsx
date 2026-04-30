import React from "react";
import developers from "../../data/developers";
import { DeveloperCard } from "./DevelopersClient";

export default function DevelopersPreview() {
    return (
        <section id="developers" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">

                {/* Header */}
                <div className="max-w-2xl mb-16">
                    <div className="flex items-center gap-4 mb-4 text-blue-700">
                        <span className="w-8 h-px bg-blue-700" />
                        <span className="text-xs text-[#1e3a8a] font-semibold uppercase tracking-[0.3em]">
                            Development Team
                        </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
                        Meet The
                        <span className="text-[#1e3a8a]"> Developers</span>
                    </h2>

                    <p className="mt-4 text-slate-500 text-sm leading-relaxed max-w-lg">
                        The team responsible for designing, building, and maintaining the
                        digital platforms that power our society.
                    </p>
                </div>

                {/* Developers Grid */}
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    {developers.map((dev, index) => (
                        <DeveloperCard key={index} dev={dev} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}