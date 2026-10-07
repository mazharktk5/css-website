"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, AlertCircle, CheckCircle2, Users } from "lucide-react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[0-9+\-\s()]{7,20}$/;

function validate(form) {
    const errors = {};
    if (form.name.trim().length < 3 || form.name.trim().length > 100) errors.name = "Enter your full name (3-100 characters).";
    if (!EMAIL_RE.test(form.email.trim())) errors.email = "Enter a valid email address.";
    if (form.phone.trim() && !PHONE_RE.test(form.phone.trim())) errors.phone = "Enter a valid phone number.";
    if (form.institution.trim().length > 150) errors.institution = "Institution name is too long.";
    if (!form.department) errors.department = "Select your department.";
    if (!form.semester) errors.semester = "Select your semester.";
    return errors;
}

function Field({ label, error, children, required }) {
    return (
        <label className="block">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                {label} {required && <span className="text-red-400">*</span>}
            </span>
            <div className="mt-1.5">{children}</div>
            {error && (
                <span className="mt-1 flex items-center gap-1 text-xs text-red-500">
                    <AlertCircle size={12} /> {error}
                </span>
            )}
        </label>
    );
}

const inputCls =
    "w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14305E]/40 focus:border-[#14305E] transition";
const selectCls = inputCls + " appearance-none bg-[length:0]";

