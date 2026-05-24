"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/Admin/AdminLayout";
import { Upload, Trash2, Search, FileText, Download, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import ConfirmModal from "@/components/Admin/ConfirmModal";
import ImageUpload from "@/components/Admin/ImageUpload";

export default function AdminCertificates() {
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [importing, setImporting] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ open: false, eventName: null });
    const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: '' }

    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

    const fetchBatches = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/certificates", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setBatches(Array.isArray(data) ? data : []);
        } catch { /* ignore */ }
        setLoading(false);
    };

    useEffect(() => {
        fetchBatches();
    }, []);

    const [eventTitle, setEventTitle] = useState("");
    const [description, setDescription] = useState("");
    const [roleLead, setRoleLead] = useState("SE Club Lead");
    const [rightSignature, setRightSignature] = useState("");
    const [leadSignatureUrl, setLeadSignatureUrl] = useState("");

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!eventTitle || !description || !roleLead) {
            setStatus({ type: "error", message: "Please fill in required details (Title, Description, and Role) before uploading." });
            return;
        }

        setImporting(true);
        setStatus(null);

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const text = event.target.result;
                const rows = text.split("\n").filter(row => row.trim());

                const headerRow = rows[0].split(",").map(h => h.trim().toLowerCase());
                const emailIdx = headerRow.findIndex(h => h.includes("email"));
                const nameIdx = headerRow.findIndex(h => h.includes("name") || h.includes("full"));

                if (emailIdx === -1 || nameIdx === -1) {
                    throw new Error("Could not find 'Name' or 'Email' columns in CSV.");
                }

                const dataRows = rows.slice(1);
                const formattedRecords = dataRows.map(row => {
                    const cols = row.split(",").map(c => c.trim());
                    const name = cols[nameIdx];
                    const email = cols[emailIdx];

                    if (!name || !email) return null;

                    return {
                        fullName: name,
                        email: email.toLowerCase(),
                        eventName: eventTitle.trim(),
                        description: description.trim(),
                        rightSignatureName: rightSignature.trim(),
                        rightSignatureRole: roleLead.trim(),
                        leadSignatureUrl: leadSignatureUrl,
                    };
                }).filter(Boolean);

                if (formattedRecords.length === 0) {
                    throw new Error("No valid data rows found in CSV. Check your columns.");
                }

                const res = await fetch("/api/certificates", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ records: formattedRecords }),
                });

                if (res.ok) {
                    setStatus({ type: "success", message: `${formattedRecords.length} records imported successfully!` });
                    setEventTitle("");
                    setDescription("");
                    setRightSignature("");
                    setLeadSignatureUrl("");
                    fetchBatches();
                } else {
                    const error = await res.json();
                    setStatus({ type: "error", message: error.error || "Failed to import records", details: error.details });
                }
            } catch (err) {
                setStatus({ type: "error", message: err.message || "Error parsing CSV file." });
            }
            setImporting(false);
        };
        reader.readAsText(file);
    };

    const handleDelete = (eventName) => {
        setDeleteModal({ open: true, eventName, type: 'batch' });
    };

    const handleClearAll = () => {
        setDeleteModal({ open: true, eventName: "ALL CERTIFICATES", type: 'all' });
    };

    const confirmDelete = async () => {
        try {
            const url = deleteModal.type === 'all'
                ? "/api/certificates?clearAll=true"
                : `/api/certificates?eventName=${encodeURIComponent(deleteModal.eventName)}`;

            const res = await fetch(url, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const result = await res.json();
                setStatus({ type: "success", message: result.message || "Deletion successful" });
                // Force a fresh fetch from server to be 100% sure
                await fetchBatches();
                setDeleteModal({ open: false, eventName: null, type: null });
            } else {
                const err = await res.json();
                setStatus({ type: "error", message: err.error || "Failed to delete" });
            }
        } catch (err) {
            console.error("DELETE_CONFIRM_ERROR:", err);
            alert("An error occurred during deletion.");
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-black text-white">Certificates Management</h2>
                            <p className="text-gray-500 text-sm mt-1">Manage event participant data and certificate access.</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <label className={`flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 text-sm cursor-pointer ${(!eventTitle || !description || !roleLead) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                <Upload className="w-4 h-4" />
                                {importing ? "Importing..." : "Upload CSV"}
                                <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" disabled={importing || !eventTitle || !description || !roleLead} />
                            </label>
                        </div>
                    </div>

                    {/* Batch Settings */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 bg-white/[0.03] border border-white/[0.06] p-6 rounded-2xl">
                        <div className="md:col-span-2 lg:col-span-1 space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Event Name (e.g. Workshop)</label>
                            <input
                                type="text"
                                placeholder="Short Title for Search Cards"
                                value={eventTitle}
                                onChange={(e) => setEventTitle(e.target.value)}
                                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                            />
                        </div>
                        <div className="md:col-span-2 lg:col-span-2 space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Certificate Description / Main Text</label>
                            <textarea
                                rows="3"
                                placeholder='for attending the Session: "...", conducted by ..., organized by ...'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium resize-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Signatory Name (Lead / Chief Organizer)</label>
                            <input
                                type="text"
                                placeholder="e.g. Mazhar Ahmad  (or leave blank for CSS event)"
                                value={rightSignature}
                                onChange={(e) => setRightSignature(e.target.value)}
                                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Role Label (determines which signature appears)</label>
                            <input
                                type="text"
                                placeholder="e.g. SE Club Lead / AI Club Lead / Chief Organizer"
                                value={roleLead}
                                onChange={(e) => setRoleLead(e.target.value)}
                                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 opacity-40">President (Fixed)</label>
                            <div className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-gray-600 font-medium">
                                Muhammad Ilyas
                            </div>
                        </div>

                        <div className="md:col-span-2 lg:col-span-3">
                            <ImageUpload 
                                label="Lead / Organizer Signature (Overrides Auto-Match)"
                                value={leadSignatureUrl}
                                onChange={setLeadSignatureUrl}
                            />
                            <p className="text-[10px] text-blue-400 mt-2 italic px-2">
                                * Auto-match rules: &quot;<span className="text-green-400 font-semibold">SE Club Lead</span>&quot; → SE signature &nbsp;|&nbsp; &quot;<span className="text-green-400 font-semibold">AI Club Lead</span>&quot; → AI signature &nbsp;|&nbsp; &quot;<span className="text-green-400 font-semibold">Chief Organizer</span>&quot; (or &quot;General&quot;) → Chief Organizer signature. Upload an image here only to override.
                            </p>
                        </div>
                        <p className="md:col-span-2 lg:col-span-3 text-[10px] text-gray-500 italic">
                            * These details will be assigned to every student in the uploaded CSV.
                        </p>
                    </div>
                </div>

                {/* Status Message */}
                {status && (
                    <div className={`p-4 rounded-xl flex items-start gap-3 border ${status.type === "success"
                            ? "bg-green-500/10 border-green-500/20 text-green-400"
                            : "bg-red-500/10 border-red-500/20 text-red-400"
                        }`}>
                        {status.type === "success" ? <CheckCircle className="w-5 h-5 mt-0.5" /> : <XCircle className="w-5 h-5 mt-0.5" />}
                        <div>
                            <p className="text-sm font-bold">{status.type === "success" ? "Success" : "Error"}</p>
                            <p className="text-xs opacity-80">{status.message}</p>
                        </div>
                    </div>
                )}

                {/* Grouped Table */}
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
                    <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h3 className="text-sm font-bold text-white px-2">Uploaded Event Batches</h3>
                            <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-1 rounded-full uppercase tracking-tighter">
                                {batches.length} Event(s) Found
                            </span>
                        </div>

                        <button
                            onClick={handleClearAll}
                            className="text-[10px] font-bold text-red-400/60 hover:text-red-400 flex items-center gap-2 transition-colors px-3 py-1 bg-red-500/5 hover:bg-red-500/10 rounded-lg border border-red-500/10"
                        >
                            <Trash2 className="w-3 h-3" />
                            Clear All Certificates
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Event Title</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Students</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Description Preview</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Lead Info</th>
                                    <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="p-12 text-center">
                                            <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" />
                                        </td>
                                    </tr>
                                ) : batches.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-12 text-center text-gray-500">
                                            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                            No certificate batches found.
                                        </td>
                                    </tr>
                                ) : (
                                    batches.map((batch) => (
                                        <tr key={batch._id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-white font-bold">{batch._id}</span>
                                                    <span className="text-[10px] text-gray-500">Updated: {new Date(batch.lastUpdated).toLocaleDateString()}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-3 py-1 rounded-full border border-blue-500/20">
                                                    {batch.count} Students
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 max-w-[250px]">
                                                <p className="text-gray-400 text-xs line-clamp-1 italic">
                                                    {batch.description}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-white text-xs font-semibold">{batch.rightSignatureName}</span>
                                                    <span className="text-gray-500 text-[10px] leading-tight">{batch.rightSignatureRole}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(batch._id)}
                                                    className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors flex items-center gap-2 text-xs font-bold ml-auto"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    <span className="hidden md:inline">Delete Batch</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Instructions Card */}
                <div className="bg-blue-600/5 border border-blue-600/20 rounded-2xl p-6 flex gap-4">
                    <FileText className="w-6 h-6 text-blue-500 flex-shrink-0" />
                    <div className="space-y-2">
                        <h4 className="text-white font-bold text-sm">CSV Import Instructions</h4>
                        <p className="text-gray-400 text-xs leading-relaxed">
                            Your CSV file only needs 2 columns: <br />
                            <code className="text-blue-400 bg-blue-400/10 px-1 rounded">Name</code> and <code className="text-blue-400 bg-blue-400/10 px-1 rounded">Email</code>. <br />
                            The certificate text and signatures are set above for the whole batch.
                        </p>
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, eventName: null, type: null })}
                onConfirm={confirmDelete}
                title={deleteModal.type === 'all' ? "Clear All Database Records" : "Delete Event Batch"}
                message={deleteModal.type === 'all'
                    ? "ARE YOU SURE? This will permanently delete EVERY certificate record in the entire database. This action cannot be undone."
                    : `Are you sure you want to delete the entire batch for "${deleteModal.eventName}"? This will remove all student records belonging to this event.`
                }
            />
        </AdminLayout>
    );
}
