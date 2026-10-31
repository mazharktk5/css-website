"use client";

import { useCallback, useEffect, useState } from "react";
import {
    Sparkles, Plus, Pencil, Trash2, Upload, X, CheckCircle2,
    AlertCircle, Loader2, Download, ImageIcon,
} from "lucide-react";
import ImageUpload from "@/components/Admin/ImageUpload";
import TemplateDragEditor from "./TemplateDragEditor";
import CustomCertificateCanvas from "@/components/Certificates/CustomCertificateCanvas";

const defaultLayout = () => ({
    name: { x: 0.5, y: 0.45, size: 0.055, weight: "bold" },
    description: { enabled: true, x: 0.5, y: 0.56, maxWidth: 0.65, lineHeight: 0.038, size: 0.022 },
    signatures: [],
});

// Signature presets — blank role is NOT allowed here; "default" resolves to
// President (left, stamped on insert) + Patron / Dr Waheed (right, smart-match).
const SIGN_PRESETS = {
    default: { role: "Patron", name: "Dr Waheed ur Rehman", label: "Default — President left · Patron right" },
    se: { role: "SE Club Lead", name: "", label: "SE Club Lead" },
    ai: { role: "AI Club Lead", name: "", label: "AI Club Lead" },
    trainer: { role: "Trainer", name: "", label: "Trainer / Speaker" },
    custom: { role: "", name: "", label: "Custom signatory…" },
};