export default function TechRiseRegisterForm() {
    const router = useRouter();
    const [config, setConfig] = useState(null);
    const [form, setForm] = useState({
        name: "", email: "", phone: "", institution: "University of Peshawar",
        department: "", semester: "", communityPartner: "", hearSource: "", honeypot: "",
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState("");
    const [duplicate, setDuplicate] = useState(null);

    useEffect(() => {
        fetch("/api/techrise/config")
            .then((r) => r.json())
            .then(setConfig)
            .catch(() => setConfig({ registrationOpen: false }));
    }, []);

    const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

    async function handleSubmit(e) {
        e.preventDefault();
        setServerError("");
        setDuplicate(null);
        const clientErrors = validate(form);
        setErrors(clientErrors);
        if (Object.keys(clientErrors).length > 0) {
            document.getElementById("tr-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch("/api/techrise/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                router.push(`/techrise/ticket?tk=${encodeURIComponent(data.token)}`);
                return;
            }
            if (res.status === 409 && data.duplicate) {
                setDuplicate(data.regId || null);
                setServerError(data.error);
            } else {
                setServerError(data.error || "Registration failed, please try again.");
            }
        } catch {
            setServerError("Network error — please check your connection and try again.");
        } finally {
            setSubmitting(false);
        }
    }

    const closed = config && config.registrationOpen === false;

    if (!config) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 size={28} className="animate-spin text-[#14305E]" />
            </div>
        );
    }

    if (closed) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-10 max-w-md text-center shadow-sm">
                    <AlertCircle size={36} className="mx-auto text-slate-300" />
                    <h1 className="text-2xl font-black mt-5 text-slate-900">Registration Closed</h1>
                    <p className="text-slate-500 mt-3 text-sm">
                        Registration for {config.title} is not open right now. Check back soon!
                    </p>
                    <Link href="/techrise" className="inline-block mt-6 text-[#14305E] font-bold text-sm hover:underline">
                        ← Back to TechRise &rsquo;26
                    </Link>
                </div>
            </div>
        );
    }

    const options = config.options || {};

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 pt-32 pb-24">
            <div className="max-w-3xl mx-auto px-6">
                <Link
                    href="/techrise"
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-[#14305E] hover:underline mb-6"
                >
                    <ArrowLeft size={15} /> Back to TechRise &rsquo;26
                </Link>

                <motion.div
                    id="tr-form"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                >
                    <div className="text-center mb-8">
                        <span className="text-xs font-extrabold uppercase tracking-[0.3em] text-[#C8912A]">
                            Registration
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black mt-3 text-[#14305E]">
                            TechRise<span className="text-[#C8912A]">&rsquo;26</span>
                        </h1>
                        <p className="text-slate-500 mt-3 text-sm">
                            {config.dateLabel} · {config.venue}
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        noValidate
                        className="bg-white border border-slate-200 rounded-2xl p-6 md:p-9 shadow-sm space-y-5"
                    >
                        {serverError && (
                            <div
                                className={`rounded-xl px-4 py-3 text-sm border flex items-start gap-2 ${
                                    duplicate
                                        ? "bg-amber-50 border-amber-200 text-amber-700"
                                        : "bg-red-50 border-red-200 text-red-600"
                                }`}
                            >
                                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                                <span>
                                    {serverError}
                                    {duplicate && <> Your registration ID is <b>{duplicate}</b>.</>}
                                </span>
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-5">
                            <Field label="Full Name" required error={errors.name}>
                                <input
                                    type="text" value={form.name} onChange={set("name")}
                                    placeholder="e.g. Ahmed Khan" className={inputCls} autoComplete="name"
                                />
                            </Field>
                            <Field label="Email" required error={errors.email}>
                                <input
                                    type="email" value={form.email} onChange={set("email")}
                                    placeholder="you@example.com" className={inputCls} autoComplete="email"
                                />
                            </Field>
                            <Field label="Phone" error={errors.phone}>
                                <input
                                    type="tel" value={form.phone} onChange={set("phone")}
                                    placeholder="03XX-XXXXXXX" className={inputCls} autoComplete="tel"
                                />
                            </Field>
                            <Field label="Institution" error={errors.institution}>
                                <input
                                    type="text" value={form.institution} onChange={set("institution")}
                                    placeholder="University / College" className={inputCls}
                                />
                            </Field>
                            <Field label="Department" required error={errors.department}>
                                <select value={form.department} onChange={set("department")} className={selectCls}>
                                    <option value="">Select department…</option>
                                    {(options.departments || []).map((d) => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </Field>
                            <Field label="Semester" required error={errors.semester}>
                                <select value={form.semester} onChange={set("semester")} className={selectCls}>
                                    <option value="">Select semester…</option>
                                    {(options.semesters || []).map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </Field>
                            <Field label="Community Partner">
                                <select value={form.communityPartner} onChange={set("communityPartner")} className={selectCls}>
                                    <option value="">Not a partner / General attendee</option>
                                    {(options.partners || []).map((p) => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </Field>
                            <Field label="How did you hear about us?">
                                <select value={form.hearSource} onChange={set("hearSource")} className={selectCls}>
                                    <option value="">Select…</option>
                                    {(options.hearSources || []).map((h) => (
                                        <option key={h} value={h}>{h}</option>
                                    ))}
                                </select>
                            </Field>
                        </div>

                        {/* Honeypot — hidden from humans, catches naive bots */}
                        <div aria-hidden="true" className="absolute opacity-0 pointer-events-none h-0 overflow-hidden">
                            <label>
                                Leave this empty
                                <input
                                    type="text" name="honeypot" value={form.honeypot}
                                    onChange={set("honeypot")} tabIndex={-1} autoComplete="off"
                                />
                            </label>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100">
                            <p className="text-xs text-slate-400 flex items-center gap-1.5">
                                <Users size={13} /> You&apos;ll receive a unique ID and QR entry pass instantly.
                            </p>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#14305E] hover:bg-[#1B3A6B] text-white font-black text-sm uppercase tracking-widest px-8 py-4 rounded-xl shadow-lg shadow-[#14305E]/20 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {submitting ? (
                                    <><Loader2 size={16} className="animate-spin" /> Registering…</>
                                ) : (
                                    <>Register <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
                                )}
                            </button>
                        </div>

                        <p className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
                            <CheckCircle2 size={12} className="text-emerald-500" />
                            Instant confirmation — your pass appears right after registering.
                        </p>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
