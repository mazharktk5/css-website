"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/Admin/AdminLayout";
import Image from "next/image";
import { Plus, Pencil, Trash2, X, Save, ImageIcon } from "lucide-react";
import ConfirmModal from "@/components/Admin/ConfirmModal";

const emptyItem = { eventName: "", category: "", image: "", description: "" };

export default function AdminGallery() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyItem);
    const [saving, setSaving] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

    const fetchItems = async () => {
        try {
            const res = await fetch("/api/gallery");
            const data = await res.json();
            setItems(Array.isArray(data) ? data : []);
        } catch { /* ignore */ }
        setLoading(false);
    };

    useEffect(() => { fetchItems(); }, []);

    const openAdd = () => { setEditing(null); setForm(emptyItem); setModalOpen(true); };

    const openEdit = (item) => {
        setEditing(item._id);
        setForm({ eventName: item.eventName, category: item.category, image: item.image, description: item.description });
        setModalOpen(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (editing) {
                await fetch(`/api/gallery/${editing}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify(form),
                });
            } else {
                await fetch("/api/gallery", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify(form),
                });
            }
            setModalOpen(false);
            fetchItems();
        } catch { /* ignore */ }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        setDeleteModal({ open: true, id });
    };

    const confirmDelete = async () => {
        const id = deleteModal.id;
        await fetch(`/api/gallery/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        fetchItems();
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-white">Gallery Management</h2>
                        <p className="text-gray-500 text-sm mt-1">{items.length} total images</p>
                    </div>
                    <button onClick={openAdd} className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-violet-600/20 text-sm">
                        <Plus className="w-4 h-4" /> Add Image
                    </button>
                </div>

                {/* Gallery Grid */}
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto" />
                    </div>
                ) : items.length === 0 ? (
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-12 text-center text-gray-500">
                        No gallery items found. Click &quot;Add Image&quot; to get started.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {items.map((item) => (
                            <div key={item._id} className="group bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/[0.12] transition-all duration-300">
                                <div className="relative h-44 bg-white/[0.02]">
                                    <Image src={item.image} alt={item.eventName} fill className="object-cover" />
                                    {/* Overlay actions */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                                        <button onClick={() => openEdit(item)} className="p-2.5 bg-white/10 rounded-xl hover:bg-blue-500/30 text-white transition-all">
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(item._id)} className="p-2.5 bg-white/10 rounded-xl hover:bg-red-500/30 text-white transition-all">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <p className="text-white font-semibold text-sm truncate">{item.eventName}</p>
                                    <span className="text-xs text-gray-500">{item.category}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-[#111827] border border-white/[0.08] rounded-2xl w-full max-w-lg shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                            <h3 className="text-lg font-black text-white">{editing ? "Edit Gallery Item" : "Add Gallery Item"}</h3>
                            <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-white/[0.05] rounded-lg text-gray-400">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            <GInput label="Event Name" value={form.eventName} onChange={(v) => setForm({ ...form, eventName: v })} />
                            <GInput label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} placeholder="e.g. Workshop, Bootcamp, Games" />
                            <GInput label="Image Path" icon={<ImageIcon className="w-4 h-4" />} value={form.image} onChange={(v) => setForm({ ...form, image: v })} placeholder="/images/gallery/..." />
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Description</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    rows={3}
                                    className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all resize-none text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/[0.06]">
                            <button onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/[0.05] transition-all">Cancel</button>
                            <button
                                onClick={handleSave}
                                disabled={saving || !form.eventName || !form.category || !form.image}
                                className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-violet-600/20 text-sm disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {saving ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, id: null })}
                onConfirm={confirmDelete}
                title="Delete Gallery Item"
                message="Are you sure you want to delete this gallery item? This action will remove the image from the website gallery."
            />
        </AdminLayout>
    );
}

function GInput({ label, value, onChange, type = "text", placeholder = "", icon }) {
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
                    className={`w-full bg-white/[0.05] border border-white/[0.08] rounded-xl ${icon ? "pl-11" : "pl-4"} pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all text-sm`}
                />
            </div>
        </div>
    );
}
