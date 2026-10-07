import QRCode from "qrcode";

export const NAVY = "#14305E";
export const NAVY_2 = "#1B3A6B";
export const GOLD = "#C8912A";
export const GOLD_LIGHT = "#D9A441";
export const GOLD_DEEP = "#8a6317";

export const TICKET_W = 1754;
export const TICKET_H = 990;
export const STORY_W = 1080;
export const STORY_H = 1080;

export function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load ${src}`));
        img.src = src;
    });
}

/* Chroma-keys out the near-white backing of a flattened JPEG logo so it can
   sit directly on a coloured surface instead of carrying its own white box.
   Also progressively halves the canvas down toward `targetSize` — a single
   huge downscale (e.g. 1600px -> 90px) turns the seal's thin ring-text and
   sunburst hairlines into broken dots, while repeated 2x steps keep them
   legible. Returns a canvas, which drawImage() accepts anywhere an <img>
   would go. */
export function stripNearWhite(img, threshold = 235, targetSize = 260) {
    const srcW = img.naturalWidth || img.width;
    const srcH = img.naturalHeight || img.height;

    let canvas = document.createElement("canvas");
    canvas.width = srcW;
    canvas.height = srcH;
    let ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, srcW, srcH);

    const data = ctx.getImageData(0, 0, srcW, srcH);
    const px = data.data;
    for (let i = 0; i < px.length; i += 4) {
        if (px[i] > threshold && px[i + 1] > threshold && px[i + 2] > threshold) {
            px[i + 3] = 0;
        }
    }
    ctx.putImageData(data, 0, 0);

    while (canvas.width > targetSize * 2) {
        const next = document.createElement("canvas");
        next.width = Math.round(canvas.width / 2);
        next.height = Math.round(canvas.height / 2);
        const nctx = next.getContext("2d");
        nctx.imageSmoothingQuality = "high";
        nctx.drawImage(canvas, 0, 0, next.width, next.height);
        canvas = next;
    }
    return canvas;
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
    await Promise.all(specs.map((s) => document.fonts.load(s).catch(() => { })));
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

/* Rect rounded only at the top two corners — used for the logo "letterhead"
   band so it reads as one strip, not separate floating corners. */
function roundTopRectPath(ctx, x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.lineTo(x + w - radius, y);
    ctx.arcTo(x + w, y, x + w, y + radius, radius);
    ctx.lineTo(x + w, y + h);
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

/* Letterboxed fit (logos keep their real aspect ratio, never cropped). */
function drawContain(ctx, img, x, y, w, h) {
    const scale = Math.min(w / img.width, h / img.height);
    const dw = img.width * scale;
    const dh = img.height * scale;
    ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

/* Logo drawn as-is — contrast now comes from the shared letterhead band
   behind all three (see renderStory), not individual chips. */
function drawLogo(ctx, img, x, y, size) {
    if (!img) return;
    drawContain(ctx, img, x, y, size, size);
}

/* Wide landscape lockup (icon + wordmark text), centred on cx. */
function drawWideLogo(ctx, img, cx, y, h) {
    if (!img) return;
    const w = Math.min(380, (h * img.width) / img.height);
    drawContain(ctx, img, cx - w / 2, y, w, h);
    return w;
}

function initialsOf(name) {
    const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "?";
    const first = parts[0][0] || "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase();
}

/* The personalised photo frame — draws the attendee's photo cover-fit, or a
   gold initials avatar when no photo was provided (privacy-friendly default,
   e.g. for attendees who'd rather not share a picture). Adds camera-corner
   accents so it reads as a deliberate "frame", not a cropped mistake. */
function drawPhotoFrame(ctx, { photoImg, name, x, y, size }) {
    const r = Math.round(size * 0.1);

    // Outer gold frame
    ctx.fillStyle = GOLD;
    roundRectPath(ctx, x - 10, y - 10, size + 20, size + 20, r + 10);
    ctx.fill();

    // Inner picture / avatar, clipped to rounded square
    ctx.save();
    roundRectPath(ctx, x, y, size, size, r);
    ctx.clip();
    if (photoImg) {
        drawCover(ctx, photoImg, x, y, size, size);
    } else {
        const grad = ctx.createLinearGradient(x, y, x + size, y + size);
        grad.addColorStop(0, NAVY_2);
        grad.addColorStop(1, NAVY);
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, size, size);
        const { display } = fontStacks();
        ctx.fillStyle = GOLD;
        ctx.textAlign = "center";
        ctx.font = `italic 700 ${Math.round(size * 0.4)}px ${display}`;
        ctx.fillText(initialsOf(name), x + size / 2, y + size / 2 + size * 0.14);
    }
    ctx.restore();

    // Camera-corner accents for a deliberate "framed photo" feel
    const corner = Math.round(size * 0.12);
    ctx.save();
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = Math.max(4, Math.round(size * 0.012));
    ctx.lineCap = "round";
    const corners = [
        [x - 2, y - 2, 1, 1],
        [x + size + 2, y - 2, -1, 1],
        [x - 2, y + size + 2, 1, -1],
        [x + size + 2, y + size + 2, -1, -1],
    ];
    for (const [cx, cy, dx, dy] of corners) {
        ctx.beginPath();
        ctx.moveTo(cx, cy + corner * dy);
        ctx.lineTo(cx, cy);
        ctx.lineTo(cx + corner * dx, cy);
        ctx.stroke();
    }
    ctx.restore();
}

function fitFont(ctx, text, family, weight, startPx, maxWidth, minPx = 12) {
    let px = startPx;
    while (px > minPx) {
        ctx.font = `${weight} ${px}px ${family}`;
        if (ctx.measureText(text).width <= maxWidth) break;
        px -= 2;
    }
    ctx.font = `${weight} ${px}px ${family}`;
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

function drawConfetti(ctx, x, y, w, h, seed, count = 42, alphaScale = 1, tints = null, avoid = null) {
    const rand = seededRandom(seed);
    const palette = tints || [GOLD, GOLD_LIGHT, NAVY, "#ffffff"];
    const inAvoid = (px, py) =>
        avoid && px > avoid.x && px < avoid.x + avoid.w && py > avoid.y && py < avoid.y + avoid.h;
    ctx.save();
    for (let i = 0; i < count; i++) {
        const cx = x + rand() * w;
        const cy = y + rand() * h;
        const kind = rand();
        const tint = palette[Math.floor(rand() * palette.length)];
        const alpha = Math.min(0.9, (0.1 + rand() * 0.16) * alphaScale);
        if (inAvoid(cx, cy)) continue;
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

// ---------- Shareable "I'm Attending" card (1080 x 1080, square) ----------
// Square works everywhere (IG feed, WhatsApp, Facebook) without cropping.
// Personalised with the attendee's photo (or a gold initials avatar if they
// skip that, e.g. for privacy) and a public CTA + QR to the registration
// page (never the private check-in token), so every share is a potential
// new sign-up. Title is hand-drawn (not the brush wordmark image) so it
// stays legible at this compact size.
export async function renderStory(canvas, { name, regId, event, registerUrl, cssLogoImg, deptLogoImg, youthLogoImg, photoImg }) {
    canvas.width = STORY_W;
    canvas.height = STORY_H;
    const ctx = canvas.getContext("2d");
    const { display, body } = fontStacks();

    await ensureFonts();

    ctx.fillStyle = NAVY;
    ctx.fillRect(0, 0, STORY_W, STORY_H);

    const BAND_H = 150;
    const ORG_H = 92;
    const frameY = BAND_H + ORG_H + 54;
    drawConfetti(ctx, 0, BAND_H, STORY_W, STORY_H - BAND_H, 20261022, 50, 1, null, {
        x: 24, y: frameY - 24, w: 520, h: 500,
    });

    // Logo "letterhead" band — one cohesive light strip reads better than
    // separate floating chips, and gives the dark crests the contrast they need.
    ctx.fillStyle = "#FBF8F0";
    roundTopRectPath(ctx, 18, 18, STORY_W - 36, BAND_H - 18, 32);
    ctx.fill();
    ctx.strokeStyle = "rgba(200,145,42,0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(18, BAND_H);
    ctx.lineTo(STORY_W - 18, BAND_H);
    ctx.stroke();

    ctx.strokeStyle = "rgba(200,145,42,0.55)";
    ctx.lineWidth = 4;
    roundRectPath(ctx, 18, 18, STORY_W - 36, STORY_H - 36, 32);
    ctx.stroke();

    ctx.textAlign = "center";

    // Official logos on the band
    const CHIP = 86;
    const logoY = 18 + (BAND_H - 18 - CHIP) / 2;
    drawLogo(ctx, cssLogoImg, 42, logoY, CHIP);
    drawLogo(ctx, deptLogoImg, STORY_W - 42 - CHIP, logoY, CHIP);
    drawWideLogo(ctx, youthLogoImg, STORY_W / 2, logoY + (CHIP - 72) / 2, 72);

    // Organiser name, below the band (not inside it) — on the navy body
    ctx.fillStyle = "#FFFFFF";
    ctx.font = `700 25px ${body}`;
    ctx.letterSpacing = "1px";
    ctx.fillText("Computing Students Society", STORY_W / 2, BAND_H + 38);
    ctx.letterSpacing = "0px";
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.font = `600 19px ${body}`;
    ctx.fillText("Department of Computer Science", STORY_W / 2, BAND_H + 64);
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.font = `500 17px ${body}`;
    ctx.fillText("University of Peshawar", STORY_W / 2, BAND_H + 88);

    // Personalised photo — big, on the left — with the attendee details
    // stacked beside it on the right, so the card reads as one full layout
    // instead of a thin centred column with empty space either side.
    const FRAME = 430;
    const LEFT_X = 36;
    const colX = LEFT_X + FRAME + 30;
    const colRight = STORY_W - 36;
    const colCenterX = colX + (colRight - colX) / 2;
    const colMax = colRight - colX - 10;
    drawPhotoFrame(ctx, { photoImg, name, x: LEFT_X, y: frameY, size: FRAME });

    let cy = frameY + 72;

    // Hero statement — one line, it comfortably fits the column width
    ctx.fillStyle = GOLD;
    ctx.font = `700 23px ${body}`;
    ctx.letterSpacing = "3px";
    ctx.fillText("I AM ATTENDING", colCenterX, cy);
    ctx.letterSpacing = "0px";
    cy += 58;

    // Title — "TECH" + "RISE'26" split to match the brand wordmark's two-tone
    // treatment (gold RISE), just inverted for a dark background.
    let titlePx = 48;
    ctx.font = `900 ${titlePx}px ${body}`;
    while (titlePx > 24 && ctx.measureText("TECHRISE").width > colMax - 30) {
        titlePx -= 2;
        ctx.font = `900 ${titlePx}px ${body}`;
    }
    const w1 = ctx.measureText("TECH").width;
    const w2 = ctx.measureText("RISE").width;
    const accentPx = Math.round(titlePx * 0.58);
    ctx.font = `italic 700 ${accentPx}px ${display}`;
    const w3 = ctx.measureText(" ’26").width;
    const titleX = colCenterX - (w1 + w2 + w3) / 2;
    ctx.textAlign = "left";
    ctx.font = `900 ${titlePx}px ${body}`;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("TECH", titleX, cy);
    ctx.fillStyle = GOLD;
    ctx.fillText("RISE", titleX + w1, cy);
    ctx.font = `italic 700 ${accentPx}px ${display}`;
    ctx.fillText(" ’26", titleX + w1 + w2, cy);
    ctx.textAlign = "center";
    cy += 40;

    ctx.fillStyle = "rgba(255,255,255,0.85)";
    const taglinePx = fitFont(ctx, "LEARN  •  CONNECT  •  RISE", display, "italic 700", 21, colMax);
    ctx.font = `italic 700 ${taglinePx}px ${display}`;
    ctx.fillText("LEARN  •  CONNECT  •  RISE", colCenterX, cy);
    cy += 64;

    // Name
    ctx.fillStyle = "#FFFFFF";
    const namePx = fitFont(ctx, name, display, "italic 700", 40, colMax);
    ctx.font = `italic 700 ${namePx}px ${display}`;
    ctx.fillText(name, colCenterX, cy);
    cy += 62;

    // Reg ID pill
    ctx.font = `italic 700 30px ${display}`;
    const idW = Math.min(colMax, ctx.measureText(regId).width + 50);
    ctx.fillStyle = GOLD;
    roundRectPath(ctx, colCenterX - idW / 2, cy, idW, 54, 15);
    ctx.fill();
    ctx.fillStyle = NAVY;
    ctx.fillText(regId, colCenterX, cy + 36);
    cy += 54;

    // Bottom row — one shared header ("REGISTRATION IS FREE") above a single
    // aligned row: venue/date bottom-left (under the photo) and the QR
    // bottom-right (under the name column), both anchored to the same rowY
    // instead of floating at different heights.
    const sectionTop = Math.max(frameY + FRAME, cy) + 56;

    ctx.strokeStyle = "rgba(200,145,42,0.4)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(LEFT_X, sectionTop);
    ctx.lineTo(colRight, sectionTop);
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.fillStyle = GOLD;
    ctx.font = `700 19px ${body}`;
    ctx.letterSpacing = "1px";
    ctx.fillText("REGISTRATION IS FREE", STORY_W / 2, sectionTop + 32);
    ctx.letterSpacing = "0px";

    const rowY = sectionTop + 60;
    const QR_SIZE = 120;
    const qx = colRight - QR_SIZE - 16;

    // Venue + date, vertically balanced against the QR block beside it
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    const venueLine = `📍 ${event.venue}`;
    const leftMax = FRAME;
    const venuePx = fitFont(ctx, venueLine, body, "600", 20, leftMax);
    ctx.font = `600 ${venuePx}px ${body}`;
    ctx.fillText(venueLine, LEFT_X, rowY + 44);

    const dateLine = `🗓️ ${event.dateLabel}`;
    const datePx = fitFont(ctx, dateLine, body, "600", 20, leftMax);
    ctx.font = `600 ${datePx}px ${body}`;
    ctx.fillText(dateLine, LEFT_X, rowY + 76);

    // QR — top-aligned to the same rowY as the venue/date block
    ctx.fillStyle = "#FFFFFF";
    roundRectPath(ctx, qx - 13, rowY - 13, QR_SIZE + 26, QR_SIZE + 26, 15);
    ctx.fill();
    if (registerUrl) drawQR(ctx, registerUrl, qx, rowY, QR_SIZE);

    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255,255,255,0.65)";
    ctx.font = `500 15px ${body}`;
    ctx.fillText("Scan or visit", qx + QR_SIZE / 2, rowY + QR_SIZE + 26);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = `700 17px ${body}`;
    ctx.fillText("cssuop.org/techrise", qx + QR_SIZE / 2, rowY + QR_SIZE + 48);

    // Hashtag, dead-centre at the very bottom of the card
    ctx.fillStyle = GOLD;
    ctx.font = `700 16px ${body}`;
    ctx.letterSpacing = "0.5px";
    ctx.fillText("#TechRise26  •  #CSSUOP", STORY_W / 2, rowY + QR_SIZE + 44);
    ctx.letterSpacing = "0px";
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
