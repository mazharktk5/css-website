"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Search, Download, Award, Loader2, ArrowRight } from "lucide-react";
import CertificateCanvas from "@/components/Certificates/CertificateCanvas";

function CertificateResultCard({ cert }) {
    const [previewDataUrl, setPreviewDataUrl] = useState(null);

    const handleDownload = () => {
        if (!previewDataUrl) return;
        const fileName = `Certificate_${cert.fullName.replace(/\s+/g, "_")}_${(cert.eventName || "Award").replace(/\s+/g, "_")}.png`;
        const link = document.createElement("a");
        link.download = fileName;
        link.href = previewDataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-500"
        >
            {/* Visual Preview Area */}
            <div className="relative aspect-[16/11] bg-slate-100 overflow-hidden border-b border-slate-100">
                <div className="absolute inset-0 flex items-center justify-center p-4">
                    <div className="relative w-full h-full shadow-lg rounded-sm overflow-hidden group-hover:scale-[1.02] transition-transform duration-500 text-slate-800">
                        <CertificateCanvas
                            {...cert}
                            isPreview={true}
                            onReady={(url) => setPreviewDataUrl(url)}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500" />
                    </div>
                </div>

                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-10">
                    <span className="text-[10px] font-bold text-[#1e3a8a] bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 shadow-sm uppercase tracking-widest">
                        Verified
                    </span>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-8">
                <div className="flex flex-col mb-6">
                    <h3 className="text-xl font-bold text-slate-900 leading-tight mb-2 group-hover:text-[#1e3a8a] transition-colors line-clamp-1">
                        {cert.eventName}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium font-sans">
                        Awarded to <span className="text-[#1e3a8a] font-bold">{cert.fullName}</span>
                    </p>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Issued Date</p>
                        <p className="text-xs text-slate-600 font-bold">{new Date(cert.issueDate).toLocaleDateString()}</p>
                    </div>

                    <button
                        onClick={handleDownload}
                        disabled={!previewDataUrl}
                        className="flex items-center gap-2 bg-[#1e3a8a] hover:bg-[#1e40af] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-50"
                    >
                        {previewDataUrl ? <Download className="w-4 h-4" /> : <Loader2 className="w-4 h-4 animate-spin" />}
                        Download
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

export default function CertificateSearch() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        setResults(null);
        try {
            const res = await fetch(`/api/certificates?email=${email.toLowerCase()}`);
            const data = await res.json();
            setResults(Array.isArray(data) ? data : []);
        } catch {
            setResults([]);
        }
        setLoading(false);
    };

    return (
        <main className="min-h-screen bg-slate-50 selection:bg-[#1e3a8a]/10 selection:text-[#1e3a8a] font-sans pb-40 overflow-x-hidden">
            {/* HERO SECTION - Matching Gallery/Alumni Theme */}
            <header className="relative pt-40 pb-20 bg-[#1e3a8a]/10 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle,_#000_1px,_transparent_1px)] bg-[size:40px_40px]" />
                <div className="absolute top-[-100px] left-[10%] w-[400px] h-[400px] bg-[#1e3a8a]/5 blur-[100px] rounded-full" />

                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                    {/* LEFT CONTENT */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-sm text-[#1e3a8a] font-semibold tracking-wider uppercase">
                            Digital Certificates
                        </span>

                        <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-semibold text-slate-900 leading-tight tracking-tight uppercase">
                            CERTIFICATES ARCHIVE
                            <span className="block text-[#1e3a8a] mt-2 text-3xl md:text-4xl font-bold">
                                Claim Your Achievements
                            </span>
                        </h1>

                        <p className="mt-6 text-lg text-slate-600 max-w-xl leading-relaxed">
                            Access your earned certificates from CSS events. Enter your registered email address to find and download your digital honors.
                        </p>

                        {/* Search Box */}
                        <form onSubmit={handleSearch} className="mt-10 max-w-md relative group">
                            <div className="relative">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-hover:text-[#1e3a8a] transition-colors" />
                                <input
                                    type="email"
                                    placeholder="Enter registered email..."
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-full px-6 py-5 pl-14 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#1e3a8a] transition-all text-lg shadow-xl shadow-slate-200/50"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#1e3a8a] text-white p-4 rounded-full hover:bg-[#1e40af] transition-all shadow-lg active:scale-95 disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                                </button>
                            </div>
                        </form>
                    </motion.div>

                    {/* RIGHT VISUAL - Floating Logo Visual */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative hidden lg:flex justify-end items-center"
                    >
                        <div className="relative w-full max-w-[450px] aspect-square">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border-2 border-dashed border-blue-200/50 rounded-full"
                            />

                            <motion.div
                                animate={{ y: [-15, 15, -15] }}
                                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                                className="absolute inset-0 m-auto w-72 h-72 z-20"
                            >
                                <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden border-[12px] border-white shadow-2xl rotate-3">
                                    <Image
                                        src="/images/logo/cssfinallogo.jpeg"
                                        alt="CSS Logo"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ repeat: Infinity, duration: 3 }}
                                className="absolute top-0 right-0 bg-blue-600 text-white p-6 rounded-[2rem] shadow-2xl z-30"
                            >
                                <Award className="w-10 h-10" />
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* RESULTS SECTION */}
            <section className="py-24 px-6 min-h-[400px]">
                <div className="max-w-7xl mx-auto">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center py-20 gap-6"
                            >
                                <div className="w-16 h-16 border-4 border-blue-100 border-t-[#1e3a8a] rounded-full animate-spin" />
                                <p className="text-slate-500 font-bold tracking-[0.2em] uppercase text-xs animate-pulse">Scanning Archive...</p>
                            </motion.div>
                        ) : results === null ? null : results.length === 0 ? (
                            <motion.div
                                key="no-results"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white border border-slate-100 rounded-[3rem] p-16 text-center max-w-2xl mx-auto shadow-2xl"
                            >
                                <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                                    <Search className="w-10 h-10 text-red-500" />
                                </div>
                                <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">No Records Found</h3>
                                <p className="text-slate-500 mb-10 text-lg leading-relaxed">
                                    We searched our records but couldn&apos;t find an match for <br />
                                    <span className="text-slate-900 font-bold underline decoration-red-200 decoration-4">{email}</span>.
                                </p>
                                <button onClick={() => setResults(null)} className="px-10 py-5 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-all shadow-xl active:scale-95 uppercase tracking-widest text-xs">Search Again</button>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                                {results.map((cert) => (
                                    <CertificateResultCard key={cert._id} cert={cert} />
                                ))}
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </section>
        </main>
    );
}
