"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/Admin/AdminLayout";
import { Download, User, Layers, Clock, X, ExternalLink } from "lucide-react";

const TEMPLATE_LABELS = {
    savera:    "Naya Savera",
    dil:       "Dil Hai Pakistan",
    pehchan:   "Meri Pehchan",
    azaadi:    "Azaadi Mubarak",
    cssazaadi: "CSS Azaadi",
    parcham:   "Parcham",
};

/** Add Cloudinary transformation into the URL path */
function clTransform(url, transform) {
    if (!url || !url.includes("cloudinary.com")) return url;
    return url.replace("/upload/", `/upload/${transform}/`);
}

export default function PostersAdminPage() {
    const [records, setRecords]   = useState([]);
    const [loading, setLoading]   = useState(true);
    const [lightbox, setLightbox] = useState(null); // { url, name }

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("admin_token");
            try {
                const res = await fetch("/api/poster-downloads", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                setRecords(Array.isArray(data) ? data : []);
            } catch {
                setRecords([]);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const fmt = (iso) =>
        new Date(iso).toLocaleString("en-GB", {
            day: "2-digit", month: "short", year: "numeric",
            hour: "2-digit", minute: "2-digit",
        });

    const downloadPoster = (url, name) => {
        // fl_attachment forces Cloudinary to send Content-Disposition: attachment
        const dlUrl = clTransform(url, "fl_attachment");
        const a = document.createElement("a");
        a.href = dlUrl;
        a.download = `CSS-Poster-${(name || "poster").replace(/\s+/g, "-")}.jpg`;
        a.target = "_blank";
        a.rel = "noopener";
        a.click();
    };

    return (
        <AdminLayout>
            <div className="p-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Poster Downloads</h1>
                        <p className="text-slate-500 text-sm mt-1">
                            Independence Day poster generator — saved records
                        </p>
                    </div>
                    <div className="flex items-center gap-2 bg-[#1e3a8a] text-white rounded-xl px-5 py-3 shadow">
                        <Download className="w-5 h-5" />
                        <span className="text-xl font-black">{records.length}</span>
                        <span className="text-sm font-medium opacity-80">Total Downloads</span>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-slate-400">Loading…</div>
                ) : records.length === 0 ? (
                    <div className="text-center py-20 text-slate-400">
                        No poster downloads recorded yet.
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left px-4 py-3 text-slate-500 font-semibold w-10">#</th>
                                    <th className="text-left px-4 py-3 text-slate-500 font-semibold w-20">Poster</th>
                                    <th className="text-left px-4 py-3 text-slate-500 font-semibold">Name</th>
                                    <th className="text-left px-4 py-3 text-slate-500 font-semibold hidden md:table-cell">Role</th>
                                    <th className="text-left px-4 py-3 text-slate-500 font-semibold hidden sm:table-cell">Template</th>
                                    <th className="text-left px-4 py-3 text-slate-500 font-semibold hidden lg:table-cell">Downloaded</th>
                                    <th className="text-left px-4 py-3 text-slate-500 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {records.map((r, i) => (
                                    <tr key={r._id} className="hover:bg-slate-50 transition">
                                        <td className="px-4 py-3 text-slate-400 font-mono text-xs">{i + 1}</td>
                                        <td className="px-4 py-3">
                                            {r.posterUrl ? (
                                                <img
                                                    src={clTransform(r.posterUrl, "w_80,h_80,c_scale,q_85")}
                                                    alt={r.name}
                                                    className="w-14 h-14 rounded-xl object-cover cursor-pointer hover:opacity-80 hover:scale-105 transition border border-slate-200 shadow-sm"
                                                    onClick={() => setLightbox({ url: r.posterUrl, name: r.name })}
                                                />
                                            ) : (
                                                <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-slate-300">
                                                    <User className="w-6 h-6" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 font-semibold text-slate-800">
                                            {r.name || "—"}
                                        </td>
                                        <td className="px-4 py-3 text-slate-500 hidden md:table-cell">
                                            {r.role || "—"}
                                        </td>
                                        <td className="px-4 py-3 hidden sm:table-cell">
                                            <span className="inline-flex items-center gap-1.5 bg-[#1e3a8a]/8 text-[#1e3a8a] text-xs font-bold px-2.5 py-1 rounded-full">
                                                <Layers className="w-3 h-3" />
                                                {TEMPLATE_LABELS[r.template] ?? r.template}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-slate-400 text-xs hidden lg:table-cell">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {fmt(r.createdAt)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {r.posterUrl ? (
                                                <button
                                                    onClick={() => downloadPoster(r.posterUrl, r.name)}
                                                    title="Download poster"
                                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1e3a8a] hover:bg-[#1e3a8a]/8 px-3 py-1.5 rounded-lg transition"
                                                >
                                                    <Download className="w-3.5 h-3.5" />
                                                    Download
                                                </button>
                                            ) : (
                                                <span className="text-slate-300 text-xs">No image</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Lightbox */}
            {lightbox && (
                <div
                    className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4"
                    onClick={() => setLightbox(null)}
                >
                    <div
                        className="relative max-w-[520px] w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={clTransform(lightbox.url, "w_720,c_scale,q_90")}
                            alt={lightbox.name}
                            className="w-full rounded-2xl shadow-2xl"
                        />
                        {/* Lightbox actions */}
                        <div className="absolute top-3 right-3 flex gap-2">
                            <button
                                onClick={() => downloadPoster(lightbox.url, lightbox.name)}
                                className="bg-white/90 hover:bg-white text-slate-800 rounded-full px-4 py-2 text-xs font-bold flex items-center gap-1.5 shadow transition"
                            >
                                <Download className="w-3.5 h-3.5" />
                                Download
                            </button>
                            <button
                                onClick={() => setLightbox(null)}
                                className="bg-white/90 hover:bg-white text-slate-800 rounded-full p-2 shadow transition"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        {lightbox.name && (
                            <p className="text-center text-white/60 text-sm mt-3">{lightbox.name}</p>
                        )}
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
