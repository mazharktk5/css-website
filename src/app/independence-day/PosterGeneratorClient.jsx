"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Upload, RefreshCcw, Check, Star, ArrowLeft } from "lucide-react";
import Link from "next/link";

const W = 1080;
const H = 1080;

const TEMPLATES = [
    { id: "savera", name: "Naya Savera", hint: "Dark green · sparkles" },
    { id: "dil", name: "Dil Hai Pakistan", hint: "Hex pattern · festive" },
    { id: "pehchan", name: "Meri Pehchan", hint: "White · clean" },
    { id: "azaadi", name: "Azaadi Mubarak", hint: "Ivory · vintage" },
    { id: "cssazaadi", name: "CSS Azaadi", hint: "CSS · Pakistan" },
    { id: "parcham", name: "Parcham", hint: "Pakistan flag" },
];

// ─── Canvas helpers ────────────────────────────────────────────────────────

/** Returns an offscreen canvas with just the crescent (no background bleed) */
function makeCrescent(moonR, color) {
    const pad = Math.ceil(moonR * 0.25);
    const size = (moonR + pad) * 2;
    const c = document.createElement("canvas");
    c.width = size;
    c.height = size;
    const ctx = c.getContext("2d");
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(moonR + pad, moonR + pad, moonR, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(moonR + pad + moonR * 0.34, moonR + pad - moonR * 0.07, moonR * 0.8, 0, Math.PI * 2);
    ctx.fill();
    return { canvas: c, offset: moonR + pad }; // offset = centre point inside canvas
}

function drawStar(ctx, cx, cy, outerR, color) {
    const points = 5;
    const innerR = outerR * 0.42;
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const angle = (i * Math.PI) / points - Math.PI / 2;
        if (i === 0) ctx.moveTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
        else ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
    }
    ctx.closePath();
    ctx.fill();
}

/** Draw crescent centred at (cx, cy) */
function drawCrescent(ctx, cx, cy, moonR, color) {
    const { canvas, offset } = makeCrescent(moonR, color);
    ctx.drawImage(canvas, cx - offset, cy - offset);
}

function clipCircle(ctx, cx, cy, r, fn) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
    fn(ctx);
    ctx.restore();
}

/** Shrinks font until text fits maxWidth */
function fitFont(ctx, text, maxWidth, maxPx, style) {
    let px = maxPx;
    ctx.font = `${style} ${px}px Georgia, serif`;
    while (ctx.measureText(text).width > maxWidth && px > 24) {
        px -= 2;
        ctx.font = `${style} ${px}px Georgia, serif`;
    }
}

