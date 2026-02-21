"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/Admin/AdminLayout";
import { Plus, Pencil, Trash2, X, Save, Calendar, Link as LinkIcon, Type } from "lucide-react";
import ConfirmModal from "@/components/Admin/ConfirmModal";

const emptyAnnouncement = {
    title: "",
    description: "",
    googleFormLink: "",
    expiryDate: "",
};

export default function AdminRegistrations() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyAnnouncement);
    const [saving, setSaving] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

    const fetchAnnouncements = async () => {
        try {
            const res = await fetch("/api/announcements");
            const data = await res.json();
            setAnnouncements(Array.isArray(data) ? data : []);
        } catch { /* ignore */ }
        setLoading(false);
    };

    useEffect(() => { fetchAnnouncements(); }, []);

    const openAdd = () => {
        setEditing(null);
        setForm(emptyAnnouncement);
        setModalOpen(true);
    };

    const openEdit = (ann) => {
        setEditing(ann._id);
        // Format date for datetime-local input (YYYY-MM-DDTHH:MM) in local timezone
        const date = new Date(ann.expiryDate);
        const tzOffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
        const localISODate = new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);

        setForm({
            ...ann,
            expiryDate: localISODate
        });
        setModalOpen(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            let res;
            if (editing) {
                res = await fetch(`/api/announcements/${editing}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify(form),
                });
            } else {
                res = await fetch("/api/announcements", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify(form),
                });
            }

            if (res.ok) {
                setModalOpen(false);
                fetchAnnouncements();
            } else {
                const error = await res.json();
                alert(error.error || "Failed to save announcement");
            }
        } catch (err) {
            alert("An error occurred while saving");
        }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        setDeleteModal({ open: true, id });
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

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-white">Registrations Management</h2>
                        <p className="text-gray-500 text-sm mt-1">{announcements.length} total popups</p>
                    </div>
                    <button
                        onClick={openAdd}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 text-sm"
                    >
                        <Plus className="w-4 h-4" /> Add Registration
                    </button>
                </div>

                {/* Table */}
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" />
                        </div>
                    ) : announcements.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">No registrations found. Click &quot;Add Registration&quot; to get started.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-white/[0.06]">
                                        <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Event Title</th>
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
                                                <td className="px-6 py-4 text-gray-400">
                                                    {new Date(ann.expiryDate).toLocaleString()}
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
                                                        <button onClick={() => handleDelete(ann._id)} className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors">
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
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-[#111827] border border-white/[0.08] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                            <h3 className="text-lg font-black text-white">{editing ? "Edit Registration" : "Add Registration"}</h3>
                            <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-white/[0.05] rounded-lg text-gray-400">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-5">
                            <InputField label="Event Title" icon={<Type className="w-4 h-4" />} value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
                            <InputField label="Google Form Link" icon={<LinkIcon className="w-4 h-4" />} value={form.googleFormLink} onChange={(v) => setForm({ ...form, googleFormLink: v })} />
                            <InputField label="Expiry Date & Time" icon={<Calendar className="w-4 h-4" />} type="datetime-local" value={form.expiryDate} onChange={(v) => setForm({ ...form, expiryDate: v })} />

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Brief Description</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    rows={3}
                                    className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none text-sm"
                                    placeholder="Short description for the popup..."
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
                                disabled={saving || !form.title || !form.googleFormLink || !form.expiryDate}
                                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 text-sm disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {saving ? "Saving..." : "Save Registration"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, id: null })}
                onConfirm={confirmDelete}
                title="Delete Registration"
                message="Are you sure you want to delete this registration popup? It will be immediately removed from the home page."
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
