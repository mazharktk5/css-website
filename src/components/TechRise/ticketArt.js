import QRCode from "qrcode";

export const NAVY = "#14305E";
export const NAVY_2 = "#1B3A6B";
export const GOLD = "#C8912A";
export const GOLD_LIGHT = "#D9A441";
export const GOLD_DEEP = "#8a6317";

export const TICKET_W = 1754;
export const TICKET_H = 990;
export const STORY_W = 1080;
export const STORY_H = 1920;

export function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load ${src}`));
        img.src = src;
    });
}

/* next/font variables live on <body>; resolve them so canvas ctx.font can use
   the exact self-hosted families (Kalam / Poppins). */
let stacks = null;
function fontStacks() {
    if (stacks) return stacks;
    const read = (name, fallback) => {
        try {
            const v = getComputedStyle(document.body).getPropertyValue(name).trim();
            return v || fallback;
        } catch {
            return fallback;
        }
    };
    stacks = {
        display: read("--font-display", "Kalam, cursive"),
        accent: read("--font-accent", "Kalam, cursive"),
        body: read("--font-body", "Poppins, Arial, sans-serif"),
    };
    return stacks;
}

export async function ensureFonts() {
    const { display, accent, body } = fontStacks();
    const specs = [
        `italic 700 76px ${display}`,
        `italic 700 52px ${display}`,
        `italic 700 44px ${display}`,
        `700 30px ${display}`,
        `italic 600 48px ${accent}`,
        `italic 600 58px ${accent}`,
        `900 76px ${body}`,
        `700 56px ${body}`,
        `700 40px ${body}`,
        `500 30px ${body}`,
        `400 28px ${body}`,
    ];
    await Promise.all(specs.map((s) => document.fonts.load(s).catch(() => {})));
    try { await document.fonts.ready; } catch { /* noop */ }
}

function roundRectPath(ctx, x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
}

function drawSparkle(ctx, cx, cy, r, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(cx, cy - r);
    ctx.quadraticCurveTo(cx + r * 0.16, cy - r * 0.16, cx + r, cy);
    ctx.quadraticCurveTo(cx + r * 0.16, cy + r * 0.16, cx, cy + r);
    ctx.quadraticCurveTo(cx - r * 0.16, cy + r * 0.16, cx - r, cy);
    ctx.quadraticCurveTo(cx - r * 0.16, cy - r * 0.16, cx, cy - r);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

export function drawCover(ctx, img, x, y, w, h) {
    const scale = Math.max(w / img.width, h / img.height);
    const dw = img.width * scale;
    const dh = img.height * scale;
    ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

function fitFont(ctx, text, family, weight, startPx, maxWidth) {
    let px = startPx;
    while (px > 20) {
        ctx.font = `${weight} ${px}px ${family}`;
        if (ctx.measureText(text).width <= maxWidth) break;
        px -= 2;
    }
    return px;
}

function drawQR(ctx, token, x, y, size) {
    const qr = QRCode.create(token, { errorCorrectionLevel: "M" });
    const modules = qr.modules.size;
    const quiet = 4;
    const total = modules + quiet * 2;
    const cell = Math.floor(size / total);
    const drawSize = cell * total;
    const ox = x + (size - drawSize) / 2;
    const oy = y + (size - drawSize) / 2;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x, y, size, size);
    ctx.fillStyle = NAVY;
    for (let r = 0; r < modules; r++) {
        for (let c = 0; c < modules; c++) {
            if (qr.modules.data[r * modules + c]) {
                ctx.fillRect(ox + (c + quiet) * cell, oy + (r + quiet) * cell, cell, cell);
            }
        }
    }
}

function wrapText(ctx, text, maxWidth) {
    const words = String(text).split(/\s+/);
    const lines = [];
    let line = "";
    for (const word of words) {
        const test = line ? `${line} ${word}` : word;
        if (ctx.measureText(test).width > maxWidth && line) {
            lines.push(line);
            line = word;
        } else {
            line = test;
        }
    }
    if (line) lines.push(line);
    return lines;
}

/* Deterministic confetti so the artwork feels alive but never flickers. */
function seededRandom(seed) {
    let s = seed >>> 0;
    return () => {
        s = (s * 1664525 + 1013904223) >>> 0;
        return s / 4294967296;
    };
}

function drawConfetti(ctx, x, y, w, h, seed, count = 42, alphaScale = 1, tints = null) {
    const rand = seededRandom(seed);
    const palette = tints || [GOLD, GOLD_LIGHT, NAVY, "#ffffff"];
    ctx.save();
    for (let i = 0; i < count; i++) {
        const cx = x + rand() * w;
        const cy = y + rand() * h;
        const kind = rand();
        const tint = palette[Math.floor(rand() * palette.length)];
        const alpha = Math.min(0.9, (0.1 + rand() * 0.16) * alphaScale);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = tint;
        ctx.strokeStyle = tint;
        if (kind < 0.55) {
            ctx.beginPath();
            ctx.arc(cx, cy, 3 + rand() * 5, 0, Math.PI * 2);
            ctx.fill();
        } else if (kind < 0.8) {
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(cx, cy, 7 + rand() * 8, 0, Math.PI * 2);
            ctx.stroke();
        } else {
            const len = 10 + rand() * 14;
            const ang = rand() * Math.PI;
            ctx.lineWidth = 4;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.cos(ang) * len, cy + Math.sin(ang) * len);
            ctx.stroke();
        }
    }
    ctx.restore();
}

function firstNameOf(fullName) {
    const first = String(fullName || "").trim().split(/\s+/)[0];
    return first || String(fullName || "").trim();
}

// ---------- Landscape entry ticket (1754 x 990) ----------
export async function renderTicket(canvas, { name, regId, token, department, event, posterImg, wordmarkImg }) {
    canvas.width = TICKET_W;
    canvas.height = TICKET_H;
    const ctx = canvas.getContext("2d");
    const { display, accent, body } = fontStacks();

    await ensureFonts();

    ctx.fillStyle = "#F8FAFC";
    ctx.fillRect(0, 0, TICKET_W, TICKET_H);

    // Left poster panel — width matches the new poster's 768x1376 ratio so it shows complete
    const PANEL = 552;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, PANEL, TICKET_H);
    ctx.clip();
    drawCover(ctx, posterImg, 0, 0, PANEL, TICKET_H);
    const grad = ctx.createLinearGradient(0, TICKET_H * 0.45, 0, TICKET_H);
    grad.addColorStop(0, "rgba(20,48,94,0)");
    grad.addColorStop(0.55, "rgba(20,48,94,0.72)");
    grad.addColorStop(1, "rgba(20,48,94,0.96)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, PANEL, TICKET_H);
    ctx.restore();

    ctx.fillStyle = GOLD;
    ctx.font = `italic 700 30px ${display}`;
    ctx.textAlign = "left";
    ctx.fillText(event.dateLabel.toUpperCase(), 48, TICKET_H - 170);
    // Venue — single fitted line so it never collides with the pillar strip
    ctx.fillStyle = "#FFFFFF";
    const venuePx = fitFont(ctx, event.venue, body, "500", 30, PANEL - 96);
    ctx.font = `500 ${venuePx}px ${body}`;
    ctx.fillText(event.venue, 48, TICKET_H - 116);
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = `italic 700 24px ${display}`;
    ctx.fillText("LEARN • CONNECT • RISE", 48, TICKET_H - 40);

    // Gold divider
    ctx.fillStyle = GOLD;
    ctx.fillRect(PANEL, 0, 8, TICKET_H);

    // Dashed cut line
    ctx.save();
    ctx.strokeStyle = "rgba(20,48,94,0.25)";
    ctx.lineWidth = 3;
    ctx.setLineDash([14, 14]);
    ctx.beginPath();
    ctx.moveTo(PANEL + 40, 40);
    ctx.lineTo(PANEL + 40, TICKET_H - 40);
    ctx.stroke();
    ctx.restore();

    // Right content
    const X = PANEL + 90;
    const rightW = TICKET_W - X - 70;

    // Soft confetti field behind the right-side content
    drawConfetti(ctx, X - 40, 40, rightW + 40, TICKET_H - 80, 20261022, 46);

    // Gold foil frame
    ctx.strokeStyle = "rgba(200,145,42,0.55)";
    ctx.lineWidth = 3;
    roundRectPath(ctx, 16, 16, TICKET_W - 32, TICKET_H - 32, 26);
    ctx.stroke();

    ctx.textAlign = "left";
    // Brush wordmark from the official poster (transparent PNG)
    if (wordmarkImg) {
        const wmH = 88;
        const wmW = (wmH * wordmarkImg.width) / wordmarkImg.height;
        ctx.drawImage(wordmarkImg, X, 46, wmW, wmH);
    } else {
        ctx.fillStyle = NAVY;
        ctx.font = `italic 700 76px ${display}`;
        ctx.fillText("TECHRISE", X, 118);
        const titleW = ctx.measureText("TECHRISE").width;
        ctx.fillStyle = GOLD;
        ctx.fillText("’26", X + titleW + 16, 118);
    }

    // Confirmed badge (gold, plain body text like the date line)
    ctx.font = `600 26px ${body}`;
    const badgeText = "CONFIRMED ✓";
    const badgeW = ctx.measureText(badgeText).width + 52;
    ctx.fillStyle = GOLD;
    roundRectPath(ctx, TICKET_W - 70 - badgeW, 66, badgeW, 56, 14);
    ctx.fill();
    ctx.fillStyle = NAVY;
    ctx.textAlign = "center";
    ctx.fillText(badgeText, TICKET_W - 70 - badgeW / 2, 104);

    // Handwritten welcome line
    const welcome = `Pa Meena Pakhair Raghley, ${firstNameOf(name)}`;
    ctx.textAlign = "left";
    ctx.fillStyle = GOLD_DEEP;
    const welcomePx = fitFont(ctx, welcome, accent, "italic 700", 46, rightW - 78);
    ctx.font = `italic 700 ${welcomePx}px ${accent}`;
    ctx.fillText(welcome, X, 196);

    // Sparkle accent at the end of the welcome line
    const welcomeW = ctx.measureText(welcome).width;
    const spX = X + welcomeW + 38;
    const spY = 196 - welcomePx * 0.34;
    drawSparkle(ctx, spX, spY, Math.max(11, welcomePx * 0.4), GOLD_LIGHT);
    drawSparkle(ctx, spX + welcomePx * 0.5, spY - welcomePx * 0.32, Math.max(6, welcomePx * 0.2), GOLD);
    ctx.fillStyle = GOLD_DEEP;
    ctx.beginPath();
    ctx.arc(spX + welcomePx * 0.58, spY + welcomePx * 0.36, Math.max(2.5, welcomePx * 0.07), 0, Math.PI * 2);
    ctx.fill();

    // Participant
    ctx.fillStyle = "#94A3B8";
    ctx.font = `700 26px ${body}`;
    ctx.fillText("PARTICIPANT", X, 256);
    ctx.fillStyle = NAVY;
    const namePx = fitFont(ctx, name, display, "italic 700", 74, rightW);
    ctx.font = `italic 700 ${namePx}px ${display}`;
    ctx.fillText(name, X, 344);

    // Reg ID pill
    ctx.font = `italic 700 52px ${display}`;
    const idW = ctx.measureText(regId).width + 72;
    ctx.fillStyle = NAVY;
    roundRectPath(ctx, X, 396, idW, 84, 20);
    ctx.fill();
    ctx.fillStyle = GOLD;
    ctx.textAlign = "center";
    ctx.fillText(regId, X + idW / 2, 454);

    // QR geometry (also referenced by detail-row width limits below)
    const QR_SIZE = 260;
    const qx = TICKET_W - 70 - QR_SIZE;
    const qy = 670;

    // Detail rows
    const rows = [
        ["DATE", event.dateLabel],
        ["VENUE", event.venue],
        ["DEPARTMENT", department || "—"],
    ];
    const valueX = X + 240;
    const valueMax = TICKET_W - 70 - valueX;
    let rowY = 544;
    let rowIndex = 0;
    for (const [label, value] of rows) {
        ctx.textAlign = "left";
        ctx.fillStyle = GOLD;
        ctx.font = `italic 700 24px ${display}`;
        // Widen handwritten caps so pairs like N+U don't read as "W"
        ctx.letterSpacing = "1.5px";
        ctx.fillText(label, X, rowY);
        ctx.letterSpacing = "0px";
        ctx.fillStyle = NAVY;
        // Last row sits beside the QR card — keep values clear of it
        const maxW = rowIndex === rows.length - 1 ? Math.min(valueMax, qx - 16 - valueX - 24) : valueMax;
        const px = fitFont(ctx, value, body, "500", 32, maxW);
        ctx.font = `500 ${px}px ${body}`;
        ctx.fillText(value, valueX, rowY);
        rowY += 80;
        rowIndex++;
    }

    // QR block
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = NAVY;
    ctx.lineWidth = 4;
    roundRectPath(ctx, qx - 16, qy - 16, QR_SIZE + 32, QR_SIZE + 62, 18);
    ctx.fill();
    ctx.stroke();
    drawQR(ctx, token, qx, qy, QR_SIZE);
    ctx.fillStyle = "#64748B";
    ctx.font = `700 22px ${body}`;
    ctx.textAlign = "center";
    ctx.fillText("SCAN AT ENTRY", qx + QR_SIZE / 2, qy + QR_SIZE + 36);

    // Footer
    ctx.textAlign = "left";
    ctx.fillStyle = "#94A3B8";
    ctx.font = `500 24px ${body}`;
    ctx.fillText("cssuop.org", X, 946);
}

// ---------- 1080 x 1920 story card (no PII beyond name + regId) ----------
export async function renderStory(canvas, { name, regId, event, posterImg }) {
    canvas.width = STORY_W;
    canvas.height = STORY_H;
    const ctx = canvas.getContext("2d");
    const { display, body } = fontStacks();

    await ensureFonts();

    ctx.fillStyle = NAVY;
    ctx.fillRect(0, 0, STORY_W, STORY_H);
    if (posterImg) drawCover(ctx, posterImg, 0, 0, STORY_W, STORY_H);

    // Small info bar at the bottom: name, ticket #, date, venue
    const barH = 380;
    const barY = STORY_H - barH;
    ctx.fillStyle = NAVY;
    ctx.fillRect(0, barY, STORY_W, barH);
    ctx.fillStyle = GOLD;
    ctx.fillRect(0, barY, STORY_W, 5);

    ctx.textAlign = "center";

    ctx.fillStyle = "#FFFFFF";
    const namePx = fitFont(ctx, name, display, "italic 700", 46, STORY_W - 160);
    ctx.font = `italic 700 ${namePx}px ${display}`;
    ctx.fillText(name, STORY_W / 2, barY + 118);

    ctx.fillStyle = GOLD;
    ctx.font = `italic 700 32px ${display}`;
    ctx.fillText(regId, STORY_W / 2, barY + 174);

    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.font = `500 26px ${body}`;
    ctx.fillText(event.dateLabel.toUpperCase(), STORY_W / 2, barY + 230);

    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.font = `500 24px ${body}`;
    ctx.fillText(event.venue, STORY_W / 2, barY + 276);
}


export function downloadCanvas(canvas, filename) {
    canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 4000);
    }, "image/png");
}
