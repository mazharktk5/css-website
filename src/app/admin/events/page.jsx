"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/Admin/AdminLayout";
import { Plus, Pencil, Trash2, X, Save, Calendar, MapPin, Tag } from "lucide-react";

const emptyEvent = {
    title: "",
    date: "",
    time: "",
    location: "",
    image: "",
    description: "",
    tags: "",
    registrationLink: "#",
    category: "",
    participants: "",
};

export default function AdminEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyEvent);
    const [saving, setSaving] = useState(false);

    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

    const fetchEvents = async () => {
        try {
            const res = await fetch("/api/events");
            const data = await res.json();
            setEvents(Array.isArray(data) ? data : []);
        } catch { /* ignore */ }
        setLoading(false);
    };

    useEffect(() => { fetchEvents(); }, []);

    const openAdd = () => {
        setEditing(null);
        setForm(emptyEvent);
        setModalOpen(true);
    };

    const openEdit = (event) => {
        setEditing(event._id);
        setForm({
            ...event,
            tags: Array.isArray(event.tags) ? event.tags.join(", ") : event.tags || "",
        });
        setModalOpen(true);
    };

    const handleSave = async () => {
        setSaving(true);
        const body = {
            ...form,
            tags: typeof form.tags === "string" ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : form.tags,
        };

        try {
            if (editing) {
                await fetch(`/api/events/${editing}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify(body),
                });
            } else {
                await fetch("/api/events", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify(body),
                });
            }
            setModalOpen(false);
            fetchEvents();
        } catch { /* ignore */ }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this event?")) return;
        await fetch(`/api/events/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        fetchEvents();
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-white">Events Management</h2>
                        <p className="text-gray-500 text-sm mt-1">{events.length} total events</p>
                    </div>
                    <button
                        onClick={openAdd}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 text-sm"
                    >
                        <Plus className="w-4 h-4" /> Add Event
                    </button>
                </div>

                {/* Events Table */}
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" />
                        </div>
                    ) : events.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">No events found. Click &quot;Add Event&quot; to get started.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-white/[0.06]">
                                        <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Title</th>
                                        <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Category</th>
                                        <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Date</th>
                                        <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Location</th>
                                        <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {events.map((event) => (
                                        <tr key={event._id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-4 text-white font-semibold">{event.title}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                    {event.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-400">{event.date}</td>
                                            <td className="px-6 py-4 text-gray-400">{event.location || "—"}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => openEdit(event)} className="p-2 rounded-lg hover:bg-white/[0.05] text-gray-400 hover:text-blue-400 transition-colors">
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(event._id)} className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors">
                                                        <Trash2 className="w-4 h-4" />
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
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-[#111827] border border-white/[0.08] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                            <h3 className="text-lg font-black text-white">{editing ? "Edit Event" : "Add Event"}</h3>
                            <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-white/[0.05] rounded-lg text-gray-400">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <InputField label="Title" icon={<Tag className="w-4 h-4" />} value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
                                <InputField label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} placeholder="e.g. AI, Web Development, past" />
                                <InputField label="Date" icon={<Calendar className="w-4 h-4" />} type="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} />
                                <InputField label="Time" value={form.time} onChange={(v) => setForm({ ...form, time: v })} placeholder="e.g. 2:00 PM - 5:00 PM" />
                                <InputField label="Location" icon={<MapPin className="w-4 h-4" />} value={form.location} onChange={(v) => setForm({ ...form, location: v })} />
                                <InputField label="Participants" value={form.participants} onChange={(v) => setForm({ ...form, participants: v })} placeholder="e.g. 50+ students" />
                            </div>
                            <InputField label="Image Path" value={form.image} onChange={(v) => setForm({ ...form, image: v })} placeholder="/images/events/..." />
                            <InputField label="Tags (comma separated)" value={form.tags} onChange={(v) => setForm({ ...form, tags: v })} placeholder="Workshop, AI, Hackathon" />
                            <InputField label="Registration Link" value={form.registrationLink} onChange={(v) => setForm({ ...form, registrationLink: v })} />
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Description</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    rows={3}
                                    className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none text-sm"
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/[0.06]">
                            <button onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/[0.05] transition-all">
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving || !form.title || !form.category || !form.date}
                                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 text-sm disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {saving ? "Saving..." : "Save Event"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
