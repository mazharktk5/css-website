"use client";

import { useEffect, useRef } from "react";

export default function KahootCertificateCanvas({
    fullName,
    position,       // 1, 2, or 3
    sessionName,    // e.g. "Turn Your Skills Into Income"
    sessionDate,    // ISO date string or Date
    isPreview = false,
    onReady
}) {
    const canvasRef = useRef(null);
    const hasCalledReady = useRef(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const loadImg = (src) => new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
            img.src = src;
        });

        // Same background-removal logic as the session certificate
        const removeBg = (img) => {
            if (!img) return null;
            const tmp = document.createElement("canvas");
            const tCtx = tmp.getContext("2d");
            tmp.width = img.width;
            tmp.height = img.height;
            tCtx.drawImage(img, 0, 0);
            const imgData = tCtx.getImageData(0, 0, tmp.width, tmp.height);
            const d = imgData.data;
            for (let i = 0; i < d.length; i += 4) {
                const lum = (d[i] + d[i + 1] + d[i + 2]) / 3;
                if (lum > 135) {
                    d[i + 3] = 0;
                } else {
                    const s = 1.8;
                    d[i]     = Math.max(0, Math.min(255, d[i]     * s - 100));
                    d[i + 1] = Math.max(0, Math.min(255, d[i + 1] * s - 100));
                    d[i + 2] = Math.max(0, Math.min(255, d[i + 2] * s - 100));
                }
            }
            tCtx.putImageData(imgData, 0, 0);
            return tmp;
        };

        // Trim fully-transparent rows/cols so centering is based on actual ink bounds
        const trimCanvas = (src) => {
            if (!src) return null;
            const tCtx = src.getContext("2d");
            const { width, height } = src;
            const data = tCtx.getImageData(0, 0, width, height).data;
            let top = height, bottom = 0, left = width, right = 0;
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    if (data[(y * width + x) * 4 + 3] > 10) {
                        if (y < top)    top    = y;
                        if (y > bottom) bottom = y;
                        if (x < left)   left   = x;
                        if (x > right)  right  = x;
                    }
                }
            }
            if (top > bottom || left > right) return src; // nothing to trim
            const tw = right - left + 1;
            const th = bottom - top + 1;
            const out = document.createElement("canvas");
            out.width  = tw;
            out.height = th;
            out.getContext("2d").drawImage(src, left, top, tw, th, 0, 0, tw, th);
            return out;
        };

        const render = async () => {
            hasCalledReady.current = false;

            const [templateImg, rawChiefImg, rawPresImg] = await Promise.all([
                loadImg("/images/certificates/kahoot-template.jpeg"),
                loadImg("/images/signature/cheif-organizer.jpeg"),
                loadImg("/images/signature/president_signature.jpeg"),
            ]);

            if (!templateImg) return;

            canvas.width  = templateImg.width;
            canvas.height = templateImg.height;

            // Draw the template
            ctx.drawImage(templateImg, 0, 0);

            // ── Accurate background colour ─────────────────────────────────────────
            // Sample from y≈41% — the clean gap between "PRESENTED TO" heading and
            // the name underline. This row is guaranteed blank background on every
            // template variation. Use a wide 120×60 block from both margins and
            // average them together to cancel any JPEG compression edge-artefacts.
            const sampleBlock = (bx, by, bw, bh) => {
                const d = ctx.getImageData(
                    Math.max(0, bx), Math.max(0, by), bw, bh
                ).data;
                let r = 0, g = 0, b = 0;
                for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i+1]; b += d[i+2]; }
                const n = bw * bh;
                return [r / n, g / n, b / n];
            };
            const bw = 120, bh = 60;
            const by = Math.floor(canvas.height * 0.41) - bh / 2;
            const [r1, g1, b1] = sampleBlock(Math.floor(canvas.width * 0.08), by, bw, bh);
            const [r2, g2, b2] = sampleBlock(Math.floor(canvas.width * 0.84), by, bw, bh);
            const bgColor = `rgb(${Math.round((r1+r2)/2)},${Math.round((g1+g2)/2)},${Math.round((b1+b2)/2)})`;

            // ── Cover the hardcoded description paragraph ──────────────────────────
            // x: 10%–90%  — leaves the decorative side panels untouched
            // y: 48.7%–70.7% — stops before the ribbon badge (~73%) is reached
            const coverX = canvas.width  * 0.10;
            const coverY = canvas.height * 0.487;
            const coverW = canvas.width  * 0.80;
            const coverH = canvas.height * 0.245; // 5 lines × 42px lineH fits within ~70.8%
            ctx.fillStyle = bgColor;
            ctx.fillRect(coverX, coverY, coverW, coverH);
            // Second pass to feather JPEG border artefacts
            ctx.fillStyle = bgColor;
            ctx.fillRect(coverX + 1, coverY + 1, coverW - 2, coverH - 2);

            // ── Winner name ───────────────────────────────────────────────────────
            ctx.textAlign = "center";
            ctx.fillStyle = "#0f172a";
            ctx.font = `bold 82px 'Inter', sans-serif`;
            ctx.fillText(fullName, canvas.width / 2, canvas.height * 0.458);

            // ── Dynamic description ───────────────────────────────────────────────
            const ordinalMap = { 1: "1st", 2: "2nd", 3: "3rd" };
            const ordinal = ordinalMap[position] || `${position}th`;

            const formattedDate = sessionDate
                ? new Date(sessionDate).toLocaleDateString("en-US", {
                      month: "long", day: "numeric", year: "numeric",
                  })
                : "";

            const segments = [
                { text: "for securing ",                                                                  bold: false },
                { text: ordinal,                                                                           bold: true  },
                { text: " position in the ",                                                               bold: false },
                { text: "Kahoot Quiz Competition",                                                         bold: true  },
                { text: " during the seminar ",                                                            bold: false },
                { text: `\u201c${sessionName}\u201d`,                                                      bold: true  },
                { text: ` on ${formattedDate}, organized by the `,                                        bold: false },
                { text: "Computing Students Society (CSS)",                                                bold: true  },
                { text: " at the University of Peshawar. Your performance, enthusiasm, and quick thinking distinguished you among all participants.", bold: false },
            ];

            // Smaller font + tighter line-height so the block comfortably fits
            // between the name underline and the signature lines on the template.
            const FONT_SIZE = 30;
            const NORMAL = `500 ${FONT_SIZE}px 'Inter', sans-serif`;
            const BOLD   = `bold ${FONT_SIZE}px 'Inter', sans-serif`;

            // Tokenise and word-wrap mixed-weight segments, then draw centred
            const tokens = [];
            segments.forEach(({ text, bold }) => {
                text.split(" ").forEach((part, i, arr) => {
                    if (part !== "") tokens.push({ word: part, bold });
                    if (i < arr.length - 1) tokens.push({ word: " ", bold: false });
                });
            });

            // maxW matches the original template's narrower text column (~62%)
            // so lines break at the same rhythm (5 centered lines like the original)
            const maxW = canvas.width * 0.62;
            const lines = [];
            let cur = [], curW = 0;
            tokens.forEach(({ word, bold }) => {
                ctx.font = bold ? BOLD : NORMAL;
                const w = ctx.measureText(word).width;
                if (word !== " " && curW + w > maxW && cur.length > 0) {
                    while (cur.length && cur[cur.length - 1].word === " ") cur.pop();
                    lines.push(cur);
                    cur  = [{ word, bold, w }];
                    curW = w;
                } else {
                    cur.push({ word, bold, w });
                    curW += w;
                }
            });
            if (cur.length) {
                while (cur.length && cur[cur.length - 1].word === " ") cur.pop();
                lines.push(cur);
            }

            ctx.fillStyle = "#334155";
            const lineH  = 42;
            const startY = canvas.height * 0.515;
            lines.forEach((line, li) => {
                const totalW = line.reduce((a, t) => a + t.w, 0);
                let x = canvas.width / 2 - totalW / 2;
                const y = startY + li * lineH;
                line.forEach(({ word, bold, w }) => {
                    ctx.font = bold ? BOLD : NORMAL;
                    ctx.textAlign = "left";
                    ctx.fillText(word, x, y);
                    x += w;
                });
            });

            // ── Signatures ────────────────────────────────────────────────────────
            // Template signature underlines sit at y≈81.3%.
            // Cap signature height to 110px so even a tall scanned signature never
            // bleeds upward into the description text.
            const chiefImg = trimCanvas(removeBg(rawChiefImg));
            const presImg  = trimCanvas(removeBg(rawPresImg));
            const SIG_MAX_H = 110;
            // SIG_LINE is the y of the template's underline — signature bottom sits ON it
            const SIG_LINE  = canvas.height * 0.820;
            // x centers matched to the mid-point of the template's left/right underlines
            const CHIEF_X   = canvas.width  * 0.285;
            const PRES_X    = canvas.width  * 0.715;

            const drawSig = (sigCanvas, cx) => {
                if (!sigCanvas) return;
                const aspect = sigCanvas.width / sigCanvas.height;
                const sh = Math.min(SIG_MAX_H, sigCanvas.height);
                const sw = sh * aspect;
                // Draw so the BOTTOM edge of the image lands exactly on SIG_LINE
                ctx.drawImage(sigCanvas, cx - sw / 2, SIG_LINE - sh, sw, sh);
            };

            drawSig(chiefImg, CHIEF_X);

            if (!chiefImg) {
                await document.fonts.load("400 90px 'Mrs Saint Delafield'");
                ctx.font = "400 90px 'Mrs Saint Delafield', cursive";
                ctx.fillStyle = "#1e40af";
                ctx.textAlign = "center";
                ctx.fillText("Dr Waheed ur Rehman", CHIEF_X, SIG_LINE);
            }

            drawSig(presImg, PRES_X);

            if (!presImg) {
                await document.fonts.load("400 90px 'Mrs Saint Delafield'");
                ctx.font = "400 90px 'Mrs Saint Delafield', cursive";
                ctx.fillStyle = "#1e40af";
                ctx.textAlign = "center";
                ctx.fillText("Muhammad Ilyas", PRES_X, SIG_LINE);
            }

            if (onReady && !hasCalledReady.current) {
                hasCalledReady.current = true;
                onReady(canvas.toDataURL("image/png"));
            }
        };

        render();
    }, [fullName, position, sessionName, sessionDate, onReady]);

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-auto border border-gray-200 rounded-lg shadow-inner bg-white"
            style={{ display: isPreview ? "block" : "none" }}
        />
    );
}