function drawPhoto(ctx, photo, cx, cy, r, ringColor, ringW) {
    if (photo) {
        clipCircle(ctx, cx, cy, r, (c) =>
            c.drawImage(photo, cx - r, cy - r, r * 2, r * 2)
        );
    } else {
        // Placeholder silhouette
        ctx.fillStyle = "rgba(255,255,255,0.07)";
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.18)";
        ctx.font = `${r * 0.75}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("☆", cx, cy);
        ctx.textBaseline = "alphabetic";
    }
    ctx.strokeStyle = ringColor;
    ctx.lineWidth = ringW;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
}

// ─── Template 1: Emerald Pride ─────────────────────────────────────────────

// ─── Pakistan-themed template helpers ─────────────────────────────────────

const SPARKLE_POS = [
    [90, 160, 18], [960, 130, 14], [185, 885, 12], [900, 820, 16],
    [55, 505, 10], [1038, 450, 12], [285, 92, 14], [805, 970, 10],
    [470, 70, 12], [605, 1008, 14], [118, 720, 10], [978, 622, 8],
    [352, 972, 16], [722, 98, 10], [510, 48, 8], [160, 310, 6],
    [920, 290, 8], [72, 820, 6], [1005, 750, 10], [420, 1018, 8],
];

function drawSparkle(ctx, cx, cy, size, color, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha ?? 1;
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
        const r = i % 2 === 0 ? size : size * 0.22;
        const angle = (i * Math.PI) / 4;
        if (i === 0) ctx.moveTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
        else ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
    }
    ctx.closePath(); ctx.fill();
    ctx.restore();
}

function rrPath(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
}

function clipRRect(ctx, x, y, w, h, r, fn) {
    ctx.save(); rrPath(ctx, x, y, w, h, r); ctx.clip(); fn(ctx); ctx.restore();
}

function drawLogo(ctx, logo, cx, cy, r, ringColor) {
    if (!logo) return;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.arc(cx, cy, r + 2, 0, Math.PI * 2); ctx.fill();
    clipCircle(ctx, cx, cy, r, (c) => c.drawImage(logo, cx - r, cy - r, r * 2, r * 2));
    ctx.strokeStyle = ringColor; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
}

function hGLine(ctx, y, r, g, b, alpha) {
    const gr = ctx.createLinearGradient(0, 0, W, 0);
    gr.addColorStop(0, `rgba(${r},${g},${b},0)`);
    gr.addColorStop(0.5, `rgba(${r},${g},${b},${alpha})`);
    gr.addColorStop(1, `rgba(${r},${g},${b},0)`);
    ctx.strokeStyle = gr; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
}

function drawRRPhoto(ctx, photo, fx, fy, fw, fh, fr, borderColor, glowColor) {
    ctx.save();
    ctx.shadowColor = glowColor; ctx.shadowBlur = 28;
    ctx.strokeStyle = borderColor; ctx.lineWidth = 6;
    rrPath(ctx, fx, fy, fw, fh, fr); ctx.stroke();
    ctx.restore();
    if (photo) {
        clipRRect(ctx, fx, fy, fw, fh, fr, (c) => {
            // object-cover: fill frame, maintain aspect ratio, centre-crop
            const iw = photo.naturalWidth || photo.width;
            const ih = photo.naturalHeight || photo.height;
            const imgAspect = iw / ih;
            const frameAspect = fw / fh;
            let sx, sy, sw, sh;
            if (imgAspect > frameAspect) {
                // image wider — crop sides
                sh = ih;
                sw = ih * frameAspect;
                sx = (iw - sw) / 2;
                sy = 0;
            } else {
                // image taller — crop top/bottom
                sw = iw;
                sh = iw / frameAspect;
                sx = 0;
                sy = (ih - sh) / 2;
            }
            c.drawImage(photo, sx, sy, sw, sh, fx, fy, fw, fh);
        });
    } else {
        ctx.fillStyle = "rgba(0,0,0,0.2)";
        rrPath(ctx, fx, fy, fw, fh, fr); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.14)";
        ctx.font = "90px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("\u2606", fx + fw / 2, fy + fh / 2);
        ctx.textBaseline = "alphabetic";
    }
    ctx.strokeStyle = borderColor; ctx.lineWidth = 5;
    rrPath(ctx, fx, fy, fw, fh, fr); ctx.stroke();
}

function drawNameBlock(ctx, name, role, cx, nameY, divRgba, nameColor, roleColor) {
    fitFont(ctx, name || "Your Name", 880, 54, "bold");
    ctx.fillStyle = nameColor; ctx.textAlign = "center";
    ctx.fillText(name || "Your Name", cx, nameY);
    const dg = ctx.createLinearGradient(cx - 170, 0, cx + 170, 0);
    dg.addColorStop(0, "rgba(0,0,0,0)");
    dg.addColorStop(0.5, divRgba);
    dg.addColorStop(1, "rgba(0,0,0,0)");
    ctx.strokeStyle = dg; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx - 170, nameY + 18); ctx.lineTo(cx + 170, nameY + 18); ctx.stroke();
    ctx.fillStyle = roleColor; ctx.font = "22px Arial";
    ctx.fillText(role || "CSS Society Member", cx, nameY + 52);
}

// ─── Template 1: Naya Savera (Dark) ───────────────────────────────────────

function drawSavera(ctx, photo, name, role, logo) {
    const bg = ctx.createRadialGradient(W / 2, H * 0.4, 0, W / 2, H * 0.5, 800);
    bg.addColorStop(0, "#0d4a22"); bg.addColorStop(1, "#041208");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "rgba(255,255,255,0.04)";
    for (let gx = 0; gx <= W; gx += 38)
        for (let gy = 0; gy <= H; gy += 38) {
            ctx.beginPath(); ctx.arc(gx, gy, 2.5, 0, Math.PI * 2); ctx.fill();
        }

    const bm = makeCrescent(300, "rgba(255,255,255,0.055)");
    ctx.drawImage(bm.canvas, 900 - bm.offset, 80 - bm.offset);

    SPARKLE_POS.forEach(([x, y, r]) => drawSparkle(ctx, x, y, r, "#c8a84b", 0.62));

    drawLogo(ctx, logo, 70, 62, 55, "rgba(200,168,75,0.7)");
    ctx.fillStyle = "#ffffff"; ctx.font = "bold 26px Arial"; ctx.textAlign = "center";
    ctx.fillText("COMPUTING STUDENTS SOCIETY", W / 2, 50);
    ctx.fillStyle = "rgba(200,168,75,0.72)"; ctx.font = "16px Arial";
    ctx.fillText("University of Peshawar", W / 2, 78);
    drawCrescent(ctx, 948, 58, 48, "#c8a84b");
    drawStar(ctx, 1012, 28, 15, "#c8a84b");
    hGLine(ctx, 105, 200, 168, 75, 0.6);

    ctx.fillStyle = "#e8d060"; ctx.textAlign = "center";
    ctx.font = "bold 48px 'Noto Nastaliq Urdu','Urdu Typesetting','Traditional Arabic',serif";
    ctx.fillText("\u0646\u06cc\u0627 \u0633\u0648\u06cc\u0631\u0627\u060c \u0646\u06cc\u0627 \u067e\u0627\u06a9\u0633\u062a\u0627\u0646", W / 2, 158);
    ctx.fillStyle = "#ffffff"; ctx.font = "bold 26px Arial";
    ctx.fillText("#NayaSaveraNayaPakistan", W / 2, 200);

    const fw = 420, fh = 500, fx = (W - fw) / 2, fy = 218, fr = 40;
    drawRRPhoto(ctx, photo, fx, fy, fw, fh, fr, "#c8a84b", "rgba(200,168,75,0.7)");
    drawCrescent(ctx, fx + fw - 18, fy + 22, 24, "#c8a84b");
    drawStar(ctx, fx + fw + 14, fy + 2, 9, "#c8a84b");

    drawNameBlock(ctx, name, role, W / 2, 784, "rgba(200,168,75,0.65)", "#ffffff", "#c8a84b");
    ctx.fillStyle = "rgba(255,255,255,0.48)"; ctx.font = "16px Arial"; ctx.textAlign = "center";
    ctx.fillText("79TH INDEPENDENCE DAY OF PAKISTAN  \u00b7  14 AUGUST 2026", W / 2, 868);
    hGLine(ctx, 920, 200, 168, 75, 0.45);
    ctx.fillStyle = "rgba(255,255,255,0.3)"; ctx.font = "14px Arial";
    ctx.fillText("CSS Society  \u00b7  University of Peshawar  \u00b7  #PakistanZindabad", W / 2, 948);
}

// ─── Template 2: Dil Hai Pakistan ─────────────────────────────────────────

function drawDil(ctx, photo, name, role, logo) {
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#062010"); bg.addColorStop(0.5, "#0a3018"); bg.addColorStop(1, "#041208");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "rgba(255,255,255,0.04)"; ctx.lineWidth = 1;
    for (let row = 0; row < 32; row++)
        for (let col = 0; col < 30; col++) {
            const ox = row % 2 === 0 ? 0 : 20;
            const x = col * 38 + ox, y = row * 36;
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const a = (i * Math.PI) / 3;
                i === 0 ? ctx.moveTo(x + Math.cos(a) * 13, y + Math.sin(a) * 13)
                    : ctx.lineTo(x + Math.cos(a) * 13, y + Math.sin(a) * 13);
            }
            ctx.closePath(); ctx.stroke();
        }

    const bm = makeCrescent(260, "rgba(255,255,255,0.055)");
    ctx.drawImage(bm.canvas, 120 - bm.offset, 400 - bm.offset);

    [[112, 190, 22], [940, 155, 18], [192, 892, 15], [895, 832, 19], [62, 512, 13], [1040, 462, 15]]
        .forEach(([x, y, r]) => drawSparkle(ctx, x, y, r, "#c8a84b", 0.7));

    drawLogo(ctx, logo, 70, 62, 55, "rgba(200,168,75,0.7)");
    ctx.fillStyle = "#c8a84b"; ctx.font = "bold 26px Arial"; ctx.textAlign = "center";
    ctx.fillText("COMPUTING STUDENTS SOCIETY", W / 2, 50);
    ctx.fillStyle = "rgba(255,255,255,0.6)"; ctx.font = "16px Arial";
    ctx.fillText("University of Peshawar", W / 2, 78);
    drawCrescent(ctx, 948, 58, 48, "#c8a84b");
    drawStar(ctx, 1012, 28, 15, "#c8a84b");
    hGLine(ctx, 105, 200, 168, 75, 0.6);

    ctx.fillStyle = "#e8d060"; ctx.textAlign = "center";
    ctx.font = "bold 52px 'Noto Nastaliq Urdu','Urdu Typesetting','Traditional Arabic',serif";
    ctx.fillText("\u062f\u0644 \u06c1\u06d2 \u067e\u0627\u06a9\u0633\u062a\u0627\u0646", W / 2, 162);
    ctx.fillStyle = "#ffffff"; ctx.font = "bold 28px Arial";
    ctx.fillText("#DilHaiPakistan", W / 2, 204);

    const fw = 420, fh = 500, fx = (W - fw) / 2, fy = 224, fr = 40;
    drawRRPhoto(ctx, photo, fx, fy, fw, fh, fr, "#c8a84b", "rgba(200,168,75,0.7)");
    drawCrescent(ctx, fx + fw - 18, fy + 22, 24, "#c8a84b");
    drawStar(ctx, fx + fw + 14, fy + 2, 9, "#c8a84b");

    drawNameBlock(ctx, name, role, W / 2, 790, "rgba(200,168,75,0.65)", "#ffffff", "#c8a84b");
    ctx.fillStyle = "rgba(255,255,255,0.48)"; ctx.font = "16px Arial"; ctx.textAlign = "center";
    ctx.fillText("79TH INDEPENDENCE DAY OF PAKISTAN  \u00b7  14 AUGUST 2026", W / 2, 874);
    hGLine(ctx, 924, 200, 168, 75, 0.45);
    ctx.fillStyle = "rgba(255,255,255,0.3)"; ctx.font = "14px Arial";
    ctx.fillText("CSS Society  \u00b7  University of Peshawar  \u00b7  #DilHaiPakistan", W / 2, 950);
}

// ─── Template 3: Meri Pehchan (Light) ─────────────────────────────────────

function drawPehchan(ctx, photo, name, role, logo) {
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#0D5E2A"; ctx.fillRect(0, 0, W, 145);
    ctx.strokeStyle = "#c8a84b"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(0, 145); ctx.lineTo(W, 145); ctx.stroke();
    ctx.fillStyle = "#0D5E2A"; ctx.fillRect(0, H - 130, W, 130);
    ctx.beginPath(); ctx.moveTo(0, H - 130); ctx.lineTo(W, H - 130); ctx.stroke();

    const bm = makeCrescent(220, "rgba(13,94,42,0.055)");
    ctx.drawImage(bm.canvas, W / 2 - bm.offset, H / 2 - bm.offset);

    [[105, 185, 14], [945, 148, 11], [190, 892, 10], [902, 828, 13]]
        .forEach(([x, y, r]) => drawSparkle(ctx, x, y, r, "#0D5E2A", 0.35));

    drawLogo(ctx, logo, 72, 72, 55, "rgba(255,255,255,0.6)");
    ctx.fillStyle = "#ffffff"; ctx.font = "bold 28px Georgia, serif"; ctx.textAlign = "center";
    ctx.fillText("Computing Students Society", W / 2, 62);
    ctx.font = "17px Arial"; ctx.fillStyle = "rgba(255,255,255,0.65)";
    ctx.fillText("University of Peshawar", W / 2, 92);
    drawCrescent(ctx, 940, 70, 46, "#ffffff");
    drawStar(ctx, 1000, 42, 14, "#ffffff");

    ctx.fillStyle = "#0D5E2A"; ctx.textAlign = "center";
    ctx.font = "bold 48px 'Noto Nastaliq Urdu','Urdu Typesetting','Traditional Arabic',serif";
    ctx.fillText("\u0645\u06cc\u0631\u06cc \u067e\u06c1\u0686\u0627\u0646 \u067e\u0627\u06a9\u0633\u062a\u0627\u0646", W / 2, 215);
    ctx.fillStyle = "#c8a84b"; ctx.font = "bold 24px Arial";
    ctx.fillText("#MeriPehchanPakistan", W / 2, 252);

    const fw = 400, fh = 480, fx = (W - fw) / 2, fy = 278, fr = 36;
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.1)"; ctx.shadowBlur = 22; ctx.shadowOffsetY = 7;
    ctx.fillStyle = "#ffffff"; rrPath(ctx, fx, fy, fw, fh, fr); ctx.fill();
    ctx.restore();
    drawRRPhoto(ctx, photo, fx, fy, fw, fh, fr, "#0D5E2A", "rgba(13,94,42,0.25)");

    // gold corner dots on frame
    [[fx, fy], [fx + fw, fy], [fx, fy + fh], [fx + fw, fy + fh]].forEach(([x, y]) => {
        ctx.fillStyle = "#c8a84b";
        ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.fill();
    });

    drawNameBlock(ctx, name, role, W / 2, 824, "rgba(200,168,75,0.7)", "#0D5E2A", "#555");
    ctx.fillStyle = "rgba(13,94,42,0.45)"; ctx.font = "15px Arial"; ctx.textAlign = "center";
    ctx.fillText("79TH INDEPENDENCE DAY OF PAKISTAN  \u00b7  14 AUGUST 2026", W / 2, 902);

    ctx.fillStyle = "#ffffff"; ctx.font = "bold 24px Georgia, serif"; ctx.textAlign = "center";
    ctx.fillText("\u067e\u0627\u06a9\u0633\u062a\u0627\u0646 \u0632\u0646\u062f\u06c1 \u0628\u0627\u062f", W / 2, H - 85);
    ctx.fillStyle = "rgba(255,255,255,0.65)"; ctx.font = "15px Arial";
    ctx.fillText("#MeriPehchanPakistan  \u00b7  CSS Society UoP", W / 2, H - 55);
    ctx.fillStyle = "rgba(255,255,255,0.38)"; ctx.font = "13px Arial";
    ctx.fillText("14 August 2026  \u00b7  79th Independence Day", W / 2, H - 28);
}

// ─── Template 4: Azaadi Mubarak (Ivory) ───────────────────────────────────

function drawAzaadiLight(ctx, photo, name, role, logo) {
    ctx.fillStyle = "#fdf9f0"; ctx.fillRect(0, 0, W, H);

    const bm = makeCrescent(330, "rgba(13,94,42,0.05)");
    ctx.drawImage(bm.canvas, W / 2 - bm.offset, H * 0.45 - bm.offset);

    ctx.fillStyle = "#0D5E2A";
    ctx.fillRect(0, 0, 18, H); ctx.fillRect(W - 18, 0, 18, H);
    ctx.fillRect(0, 0, W, 122); ctx.fillRect(0, H - 122, W, 122);
    ctx.strokeStyle = "#c8a84b"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(0, 122); ctx.lineTo(W, 122); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, H - 122); ctx.lineTo(W, H - 122); ctx.stroke();

    [[105, 182, 14], [945, 148, 11], [190, 892, 10], [902, 828, 13]]
        .forEach(([x, y, r]) => drawSparkle(ctx, x, y, r, "#c8a84b", 0.5));

    drawLogo(ctx, logo, 72, 60, 52, "rgba(255,255,255,0.6)");
    ctx.fillStyle = "#ffffff"; ctx.font = "bold 27px Georgia, serif"; ctx.textAlign = "center";
    ctx.fillText("Computing Students Society", W / 2, 52);
    ctx.font = "17px Arial"; ctx.fillStyle = "rgba(255,255,255,0.65)";
    ctx.fillText("University of Peshawar", W / 2, 80);
    drawCrescent(ctx, 942, 58, 44, "#ffffff");
    drawStar(ctx, 1000, 32, 13, "#ffffff");

    ctx.fillStyle = "#0D5E2A"; ctx.textAlign = "center";
    ctx.font = "bold 50px 'Noto Nastaliq Urdu','Urdu Typesetting','Traditional Arabic',serif";
    ctx.fillText("\u0622\u0632\u0627\u062f\u06cc \u0645\u0628\u0627\u0631\u06a9", W / 2, 200);
    ctx.fillStyle = "#c8a84b"; ctx.font = "bold 24px Arial";
    ctx.fillText("#AzaadiMubarak  \u00b7  14 August 2026", W / 2, 238);

    const fw = 400, fh = 480, fx = (W - fw) / 2, fy = 262, fr = 36;
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.08)"; ctx.shadowBlur = 20; ctx.shadowOffsetY = 6;
    ctx.fillStyle = "#fff"; rrPath(ctx, fx, fy, fw, fh, fr); ctx.fill();
    ctx.restore();
    drawRRPhoto(ctx, photo, fx, fy, fw, fh, fr, "#0D5E2A", "rgba(13,94,42,0.22)");

    const orn = (x, y, sx, sy) => {
        ctx.strokeStyle = "#c8a84b"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(x, y + sy * 36); ctx.lineTo(x, y); ctx.lineTo(x + sx * 36, y); ctx.stroke();
        ctx.fillStyle = "#c8a84b"; ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
    };
    orn(fx - 12, fy - 12, 1, 1); orn(fx + fw + 12, fy - 12, -1, 1);
    orn(fx - 12, fy + fh + 12, 1, -1); orn(fx + fw + 12, fy + fh + 12, -1, -1);

    drawNameBlock(ctx, name, role, W / 2, 818, "rgba(200,168,75,0.7)", "#0D5E2A", "#555");
    ctx.fillStyle = "rgba(13,94,42,0.4)"; ctx.font = "15px Arial"; ctx.textAlign = "center";
    ctx.fillText("79TH INDEPENDENCE DAY OF PAKISTAN  \u00b7  14 AUGUST 2026", W / 2, 898);

    ctx.fillStyle = "#ffffff"; ctx.font = "bold 22px Georgia, serif"; ctx.textAlign = "center";
    ctx.fillText("\u067e\u0627\u06a9\u0633\u062a\u0627\u0646 \u0632\u0646\u062f\u06c1 \u0628\u0627\u062f", W / 2, H - 82);
    ctx.fillStyle = "rgba(255,255,255,0.62)"; ctx.font = "15px Arial";
    ctx.fillText("#AzaadiMubarak  \u00b7  CSS Society  \u00b7  UoP", W / 2, H - 54);
    ctx.fillStyle = "rgba(255,255,255,0.36)"; ctx.font = "13px Arial";
    ctx.fillText("14 August 2026", W / 2, H - 28);
}

// ─── Template 5: CSS Azaadi ────────────────────────────────────────────────

function drawCSSAzaadi(ctx, photo, name, role, logo) {
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#0a1e4a"); bg.addColorStop(0.5, "#0c2d5e"); bg.addColorStop(1, "#0a1e30");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "rgba(255,255,255,0.018)"; ctx.lineWidth = 1;
    for (let i = -H; i < W + H; i += 55) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + H, H); ctx.stroke();
    }

    ctx.fillStyle = "#0D5E2A"; ctx.fillRect(0, H - 142, W, 142);
    ctx.strokeStyle = "#c8a84b"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(0, H - 142); ctx.lineTo(W, H - 142); ctx.stroke();
    ctx.fillStyle = "#0D5E2A"; ctx.fillRect(0, 0, W, 6);
    hGLine(ctx, 115, 200, 168, 75, 0.55);

    [[85, 162, 16], [950, 128, 12], [178, 882, 12], [898, 818, 15], [1034, 440, 11]]
        .forEach(([x, y, r]) => drawSparkle(ctx, x, y, r, "#c8a84b", 0.65));

    const bm = makeCrescent(200, "rgba(13,94,42,0.2)");
    ctx.drawImage(bm.canvas, 820 - bm.offset, 200 - bm.offset);
    drawStar(ctx, 985, 172, 30, "rgba(13,94,42,0.2)");

    drawLogo(ctx, logo, 70, 62, 55, "rgba(200,168,75,0.7)");
    ctx.fillStyle = "#ffffff"; ctx.font = "bold 26px Arial"; ctx.textAlign = "center";
    ctx.fillText("COMPUTING STUDENTS SOCIETY", W / 2, 50);
    ctx.fillStyle = "rgba(180,210,255,0.65)"; ctx.font = "16px Arial";
    ctx.fillText("University of Peshawar", W / 2, 78);
    drawCrescent(ctx, 950, 58, 50, "#c8a84b");
    drawStar(ctx, 1018, 24, 18, "#c8a84b");

    ctx.fillStyle = "#c8a84b"; ctx.font = "bold 34px Georgia, serif"; ctx.textAlign = "center";
    ctx.fillText("Jashn-e-Azaadi", W / 2, 162);
    ctx.fillStyle = "rgba(255,255,255,0.65)"; ctx.font = "bold 22px Arial";
    ctx.fillText("#CSS_UoP  \u00b7  14 August 2026", W / 2, 200);

    const fw = 400, fh = 492, fx = (W - fw) / 2, fy = 224, fr = 38;
    drawRRPhoto(ctx, photo, fx, fy, fw, fh, fr, "#c8a84b", "rgba(200,168,75,0.6)");
    drawCrescent(ctx, fx + fw - 18, fy + 22, 24, "#c8a84b");
    drawStar(ctx, fx + fw + 14, fy + 2, 9, "#c8a84b");

    drawNameBlock(ctx, name, role, W / 2, 780, "rgba(200,168,75,0.65)", "#ffffff", "rgba(180,210,255,0.85)");

    ctx.fillStyle = "#ffffff"; ctx.font = "bold 26px Georgia, serif"; ctx.textAlign = "center";
    ctx.fillText("Pakistan Zindabad", W / 2, H - 92);
    ctx.fillStyle = "rgba(200,168,75,0.82)"; ctx.font = "17px Arial";
    ctx.fillText("#DilHaiPakistan  \u00b7  #CSS_UoP  \u00b7  #PakistanZindabad", W / 2, H - 62);
    ctx.fillStyle = "rgba(255,255,255,0.38)"; ctx.font = "13px Arial";
    ctx.fillText("79th Independence Day of Pakistan", W / 2, H - 32);
}

// ─── Template 6: Parcham ──────────────────────────────────────────────────

function drawParcham(ctx, photo, name, role, logo) {
    ctx.fillStyle = "#0D5E2A"; ctx.fillRect(0, 0, W, H);

    // White left stripe (Pakistan flag proportion)
    ctx.fillStyle = "#f5f5f5"; ctx.fillRect(0, 0, W * 0.24, H);

    // dot texture on green
    ctx.fillStyle = "rgba(255,255,255,0.04)";
    for (let gx = W * 0.24; gx <= W; gx += 38)
        for (let gy = 0; gy <= H; gy += 38) {
            ctx.beginPath(); ctx.arc(gx, gy, 2.5, 0, Math.PI * 2); ctx.fill();
        }

    // large background crescent top-right (faint)
    const bm = makeCrescent(280, "rgba(255,255,255,0.07)");
    ctx.drawImage(bm.canvas, W * 0.65 - bm.offset, H * 0.38 - bm.offset);

    // prominent white crescent + star (mid-right of green area)
    drawCrescent(ctx, W * 0.66, H * 0.34, 115, "rgba(255,255,255,0.6)");
    drawStar(ctx, W * 0.81, H * 0.24, 38, "rgba(255,255,255,0.6)");

    // white sparkles on green area
    [[350, 120, 14], [955, 140, 10], [325, 945, 12], [1012, 825, 14], [355, 500, 8], [1042, 500, 10]]
        .forEach(([x, y, r]) => drawSparkle(ctx, x, y, r, "#ffffff", 0.52));
    // gold sparkles on white stripe
    [[38, 150, 9], [78, 400, 7], [52, 700, 9], [118, 905, 7]]
        .forEach(([x, y, r]) => drawSparkle(ctx, x, y, r, "#c8a84b", 0.58));

    // White stripe: CSS logo + label
    drawLogo(ctx, logo, W * 0.12, 78, 52, "rgba(13,94,42,0.4)");
    ctx.fillStyle = "#0D5E2A"; ctx.font = "bold 22px Georgia, serif"; ctx.textAlign = "center";
    ctx.fillText("CSS", W * 0.12, 158);
    ctx.font = "14px Arial"; ctx.fillText("Society", W * 0.12, 178);

    // Green area: header
    const gCX = W * 0.62;
    ctx.fillStyle = "#ffffff"; ctx.font = "bold 26px Arial"; ctx.textAlign = "center";
    ctx.fillText("COMPUTING STUDENTS SOCIETY", gCX, 50);
    ctx.fillStyle = "rgba(255,255,255,0.6)"; ctx.font = "16px Arial";
    ctx.fillText("University of Peshawar  \u00b7  Jashn-e-Azaadi 2026", gCX, 80);
    hGLine(ctx, 108, 255, 255, 255, 0.2);

    ctx.fillStyle = "#e8d060"; ctx.textAlign = "center";
    ctx.font = "bold 46px 'Noto Nastaliq Urdu','Urdu Typesetting','Traditional Arabic',serif";
    ctx.fillText("\u067e\u0627\u06a9\u0633\u062a\u0627\u0646 \u0632\u0646\u062f\u06c1 \u0628\u0627\u062f", gCX, 168);
    ctx.fillStyle = "#ffffff"; ctx.font = "bold 24px Arial";
    ctx.fillText("#PakistanZindabad", gCX, 208);

    const fw = 360, fh = 450, fx = gCX - fw / 2, fy = 232, fr = 36;
    drawRRPhoto(ctx, photo, fx, fy, fw, fh, fr, "#c8a84b", "rgba(200,168,75,0.7)");

    drawNameBlock(ctx, name, role, gCX, 754, "rgba(200,168,75,0.65)", "#ffffff", "rgba(220,220,220,0.85)");
    ctx.fillStyle = "rgba(255,255,255,0.45)"; ctx.font = "15px Arial"; ctx.textAlign = "center";
    ctx.fillText("79TH INDEPENDENCE DAY  \u00b7  14 AUGUST 2026", gCX, 832);

    ctx.fillStyle = "rgba(0,0,0,0.22)"; ctx.fillRect(0, H - 112, W, 112);
    ctx.strokeStyle = "#c8a84b"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, H - 112); ctx.lineTo(W, H - 112); ctx.stroke();
    ctx.fillStyle = "#ffffff"; ctx.font = "bold 22px Georgia, serif"; ctx.textAlign = "center";
    ctx.fillText("Pakistan Zindabad", W / 2, H - 72);
    ctx.fillStyle = "rgba(200,168,75,0.82)"; ctx.font = "16px Arial";
    ctx.fillText("#DilHaiPakistan  \u00b7  CSS Society UoP", W / 2, H - 44);
    ctx.fillStyle = "rgba(255,255,255,0.4)"; ctx.font = "13px Arial";
    ctx.fillText("14 August 2026", W / 2, H - 20);
}

// ─── Drawing dispatcher ────────────────────────────────────────────────────

function renderTemplate(ctx, templateId, photo, name, role, logo) {
    ctx.clearRect(0, 0, W, H);
    if (templateId === "savera") drawSavera(ctx, photo, name, role, logo);
    else if (templateId === "dil") drawDil(ctx, photo, name, role, logo);
    else if (templateId === "pehchan") drawPehchan(ctx, photo, name, role, logo);
    else if (templateId === "azaadi") drawAzaadiLight(ctx, photo, name, role, logo);
    else if (templateId === "cssazaadi") drawCSSAzaadi(ctx, photo, name, role, logo);
    else drawParcham(ctx, photo, name, role, logo);
}


export default function PosterGeneratorClient() {
    const [template, setTemplate] = useState("savera");
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [photoImg, setPhotoImg] = useState(null);
    const [photoThumb, setPhotoThumb] = useState(null); // small data URL for UI preview
    const [cssLogo, setCssLogo] = useState(null);
    const [downloading, setDownloading] = useState(false);
    const [thumbsReady, setThumbsReady] = useState(false);
    const [downloadCount, setDownloadCount] = useState(null);

    const canvasRef = useRef(null);
    const fileRef = useRef(null);
    const thumbRefs = useRef({});

    // Load CSS Society logo once
    useEffect(() => {
        const img = new window.Image();
        img.onload = () => setCssLogo(img);
        img.src = "/images/logo/cssfinallogo.jpeg";
    }, []);

    // Fetch live download count
    useEffect(() => {
        fetch("/api/poster-downloads")
            .then((r) => r.json())
            .then((d) => setDownloadCount(d.count ?? null))
            .catch(() => { });
    }, []);

    // Redraw main canvas whenever state changes
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        renderTemplate(canvas.getContext("2d"), template, photoImg, name, role, cssLogo);
    }, [template, name, role, photoImg, cssLogo]);

    // Draw static thumbnails after logo loads (or on mount if logo not needed)
    useEffect(() => {
        const scale = 240 / W;
        TEMPLATES.forEach(({ id }) => {
            const canvas = thumbRefs.current[id];
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            ctx.save();
            ctx.scale(scale, scale);
            renderTemplate(ctx, id, null, "Your Name", "CSS Society", cssLogo);
            ctx.restore();
        });
        setThumbsReady(true);
    }, [cssLogo]);

    const handlePhotoUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const src = ev.target.result;
            setPhotoThumb(src);
            const img = new window.Image();
            img.onload = () => setPhotoImg(img);
            img.src = src;
        };
        reader.readAsDataURL(file);
    };

    const handleDownload = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        setDownloading(true);
        canvas.toBlob(
            (blob) => {
                // Trigger browser download immediately
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `CSS-Jashn-e-Azadi-2026.png`;
                a.click();
                URL.revokeObjectURL(url);
                setDownloading(false);
                setDownloadCount((c) => (c ?? 0) + 1);

                // Background: create 720×720 JPEG and save to DB for better admin quality
                try {
                    const thumb = document.createElement("canvas");
                    thumb.width = 720; thumb.height = 720;
                    thumb.getContext("2d").drawImage(canvas, 0, 0, 720, 720);
                    const thumbDataUrl = thumb.toDataURL("image/jpeg", 0.92);
                    fetch("/api/poster-downloads", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            name: name || "Anonymous",
                            role: role || "",
                            template,
                            thumbDataUrl,
                        }),
                    }).catch(() => { });
                } catch { }
            },
            "image/png"
        );
    }, [name, role, template]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#020e05] via-[#0a3018] to-[#020e05]">

            {/* ── Page header ── */}
            <header className="relative pt-24 pb-8 text-center overflow-hidden px-4">
                <div className="absolute inset-0 pointer-events-none select-none">
                    <div className="absolute top-6 right-6 sm:right-12 w-32 sm:w-40 h-32 sm:h-40 rounded-full border-[3px] border-white/5" />
                    <div className="absolute top-4 left-6 sm:left-10 w-24 sm:w-32 h-24 sm:h-32 rounded-full border border-white/4" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-1.5 mb-4"
                >
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-yellow-300">
                        CSS Society · Jashn-e-Azadi 2026
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.07 }}
                    className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight"
                >
                    <span className="text-white">Dil Hai </span>
                    <span className="text-[#c8a84b]">Pakistan</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.14 }}
                    className="mt-2 text-white/55 text-base sm:text-lg"
                >
                    79th Independence Day · 14 August 2026
                </motion.p>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-white/32 text-xs sm:text-sm mt-1"
                >
                    Create your personalised Independence Day poster — free &amp; instant
                </motion.p>

                {/* Live download counter */}
                {downloadCount !== null && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-5 inline-flex items-center gap-2 bg-white/8 border border-white/12 rounded-full px-5 py-2"
                    >
                        <span className="text-[#c8a84b] font-black text-lg tabular-nums">{downloadCount.toLocaleString()}</span>
                        <span className="text-white/45 text-xs font-semibold uppercase tracking-wider">Posters Downloaded</span>
                    </motion.div>
                )}
            </header>

            {/* ── Main content ── */}
            <div className="max-w-6xl mx-auto px-4 sm:px-5 pb-24">
                {/*
          On mobile: canvas first (order-1), controls below (order-2).
          On lg+: side-by-side with controls on the left.
        */}
                <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[400px_1fr] lg:gap-10 lg:items-start">

                    {/* ── Canvas preview — appears first on mobile ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-col items-center order-1 lg:order-2"
                    >
                        <div className="w-full max-w-[520px] lg:max-w-[600px] rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/8">
                            <canvas
                                ref={canvasRef}
                                width={W}
                                height={H}
                                className="w-full h-auto block"
                            />
                        </div>
                        <p className="mt-2 text-[10px] sm:text-[11px] text-white/28">
                            Preview — full-resolution 1080×1080 PNG on download
                        </p>
                    </motion.div>

                    {/* ── Controls panel — appears second on mobile ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="space-y-4 order-2 lg:order-1 lg:sticky lg:top-24"
                    >

                        {/* Template selector — horizontal scroll */}
                        <section className="rounded-2xl bg-white/5 border border-white/8 p-4">
                            <h2 className="text-[10px] font-bold uppercase tracking-widest text-white/45 mb-3">
                                Choose a Template
                            </h2>
                            <div className="flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory">
                                {TEMPLATES.map(({ id, name: tName, hint }) => (
                                    <button
                                        key={id}
                                        onClick={() => setTemplate(id)}
                                        className={`shrink-0 w-[90px] sm:w-[105px] relative rounded-xl overflow-hidden border-2 transition-all duration-200 snap-start group ${template === id
                                            ? "border-[#c8a84b] scale-[1.04] shadow-lg shadow-[#c8a84b]/20"
                                            : "border-white/10 hover:border-white/25"
                                            }`}
                                    >
                                        <canvas
                                            width={240}
                                            height={240}
                                            ref={(el) => { if (el) thumbRefs.current[id] = el; }}
                                            className="w-full aspect-square block"
                                        />
                                        {template === id && (
                                            <div className="absolute top-1 right-1 bg-[#c8a84b] rounded-full p-0.5 shadow">
                                                <Check className="w-2.5 h-2.5 text-black" />
                                            </div>
                                        )}
                                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pt-5 pb-1.5 px-1">
                                            <p className="text-[9px] font-black text-white leading-tight truncate">{tName}</p>
                                            <p className="text-[8px] text-white/48 leading-tight truncate">{hint}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Photo upload */}
                        <section className="rounded-2xl bg-white/5 border border-white/8 p-4">
                            <h2 className="text-[10px] font-bold uppercase tracking-widest text-white/45 mb-3">
                                Your Photo
                            </h2>
                            <button
                                onClick={() => fileRef.current?.click()}
                                className="w-full border-2 border-dashed border-white/15 hover:border-[#c8a84b]/50 rounded-xl p-4 sm:p-5 text-center transition-all group"
                            >
                                {photoThumb ? (
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={photoThumb}
                                            alt="Your photo"
                                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-[#c8a84b] shrink-0"
                                        />
                                        <div className="text-left">
                                            <p className="text-sm font-semibold text-white">Photo uploaded ✓</p>
                                            <p className="text-xs text-white/40 mt-0.5">Tap to change</p>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="w-6 h-6 sm:w-7 sm:h-7 text-white/25 group-hover:text-[#c8a84b] mx-auto mb-2 transition" />
                                        <p className="text-sm text-white/45 group-hover:text-white/65 transition">
                                            Tap to upload your photo
                                        </p>
                                        <p className="text-xs text-white/25 mt-1">JPG or PNG · clear headshot works best</p>
                                    </>
                                )}
                            </button>
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                className="hidden"
                                onChange={handlePhotoUpload}
                            />
                        </section>

                        {/* Name + Role */}
                        <section className="rounded-2xl bg-white/5 border border-white/8 p-4 space-y-3">
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-white/45 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Ahmed Khan"
                                    maxLength={42}
                                    className="w-full bg-white/6 border border-white/12 rounded-xl px-4 py-3 text-white placeholder-white/22 text-sm focus:outline-none focus:border-[#c8a84b]/55 focus:bg-white/10 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-white/45 mb-2">
                                    Role / Program
                                </label>
                                <input
                                    type="text"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    placeholder="e.g. BS CS · 2nd Year"
                                    maxLength={50}
                                    className="w-full bg-white/6 border border-white/12 rounded-xl px-4 py-3 text-white placeholder-white/22 text-sm focus:outline-none focus:border-[#c8a84b]/55 focus:bg-white/10 transition"
                                />
                            </div>
                        </section>

                        {/* Download */}
                        <button
                            onClick={handleDownload}
                            disabled={downloading}
                            className="w-full bg-[#c8a84b] hover:bg-[#d6b85c] active:scale-95 disabled:opacity-60 text-black font-black text-sm uppercase tracking-widest py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#c8a84b]/20"
                        >
                            {downloading ? (
                                <>
                                    <RefreshCcw className="w-4 h-4 animate-spin" />
                                    Generating…
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4" />
                                    Download Poster
                                </>
                            )}
                        </button>

                        <p className="text-center text-[11px] text-white/25">
                            Poster updates live as you type
                        </p>
                        <div className="text-center space-x-2 text-[10px] text-white/28">
                            <span>#DilHaiPakistan</span>
                            <span>·</span>
                            <span>#PakistanZindabad</span>
                            <span>·</span>
                            <span>#CSS_UoP</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Back link */}
            <div className="text-center pb-10">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-white/30 hover:text-white/60 text-sm transition"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to CSS Society
                </Link>
            </div>
        </div>
    );
}
