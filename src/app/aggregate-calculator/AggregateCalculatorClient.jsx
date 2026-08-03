"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Instagram, Linkedin, Calculator, GraduationCap,
  BookOpen, FlaskConical, RotateCcw,
  ChevronDown, AlertCircle, Star, ArrowLeft,
} from "lucide-react";

/* ─── count-up hook ─── */
function useCountUp(target, duration = 1200, active = false) {
  const [value, setValue] = useState(0);
  const raf = useRef(null);
  useEffect(() => {
    if (!active) { setValue(0); return; }
    let t0 = null;
    const tick = (ts) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      setValue(parseFloat(((1 - Math.pow(1 - p, 3)) * target).toFixed(2)));
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else setValue(target);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration, active]);
  return value;
}

/* ─── compact input card ─── */
function InputCard({ label, icon: Icon, obtained, total, onObtained, onTotal, totalOptions, error }) {
  return (
    <div className={`rounded-xl border ${error ? "border-red-400 bg-red-50" : "border-slate-200 bg-white"} p-4 transition-all`}>
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-[#1e3a8a]">
          <Icon className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-bold text-slate-700">{label}</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Obtained</label>
          <input
            type="number" min="0" max={total} value={obtained}
            onChange={(e) => onObtained(e.target.value)}
            placeholder="e.g. 950"
            className={`w-full rounded-lg border ${error ? "border-red-300" : "border-slate-200"} bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/40 transition`}
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total</label>
          {totalOptions ? (
            <div className="relative">
              <select
                value={total} onChange={(e) => onTotal(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/40 transition pr-7 cursor-pointer"
              >
                {totalOptions.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
          ) : (
            <input type="number" value={total} readOnly
              className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-400 cursor-not-allowed" />
          )}
        </div>
      </div>
      {error && (
        <div className="mt-2 flex items-center gap-1 text-red-500">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span className="text-[11px] font-medium">{error}</span>
        </div>
      )}
    </div>
  );
}

export default function AggregateCalculator() {
  const [matric, setMatric] = useState({ obtained: "", total: "1100" });
  const [fsc, setFsc] = useState({ obtained: "", total: "1100" });
  const [test, setTest] = useState({ obtained: "", total: "50" });
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const [animating, setAnimating] = useState(false);

  const animated = useCountUp(result?.aggregate ?? 0, 1200, animating);

  const validate = useCallback(() => {
    const errs = {};
    const chk = (key, val, max, name) => {
      const v = String(val).trim();
      if (!v) { errs[key] = `${name} is required`; return; }
      const n = Number(v);
      if (isNaN(n) || n < 0) { errs[key] = "Must be \u2265 0"; return; }
      if (n > Number(max)) errs[key] = `Max is ${max}`;
    };
    chk("matric", matric.obtained, matric.total, "Matric marks");
    chk("fsc", fsc.obtained, fsc.total, "FSc marks");
    chk("test", test.obtained, test.total, "Test marks");
    return errs;
  }, [matric, fsc, test]);

  const calculate = () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const mp = (Number(matric.obtained) / Number(matric.total)) * 100;
    const fp = (Number(fsc.obtained) / Number(fsc.total)) * 100;
    const tp = (Number(test.obtained) / Number(test.total)) * 100;
    const ag = mp * 0.20 + fp * 0.30 + tp * 0.50;
    setResult({ mp, fp, tp, aggregate: parseFloat(ag.toFixed(2)) });
    setAnimating(false);
    setTimeout(() => setAnimating(true), 60);
  };

  const reset = () => {
    setMatric({ obtained: "", total: "1100" });
    setFsc({ obtained: "", total: "1100" });
    setTest({ obtained: "", total: "50" });
    setErrors({}); setResult(null); setAnimating(false);
  };

  const grade = (a) => {
    if (a >= 80) return "Excellent";
    if (a >= 65) return "Good";
    if (a >= 50) return "Average";
    return "Below Average";
  };

  return (
    <div className="min-h-screen mt-10 bg-slate-50">

      {/* ── Compact hero banner (darker shade to separate from navbar) ── */}
      <section className="bg-[#172e6b] border-b-2 border-white/10 pt-20 pb-7">
        <div className="max-w-5xl mx-auto px-5">
          <Link href="/" className="inline-flex items-center gap-1.5 text-blue-300 hover:text-white text-xs font-medium mb-4 transition">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative w-12 h-12 rounded-full border-2 border-white/25 shadow-lg overflow-hidden shrink-0 hidden sm:block">
              <Image src="/images/logo/cssfinallogo.jpeg" alt="CSS Logo" fill sizes="48px" className="object-cover" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-full px-3 py-1 mb-1">
                <GraduationCap className="w-3 h-3 text-blue-300" />
                <span className="text-blue-200 text-[10px] font-bold uppercase tracking-widest">University of Peshawar</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                Aggregate <span className="text-blue-300">Calculator</span>
              </h1>
            </div>

            {/* Weight pills */}
            <div className="sm:ml-auto flex gap-2 flex-wrap">
              {[
                { icon: BookOpen, label: "Matric", w: "20%" },
                { icon: GraduationCap, label: "FSc", w: "30%" },
                { icon: FlaskConical, label: "Test", w: "50%" },
              ].map(({ icon: I, label, w }) => (
                <div key={label} className="flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-full px-3 py-1.5">
                  <I className="w-3.5 h-3.5 text-blue-300" />
                  <span className="text-white text-xs font-black">{w}</span>
                  <span className="text-blue-300 text-xs">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Main calculator card ── */}
      <section className="max-w-5xl mx-auto px-5 py-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          {/* Input grid */}
          <div className="p-5 grid md:grid-cols-3 gap-3">
            <InputCard
              label="Matric Marks" icon={BookOpen}
              obtained={matric.obtained} total={matric.total}
              onObtained={(v) => { setMatric(p => ({ ...p, obtained: v })); setErrors(e => ({ ...e, matric: undefined })); }}
              onTotal={(v) => setMatric(p => ({ ...p, total: v }))}
              totalOptions={["1100", "1200"]} error={errors.matric}
            />
            <InputCard
              label="FSc / Intermediate" icon={GraduationCap}
              obtained={fsc.obtained} total={fsc.total}
              onObtained={(v) => { setFsc(p => ({ ...p, obtained: v })); setErrors(e => ({ ...e, fsc: undefined })); }}
              onTotal={(v) => setFsc(p => ({ ...p, total: v }))}
              totalOptions={["600", "1100", "1200"]} error={errors.fsc}
            />
            <InputCard
              label="Entry Test" icon={FlaskConical}
              obtained={test.obtained} total={test.total}
              onObtained={(v) => { setTest(p => ({ ...p, obtained: v })); setErrors(e => ({ ...e, test: undefined })); }}
              onTotal={null} totalOptions={null} error={errors.test}
            />
          </div>

          {/* Actions row */}
          <div className="px-5 pb-5 flex flex-col sm:flex-row gap-3">
            <button onClick={calculate}
              className="flex-1 flex items-center justify-center gap-2 bg-[#1e3a8a] hover:bg-[#172e6b] text-white font-bold py-3.5 rounded-xl text-sm shadow-md shadow-[#1e3a8a]/20 hover:-translate-y-0.5 active:translate-y-0 transition-all">
              <Calculator className="w-4 h-4" />
              Calculate Aggregate
            </button>
            <button onClick={reset}
              className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-bold py-3.5 px-5 rounded-xl text-sm hover:-translate-y-0.5 active:translate-y-0 transition-all">
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>

          {/* ── Inline result (no page scroll needed) ── */}
          {result && (
            <div className="border-t border-slate-100 bg-slate-50/70 p-5">
              <div className="grid sm:grid-cols-2 gap-5 items-center">

                {/* Aggregate number + bar */}
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Your Aggregate</p>
                  <div className="flex items-end gap-1">
                    <span className="text-6xl font-black text-[#1e3a8a] tabular-nums leading-none">{animated.toFixed(2)}</span>
                    <span className="text-xl font-bold text-[#1e3a8a]/50 mb-1">%</span>
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1.5 bg-[#1e3a8a]/10 rounded-full px-3 py-1">
                    <Star className="w-3 h-3 text-yellow-500" />
                    <span className="text-[#1e3a8a] text-xs font-bold">{grade(result.aggregate)}</span>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                      <span>0%</span>
                      <span className="font-bold text-[#1e3a8a]">{result.aggregate}%</span>
                      <span>100%</span>
                    </div>
                    <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-[#1e3a8a] transition-all duration-[1200ms] ease-out"
                        style={{ width: animating ? `${Math.min(result.aggregate, 100)}%` : "0%" }} />
                    </div>
                  </div>
                </div>

                {/* Breakdown mini cards */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Matric", val: result.mp, icon: BookOpen, w: "20%" },
                    { label: "FSc", val: result.fp, icon: GraduationCap, w: "30%" },
                    { label: "Test", val: result.tp, icon: FlaskConical, w: "50%" },
                  ].map(({ label, val, icon: I, w }) => (
                    <div key={label} className="bg-white rounded-xl border border-slate-200 p-3 text-center shadow-sm">
                      <div className="flex justify-center mb-1.5">
                        <div className="p-1.5 rounded-lg bg-[#1e3a8a]"><I className="w-3.5 h-3.5 text-white" /></div>
                      </div>
                      <p className="text-lg font-black text-slate-800 leading-tight">{parseFloat(val).toFixed(1)}%</p>
                      <p className="text-[9px] text-slate-400 font-semibold mt-0.5">{label} · {w}</p>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          )}
        </div>

        {/* Formula note */}
        <p className="text-center text-xs text-slate-400 mt-3">
          Formula: <span className="font-mono">(Matric% &times; 0.20) + (FSc% &times; 0.30) + (Test% &times; 0.50)</span>
        </p>
      </section>

      {/* ── Social footer ── */}
      <section className="bg-[#1e3a8a] py-10 px-5 mt-2">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-lg font-black text-white mb-1">Need more admission updates?</h2>
          <p className="text-blue-200 text-xs mb-6">Follow us on social media.</p>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/10 border border-white/15 p-4 text-left hover:bg-white/15 transition hover:-translate-y-0.5">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500 to-orange-400">
                  <Instagram className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-black text-xs">Instagram</p>
                  <p className="text-blue-200 text-[10px]">@css.dcs.uop</p>
                </div>
              </div>
              <a href="https://www.instagram.com/css.dcs.uop" target="_blank" rel="noopener noreferrer"
                className="block w-full text-center bg-gradient-to-r from-pink-600 to-orange-500 hover:from-pink-700 hover:to-orange-600 text-white text-xs font-bold py-2 rounded-lg transition">
                Follow on Instagram
              </a>
            </div>

            <div className="rounded-xl bg-white/10 border border-white/15 p-4 text-left hover:bg-white/15 transition hover:-translate-y-0.5">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-[#0077b5]">
                  <Linkedin className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-black text-xs">LinkedIn</p>
                  <p className="text-blue-200 text-[10px]">Computing Students Society</p>
                </div>
              </div>
              <a href="https://www.linkedin.com/company/computing-students-society/" target="_blank" rel="noopener noreferrer"
                className="block w-full text-center bg-[#0077b5] hover:bg-[#005e8b] text-white text-xs font-bold py-2 rounded-lg transition">
                Follow on LinkedIn
              </a>
            </div>
          </div>

          <p className="mt-7 text-blue-400/40 text-[10px]">
            &copy; {new Date().getFullYear()} Computing Students Society &middot; University of Peshawar
          </p>
        </div>
      </section>

    </div>
  );
}
