"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/Admin/AdminLayout";
import { Download, User, Layers, Clock } from "lucide-react";

const TEMPLATE_LABELS = {
    savera: "Naya Savera",
    dil: "Dil Hai Pakistan",
    pehchan: "Meri Pehchan",
    azaadi: "Azaadi Mubarak",
    cssazaadi: "CSS Azaadi",
    parcham: "Parcham",
};

export default function PostersAdminPage() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lightbox, setLightbox] = useState(null);

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

    return (
        <AdminLayout>
            <div className="p-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
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
                                    <th className="text-left px-4 py-3 text-slate-500 font-semibold w-14">#</th>
                                    <th className="text-left px-4 py-3 text-slate-500 font-semibold">Poster</th>
                                    <th className="text-left px-4 py-3 text-slate-500 font-semibold">Name</th>
                                    <th className="text-left px-4 py-3 text-slate-500 font-semibold hidden md:table-cell">Role / Program</th>
                                    <th className="text-left px-4 py-3 text-slate-500 font-semibold hidden sm:table-cell">Template</th>
                                    <th className="text-left px-4 py-3 text-slate-500 font-semibold hidden lg:table-cell">Downloaded</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {records.map((r, i) => (
                                    <tr key={r._id} className="hover:bg-slate-50 transition">
                                        <td className="px-4 py-3 text-slate-400 font-mono">{i + 1}</td>
                                        <td className="px-4 py-3">
                                            {r.posterUrl ? (
                                                <img
                                                    src={r.posterUrl}
                                                    alt={r.name}
                                                    className="w-12 h-12 rounded-lg object-cover cursor-pointer hover:opacity-80 transition border border-slate-200"
                                                    onClick={() => setLightbox(r.posterUrl)}
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-300">
                                                    <User className="w-5 h-5" />
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
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                    onClick={() => setLightbox(null)}
                >
                    <img
                        src={lightbox}
                        alt="Poster"
                        className="max-w-[90vw] max-h-[90vh] rounded-2xl shadow-2xl"
                    />
                </div>
            )}
        </AdminLayout>
    );
}
