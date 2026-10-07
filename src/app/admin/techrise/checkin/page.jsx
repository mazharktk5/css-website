"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import jsQR from "jsqr";
import AdminLayout from "@/components/Admin/AdminLayout";
import {
    QrCode, Camera, CameraOff, Loader2, CheckCircle2, AlertTriangle, XCircle,
    Search, ArrowLeft, ScanLine,
} from "lucide-react";

const TOKEN_RE = /^[a-f0-9]{32}$/;

export default function TechRiseCheckInPage() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const rafRef = useRef(0);
    const cooldownRef = useRef(0);

    const [cameraOn, setCameraOn] = useState(false);
    const [cameraError, setCameraError] = useState("");
    const [scanning, setScanning] = useState(false);
    const [manualInput, setManualInput] = useState("");
    const [busy, setBusy] = useState(false);
    const [feedback, setFeedback] = useState(null); // {type: 'ok'|'dup'|'error', title, lines[]}
    const [recent, setRecent] = useState([]);
    const [counts, setCounts] = useState({ total: 0, checkedIn: 0 });

    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

    const loadCounts = useCallback(async () => {
        try {
            const res = await fetch("/api/techrise/registrations?status=all", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) {
                setCounts(data.stats || { total: 0, checkedIn: 0 });
                const checked = (data.rows || [])
                    .filter((r) => r.checkedIn && r.checkedInAt)
                    .sort((a, b) => new Date(b.checkedInAt) - new Date(a.checkedInAt))
                    .slice(0, 12);
                setRecent(checked);
            }
        } catch { /* non-fatal */ }
    }, [token]);

    useEffect(() => {
        loadCounts();
        return () => stopCamera();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const checkIn = useCallback(async ({ token: qrToken, regId }) => {
        setBusy(true);
        try {
            const res = await fetch("/api/techrise/checkin", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(qrToken ? { token: qrToken } : { regId }),
            });
            const data = await res.json();
            if (!res.ok) {
                setFeedback({ type: "error", title: data.error || "Check-in failed", lines: [regId || ""] });
                return;
            }
            const r = data.registration;
            if (data.alreadyCheckedIn) {
                setFeedback({
                    type: "dup",
                    title: "Already Checked-In",
                    lines: [
                        `${r.name} (${r.regId})`,
                        r.checkedInAt ? `First entry: ${new Date(r.checkedInAt).toLocaleTimeString()}` : "",
                    ].filter(Boolean),
                });
            } else {
                setFeedback({ type: "ok", title: "Check-In Successful", lines: [`${r.name} (${r.regId})`, r.department || ""] });
                setRecent((prev) => [{ ...r, checkedInAt: new Date().toISOString() }, ...prev].slice(0, 12));
            }
            loadCounts();
        } catch {
            setFeedback({ type: "error", title: "Network error — try again", lines: [] });
        } finally {
            setBusy(false);
        }
    }, [token, loadCounts]);

    function handleDecode(data) {
        const now = Date.now();
        if (!data || now < cooldownRef.current) return;
        if (TOKEN_RE.test(data)) {
            cooldownRef.current = now + 4000;
            checkIn({ token: data });
        } else {
            cooldownRef.current = now + 2500;
            setFeedback({ type: "error", title: "Unrecognized QR code", lines: ["Not a TechRise '26 ticket"] });
        }
    }

    function scanLoop() {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            const w = video.videoWidth;
            const h = video.videoHeight;
            if (w && h) {
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext("2d", { willReadFrequently: true });
                ctx.drawImage(video, 0, 0, w, h);
                const image = ctx.getImageData(0, 0, w, h);
                const code = jsQR(image.data, w, h, { inversionAttempts: "dontInvert" });
                if (code?.data) handleDecode(code.data);
            }
        }
        rafRef.current = requestAnimationFrame(scanLoop);
    }

    async function startCamera() {
        setCameraError("");
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment", width: { ideal: 1280 } },
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }
            setCameraOn(true);
            setScanning(true);
            rafRef.current = requestAnimationFrame(scanLoop);
        } catch {
            setCameraError("Camera unavailable — grant camera permission or use manual entry below.");
            setCameraOn(false);
        }
    }

    function stopCamera() {
        cancelAnimationFrame(rafRef.current);
        const video = videoRef.current;
        if (video?.srcObject) {
            video.srcObject.getTracks().forEach((t) => t.stop());
            video.srcObject = null;
        }
        setCameraOn(false);
        setScanning(false);
    }

    function submitManual(e) {
        e.preventDefault();
        const value = manualInput.trim();
        if (!value || busy) return;
        if (TOKEN_RE.test(value)) checkIn({ token: value });
        else if (/^TR26-\d{1,6}$/i.test(value.toUpperCase())) checkIn({ regId: value.toUpperCase() });
        else setFeedback({ type: "error", title: "Invalid code", lines: ["Enter a TR26-#### ID or scan a ticket QR"] });
        setManualInput("");
    }

    const feedbackStyle = {
        ok: "border-emerald-500/30 bg-emerald-500/10",
        dup: "border-amber-500/30 bg-amber-500/10",
        error: "border-red-500/30 bg-red-500/10",
    };
    const feedbackIcon = { ok: CheckCircle2, dup: AlertTriangle, error: XCircle };
    const feedbackColor = { ok: "text-emerald-400", dup: "text-amber-400", error: "text-red-400" };

    return (
        <AdminLayout>
            <div className="bg-gradient-to-r from-blue-600/10 via-indigo-600/5 to-transparent border border-blue-500/10 rounded-2xl p-8 mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400">TechRise &rsquo;26</span>
                <div className="flex flex-wrap items-end justify-between gap-4 mt-2">
                    <div>
                        <h2 className="text-2xl font-black text-white">Check-In Scanner</h2>
                        <p className="text-gray-400 text-sm mt-1">
                            {counts.checkedIn} of {counts.total} attendees checked in
                        </p>
                    </div>
                    <Link
                        href="/admin/techrise"
                        className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white border border-white/[0.08] hover:border-white/20 px-4 py-2.5 rounded-lg transition"
                    >
                        <ArrowLeft size={14} /> Back to Dashboard
                    </Link>
                </div>
            </div>

            <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6">
                {/* Scanner column */}
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                            <ScanLine size={15} /> Live Scan
                        </h3>
                        <button
                            onClick={cameraOn ? stopCamera : startCamera}
                            disabled={busy}
                            className={`inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition ${
                                cameraOn
                                    ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                                    : "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:opacity-90"
                            }`}
                        >
                            {cameraOn ? <><CameraOff size={14} /> Stop Camera</> : <><Camera size={14} /> Start Camera</>}
                        </button>
                    </div>

                    <div className="relative aspect-video bg-black/60 rounded-xl overflow-hidden border border-white/[0.06]">
                        <video ref={videoRef} playsInline muted className="w-full h-full object-cover" />
                        <canvas ref={canvasRef} className="hidden" />
                        {!cameraOn && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-500">
                                <QrCode size={44} className="text-gray-600" />
                                <p className="text-sm px-6 text-center">
                                    {cameraError || "Start the camera and point it at a TechRise ticket QR code."}
                                </p>
                            </div>
                        )}
                        {cameraOn && (
                            <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute inset-x-10 inset-y-16 border-2 border-emerald-400/60 rounded-xl" />
                                {scanning && !busy && (
                                    <motion.div
                                        className="absolute left-10 right-10 h-0.5 bg-emerald-400 shadow-[0_0_12px_2px_rgba(52,211,153,0.7)]"
                                        initial={{ top: "4rem" }}
                                        animate={{ top: ["4rem", "calc(100% - 4rem)", "4rem"] }}
                                        transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
                                    />
                                )}
                            </div>
                        )}
                    </div>

                    {/* Manual entry */}
                    <form onSubmit={submitManual} className="mt-5">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
                            Manual entry (registration ID or token)
                        </label>
                        <div className="flex gap-2 mt-2">
                            <div className="relative flex-1">
                                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    value={manualInput}
                                    onChange={(e) => setManualInput(e.target.value)}
                                    placeholder="TR26-0001"
                                    className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={busy || !manualInput.trim()}
                                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-widest px-5 py-3 rounded-xl transition disabled:opacity-50"
                            >
                                {busy ? <Loader2 size={14} className="animate-spin" /> : <QrCode size={14} />} Check In
                            </button>
                        </div>
                    </form>

                    {/* Feedback */}
                    <AnimatePresence>
                        {feedback && (
                            <motion.div
                                key={feedback.title + (feedback.lines[0] || "")}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setFeedback(null)}
                                className={`mt-5 border rounded-xl p-5 cursor-pointer ${feedbackStyle[feedback.type]}`}
                            >
                                <div className="flex items-center gap-3">
                                    {(() => {
                                        const Icon = feedbackIcon[feedback.type];
                                        return <Icon size={22} className={feedbackColor[feedback.type]} />;
                                    })()}
                                    <div>
                                        <p className={`font-black uppercase tracking-wide text-sm ${feedbackColor[feedback.type]}`}>
                                            {feedback.title}
                                        </p>
                                        {feedback.lines.filter(Boolean).map((line) => (
                                            <p key={line} className="text-gray-300 text-sm mt-0.5">{line}</p>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Recent column */}
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Recent Check-Ins</h3>
                        <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-1 rounded-full">{recent.length}</span>
                    </div>
                    {recent.length === 0 ? (
                        <div className="p-8 text-center text-gray-600 text-sm">No check-ins yet.</div>
                    ) : (
                        <ul className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
                            {recent.map((r, i) => (
                                <li key={`${r.regId}-${i}`} className="flex items-center justify-between bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3">
                                    <div>
                                        <p className="text-white text-sm font-semibold">{r.name}</p>
                                        <p className="text-gray-500 text-xs">{r.regId}{r.department ? ` · ${r.department}` : ""}</p>
                                    </div>
                                    <span className="text-[10px] font-mono text-emerald-400">
                                        {r.checkedInAt ? new Date(r.checkedInAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
