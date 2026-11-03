"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/Admin/AdminLayout";
import { Plus, Pencil, Trash2, X, Save, Calendar, Link as LinkIcon, Type, Search, Download, ClipboardList } from "lucide-react";
import ConfirmModal from "@/components/Admin/ConfirmModal";

const emptyAnnouncement = {
    title: "",
    description: "",
    googleFormLink: "",
    linkedEvent: "",
    expiryDate: "",
};

export default function AdminRegistrations() {
    const [tab, setTab] = useState("data"); // "data" | "announcements"

    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

    // ── Registrations tab state ──
    const [regs, setRegs] = useState([]);
    const [regsLoading, setRegsLoading] = useState(true);
    const [q, setQ] = useState("");
    const [eventFilter, setEventFilter] = useState("all");
    const [refreshTick, setRefreshTick] = useState(0);
    const [regDelete, setRegDelete] = useState({ open: false, id: null });
    const [events, setEvents] = useState([]);

    // ── Announcements tab state ──
    const [announcements, setAnnouncements] = useState([]);
    const [annLoading, setAnnLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyAnnouncement);
    const [destChoice, setDestChoice] = useState("builtin"); // "builtin" | "google"
    const [saving, setSaving] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

    // Events feed the filter dropdown and the announcement event tag
    useEffect(() => {
        fetch("/api/events")
            .then((r) => (r.ok ? r.json() : []))
            .then((data) => setEvents(Array.isArray(data) ? data : []))
            .catch(() => { /* ignore */ });
    }, []);

    // Registrations list — debounced search + filter
    useEffect(() => {
        let cancelled = false;
        const t = setTimeout(async () => {
            setRegsLoading(true);
            try {
                const res = await fetch(
                    `/api/registrations?q=${encodeURIComponent(q)}&event=${encodeURIComponent(eventFilter)}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (res.ok) {
                    const data = await res.json();
                    if (!cancelled) setRegs(Array.isArray(data) ? data : []);
                }
            } catch { /* ignore */ }
            if (!cancelled) setRegsLoading(false);
        }, 300);
        return () => { cancelled = true; clearTimeout(t); };
    }, [q, eventFilter, refreshTick, token]);

    const fetchAnnouncements = async () => {
        setAnnLoading(true);
        try {
            const res = await fetch(`/api/announcements`);
            const data = await res.json();
            setAnnouncements(data || []);
        } catch { /* ignore */ }
        setAnnLoading(false);
    };

    useEffect(() => { fetchAnnouncements(); }, []);

    // ── CSV export (client-side, no dependencies) ──
    const exportCsv = () => {
        const esc = (v) => {
            const s = String(v ?? "");
            return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
        };
        const header = ["Name", "Email", "Program", "Semester", "University", "Department", "Event", "Registered At"];
        const rows = regs.map((r) => [
            r.name,
            r.email,
            r.program,
            r.semester,
            r.university,
            r.department,
            r.event?.title || "General",
            new Date(r.createdAt).toLocaleString(),
        ]);
        const csv = [header, ...rows].map((row) => row.map(esc).join(",")).join("\r\n");
        const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `registrations-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    };

    const confirmRegDelete = async () => {
        const id = regDelete.id;
        setRegDelete({ open: false, id: null });
        if (!id) return;
        try {
            const res = await fetch(`/api/registrations/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) setRefreshTick((v) => v + 1);
            else alert("Failed to delete registration");
        } catch {
            alert("An error occurred while deleting");
        }
    };

    // ── Announcement CRUD ──
    const openAdd = () => {
        setEditing(null);
        setForm(emptyAnnouncement);
        setDestChoice("builtin");
        setModalOpen(true);
    };

    const openEdit = (ann) => {
        setEditing(ann._id);
        const date = new Date(ann.expiryDate);
        const tzOffset = date.getTimezoneOffset() * 60000;
        const localISODate = new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);

        setForm({
            ...ann,
            linkedEvent: ann.linkedEvent?._id || ann.linkedEvent || "",
            expiryDate: localISODate,
        });
        setDestChoice(ann.googleFormLink ? "google" : "builtin");
        setModalOpen(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const body = {
                ...form,
                googleFormLink: destChoice === "google" ? form.googleFormLink.trim() : "",
                linkedEvent: destChoice === "builtin" ? (form.linkedEvent || null) : null,
                expiryDate: new Date(form.expiryDate).toISOString(),
            };

            let res;
            if (editing) {
                res = await fetch(`/api/announcements/${editing}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify(body),
                });
            } else {
                res = await fetch("/api/announcements", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify(body),
                });
            }

            if (res.ok) {
                setModalOpen(false);
                fetchAnnouncements();
            } else {
                const error = await res.json();
                alert(error.error || "Failed to save announcement");
            }
        } catch {
            alert("An error occurred while saving");
        }
        setSaving(false);
    };

    const confirmDelete = async () => {
        const id = deleteModal.id;
        try {
            const res = await fetch(`/api/announcements/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                fetchAnnouncements();
            } else {
                alert("Failed to delete announcement");
            }
        } catch {
            alert("An error occurred while deleting");
        }
    };

    const saveDisabled = saving || !form.title || !form.expiryDate ||
        (destChoice === "google" && !form.googleFormLink.trim());

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-black text-white">Registrations</h2>
                        <p className="text-gray-500 text-sm mt-1">
                            {tab === "data"
                                ? "Everyone who submitted your built-in form — search, filter, and export to CSV."
                                : "Home-page popups that point visitors to your registration form."}
                        </p>
                    </div>
                    {tab === "announcements" && (
                        <button
                            onClick={openAdd}
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 text-sm"
                        >
                            <Plus className="w-4 h-4" /> Add Popup
                        </button>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-2 border-b border-white/[0.06]">
                    {[
                        { id: "data", label: `Collected Registrations (${regs.length})` },
                        { id: "announcements", label: `Announcement Popups (${announcements.length})` },
                    ].map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={`px-4 py-3 text-xs font-bold uppercase tracking-widest border-b-2 -mb-px transition-colors ${
                                tab === t.id
                                    ? "border-blue-500 text-blue-400"
                                    : "border-transparent text-gray-500 hover:text-gray-300"
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* ── Tab 1: Collected registrations ── */}
                {tab === "data" && (
                    <div className="space-y-4">
                        {/* Toolbar */}
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="relative flex-1 min-w-[220px] max-w-md">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="text"
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                    placeholder="Search by name or email…"
                                    className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                />
                            </div>
                            <select
                                value={eventFilter}
                                onChange={(e) => setEventFilter(e.target.value)}
                                aria-label="Filter by event"
                                className="bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-w-[180px]"
                            >
                                <option value="all">All events</option>
                                {events.map((ev) => (
                                    <option key={ev._id} value={ev._id}>{ev.title}</option>
                                ))}
                                <option value="global">General (no event)</option>
                            </select>
                            <button
                                onClick={exportCsv}
                                disabled={regs.length === 0}
                                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <Download className="w-4 h-4" /> Export CSV
                            </button>
                        </div>

                        {/* Table */}
                        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
                            {regsLoading ? (
                                <div className="p-12 text-center">
                                    <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" />
                                </div>
                            ) : regs.length === 0 ? (
                                <div className="p-14 text-center">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
                                        <Download className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <p className="text-gray-300 font-bold mb-1.5">
                                        {q || eventFilter !== "all" ? "Nothing matches your filters" : "No registrations yet"}
                                    </p>
                                    <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
                                        {q || eventFilter !== "all"
                                            ? "Try a different search term, or switch the event filter back to “All events”."
                                            : "Share your event’s Register link — every submission appears here instantly and can be exported to CSV."}
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-white/[0.06]">
                                                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Name</th>
                                                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Program</th>
                                                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">University</th>
                                                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Event</th>
                                                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Date</th>
                                                <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {regs.map((r) => (
                                                <tr key={r._id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                                    <td className="px-6 py-4">
                                                        <p className="text-white font-semibold whitespace-nowrap">{r.name}</p>
                                                        <p className="text-gray-500 text-xs mt-0.5 whitespace-nowrap">{r.email}</p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="text-gray-300">{r.program}</p>
                                                        <p className="text-gray-500 text-xs mt-0.5">
                                                            {r.department}{r.semester ? ` · Sem ${r.semester}` : ""}
                                                        </p>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-400">{r.university}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${r.event?.title
                                                            ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                                                            : "bg-white/[0.05] text-gray-500 border border-white/[0.08]"
                                                        }`}>
                                                            {r.event?.title || "General"}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                                        {new Date(r.createdAt).toLocaleDateString(undefined, {
                                                            year: "numeric", month: "short", day: "numeric",
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => setRegDelete({ open: true, id: r._id })}
                                                            title="Delete this registration"
                                                            className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ── Tab 2: Announcement popups ── */}
                {tab === "announcements" && (
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
                        {annLoading ? (
                            <div className="p-12 text-center">
                                <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" />
                            </div>
                        ) : announcements.length === 0 ? (
                            <div className="p-14 text-center">
                                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
                                    <Plus className="w-5 h-5 text-blue-400" />
                                </div>
                                <p className="text-gray-300 font-bold mb-1.5">No popups yet</p>
                                <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
                                    Add a popup to show a “Register Now” card on the home page — it links to your form until the date you set.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-white/[0.06]">
                                            <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Popup Title</th>
                                            <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Goes To</th>
                                            <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Expiry Date/Time</th>
                                            <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Status</th>
                                            <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {announcements.map((ann) => {
                                            const isExpired = new Date(ann.expiryDate) < new Date();
                                            return (
                                                <tr key={ann._id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                                    <td className="px-6 py-4 text-white font-semibold">{ann.title}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${ann.googleFormLink
                                                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                                            : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                                        }`}>
                                                            {ann.googleFormLink ? "Google Form" : "Built-in form"}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-400">
                                                        {new Date(ann.expiryDate).toLocaleString(undefined, {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            hour12: true
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${isExpired
                                                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                                            : "bg-green-500/10 text-green-400 border border-green-500/20"
                                                            }`}>
                                                            {isExpired ? "Expired" : "Active"}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button onClick={() => openEdit(ann)} className="p-2 rounded-lg hover:bg-white/[0.05] text-gray-400 hover:text-blue-400 transition-colors">
                                                                <Pencil className="w-4 h-4" />
                                                            </button>
                                                            <button onClick={() => setDeleteModal({ open: true, id: ann._id })} className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Announcement Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-[#111827] border border-white/[0.08] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                            <h3 className="text-lg font-black text-white">{editing ? "Edit Popup" : "Add Popup"}</h3>
                            <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-white/[0.05] rounded-lg text-gray-400">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-5">
                            <InputField label="Popup Title" icon={<Type className="w-4 h-4" />} value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="e.g. Register for the Prompt Engineering Bootcamp" />

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Brief Description</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    rows={3}
                                    className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none text-sm"
                                    placeholder="Short line shown in the popup…"
                                />
                            </div>

                            <InputField label="Hide popup after" icon={<Calendar className="w-4 h-4" />} type="datetime-local" value={form.expiryDate} onChange={(v) => setForm({ ...form, expiryDate: v })} />

                            {/* ── Destination chooser ── */}
                            <div className="space-y-2.5 pt-1">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Where does “Register Now” go?</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <DestCard
                                        active={destChoice === "builtin"}
                                        onClick={() => setDestChoice("builtin")}
                                        icon={<ClipboardList className="w-4 h-4" />}
                                        title="Built-in form"
                                        desc="Collects entries in this admin panel"
                                        badge="Recommended"
                                    />
                                    <DestCard
                                        active={destChoice === "google"}
                                        onClick={() => setDestChoice("google")}
                                        icon={<LinkIcon className="w-4 h-4" />}
                                        title="Google Form"
                                        desc="Sends people to Google instead"
                                    />
                                </div>

                                {destChoice === "builtin" ? (
                                    <div className="space-y-2">
                                        <select
                                            value={form.linkedEvent || ""}
                                            onChange={(e) => setForm({ ...form, linkedEvent: e.target.value })}
                                            aria-label="Tag registrations to event"
                                            className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                        >
                                            <option value="">Not tied to a specific event</option>
                                            {events.map((ev) => (
                                                <option key={ev._id} value={ev._id}>Tag entries as: {ev.title}</option>
                                            ))}
                                        </select>
                                        <p className="text-[11px] text-blue-300/80 leading-relaxed">
                                            Opens your <span className="font-mono font-semibold text-blue-200">/register</span> page — submissions appear instantly under Collected Registrations.
                                        </p>
                                    </div>
                                ) : (
                                    <InputField
                                        label="Google Form URL"
                                        icon={<LinkIcon className="w-4 h-4" />}
                                        value={form.googleFormLink}
                                        onChange={(v) => setForm({ ...form, googleFormLink: v })}
                                        placeholder="https://docs.google.com/forms/…"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/[0.06]">
                            <button onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/[0.05] transition-all">
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saveDisabled}
                                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 text-sm disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {saving ? "Saving..." : "Save Popup"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, id: null })}
                onConfirm={confirmDelete}
                title="Delete Announcement"
                message="Are you sure you want to delete this popup? It will be immediately removed from the home page."
            />

            <ConfirmModal
                isOpen={regDelete.open}
                onClose={() => setRegDelete({ open: false, id: null })}
                onConfirm={confirmRegDelete}
                title="Delete Registration"
                message="Are you sure you want to delete this registration? This cannot be undone."
            />
        </AdminLayout>
    );
}

function InputField({ label, value, onChange, type = "text", placeholder = "", icon }) {
    return (
        <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</label>
            <div className="relative">
                {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">{icon}</div>}
                <input
                    type={type}
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`w-full bg-white/[0.05] border border-white/[0.08] rounded-xl ${icon ? "pl-11" : "pl-4"} pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm`}
                />
            </div>
        </div>
    );
}

function DestCard({ active, onClick, icon, title, desc, badge }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`text-left rounded-xl border p-3.5 transition-all ${
                active
                    ? "border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/30"
                    : "border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.05]"
            }`}
        >
            <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className={`flex items-center gap-1.5 text-xs font-bold ${active ? "text-blue-300" : "text-gray-300"}`}>
                    {icon}
                    {title}
                </span>
                <span className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                    active ? "border-blue-400 bg-blue-500" : "border-gray-600"
                }`}>
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </span>
            </div>
            <p className="text-[11px] text-gray-500 leading-snug">{desc}</p>
            {badge && (
                <span className="inline-block mt-1.5 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold uppercase tracking-widest">
                    {badge}
                </span>
            )}
        </button>
    );
}
