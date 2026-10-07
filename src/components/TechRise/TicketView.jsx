"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Download, Loader2, AlertCircle, QrCode, CalendarDays, MapPin, CheckCircle2, Copy, Share2, Ticket,
    ImagePlus, X, UserCircle2,
} from "lucide-react";
import { FaLinkedinIn } from "react-icons/fa6";
import { renderTicket, renderStory, downloadCanvas, loadImage, stripNearWhite, TICKET_W, TICKET_H, STORY_W, STORY_H } from "./ticketArt";

const MAX_PHOTO_BYTES = 8 * 1024 * 1024; // 8MB

function openPopup(url) {
    return window.open(url, "_blank", "popup=yes,width=680,height=720,noopener,noreferrer");
}

function canvasToBlob(canvas) {
    return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}

async function copyImageToClipboard(canvas) {
    try {
        const blob = await canvasToBlob(canvas);
        if (!blob || !window.ClipboardItem) return false;
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        return true;
    } catch {
        return false;
    }
}

export default function TicketView({ token }) {
    const ticketRef = useRef(null);
    const storyRef = useRef(null);
    const photoUrlRef = useRef(null);
    const [state, setState] = useState("loading"); // loading | error | ready
    const [error, setError] = useState("");
    const [data, setData] = useState(null);
    const [assets, setAssets] = useState(null);
    const [photoImg, setPhotoImg] = useState(null);
    const [photoError, setPhotoError] = useState("");
    const [photoSaving, setPhotoSaving] = useState(false);
    const [rendering, setRendering] = useState(true);
    const [toast, setToast] = useState("");

    useEffect(() => {
        if (!token) {
            setState("error");
            setError("This ticket link is missing or incomplete.");
            return;
        }
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch(`/api/techrise/lookup?token=${encodeURIComponent(token)}`);
                const json = await res.json();
                if (!res.ok) throw new Error(json.error || "Ticket not found");
                if (cancelled) return;
                setData({ ...json, token });
                setState("ready");
                if (json.photoUrl) {
                    loadImage(json.photoUrl).then((img) => { if (!cancelled) setPhotoImg(img); }).catch(() => {});
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.message || "Ticket not found");
                    setState("error");
                }
            }
        })();
        return () => { cancelled = true; };
    }, [token]);

    // Load the static brand assets once per ticket.
    useEffect(() => {
        if (state !== "ready" || !data) return;
        let cancelled = false;
        (async () => {
            try {
                const [wordmarkImg, ticketImg, cssLogoImg, deptLogoImg, youthLogoImg] = await Promise.all([
                    loadImage("/images/techrise/wordmark.png"),
                    loadImage("/images/techrise/ticket.jpg"),
                    loadImage("/images/logo/cssfinallogo.jpeg"),
                    loadImage("/images/logo/department-logo.png"),
                    loadImage("/images/logo/youth-affairs-logo.png"),
                ]);
                if (cancelled) return;
                // The CSS logo is a flattened JPEG with its own white backing —
                // key it out so it sits on the share card's band like the others.
                setAssets({ wordmarkImg, ticketImg, cssLogoImg: stripNearWhite(cssLogoImg), deptLogoImg, youthLogoImg });
            } catch (err) {
                console.error("ticket asset load:", err);
                if (!cancelled) setError("Failed to load ticket graphics.");
            }
        })();
        return () => { cancelled = true; };
    }, [state, data]);

    // Render both canvases whenever assets, data, or the attendee's photo change.
    useEffect(() => {
        if (!assets || !data) return;
        let cancelled = false;
        setRendering(true);
        (async () => {
            try {
                const registerUrl = `${window.location.origin}/techrise`;
                await renderStory(storyRef.current, { ...data, registerUrl, photoImg, ...assets });
                await renderTicket(ticketRef.current, { ...data, posterImg: assets.ticketImg, wordmarkImg: assets.wordmarkImg });
                if (!cancelled) setRendering(false);
            } catch (err) {
                console.error("ticket render:", err);
                if (!cancelled) {
                    setRendering(false);
                    setError("Failed to render your ticket graphics.");
                }
            }
        })();
        return () => { cancelled = true; };
    }, [assets, data, photoImg]);

    // Draws instantly from the local file, then uploads it so organisers can
    // see it in the admin dashboard alongside the rest of the registration.
    async function handlePhotoChange(e) {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;
        setPhotoError("");

        if (!file.type.startsWith("image/")) {
            setPhotoError("Please choose an image file (JPG, PNG, WebP).");
            return;
        }
        if (file.size > MAX_PHOTO_BYTES) {
            setPhotoError("Image is too large — please pick one under 8MB.");
            return;
        }

        const url = URL.createObjectURL(file);
        try {
            const img = await loadImage(url);
            if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current);
            photoUrlRef.current = url;
            setPhotoImg(img);
        } catch {
            URL.revokeObjectURL(url);
            setPhotoError("Couldn't read that image — please try another file.");
            return;
        }

        setPhotoSaving(true);
        try {
            const formData = new FormData();
            formData.append("token", token);
            formData.append("file", file);
            const res = await fetch("/api/techrise/photo", { method: "POST", body: formData });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || "Upload failed");
        } catch (err) {
            setPhotoError(err.message || "Couldn't save your photo — it still shows on the card below.");
        } finally {
            setPhotoSaving(false);
        }
    }

    function handleRemovePhoto() {
        if (photoUrlRef.current) {
            URL.revokeObjectURL(photoUrlRef.current);
            photoUrlRef.current = null;
        }
        setPhotoImg(null);
        setPhotoError("");
    }

    useEffect(() => () => {
        if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current);
    }, []);

    function showToast(msg) {
        setToast(msg);
        setTimeout(() => setToast(""), 2600);
    }

    function handleDownload(canvasRef, label) {
        const canvas = canvasRef.current;
        if (!canvas || rendering) return;
        downloadCanvas(canvas, `TechRise26_${label}_${data.regId}.png`);
    }

    // Native share sheet (WhatsApp/Instagram/etc.) — the main sharing path on
    // mobile, where most registrants will be viewing this page.
    async function handleNativeShare() {
        const canvas = storyRef.current;
        if (!canvas || rendering) return;
        try {
            const blob = await canvasToBlob(canvas);
            const file = blob && new File([blob], `TechRise26_${data.regId}.png`, { type: "image/png" });
            if (file && navigator.canShare?.({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: "I'm attending TechRise '26!",
                    text: "Join me at TechRise '26 — Learn, Connect, Rise. Register free:",
                });
                return;
            }
        } catch (err) {
            if (err?.name === "AbortError") return;
        }
        downloadCanvas(canvas, `TechRise26_Share_${data.regId}.png`);
        showToast("Image downloaded — post it to WhatsApp Status or Instagram Stories!");
    }

    async function handleLinkedIn() {
        if (rendering) return;
        const copied = await copyImageToClipboard(storyRef.current);
        openPopup(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${window.location.origin}/techrise`)}`);
        showToast(
            copied
                ? "Card copied — paste it (Ctrl+V) into your LinkedIn post!"
                : "LinkedIn opened — download the card to attach it."
        );
    }

    if (state === "loading") {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
                <Loader2 size={30} className="animate-spin text-[#14305E]" />
                <p className="text-slate-400 text-sm">Loading your pass…</p>
            </div>
        );
    }

    if (state === "error") {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-10 max-w-md text-center shadow-sm">
                    <AlertCircle size={36} className="mx-auto text-red-300" />
                    <h1 className="text-2xl font-black mt-5 text-slate-900">Ticket Not Found</h1>
                    <p className="text-slate-500 mt-3 text-sm">{error}</p>
                    <div className="flex gap-3 justify-center mt-7">
                        <Link href="/techrise/register" className="bg-[#14305E] text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-[#1B3A6B] transition">
                            Register Now
                        </Link>
                        <Link href="/techrise" className="border border-slate-200 text-slate-600 font-bold text-sm px-6 py-3 rounded-xl hover:bg-slate-50 transition">
                            Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 pt-32 pb-24">
            <div className="max-w-5xl mx-auto px-6">
                <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    {/* Success header */}
                    <div className="text-center">
                        <span className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">
                            <CheckCircle2 size={14} /> Registration Confirmed
                        </span>
                        <h1 className="font-display text-4xl md:text-5xl font-extrabold mt-5 text-[#14305E]">
                            You&rsquo;re in! 🎉
                        </h1>
                        <p className="text-slate-500 mt-3">
                            Pa Meena Pakhair Raghley, <b className="text-slate-700">{data.name}</b> — see you at TechRise &rsquo;26.
                        </p>
                    </div>

                    {/* Summary chips */}
                    <div className="flex flex-wrap justify-center gap-3 mt-7">
                        <span className="bg-[#14305E] text-[#C8912A] font-black px-5 py-2.5 rounded-xl text-lg tracking-wide">
                            {data.regId}
                        </span>
                        <span className="bg-white border border-slate-200 text-slate-600 font-bold px-4 py-2.5 rounded-xl text-sm inline-flex items-center gap-2">
                            <CalendarDays size={15} /> {data.event.dateLabel}
                        </span>
                        <span className="bg-white border border-slate-200 text-slate-600 font-bold px-4 py-2.5 rounded-xl text-sm inline-flex items-center gap-2">
                            <MapPin size={15} /> {data.event.venue}
                        </span>
                    </div>

                    {/* HERO: shareable "I'm Attending" card — this drives sign-ups, so it leads */}
                    <div className="mt-10 grid md:grid-cols-[300px_1fr] gap-6 items-start">
                        <div>
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Your &ldquo;I&rsquo;m Attending&rdquo; Card</h2>
                            <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm">
                                <canvas
                                    ref={storyRef}
                                    style={{ width: "100%", display: rendering ? "none" : "block", borderRadius: 10 }}
                                    aria-label="TechRise 26 I'm attending share card"
                                />
                                {rendering && <div className="h-72 flex items-center justify-center"><Loader2 size={24} className="animate-spin text-[#14305E]" /></div>}
                            </div>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <h3 className="font-display font-extrabold text-[#14305E] uppercase tracking-wide">Personalise your card</h3>
                            <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                                Add a photo for a personal touch, or skip it — we&rsquo;ll show a neat initials
                                badge instead. Your photo is saved with your registration (visible only to CSS
                                organisers) so it&rsquo;s ready if you reopen this page later.
                            </p>
                            <div className="flex flex-wrap items-center gap-3 mt-4">
                                <label className="inline-flex items-center gap-2 bg-[#14305E] hover:bg-[#1B3A6B] text-white font-bold text-xs uppercase tracking-widest px-4 py-3 rounded-xl transition active:scale-95 cursor-pointer">
                                    {photoSaving ? <Loader2 size={15} className="animate-spin" /> : <ImagePlus size={15} />}
                                    {photoImg ? "Change Photo" : "Add Photo"}
                                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} disabled={photoSaving} />
                                </label>
                                {photoImg && (
                                    <button
                                        onClick={handleRemovePhoto}
                                        className="inline-flex items-center gap-1.5 text-slate-500 hover:text-red-500 font-bold text-xs uppercase tracking-widest px-3 py-3 transition"
                                    >
                                        <X size={14} /> Remove
                                    </button>
                                )}
                                {!photoImg && (
                                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                                        <UserCircle2 size={15} /> Using initials badge
                                    </span>
                                )}
                            </div>
                            {photoError && (
                                <p className="text-xs text-red-500 mt-2 flex items-center gap-1.5"><AlertCircle size={12} /> {photoError}</p>
                            )}

                            <h3 className="font-display font-extrabold text-[#14305E] uppercase tracking-wide mt-6 pt-5 border-t border-slate-100">Share the hype</h3>
                            <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                                Post your card to your WhatsApp Status or Instagram Story and tag{" "}
                                <b className="text-slate-700">@cssuop</b> — it carries a scannable link so your
                                friends can register in one tap. The card shows only your name, photo and
                                registration ID, never your phone, email or entry QR.
                            </p>

                            {/* Primary: native share sheet (WhatsApp/Instagram/etc.) */}
                            <button
                                onClick={handleNativeShare}
                                disabled={rendering}
                                className="w-full mt-5 inline-flex items-center justify-center gap-2.5 bg-[#14305E] hover:bg-[#1B3A6B] text-white font-black text-sm uppercase tracking-wide px-5 py-4 rounded-xl transition active:scale-95 disabled:opacity-50"
                            >
                                <Share2 size={17} /> Share Now
                            </button>
                            <p className="text-xs text-slate-400 mt-2">Opens your device&rsquo;s share sheet — pick WhatsApp, Instagram or any app.</p>

                            {/* Secondary actions */}
                            <div className="flex flex-wrap gap-3 mt-4">
                                <button
                                    onClick={() => handleDownload(storyRef, "Share")}
                                    disabled={rendering}
                                    className="inline-flex items-center gap-2 bg-[#C8912A] hover:bg-[#d6a33c] text-[#14305E] font-black text-xs uppercase tracking-widest px-5 py-3.5 rounded-xl transition active:scale-95 disabled:opacity-50"
                                >
                                    <Download size={15} /> Download PNG
                                </button>
                                <button
                                    onClick={handleLinkedIn}
                                    disabled={rendering}
                                    className="inline-flex items-center gap-2 bg-[#0A66C2] hover:bg-[#08549e] text-white font-black text-xs uppercase tracking-widest px-5 py-3.5 rounded-xl transition active:scale-95 disabled:opacity-50"
                                >
                                    <FaLinkedinIn size={14} /> LinkedIn
                                </button>
                            </div>

                            <div className="mt-6 pt-5 border-t border-slate-100 text-sm text-slate-500 space-y-2">
                                <p className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Every share has a QR + link your friends can use to register.</p>
                                <p className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Screenshot this page or bookmark the link to reopen your pass anytime.</p>
                            </div>
                        </div>
                    </div>

                    {/* SECONDARY: entry ticket — functional, for the door, no need to share */}
                    <div className="mt-12">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 inline-flex items-center gap-1.5">
                                <Ticket size={13} /> Entry Pass (for the door)
                            </h2>
                            {rendering && <span className="text-xs text-slate-400 inline-flex items-center gap-1.5"><Loader2 size={12} className="animate-spin" /> Rendering…</span>}
                        </div>
                        <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm overflow-x-auto max-w-2xl">
                            <canvas
                                ref={ticketRef}
                                style={{ width: "100%", display: rendering ? "none" : "block", borderRadius: 10 }}
                                aria-label="TechRise 26 entry ticket"
                            />
                            {rendering && <div className="h-56 md:h-80 flex items-center justify-center"><Loader2 size={26} className="animate-spin text-[#14305E]" /></div>}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 mt-3">
                            <button
                                onClick={() => handleDownload(ticketRef, "Ticket")}
                                disabled={rendering}
                                className="inline-flex items-center gap-2 bg-[#14305E] hover:bg-[#1B3A6B] text-white font-black text-xs uppercase tracking-widest px-5 py-3 rounded-xl transition active:scale-95 disabled:opacity-50"
                            >
                                <Download size={14} /> Ticket PNG
                            </button>
                            <p className="text-xs text-slate-400 flex items-center gap-1.5">
                                <QrCode size={13} /> This QR is a one-time check-in token — keep it private, bring it on event day.
                            </p>
                        </div>
                    </div>

                    <div className="text-center mt-12">
                        <Link href="/techrise" className="text-[#14305E] font-bold text-sm hover:underline">
                            ← Back to TechRise &rsquo;26
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Toast */}
            {toast && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#14305E] text-white text-sm font-bold px-5 py-3 rounded-xl shadow-xl z-50 inline-flex items-center gap-2">
                    <Copy size={14} /> {toast}
                </div>
            )}
        </div>
    );
}
