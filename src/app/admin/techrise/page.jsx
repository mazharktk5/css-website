"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import AdminLayout from "@/components/Admin/AdminLayout";
import ConfirmModal from "@/components/Admin/ConfirmModal";
import {
    Search, Download, RefreshCw, Loader2, CheckCircle2, Clock, Users, Handshake,
    QrCode, Trash2, UserCheck, UserX, Trophy, Eye, UserRound, X as XIcon,
} from "lucide-react";
import * as XLSX from "xlsx";

const STATUS_TABS = [
    { key: "all", label: "All" },
    { key: "pending", label: "Not Arrived" },
    { key: "checkedin", label: "Checked-In" },
];

export default function AdminTechRisePage() {
    const [rows, setRows] = useState([]);
    const [stats, setStats] = useState({ total: 0, checkedIn: 0, pending: 0 });
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("all");
    const [busyId, setBusyId] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [detailsTarget, setDetailsTarget] = useState(null);
    const [exporting, setExporting] = useState(false);
    const [error, setError] = useState("");

    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const params = new URLSearchParams({ status, q: query });
            const res = await fetch(`/api/techrise/registrations?${params}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to load");
            setRows(data.rows || []);
            setStats(data.stats || { total: 0, checkedIn: 0, pending: 0 });
            setPartners(data.partnerPerformance || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [status, query, token]);

    useEffect(() => {
        const t = setTimeout(fetchData, query ? 350 : 0);
        return () => clearTimeout(t);
    }, [fetchData, query]);

    async function toggleCheckIn(row) {
        setBusyId(row._id);
        try {
            const res = await fetch(`/api/techrise/registrations/${row._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ checkedIn: !row.checkedIn }),
            });
            if (res.ok) await fetchData();
        } finally {
            setBusyId(null);
        }
    }

    async function confirmDelete() {
        if (!deleteTarget) return;
        setBusyId(deleteTarget._id);
        try {
            const res = await fetch(`/api/techrise/registrations/${deleteTarget._id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) await fetchData();
        } finally {
            setBusyId(null);
        }
    }

    function handleExport() {
        setExporting(true);
        try {
            const data = rows.map((r) => ({
                "Registration ID": r.regId,
                Name: r.name,
                Email: r.email,
                Phone: r.phone || "",
                Institution: r.institution || "",
                Department: r.department || "",
                Semester: r.semester || "",
                Region: r.region || "",
                "Community Partner": r.communityPartner || "",
                "Heard Via": r.hearSource || "",
                Interests: r.interests || "",
                "Consented": r.consent ? "Yes" : "No",
                "Photo URL": r.photoUrl || "",
                Status: r.checkedIn ? "Checked-In" : "Not Arrived",
                "Checked-In At": r.checkedInAt ? new Date(r.checkedInAt).toLocaleString() : "",
                Registered: new Date(r.createdAt).toLocaleString(),
            }));
            const ws = XLSX.utils.json_to_sheet(data);
            ws["!cols"] = Object.keys(data[0] || { x: 1 }).map((k) => ({ wch: Math.max(14, k.length + 4) }));
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "TechRise 26");
            XLSX.writeFile(wb, `TechRise26_Registrations_${new Date().toISOString().slice(0, 10)}.xlsx`);
        } finally {
            setExporting(false);
        }
    }

    const cards = [
        { title: "Registered", value: stats.total, icon: Users, gradient: "from-blue-600 to-cyan-500", shadow: "shadow-blue-500/20" },
        { title: "Checked-In", value: stats.checkedIn, icon: CheckCircle2, gradient: "from-emerald-600 to-teal-500", shadow: "shadow-emerald-500/20" },
        { title: "Not Arrived", value: stats.pending, icon: Clock, gradient: "from-amber-500 to-orange-500", shadow: "shadow-amber-500/20" },
        { title: "Partners", value: partners.filter((p) => p.partner !== "General attendee").length, icon: Handshake, gradient: "from-indigo-600 to-violet-500", shadow: "shadow-indigo-500/20" },
    ];

    return (
        <AdminLayout>
            {/* Header banner */}
            <div className="bg-gradient-to-r from-blue-600/10 via-indigo-600/5 to-transparent border border-blue-500/10 rounded-2xl p-8 mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400">TechRise &rsquo;26</span>
                <div className="flex flex-wrap items-end justify-between gap-4 mt-2">
                    <div>
                        <h2 className="text-2xl font-black text-white">Registrations Dashboard</h2>
                        <p className="text-gray-400 text-sm mt-1">
                            22 October 2026 · SSAQ Khan Hall, University of Peshawar
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href="/admin/techrise/checkin"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-bold px-5 py-3 rounded-xl shadow-lg shadow-emerald-500/20 hover:opacity-90 transition"
                        >
                            <QrCode size={16} /> Check-In Scanner
                        </Link>
                        <button
                            onClick={handleExport}
                            disabled={exporting || rows.length === 0}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold px-5 py-3 rounded-xl shadow-lg shadow-blue-500/20 hover:opacity-90 transition disabled:opacity-50"
                        >
                            {exporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />} Export Excel
                        </button>
                    </div>
                </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {cards.map(({ title, value, icon: Icon, gradient, shadow }) => (
                    <div key={title} className={`bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.12] transition-all ${shadow}`}>
                        <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${gradient} mb-4`} />
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">{title}</p>
                                <p className="text-3xl font-black text-white mt-1">{value}</p>
                            </div>
                            <span className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg ${shadow}`}>
                                <Icon size={20} className="text-white" />
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Community performance */}
            {partners.length > 0 && (
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Trophy size={16} className="text-amber-400" />
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Community Performance</h3>
                        <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-1 rounded-full">ranked by attended</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/[0.06]">
                                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-gray-500">Partner</th>
                                    <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-widest text-gray-500">Registered</th>
                                    <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-widest text-gray-500">Attended</th>
                                    <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-widest text-gray-500">Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {partners.map((p) => (
                                    <tr key={p.partner} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                        <td className="px-4 py-3 text-white font-semibold">{p.partner}</td>
                                        <td className="px-4 py-3 text-right text-gray-400">{p.registered}</td>
                                        <td className="px-4 py-3 text-right text-emerald-400 font-bold">{p.attended}</td>
                                        <td className="px-4 py-3 text-right">
                                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">{p.rate}%</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="relative flex-1 min-w-[240px] max-w-md">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search name, TR26 ID, email, phone, partner…"
                        className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                </div>
                <div className="flex gap-2">
                    {STATUS_TABS.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setStatus(tab.key)}
                            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition ${status === tab.key
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                    : "bg-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.07]"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <button
                    onClick={fetchData}
                    className="p-2.5 rounded-xl bg-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.07] transition"
                    title="Refresh"
                >
                    <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                </button>
                <Link
                    href="/admin/techrise/checkin"
                    className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/15 text-emerald-400 text-xs font-bold border border-emerald-500/20"
                >
                    <QrCode size={14} /> Scanner
                </Link>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 mb-6 text-sm">{error}</div>
            )}

            {/* Table */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" />
                    </div>
                ) : rows.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">No registrations found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/[0.06]">
                                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">ID</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Photo</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Name</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Contact</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Department</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Partner</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Status</th>
                                    <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row) => (
                                    <tr key={row._id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-[#14305E]/60 text-amber-400 border border-amber-500/20">{row.regId}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {row.photoUrl ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={row.photoUrl} alt={row.name} className="w-9 h-9 rounded-full object-cover border border-white/10" />
                                            ) : (
                                                <span className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-600">
                                                    <UserRound size={16} />
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-white font-semibold">{row.name}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-400">{row.email}</div>
                                            {row.phone && <div className="text-gray-600 text-xs">{row.phone}</div>}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">{row.department}</td>
                                        <td className="px-6 py-4 text-gray-400">{row.communityPartner || "—"}</td>
                                        <td className="px-6 py-4">
                                            {row.checkedIn ? (
                                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                    Checked-In
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                                    Not Arrived
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setDetailsTarget(row)}
                                                    className="p-2 rounded-lg text-gray-400 hover:bg-blue-500/10 hover:text-blue-400 transition"
                                                    title="View all details"
                                                >
                                                    <Eye size={15} />
                                                </button>
                                                <button
                                                    onClick={() => toggleCheckIn(row)}
                                                    disabled={busyId === row._id}
                                                    title={row.checkedIn ? "Undo check-in" : "Mark checked-in"}
                                                    className={`p-2 rounded-lg transition disabled:opacity-50 ${row.checkedIn
                                                            ? "hover:bg-amber-500/10 text-emerald-400 hover:text-amber-400"
                                                            : "hover:bg-emerald-500/10 text-gray-400 hover:text-emerald-400"
                                                        }`}
                                                >
                                                    {busyId === row._id ? <Loader2 size={15} className="animate-spin" /> : row.checkedIn ? <UserX size={15} /> : <UserCheck size={15} />}
                                                </button>
                                                <button
                                                    onClick={() => setDeleteTarget(row)}
                                                    className="p-2 rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={Boolean(deleteTarget)}
                onClose={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
                title="Delete Registration"
                message={`Delete ${deleteTarget?.name} (${deleteTarget?.regId})? This permanently removes their registration and QR pass.`}
            />

            {detailsTarget && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-[#111827] border border-white/[0.08] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
                        <div className="flex items-start justify-between p-6 pb-4 border-b border-white/[0.06]">
                            <div className="flex items-center gap-4">
                                {detailsTarget.photoUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={detailsTarget.photoUrl} alt={detailsTarget.name} className="w-16 h-16 rounded-xl object-cover border border-white/10" />
                                ) : (
                                    <span className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-600">
                                        <UserRound size={24} />
                                    </span>
                                )}
                                <div>
                                    <h3 className="text-lg font-black text-white">{detailsTarget.name}</h3>
                                    <span className="px-2 py-0.5 rounded text-xs font-black bg-[#14305E]/60 text-amber-400 border border-amber-500/20">{detailsTarget.regId}</span>
                                </div>
                            </div>
                            <button onClick={() => setDetailsTarget(null)} className="p-2 hover:bg-white/[0.05] rounded-lg text-gray-400 transition-colors">
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 pt-4 overflow-y-auto space-y-3 text-sm">
                            {[
                                ["Email", detailsTarget.email],
                                ["Phone", detailsTarget.phone],
                                ["Institution", detailsTarget.institution],
                                ["Department", detailsTarget.department],
                                ["Semester", detailsTarget.semester],
                                ["Region", detailsTarget.region],
                                ["Community Partner", detailsTarget.communityPartner],
                                ["Heard Via", detailsTarget.hearSource],
                                ["Interests", detailsTarget.interests],
                                ["Consented", detailsTarget.consent ? "Yes" : "No"],
                                ["Status", detailsTarget.checkedIn ? `Checked-In${detailsTarget.checkedInAt ? ` · ${new Date(detailsTarget.checkedInAt).toLocaleString()}` : ""}` : "Not Arrived"],
                                ["Registered", detailsTarget.createdAt ? new Date(detailsTarget.createdAt).toLocaleString() : ""],
                            ].map(([label, value]) => (
                                <div key={label} className="flex items-start justify-between gap-4 border-b border-white/[0.04] pb-2.5">
                                    <span className="text-gray-500 font-bold uppercase text-xs tracking-widest shrink-0">{label}</span>
                                    <span className="text-white text-right">{value || "—"}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
