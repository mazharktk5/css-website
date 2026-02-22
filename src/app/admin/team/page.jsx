"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/Admin/AdminLayout";
import Image from "next/image";
import { Plus, Pencil, Trash2, X, Save, User } from "lucide-react";
import ConfirmModal from "@/components/Admin/ConfirmModal";
import ImageUpload from "@/components/Admin/ImageUpload";

const emptyMember = { name: "", role: "", subRole: "", image: "", section: "cabinet", order: 0 };

export default function AdminTeam() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyMember);
    const [saving, setSaving] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

    const fetchMembers = async () => {
        try {
            const res = await fetch("/api/team");
            const data = await res.json();
            setMembers(Array.isArray(data) ? data : []);
        } catch { /* ignore */ }
        setLoading(false);
    };

    useEffect(() => { fetchMembers(); }, []);

    const openAdd = () => { setEditing(null); setForm(emptyMember); setModalOpen(true); };
    const openEdit = (m) => { setEditing(m._id); setForm({ name: m.name, role: m.role, subRole: m.subRole || "", image: m.image, section: m.section, order: m.order || 0 }); setModalOpen(true); };

    const handleSave = async () => {
        setSaving(true);
        try {
            const body = { ...form, order: Number(form.order) };
            if (editing) {
                await fetch(`/api/team/${editing}`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(body) });
            } else {
                await fetch("/api/team", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(body) });
            }
            setModalOpen(false);
            fetchMembers();
        } catch { /* ignore */ }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        setDeleteModal({ open: true, id });
    };

    const confirmDelete = async () => {
        const id = deleteModal.id;
        await fetch(`/api/team/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
        fetchMembers();
    };

    const sections = ["executive", "cabinet", "clubs"];
    const sectionLabels = { executive: "Executive Board", cabinet: "Cabinet", clubs: "Club Leads" };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-white">Team Management</h2>
                        <p className="text-gray-500 text-sm mt-1">{members.length} total members</p>
                    </div>
                    <button onClick={openAdd} className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-600/20 text-sm">
                        <Plus className="w-4 h-4" /> Add Member
                    </button>
                </div>

                {loading ? (
                    <div className="p-12 text-center">
                        <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto" />
                    </div>
                ) : (
                    sections.map((section) => {
                        const sectionMembers = members.filter((m) => m.section === section);
                        if (sectionMembers.length === 0) return null;
                        return (
                            <div key={section} className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">{sectionLabels[section]}</h3>
                                    <div className="flex-1 h-px bg-white/[0.06]" />
                                    <span className="text-xs text-gray-600">{sectionMembers.length} members</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {sectionMembers.map((member) => (
                                        <div key={member._id} className="group bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/[0.12] transition-all">
                                            <div className="relative h-40 bg-white/[0.02]">
                                                <Image src={member.image || "/images/team/placeholder.jpg"} alt={member.name} fill className="object-cover" />
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                                                    <button onClick={() => openEdit(member)} className="p-2.5 bg-white/10 rounded-xl hover:bg-blue-500/30 text-white transition-all">
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(member._id)} className="p-2.5 bg-white/10 rounded-xl hover:bg-red-500/30 text-white transition-all">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <p className="text-white font-semibold text-sm">{member.name}</p>
                                                <p className="text-xs text-blue-400 font-bold uppercase tracking-wider mt-1">{member.role}</p>
                                                {member.subRole && <p className="text-xs text-gray-500 mt-1">{member.subRole}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-[#111827] border border-white/[0.08] rounded-2xl w-full max-w-lg shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                            <h3 className="text-lg font-black text-white">{editing ? "Edit Member" : "Add Member"}</h3>
                            <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-white/[0.05] rounded-lg text-gray-400"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 space-y-5">
                            <TInput label="Full Name" icon={<User className="w-4 h-4" />} value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                            <TInput label="Role / Title" value={form.role} onChange={(v) => setForm({ ...form, role: v })} placeholder="e.g. President, AI Lead" />
                            <TInput label="Sub Role (optional)" value={form.subRole} onChange={(v) => setForm({ ...form, subRole: v })} placeholder="e.g. Chairman, Dept. of CS" />
                            <ImageUpload label="Member Photo" value={form.image} onChange={(url) => setForm({ ...form, image: url })} />
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Section</label>
                                    <select
                                        value={form.section}
                                        onChange={(e) => setForm({ ...form, section: e.target.value })}
                                        className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm appearance-none"
                                    >
                                        <option value="executive" className="bg-gray-800">Executive Board</option>
                                        <option value="cabinet" className="bg-gray-800">Cabinet</option>
                                        <option value="clubs" className="bg-gray-800">Club Leads</option>
                                    </select>
                                </div>
                                <TInput label="Order" type="number" value={form.order} onChange={(v) => setForm({ ...form, order: v })} />
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/[0.06]">
                            <button onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/[0.05] transition-all">Cancel</button>
                            <button
                                onClick={handleSave}
                                disabled={saving || !form.name || !form.role}
                                className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-600/20 text-sm disabled:opacity-50"
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
                title="Delete Team Member"
                message="Are you sure you want to delete this team member? This will remove them from the public team page."
            />
        </AdminLayout>
    );
}

function TInput({ label, value, onChange, type = "text", placeholder = "", icon }) {
    return (
        <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</label>
            <div className="relative">
                {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">{icon}</div>}
                <input type={type} value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
                    className={`w-full bg-white/[0.05] border border-white/[0.08] rounded-xl ${icon ? "pl-11" : "pl-4"} pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm`}
                />
            </div>
        </div>
    );
}
