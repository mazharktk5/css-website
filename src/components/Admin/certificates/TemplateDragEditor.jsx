"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Trash2, Eye, Move } from "lucide-react";
import ImageUpload from "@/components/Admin/ImageUpload";
import CustomCertificateCanvas from "@/components/Certificates/CustomCertificateCanvas";

const SAMPLE = {
    fullName: "Qazi Farhan Ahmad",
    description:
        'for participating in "TechRise 2026 — Innovation Challenge", organized by the Computing Students Society in collaboration with the Department of Computer Science.',
};

const noop = () => {};

const clamp01 = (v) => Math.min(0.98, Math.max(0.02, v));

const DEFAULT_LAYOUT = {
    name: { x: 0.5, y: 0.45, size: 0.055, weight: "bold" },
    description: { enabled: true, x: 0.5, y: 0.56, maxWidth: 0.65, lineHeight: 0.038, size: 0.022 },
    signatures: [],
};

export default function TemplateDragEditor({ backgroundUrl, layout, onChange }) {
    const boxRef = useRef(null);
    const dragRef = useRef(null);
    const [boxW, setBoxW] = useState(0);
    const [nat, setNat] = useState(null);
    const [showPreview, setShowPreview] = useState(true);

    const L = layout && layout.name ? layout : DEFAULT_LAYOUT;

    useEffect(() => {
        const el = boxRef.current;
        if (!el) return;
        const ro = new ResizeObserver(() => setBoxW(el.getBoundingClientRect().width));
        ro.observe(el);
        setBoxW(el.getBoundingClientRect().width);
        return () => ro.disconnect();
    }, []);

    const boxH = nat && boxW ? (boxW * nat.h) / nat.w : 0;

    const patch = (part, values) => {
        onChange({
            ...L,
            [part]: { ...(L[part] || {}), ...values },
        });
    };

    const patchSlot = (index, values) => {
        const signatures = (L.signatures || []).map((s, i) =>
            i === index ? { ...s, ...values } : s
        );
        onChange({ ...L, signatures });
    };

    const addSlot = () => {
        onChange({
            ...L,
            signatures: [
                ...(L.signatures || []),
                { x: 0.5, y: 0.8, width: 0.18, source: "president", imageUrl: "", label: "" },
            ],
        });
    };

    const removeSlot = (index) => {
        const signatures = (L.signatures || []).filter((_, i) => i !== index);
        onChange({ ...L, signatures });
    };

    // ── Drag handling (pointer capture → fraction coords) ────────────────
    const startDrag = (e, type, index = null) => {
        if (!boxRef.current) return;
        e.preventDefault();
        e.stopPropagation();
        const rect = boxRef.current.getBoundingClientRect();
        const px = clamp01((e.clientX - rect.left) / rect.width);
        const py = clamp01((e.clientY - rect.top) / rect.height);
        // Grab offset: keep the element under the cursor (no jump on
        // pointerdown) regardless of anchor (bottom/top anchored).
        const target =
            type === "slot" ? L.signatures[index] : L[type] || {};
        dragRef.current = { type, index, dx: px - (target.x ?? 0.5), dy: py - (target.y ?? 0.5) };
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const moveDrag = (e) => {
        const d = dragRef.current;
        if (!d || !boxRef.current) return;
        const rect = boxRef.current.getBoundingClientRect();
        const x = clamp01((e.clientX - rect.left) / rect.width - d.dx);
        const y = clamp01((e.clientY - rect.top) / rect.height - d.dy);
        if (d.type === "name") patch("name", { x, y });
        else if (d.type === "description") patch("description", { x, y });
        else patchSlot(d.index, { x, y });
    };

    const endDrag = (e) => {
        dragRef.current = null;
        try {
            e.currentTarget.releasePointerCapture(e.pointerId);
        } catch { /* pointer already released */ }
    };

    const dragHandlers = (type, index = null) => ({
        onPointerDown: (e) => startDrag(e, type, index),
        onPointerMove: moveDrag,
        onPointerUp: endDrag,
        onPointerCancel: endDrag,
    });

    const namePx = L.name.size * boxW;
    const descPx = (L.description?.size ?? 0.022) * boxW;
    const descLineH = (L.description?.lineHeight ?? 0.038) * boxH;

    return (
        <div className="space-y-4">
            {/* Side-by-side: drag target + live render (re-renders on every change) */}
            <div className={`grid gap-4 items-start ${backgroundUrl && showPreview ? "lg:grid-cols-2" : ""}`}>
            {/* ── Editable canvas ─────────────────────────────────────────── */}
            <div
                ref={boxRef}
                className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-100 select-none touch-none"
                style={nat ? { aspectRatio: `${nat.w} / ${nat.h}` } : undefined}
            >
                {backgroundUrl ? (
                    <img
                        src={backgroundUrl}
                        alt="Certificate background"
                        className="absolute inset-0 w-full h-full object-contain"
                        onLoad={(e) => setNat({ w: e.target.naturalWidth, h: e.target.naturalHeight })}
                        draggable={false}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400 uppercase tracking-widest">
                        Upload a background to start placing elements
                    </div>
                )}

                {backgroundUrl && boxW > 0 && (
                    <>
                        {/* Name (draggable) */}
                        <div
                            {...dragHandlers("name")}
                            className="absolute cursor-move rounded hover:outline hover:outline-2 hover:outline-blue-500/70 outline-offset-2"
                            style={{
                                left: `${L.name.x * 100}%`,
                                top: `${L.name.y * 100}%`,
                                transform: "translate(-50%, -100%)",
                                fontSize: `${namePx}px`,
                                fontWeight: L.name.weight === "bold" ? 700 : 400,
                                color: "#1e293b",
                                fontFamily: "'Poppins', sans-serif",
                                whiteSpace: "nowrap",
                                lineHeight: 1.1,
                            }}
                            title="Drag to position the name"
                        >
                            {SAMPLE.fullName}
                        </div>

                        {/* Description (draggable) */}
                        {L.description?.enabled !== false && boxH > 0 && (
                            <div
                                {...dragHandlers("description")}
                                className="absolute cursor-move rounded border border-dashed border-blue-400/70 bg-white/70 hover:outline hover:outline-2 hover:outline-blue-500/70 outline-offset-2"
                                style={{
                                    left: `${L.description.x * 100}%`,
                                    top: `${L.description.y * boxH - descPx}px`,
                                    transform: "translateX(-50%)",
                                    width: `${(L.description.maxWidth ?? 0.65) * 100}%`,
                                    fontSize: `${descPx}px`,
                                    lineHeight: `${descLineH}px`,
                                    fontWeight: 500,
                                    color: "#334155",
                                    fontFamily: "'Poppins', sans-serif",
                                    textAlign: "center",
                                }}
                                title="Drag to position the description"
                            >
                                {SAMPLE.description}
                            </div>
                        )}

                        {/* Signature slots (draggable) */}
                        {(L.signatures || []).map((slot, i) => (
                            <div
                                key={i}
                                {...dragHandlers("slot", i)}
                                className="absolute cursor-move"
                                style={{
                                    left: `${slot.x * 100}%`,
                                    top: `${slot.y * 100}%`,
                                    transform: "translate(-50%, -100%)",
                                    width: `${slot.width * 100}%`,
                                }}
                                title={`Drag to position signature ${i + 1}`}
                            >
                                {slot.source === "upload" && slot.imageUrl ? (
                                    <img
                                        src={slot.imageUrl}
                                        alt=""
                                        className="w-full h-auto rounded pointer-events-none"
                                        draggable={false}
                                    />
                                ) : slot.source === "none" ? (
                                    <div className="w-full h-6 border border-dashed border-slate-400 rounded" />
                                ) : (
                                    <div className="w-full h-16 sm:h-20 border-2 border-blue-400/80 bg-blue-500/10 rounded flex items-center justify-center text-[10px] sm:text-xs font-bold uppercase tracking-widest text-blue-700 pointer-events-none">
                                        {slot.source === "president" ? "President" : "Lead"}
                                    </div>
                                )}
                            </div>
                        ))}
                    </>
                )}
            </div>

            {/* ── Live render — updates as you drag / adjust ──────────────── */}
            {backgroundUrl && showPreview && (
                <div className="bg-white rounded-2xl p-4 shadow-xl">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                        Live render — what the certificate will look like
                    </p>
                    <CustomCertificateCanvas
                        fullName={SAMPLE.fullName}
                        description={L.description?.enabled === false ? "" : SAMPLE.description}
                        leftSignatureName="Mazhar Ahmad"
                        presidentSignatureUrl="/images/signature/president_mazhar.jpeg"
                        rightSignatureName="Preview Lead"
                        rightSignatureRole="SE Club Lead"
                        leadSignatureUrl=""
                        templateSnapshot={{ backgroundUrl, layout: L }}
                        isPreview={true}
                        onReady={noop}
                    />
                </div>
            )}
            </div>

            {/* ── Live render toggle ──────────────────────────────────────── */}
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={() => setShowPreview(v => !v)}
                    disabled={!backgroundUrl}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-xl text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <Eye className="w-4 h-4" />
                    {showPreview ? "Hide live render" : "Show live render"}
                </button>
                <span className="flex items-center gap-1.5 text-[11px] text-gray-500">
                    <Move className="w-3.5 h-3.5" /> Drag blocks directly on the image — positions are saved as percentages, so any image size works.
                </span>
            </div>

            {/* ── Controls ────────────────────────────────────────────────── */}
            <div className="grid md:grid-cols-2 gap-4">
                {/* Name + description sizing */}
                <div className="space-y-3 bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        Text Blocks <span className="normal-case tracking-normal font-medium text-gray-500">(drag them on the image)</span>
                    </p>
                    <label className="flex items-center gap-3 text-sm text-gray-300">
                        <span className="w-24 text-xs uppercase tracking-wider text-gray-500">Name style</span>
                        <select
                            value={L.name.weight === "normal" ? "normal" : "bold"}
                            onChange={(e) => patch("name", { weight: e.target.value })}
                            className="flex-1 bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        >
                            <option value="bold">Bold</option>
                            <option value="normal">Regular</option>
                        </select>
                    </label>
                    <label className="flex items-center gap-3 text-sm text-gray-300">
                        <span className="w-24 text-xs uppercase tracking-wider text-gray-500">Name size</span>
                        <input
                            type="range" min="0.02" max="0.09" step="0.002"
                            value={L.name.size}
                            onChange={(e) => patch("name", { size: Number(e.target.value) })}
                            className="flex-1 accent-blue-500"
                        />
                        <span className="w-10 text-right text-xs text-gray-400">{(L.name.size * 100).toFixed(1)}%</span>
                    </label>
                    <label className="flex items-center gap-3 text-sm text-gray-300">
                        <span className="w-24 text-xs uppercase tracking-wider text-gray-500 flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={L.description?.enabled !== false}
                                onChange={(e) => patch("description", { enabled: e.target.checked })}
                                className="accent-blue-500"
                            />
                            Desc
                        </span>
                        <input
                            type="range" min="0.012" max="0.04" step="0.001"
                            value={L.description?.size ?? 0.022}
                            onChange={(e) => patch("description", { size: Number(e.target.value) })}
                            disabled={L.description?.enabled === false}
                            className="flex-1 accent-blue-500 disabled:opacity-40"
                        />
                        <span className="w-10 text-right text-xs text-gray-400">{((L.description?.size ?? 0.022) * 100).toFixed(1)}%</span>
                    </label>
                    <label className="flex items-center gap-3 text-sm text-gray-300">
                        <span className="w-24 text-xs uppercase tracking-wider text-gray-500">Desc width</span>
                        <input
                            type="range" min="0.3" max="0.95" step="0.01"
                            value={L.description?.maxWidth ?? 0.65}
                            onChange={(e) => patch("description", { maxWidth: Number(e.target.value) })}
                            disabled={L.description?.enabled === false}
                            className="flex-1 accent-blue-500 disabled:opacity-40"
                        />
                        <span className="w-10 text-right text-xs text-gray-400">{Math.round((L.description?.maxWidth ?? 0.65) * 100)}%</span>
                    </label>
                    <label className="flex items-center gap-3 text-sm text-gray-300">
                        <span className="w-24 text-xs uppercase tracking-wider text-gray-500">Desc lines</span>
                        <input
                            type="range" min="0.028" max="0.06" step="0.002"
                            value={L.description?.lineHeight ?? 0.038}
                            onChange={(e) => patch("description", { lineHeight: Number(e.target.value) })}
                            disabled={L.description?.enabled === false}
                            className="flex-1 accent-blue-500 disabled:opacity-40"
                        />
                        <span className="w-10 text-right text-xs text-gray-400">{((L.description?.lineHeight ?? 0.038) * 100).toFixed(1)}%</span>
                    </label>
                </div>

                {/* Signature slots */}
                <div className="space-y-3 bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            Signature Slots ({(L.signatures || []).length})
                        </p>
                        <button
                            type="button"
                            onClick={addSlot}
                            className="flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            <Plus className="w-3.5 h-3.5" /> Add slot
                        </button>
                    </div>

                    {(L.signatures || []).length === 0 && (
                        <p className="text-xs text-gray-500 italic">
                            No signature slots yet. Add one for each signature line on your design.
                        </p>
                    )}

                    <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                        {(L.signatures || []).map((slot, i) => (
                            <div key={i} className="bg-white/[0.04] border border-white/[0.07] rounded-lg p-3 space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                        Slot {i + 1}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => removeSlot(i)}
                                        className="p-1 text-red-400 hover:text-red-300 transition-colors"
                                        title="Remove slot"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                <select
                                    value={slot.source}
                                    onChange={(e) => patchSlot(i, { source: e.target.value })}
                                    className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                >
                                    <option value="president">President (current, auto versioned)</option>
                                    <option value="lead">Lead / Organizer signature</option>
                                    <option value="upload">Uploaded fixed image</option>
                                    <option value="none">None (label is baked into art)</option>
                                </select>

                                {slot.source === "upload" && (
                                    <ImageUpload
                                        label="Signature image"
                                        value={slot.imageUrl || ""}
                                        onChange={(url) => patchSlot(i, { imageUrl: url })}
                                    />
                                )}

                                <label className="flex items-center gap-3 text-xs text-gray-400">
                                    <span className="w-14 uppercase tracking-wider text-gray-500 text-[10px]">Width</span>
                                    <input
                                        type="range" min="0.08" max="0.35" step="0.01"
                                        value={slot.width}
                                        onChange={(e) => patchSlot(i, { width: Number(e.target.value) })}
                                        className="flex-1 accent-blue-500"
                                    />
                                    <span className="w-9 text-right text-gray-400">{Math.round(slot.width * 100)}%</span>
                                </label>

                                {slot.source !== "upload" && slot.source !== "none" && (
                                    <label className="flex items-center gap-2 text-xs text-gray-400">
                                        <span className="uppercase tracking-wider text-gray-500 text-[10px]">Fallback name</span>
                                        <input
                                            type="text"
                                            value={slot.label || ""}
                                            onChange={(e) => patchSlot(i, { label: e.target.value })}
                                            placeholder="cursive text if image missing"
                                            className="flex-1 bg-white/[0.05] border border-white/[0.08] rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                        />
                                    </label>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