const slugify = (s) =>
    String(s || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const inputCls =
    "w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium";

const StatusBox = ({ status, onClear }) => {
    if (!status) return null;
    const ok = status.type === "success";
    return (
        <div className={`flex items-center gap-3 p-4 rounded-xl border ${ok
            ? "bg-green-500/10 border-green-500/20 text-green-400"
            : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
            {ok ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <p className="text-sm font-medium flex-1">{status.message}</p>
            <button type="button" onClick={onClear} className="opacity-60 hover:opacity-100">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export default function TemplateManager() {
    const getToken = () => (typeof window !== "undefined" ? localStorage.getItem("admin_token") : null);

    const [templates, setTemplates] = useState([]);
    const [loadingTemplates, setLoadingTemplates] = useState(true);
    const [batches, setBatches] = useState([]);
    const [loadingBatches, setLoadingBatches] = useState(true);

    // form: null (closed) | template object being created/edited
    const [form, setForm] = useState(null);
    const [isNew, setIsNew] = useState(false);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    // import panel
    const [importFor, setImportFor] = useState(null); // template object
    const [imp, setImp] = useState({
        eventName: "", description: "", preset: "default",
        rightSignatureName: "", rightSignatureRole: "", leadSignatureUrl: "",
    });
    const [pasteRows, setPasteRows] = useState("");
    const [importing, setImporting] = useState(false);
    const [importStatus, setImportStatus] = useState(null);

    // batch delete
    const [confirmBatch, setConfirmBatch] = useState(null);

    // batch edit (description + signatory fields across an issued batch)
    const [editBatch, setEditBatch] = useState(null);
    const [editForm, setEditForm] = useState({
        description: "", rightSignatureName: "", rightSignatureRole: "", leadSignatureUrl: "",
    });
    const [editSaving, setEditSaving] = useState(false);

    const fetchAll = useCallback(async () => {
        const token = getToken();
        try {
            const [tRes, bRes] = await Promise.all([
                fetch("/api/certificate-templates", { headers: { Authorization: `Bearer ${token}` } }),
                fetch("/api/certificates?adminType=custom", { headers: { Authorization: `Bearer ${token}` } }),
            ]);
            const tData = await tRes.json();
            const bData = await bRes.json();
            setTemplates(Array.isArray(tData) ? tData : []);
            setBatches(Array.isArray(bData) ? bData : []);
        } catch { /* network errors leave lists as-is */ }
        setLoadingTemplates(false);
        setLoadingBatches(false);
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    // ── Template CRUD ─────────────────────────────────────────────────────
    const openNew = () => {
        setForm({
            key: "", name: "",
            backgroundUrl: "", enabled: true, layout: defaultLayout(),
        });
        setIsNew(true);
        setStatus(null);
    };

    const openEdit = (t) => {
        setForm({
            _id: t._id,
            key: t.key,
            name: t.name,
            backgroundUrl: t.backgroundUrl,
            enabled: t.enabled !== false,
            layout: t.layout?.name ? t.layout : defaultLayout(),
        });
        setIsNew(false);
        setStatus(null);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.backgroundUrl) {
            setStatus({ type: "error", message: "Upload a background image first." });
            return;
        }
        const key = isNew ? (slugify(form.key) || slugify(form.name)) : form.key;
        if (!key) {
            setStatus({ type: "error", message: "Template key is required." });
            return;
        }
        setSaving(true);
        setStatus(null);
        try {
            const token = getToken();
            const payload = {
                key, name: form.name.trim(),
                backgroundUrl: form.backgroundUrl,
                enabled: form.enabled !== false,
                layout: form.layout,
            };
            const res = isNew
                ? await fetch("/api/certificate-templates", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify(payload),
                })
                : await fetch(`/api/certificate-templates/${form._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify(payload),
                });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to save template");
            setStatus({ type: "success", message: isNew ? "Template created." : "Template updated." });
            setForm(null);
            fetchAll();
            // One-flow issuance: jump straight into certificate creation
            // after creating a template (edits keep the list view).
            if (isNew && data?.key) {
                setImp(s => ({ ...s, eventName: "", description: "", preset: "default", rightSignatureName: "", rightSignatureRole: "", leadSignatureUrl: "" }));
                setPasteRows("");
                setImportStatus(null);
                setImportFor(data);
            }
        } catch (err) {
            setStatus({ type: "error", message: err.message || "Failed to save template." });
        }
        setSaving(false);
    };

    const handleDeleteTemplate = async (t) => {
        if (confirmDeleteId !== t._id) { setConfirmDeleteId(t._id); return; }
        setConfirmDeleteId(null);
        try {
            const token = getToken();
            const res = await fetch(`/api/certificate-templates/${t._id}`, {
                method: "DELETE", headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to delete template");
            if (form?._id === t._id) setForm(null);
            if (importFor?.key === t.key) setImportFor(null);
            fetchAll();
        } catch (err) {
            setStatus({ type: "error", message: err.message || "Failed to delete template." });
        }
    };

    // ── Certificate issuance for a template ─────────────────────────────────
    const resolveSig = () => {
        if (imp.preset === "custom") {
            return { role: imp.rightSignatureRole.trim(), name: imp.rightSignatureName.trim() };
        }
        const p = SIGN_PRESETS[imp.preset] || SIGN_PRESETS.default;
        return { role: p.role, name: p.name };
    };

    const validateIssue = () => {
        if (!imp.eventName.trim()) return "Event Name is required.";
        if (imp.preset === "custom" && !imp.rightSignatureRole.trim()) {
            return "Custom preset needs a role label (signature match).";
        }
        return null;
    };

    const submitRecords = async (records) => {
        const token = getToken();
        const res = await fetch("/api/certificates", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ records }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to import records");
        setImportStatus({ type: "success", message: `${records.length} certificates created with the "${importFor.name}" template!` });
        setImp({ eventName: "", description: "", preset: "default", rightSignatureName: "", rightSignatureRole: "", leadSignatureUrl: "" });
        setPasteRows("");
        fetchAll();
    };

    const buildRecord = (fullName, email, sig) => ({
        fullName,
        email: email.toLowerCase(),
        eventName: imp.eventName.trim(),
        description: imp.description.trim(),
        rightSignatureName: sig.name,
        rightSignatureRole: sig.role,
        leadSignatureUrl: imp.preset === "custom" ? imp.leadSignatureUrl : "",
        type: "custom",
        templateKey: importFor.key,
    });

    // ── CSV file import (header row: Name / Email columns) ──────────────
    const handleImportFile = () => (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const invalid = validateIssue();
        if (invalid) {
            setImportStatus({ type: "error", message: invalid });
            e.target.value = "";
            return;
        }

        setImporting(true);
        setImportStatus(null);

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

                const sig = resolveSig();
                const records = rows.slice(1).map(row => {
                    const cols = row.split(",").map(c => c.trim());
                    const fullName = cols[nameIdx];
                    const email = cols[emailIdx];
                    if (!fullName || !email) return null;
                    return buildRecord(fullName, email, sig);
                }).filter(Boolean);

                if (records.length === 0) throw new Error("No valid data rows found in CSV.");
                await submitRecords(records);
            } catch (err) {
                setImportStatus({ type: "error", message: err.message || "Failed to import." });
            }
            setImporting(false);
        };
        reader.readAsText(file);
        e.target.value = "";
    };

    // ── Direct paste import (one "Name, Email" per line, no file) ───────
    const handlePasteImport = async () => {
        const invalid = validateIssue();
        if (invalid) { setImportStatus({ type: "error", message: invalid }); return; }
        const lines = pasteRows.split("\n").map(l => l.trim()).filter(Boolean);
        if (lines.length === 0) {
            setImportStatus({ type: "error", message: "Paste at least one \"Name, Email\" line." });
            return;
        }
        setImporting(true);
        setImportStatus(null);
        try {
            const sig = resolveSig();
            const records = [];
            for (const line of lines) {
                const parts = line.split(",").map(p => p.trim());
                if (parts.length < 2) throw new Error(`Line "${line}" needs "Name, Email".`);
                // Tolerate both "Name, Email" and "Email, Name"
                const [a, b] = parts;
                const emailFirst = a.includes("@") && !b.includes("@");
                const email = emailFirst ? a : b;
                const fullName = emailFirst ? b : a;
                if (!fullName || !email.includes("@")) throw new Error(`Line "${line}" needs "Name, Email".`);
                records.push(buildRecord(fullName, email, sig));
            }
            await submitRecords(records);
        } catch (err) {
            setImportStatus({ type: "error", message: err.message || "Failed to import." });
        }
        setImporting(false);
    };

    const handleDeleteBatch = async (batch) => {
        if (confirmBatch !== batch._id) { setConfirmBatch(batch._id); return; }
        setConfirmBatch(null);
        try {
            const token = getToken();
            const res = await fetch(
                `/api/certificates?eventName=${encodeURIComponent(batch._id)}&type=custom`,
                { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to delete batch");
            fetchAll();
        } catch (err) {
            setStatus({ type: "error", message: err.message || "Failed to delete batch." });
        }
    };

    const openEditBatch = (b) => {
        setEditBatch(b);
        setEditForm({
            description: b.description || "",
            rightSignatureName: b.rightSignatureName || "",
            rightSignatureRole: b.rightSignatureRole || "",
            leadSignatureUrl: b.leadSignatureUrl || "",
        });
        setStatus(null);
    };

    const handleSaveBatch = async () => {
        if (!editBatch) return;
        setEditSaving(true);
        setStatus(null);
        try {
            const token = getToken();
            const res = await fetch("/api/certificates", {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ eventName: editBatch._id, type: "custom", updates: editForm }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to update batch");
            setStatus({ type: "success", message: `Batch updated — ${data.modifiedCount} certificate(s) refreshed.` });
            setEditBatch(null);
            fetchAll();
        } catch (err) {
            setStatus({ type: "error", message: err.message || "Failed to update batch." });
        }
        setEditSaving(false);
    };

    // ── Render ────────────────────────────────────────────────────────────
    return (
        <div className="pt-6 border-t border-white/[0.06]">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-500/10 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white">Special Event Templates</h2>
                        <p className="text-gray-500 text-sm mt-0.5">
                            Collaboration certificates — upload custom art, drag positions, then import attendees.
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={openNew}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-purple-600/20 text-sm"
                >
                    <Plus className="w-4 h-4" /> New Template
                </button>
            </div>

            <div className="space-y-4">
                <StatusBox status={status} onClear={() => setStatus(null)} />
                <StatusBox status={importStatus} onClear={() => setImportStatus(null)} />
            </div>

            {/* ── Create / Edit form ─────────────────────────────────────── */}
            {form && (
                <form onSubmit={handleSave} className="bg-white/[0.03] border border-white/[0.06] p-6 rounded-2xl mb-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-white">
                            {isNew ? "Create Template" : `Edit: ${form.name}`}
                        </h3>
                        <button type="button" onClick={() => setForm(null)} className="text-gray-400 hover:text-white transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Template Name</label>
                            <input
                                type="text" required
                                placeholder="e.g. TechRise 2026 Collaboration"
                                value={form.name}
                                onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                                className={inputCls}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
                                Key {isNew && <span className="normal-case tracking-normal font-medium text-gray-600">(auto from name if blank)</span>}
                            </label>
                            <input
                                type="text"
                                disabled={!isNew}
                                placeholder="techrise-2026"
                                value={form.key}
                                onChange={(e) => setForm(f => ({ ...f, key: e.target.value }))}
                                className={`${inputCls} disabled:opacity-50`}
                            />
                        </div>
                    </div>

                    <ImageUpload
                        label="Certificate Background (bake headings, logos, underlines & labels into this art)"
                        value={form.backgroundUrl}
                        onChange={(url) => setForm(f => ({ ...f, backgroundUrl: url }))}
                    />

                    {form.backgroundUrl && (
                        <TemplateDragEditor
                            backgroundUrl={form.backgroundUrl}
                            layout={form.layout}
                            onChange={(layout) => setForm(f => ({ ...f, layout }))}
                        />
                    )}

                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 text-sm disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                            {isNew ? "Create Template" : "Save Changes"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setForm(null)}
                            className="text-gray-400 hover:text-white text-sm font-bold transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* ── Create Certificates panel ──────────────────────────────── */}
            {importFor && (() => {
                const sig = resolveSig();
                const issueInvalid = !!validateIssue();
                return (
                    <div className="bg-white/[0.03] border border-purple-500/20 p-6 rounded-2xl mb-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <Upload className="w-4 h-4 text-purple-400" />
                                Create Certificates — <span className="text-purple-300">{importFor.name}</span>
                            </h3>
                            <button type="button" onClick={() => setImportFor(null)} className="text-gray-400 hover:text-white transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-6">
                            {/* ── Fields ── */}
                            <div className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Event Name (card title) *</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. TechRise 2026"
                                            value={imp.eventName}
                                            onChange={(e) => setImp(s => ({ ...s, eventName: e.target.value }))}
                                            className={inputCls}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Signatures</label>
                                        <select
                                            value={imp.preset}
                                            onChange={(e) => setImp(s => ({ ...s, preset: e.target.value }))}
                                            className={inputCls}
                                        >
                                            {Object.entries(SIGN_PRESETS).map(([k, p]) => (
                                                <option key={k} value={k}>{p.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Certificate Description (optional)</label>
                                    <textarea
                                        rows="3"
                                        placeholder='for participating in "...", organized by ... — leave empty to omit'
                                        value={imp.description}
                                        onChange={(e) => setImp(s => ({ ...s, description: e.target.value }))}
                                        className={`${inputCls} resize-none`}
                                    />
                                </div>

                                {imp.preset === "custom" ? (
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Signatory Name</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Mazhar Ahmad"
                                                value={imp.rightSignatureName}
                                                onChange={(e) => setImp(s => ({ ...s, rightSignatureName: e.target.value }))}
                                                className={inputCls}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Role Label (signature match) *</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. SE Club Lead"
                                                value={imp.rightSignatureRole}
                                                onChange={(e) => setImp(s => ({ ...s, rightSignatureRole: e.target.value }))}
                                                className={inputCls}
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <ImageUpload
                                                label="Lead Signature Override (optional)"
                                                value={imp.leadSignatureUrl}
                                                onChange={(url) => setImp(s => ({ ...s, leadSignatureUrl: url }))}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-[10px] text-blue-400 italic">
                                        Right signature: <span className="text-green-400 font-semibold">{sig.role}</span>
                                        {sig.name ? ` (${sig.name})` : ""} — auto-matched. President (Mazhar Ahmad) is stamped on the left automatically.
                                    </p>
                                )}
                            </div>

                            {/* ── Live preview (what will be issued) ── */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-purple-400">Live Preview</label>
                                <div className="rounded-xl overflow-hidden border border-white/10 bg-slate-100">
                                    <CustomCertificateCanvas
                                        fullName="Sample Recipient"
                                        description={imp.description || ""}
                                        leftSignatureName="Mazhar Ahmad"
                                        rightSignatureName={sig.name}
                                        rightSignatureRole={sig.role}
                                        leadSignatureUrl={imp.preset === "custom" ? imp.leadSignatureUrl : ""}
                                        presidentSignatureUrl="/images/signature/president_mazhar.jpeg"
                                        templateSnapshot={{ backgroundUrl: importFor.backgroundUrl, layout: importFor.layout }}
                                        isPreview={true}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ── Recipients: paste (direct) or CSV file ── */}
                        <div className="grid lg:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Paste recipients — one &quot;Name, Email&quot; per line</label>
                                <textarea
                                    rows="5"
                                    placeholder={"Ali Khan, ali@example.com\nSara Ahmed, sara@example.com"}
                                    value={pasteRows}
                                    onChange={(e) => setPasteRows(e.target.value)}
                                    className={`${inputCls} resize-none font-mono`}
                                />
                                <button
                                    type="button"
                                    onClick={handlePasteImport}
                                    disabled={importing || issueInvalid || !pasteRows.trim()}
                                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-purple-600/20 text-sm disabled:opacity-50"
                                >
                                    {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                    Create from pasted rows
                                </button>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">…or upload CSV (Name, Email columns)</label>
                                <label className={`flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-white font-bold px-5 py-4 rounded-xl transition-all text-sm cursor-pointer w-fit ${issueInvalid || importing ? "opacity-50 cursor-not-allowed" : ""}`}>
                                    {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                    Upload CSV
                                    <input
                                        type="file" accept=".csv" className="hidden"
                                        disabled={importing || issueInvalid}
                                        onChange={handleImportFile()}
                                    />
                                </label>
                                <p className="text-[10px] text-gray-500 italic mt-2">
                                    Re-importing the same event refreshes its layout snapshot (duplicates update, never double).
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* ── Template cards ────────────────────────────────────────── */}
            {loadingTemplates ? (
                <div className="flex items-center gap-3 text-gray-500 text-sm py-6">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading templates…
                </div>
            ) : templates.length === 0 ? (
                <div className="bg-white/[0.02] border border-dashed border-white/10 rounded-2xl p-10 text-center mb-6">
                    <ImageIcon className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">
                        No special-event templates yet. Create one to design a collaboration certificate
                        (e.g. TechRise) with its own artwork and signature slots.
                    </p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {templates.map(t => (
                        <div key={t._id} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
                            <div className="relative h-36 bg-slate-100">
                                <img src={t.backgroundUrl} alt={t.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-4 space-y-3">
                                <div>
                                    <h4 className="text-sm font-bold text-white truncate">{t.name}</h4>
                                    <p className="text-[11px] text-gray-500 font-mono mt-0.5">{t.key}</p>
                                    <p className="text-[11px] text-gray-500 mt-1">
                                        {t.layout?.signatures?.length || 0} signature slot(s)
                                        {t.enabled === false && <span className="text-red-400"> · disabled</span>}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => openEdit(t)}
                                        className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-blue-300 hover:text-blue-200 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg py-2 transition-all"
                                    >
                                        <Pencil className="w-3.5 h-3.5" /> Edit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setImportFor(t); setImportStatus(null); }}
                                        className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-purple-300 hover:text-purple-200 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-lg py-2 transition-all"
                                    >
                                        <Download className="w-3.5 h-3.5" /> Create Certs
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteTemplate(t)}
                                        className={`flex items-center justify-center gap-1.5 text-xs font-bold rounded-lg py-2 px-3 border transition-all ${confirmDeleteId === t._id
                                            ? "bg-red-500 text-white border-red-500"
                                            : "text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border-red-500/20"}`}
                                        title="Delete template (issued certificates keep their copy)"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        {confirmDeleteId === t._id ? "Sure?" : ""}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Batch edit panel ──────────────────────────────────────── */}
            {editBatch && (
                <div className="bg-white/[0.03] border border-blue-500/20 p-6 rounded-2xl mb-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Pencil className="w-4 h-4 text-blue-400" />
                            Edit batch — <span className="text-blue-300">{editBatch._id}</span>
                            <span className="text-gray-500 font-normal">({editBatch.count} cert(s), event name fixed)</span>
                        </h3>
                        <button type="button" onClick={() => setEditBatch(null)} className="text-gray-400 hover:text-white transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Description / Main Text</label>
                            <textarea
                                rows="3"
                                value={editForm.description}
                                onChange={(e) => setEditForm(f => ({ ...f, description: e.target.value }))}
                                className={`${inputCls} resize-none`}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Signatory Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Mazhar Ahmad"
                                value={editForm.rightSignatureName}
                                onChange={(e) => setEditForm(f => ({ ...f, rightSignatureName: e.target.value }))}
                                className={inputCls}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Role Label (blank → Patron)</label>
                            <input
                                type="text"
                                placeholder="Leave empty → Patron right"
                                value={editForm.rightSignatureRole}
                                onChange={(e) => setEditForm(f => ({ ...f, rightSignatureRole: e.target.value }))}
                                className={inputCls}
                            />
                        </div>
                        <div className="space-y-2">
                            <ImageUpload
                                label="Lead Signature Override (clear to auto-match)"
                                value={editForm.leadSignatureUrl}
                                onChange={(url) => setEditForm(f => ({ ...f, leadSignatureUrl: url }))}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={handleSaveBatch}
                            disabled={editSaving}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 text-sm disabled:opacity-50"
                        >
                            {editSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                            Save Batch
                        </button>
                        <button type="button" onClick={() => setEditBatch(null)} className="text-gray-400 hover:text-white text-sm font-bold transition-colors">
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* ── Custom batches table ──────────────────────────────────── */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white px-2">Imported Special Event Batches</h3>
                    <span className="text-xs text-gray-500 font-bold">{batches.length} Batch(es)</span>
                </div>
                {loadingBatches ? (
                    <div className="flex items-center gap-3 text-gray-500 text-sm p-5">
                        <Loader2 className="w-4 h-4 animate-spin" /> Loading…
                    </div>
                ) : batches.length === 0 ? (
                    <p className="text-gray-500 text-sm p-5">No custom certificate batches yet.</p>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-[10px] uppercase tracking-widest text-gray-500 border-b border-white/[0.06]">
                                <th className="px-5 py-3">Event</th>
                                <th className="px-5 py-3">Template</th>
                                <th className="px-5 py-3 text-center">Certs</th>
                                <th className="px-5 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {batches.map((b) => (
                                <tr key={b._id} className="border-b border-white/[0.04] last:border-0">
                                    <td className="px-5 py-3 text-white font-medium">{b._id}</td>
                                    <td className="px-5 py-3 text-gray-400 font-mono text-xs">{b.templateKey || "—"}</td>
                                    <td className="px-5 py-3 text-center text-gray-300">{b.count}</td>
                                    <td className="px-5 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => openEditBatch(b)}
                                                className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteBatch(b)}
                                                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${confirmBatch === b._id
                                                    ? "bg-red-500 text-white"
                                                    : "text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20"}`}
                                            >
                                                {confirmBatch === b._id ? "Confirm?" : "Delete"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
