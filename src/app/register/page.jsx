"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ClipboardList, Loader2, AlertCircle, User, Mail, GraduationCap, Building2, Layers, ShieldCheck, ChevronDown, Hash } from "lucide-react";

const emptyForm = {
    name: "",
    email: "",
    university: "",
    universityOther: "",
    department: "",
    departmentOther: "",
    program: "",
    programOther: "",
    semester: "",
    website: "", // honeypot — humans never see or fill this
};

const UNIVERSITY_OPTIONS = ["University of Peshawar", "Other"];
const DEPARTMENT_OPTIONS = ["Department of Computer Science", "Other"];
const PROGRAM_OPTIONS = [
    "BS Computer Science",
    "BS Artificial Intelligence",
    "BS Data Science",
    "BS Software Engineering",
    "Other",
];
const SEMESTER_OPTIONS = ["1", "2", "3", "4", "5", "6", "7", "8"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const resolveChoice = (value, other) => (value === "Other" ? other.trim() : value);

export default function RegisterPage() {
    const [eventId, setEventId] = useState("");
    const [eventTitle, setEventTitle] = useState("");
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);

    useEffect(() => {
        const id = new URLSearchParams(window.location.search).get("event");
        if (!id) return;
        setEventId(id);
        fetch(`/api/events/${encodeURIComponent(id)}`)
            .then((r) => (r.ok ? r.json() : null))
            .then((ev) => { if (ev?.title) setEventTitle(ev.title); })
            .catch(() => { /* generic form without title */ });
    }, []);

    const set = (field) => (e) => {
        setForm((f) => ({ ...f, [field]: e.target.value }));
        setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const validate = () => {
        const errs = {};
        if (form.name.trim().length < 2) errs.name = "Please enter your full name.";
        if (!EMAIL_RE.test(form.email.trim())) errs.email = "Please enter a valid email address.";
        if (!form.university) errs.university = "Please select your university.";
        else if (form.university === "Other" && !form.universityOther.trim()) errs.universityOther = "Please type your university.";
        if (!form.department) errs.department = "Please select your department.";
        else if (form.department === "Other" && !form.departmentOther.trim()) errs.departmentOther = "Please type your department.";
        if (!form.program) errs.program = "Please select your program.";
        else if (form.program === "Other" && !form.programOther.trim()) errs.programOther = "Please type your program.";
        if (!form.semester) errs.semester = "Please select your semester.";
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length) return;

        const university = resolveChoice(form.university, form.universityOther);
        const department = resolveChoice(form.department, form.departmentOther);
        const program = resolveChoice(form.program, form.programOther);

        setSubmitting(true);
        setServerError("");
        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name.trim(),
                    email: form.email.trim(),
                    university,
                    department,
                    program,
                    semester: form.semester,
                    eventId,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                // Show resolved values ("Other" → typed text) on the success card
                setForm((f) => ({ ...f, name: f.name.trim(), email: f.email.trim(), university, department, program }));
                setDone(true);
            } else setServerError(data.error || "Something went wrong. Please try again.");
        } catch {
            setServerError("Network error. Please check your connection and try again.");
        }
        setSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-white relative overflow-hidden">
            {/* ── Background: brand orbs + dot grid (site design language) ── */}
            <div aria-hidden className="absolute inset-0 -z-10 hidden sm:block">
                <div className="absolute -top-40 -right-40 w-[560px] h-[560px] bg-[#1e3a8a]/10 rounded-full blur-[130px]" />
                <div className="absolute -bottom-52 -left-40 w-[520px] h-[520px] bg-indigo-500/10 rounded-full blur-[130px]" />
                <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle,_#000_1px,_transparent_1px)] bg-[size:40px_40px]" />
            </div>

            {/* ── Top bar ── */}
            <div className="relative max-w-xl mx-auto px-6 pt-6 pb-2 flex items-center justify-between">
                <Link
                    href={eventId ? `/events/${eventId}` : "/"}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-[#1e3a8a] transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Link>
                <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-slate-400">
                    <span className="w-6 h-6 rounded-md bg-[#1e3a8a] text-white text-[10px] font-black flex items-center justify-center">C</span>
                    Computing Students Society
                </span>
            </div>

            <div className="relative flex items-start sm:items-center justify-center py-8 sm:py-12 px-4">
                <div className="w-full max-w-xl">

                    <div className="animate-reg-card bg-white rounded-[28px] border border-slate-200/80 shadow-[0_24px_70px_-24px_rgba(15,23,42,0.28)] overflow-hidden">
                        {/* ── Solid crest header ── */}
                        <div className="relative bg-[#1e3a8a] px-6 sm:px-8 py-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center">
                                    <ClipboardList className="w-6 h-6 text-white" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200/90">
                                        {eventTitle ? "Event Registration" : "Registration Form"}
                                    </p>
                                    <h1 className="text-white font-black text-lg sm:text-xl leading-snug tracking-tight truncate">
                                        {eventTitle || "Register with CSS"}
                                    </h1>
                                </div>
                            </div>
                        </div>

                        {done ? (
                            /* ── Success state ── */
                            <div className="px-6 sm:px-8 py-9 text-center">
                                <div className="relative w-20 h-20 mx-auto mb-6">
                                    <span aria-hidden className="animate-reg-ring absolute inset-0 rounded-full bg-emerald-400/40" />
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 shadow-lg shadow-emerald-500/30 flex items-center justify-center">
                                        <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10">
                                            <path
                                                d="M4.5 12.5l5 5 10-11"
                                                stroke="white"
                                                strokeWidth="2.75"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="animate-reg-check"
                                            />
                                        </svg>
                                    </div>
                                </div>

                                <div className="animate-reg-fade-up" style={{ animationDelay: "0.35s" }}>
                                    <h2 className="text-2xl font-black tracking-tight text-slate-900">Registration confirmed</h2>
                                    <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
                                        {eventTitle ? (
                                            <>You&apos;re on the list for <span className="font-bold text-slate-800">{eventTitle}</span>.</>
                                        ) : (
                                            <>Your details have been recorded. No further steps needed.</>
                                        )}
                                    </p>
                                </div>

                                {/* Submitted summary */}
                                <div className="animate-reg-fade-up mt-6 text-left bg-slate-50 border border-slate-100 rounded-2xl p-1.5" style={{ animationDelay: "0.5s" }}>
                                    <SummaryRow label="Name" value={form.name} />
                                    <SummaryRow label="Email" value={form.email} />
                                    <SummaryRow label="Program" value={`${form.program}${form.semester ? ` · Semester ${form.semester}` : ""}`} />
                                    <SummaryRow label="University" value={form.university} />
                                    <SummaryRow label="Department" value={form.department} last />
                                </div>

                                <div className="animate-reg-fade-up mt-6" style={{ animationDelay: "0.62s" }}>
                                    <Link
                                        href={eventId ? `/events/${eventId}` : "/"}
                                        className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#1e3a8a] hover:bg-[#163172] text-white font-bold text-sm transition-all shadow-lg shadow-blue-900/20"
                                    >
                                        Done
                                    </Link>
                                    <p className="mt-3.5 text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                        Your details are stored securely for this event only.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            /* ── Form ── */
                            <div className="px-6 sm:px-8 pt-6 pb-7">
                                {serverError && (
                                    <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-sm">
                                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
                                        <span className="font-medium">{serverError}</span>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} noValidate>
                                    {/* Two fields per row — whole form fits one screen */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3.5">
                                        <Field id="reg-name" label="Full Name" icon={User} value={form.name} onChange={set("name")} error={errors.name} placeholder="e.g. Ali Khan" autoComplete="name" delay="0.05s" />
                                        <Field id="reg-email" label="Email Address" type="email" icon={Mail} value={form.email} onChange={set("email")} error={errors.email} placeholder="you@example.com" autoComplete="email" delay="0.1s" />
                                        <SelectField
                                            id="reg-university" label="University" icon={Building2}
                                            value={form.university} onChange={set("university")}
                                            options={UNIVERSITY_OPTIONS} placeholder="Select university"
                                            error={errors.university || errors.universityOther} delay="0.15s"
                                            extra={form.university === "Other" && (
                                                <input
                                                    type="text" value={form.universityOther} onChange={set("universityOther")}
                                                    placeholder="Type your university…" aria-label="Specify your university"
                                                    className={`mt-2 w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${errors.universityOther ? "border-red-300 focus:ring-red-100" : "border-slate-200 focus:border-[#1e3a8a]/40 focus:ring-blue-100"}`}
                                                />
                                            )}
                                        />
                                        <SelectField
                                            id="reg-department" label="Department" icon={Layers}
                                            value={form.department} onChange={set("department")}
                                            options={DEPARTMENT_OPTIONS} placeholder="Select department"
                                            error={errors.department || errors.departmentOther} delay="0.2s"
                                            extra={form.department === "Other" && (
                                                <input
                                                    type="text" value={form.departmentOther} onChange={set("departmentOther")}
                                                    placeholder="Type your department…" aria-label="Specify your department"
                                                    className={`mt-2 w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${errors.departmentOther ? "border-red-300 focus:ring-red-100" : "border-slate-200 focus:border-[#1e3a8a]/40 focus:ring-blue-100"}`}
                                                />
                                            )}
                                        />
                                        <SelectField
                                            id="reg-program" label="Program" icon={GraduationCap}
                                            value={form.program} onChange={set("program")}
                                            options={PROGRAM_OPTIONS} placeholder="Select program"
                                            error={errors.program || errors.programOther} delay="0.25s"
                                            extra={form.program === "Other" && (
                                                <input
                                                    type="text" value={form.programOther} onChange={set("programOther")}
                                                    placeholder="Type your program…" aria-label="Specify your program"
                                                    className={`mt-2 w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${errors.programOther ? "border-red-300 focus:ring-red-100" : "border-slate-200 focus:border-[#1e3a8a]/40 focus:ring-blue-100"}`}
                                                />
                                            )}
                                        />
                                        <SelectField
                                            id="reg-semester" label="Semester" icon={Hash}
                                            value={form.semester} onChange={set("semester")}
                                            options={SEMESTER_OPTIONS} placeholder="Select semester"
                                            error={errors.semester} delay="0.3s"
                                        />
                                    </div>

                                    {/* Honeypot — hidden from humans, catches bots */}
                                    <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
                                        <label htmlFor="reg-website">Website</label>
                                        <input
                                            id="reg-website"
                                            type="text"
                                            tabIndex={-1}
                                            autoComplete="off"
                                            value={form.website}
                                            onChange={set("website")}
                                        />
                                    </div>

                                    {/* WhatsApp channel — join for updates */}
                                    <a
                                        href="https://whatsapp.com/channel/0029VbDwVIFGk1FwOdYMTp0W"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 w-full p-3 mt-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors group"
                                    >
                                        <span className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center shrink-0 shadow-sm">
                                            <WhatsAppIcon className="w-5 h-5 text-white" />
                                        </span>
                                        <span className="min-w-0 text-left">
                                            <span className="block text-sm font-bold text-emerald-900">Join our WhatsApp channel</span>
                                            <span className="block text-xs text-emerald-700/80">Get updates about future events &amp; sessions</span>
                                        </span>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-auto w-4 h-4 text-emerald-600 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                                            <path d="M7 17L17 7M9 7h8v8" />
                                        </svg>
                                    </a>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full py-3.5 mt-4 rounded-xl bg-[#1e3a8a] hover:bg-[#163172] text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-blue-900/20 hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:translate-y-0 disabled:shadow-none"
                                    >
                                        {submitting ? (
                                            <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
                                        ) : (
                                            "Complete Registration"
                                        )}
                                    </button>

                                    <p className="text-[11px] text-slate-400 text-center leading-relaxed mt-3">
                                        Used only to organize this event — never shared.
                                    </p>
                                </form>
                            </div>
                        )}
                    </div>

                    <p className="text-center text-[11px] text-slate-400 mt-5 font-medium">
                        © {new Date().getFullYear()} Computing Students Society · University of Peshawar
                    </p>
                </div>
            </div>
        </div>
    );
}

function Field({ id, label, value, onChange, error, type = "text", icon: Icon, placeholder = "", autoComplete, delay }) {
    return (
        <div className="animate-reg-fade-up" style={{ animationDelay: delay }}>
            <label htmlFor={id} className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1.5">
                {label}
            </label>
            <div className="relative">
                <input
                    id={id}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    className={`w-full rounded-xl border bg-white pl-11 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-all focus:outline-none focus:ring-2 ${
                        error
                            ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                            : "border-slate-200 focus:border-[#1e3a8a]/40 focus:ring-blue-100"
                    }`}
                />
                <Icon
                    className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
                        error ? "text-red-400" : "text-slate-400"
                    }`}
                />
            </div>
            {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
        </div>
    );
}

function SelectField({ id, label, value, onChange, error, options, placeholder = "Select…", icon: Icon, delay, extra }) {
    return (
        <div className="animate-reg-fade-up" style={{ animationDelay: delay }}>
            <label htmlFor={id} className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1.5">
                {label}
            </label>
            <div className="relative">
                <select
                    id={id}
                    value={value}
                    onChange={onChange}
                    aria-label={label}
                    className={`w-full appearance-none rounded-xl border bg-white pl-11 pr-9 py-3 text-sm transition-all focus:outline-none focus:ring-2 ${
                        value ? "text-slate-900" : "text-slate-400"
                    } ${
                        error
                            ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                            : "border-slate-200 focus:border-[#1e3a8a]/40 focus:ring-blue-100"
                    }`}
                >
                    <option value="">{placeholder}</option>
                    {options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
                <Icon
                    className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
                        error ? "text-red-400" : "text-slate-400"
                    }`}
                />
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            {extra}
            {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
        </div>
    );
}

function WhatsAppIcon({ className }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
        </svg>
    );
}

function SummaryRow({ label, value, last }) {
    return (
        <div className={`flex items-baseline justify-between gap-4 px-3.5 py-2.5 ${last ? "" : "border-b border-slate-100"}`}>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 shrink-0">{label}</span>
            <span className="text-sm font-semibold text-slate-800 text-right break-words min-w-0">{value}</span>
        </div>
    );
}
