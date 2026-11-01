"use client";

import { useEffect, useRef } from "react";

// Renders a special / collaboration certificate from a template snapshot
// stored ON the record (see CertificateRecord.templateSnapshot). The static
// art (logos, headings, underlines, labels) is part of the uploaded
// background; this component only overlays the name, description and
// signature slots described by the snapshot layout.
export default function CustomCertificateCanvas({
    fullName,
    description,
    leftSignatureName,
    rightSignatureName,
    rightSignatureRole,
    leadSignatureUrl,
    presidentSignatureUrl,
    templateSnapshot,
    isPreview = false,
    onReady
}) {
    const canvasRef = useRef(null);
    const hasCalledReady = useRef(false);

    useEffect(() => {
        if (!templateSnapshot?.backgroundUrl || !templateSnapshot?.layout) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const loadImg = (src) => new Promise((resolve) => {
            if (!src) return resolve(null);
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
            img.src = src;
        });

        // Remove white/gray background from a signature photo (same math as
        // the session & kahoot canvases so all certs look consistent).
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

        // Trim fully-transparent padding so the bottom edge lands exactly
        // on the signature line drawn in the background art.
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
            if (top > bottom || left > right) return src;
            const tw = right - left + 1;
            const th = bottom - top + 1;
            const out = document.createElement("canvas");
            out.width = tw;
            out.height = th;
            out.getContext("2d").drawImage(src, left, top, tw, th, 0, 0, tw, th);
            return out;
        };

        // Quote-aware word wrapping (mirrors CertificateCanvas behaviour)
        const drawWrappedText = (text, x, y, maxWidth, lineHeight, fontPx) => {
            const words = String(text).split(" ");
            let currentY = y;

            const setFont = (isBold) => {
                ctx.font = isBold
                    ? `bold ${fontPx}px 'Poppins', sans-serif`
                    : `500 ${fontPx}px 'Poppins', sans-serif`;
            };

            const flush = (line, startInside) => {
                let totalWidth = 0;
                let currentInside = startInside;
                line.forEach(word => {
                    const hasQuote = (word.match(/"/g) || []).length;
                    setFont(currentInside || word.includes('"'));
                    totalWidth += ctx.measureText(word + " ").width;
                    if (hasQuote % 2 !== 0) currentInside = !currentInside;
                });
                let startX = x - (totalWidth - ctx.measureText(" ").width) / 2;
                currentInside = startInside;
                line.forEach((word) => {
                    const hasQuote = (word.match(/"/g) || []).length;
                    setFont(currentInside || word.includes('"'));
                    ctx.textAlign = "left";
                    ctx.fillText(word, startX, currentY);
                    startX += ctx.measureText(word + " ").width;
                    if (hasQuote % 2 !== 0) currentInside = !currentInside;
                });
                currentY += lineHeight;
            };

            let lineInside = false;
            const currentLineWords = [];
            words.forEach((word) => {
                const hasQuote = (word.match(/"/g) || []).length;
                setFont(lineInside || word.includes('"'));
                const wordWidth = ctx.measureText(word + " ").width;
                const currentLineWidth = currentLineWords.reduce(
                    (acc, w) => acc + ctx.measureText(w + " ").width, 0
                );
                if (currentLineWidth + wordWidth > maxWidth && currentLineWords.length > 0) {
                    flush(currentLineWords, lineInside);
                    currentLineWords.forEach(w => {
                        const qCount = (w.match(/"/g) || []).length;
                        if (qCount % 2 !== 0) lineInside = !lineInside;
                    });
                    currentLineWords.length = 0;
                    currentLineWords.push(word);
                } else {
                    currentLineWords.push(word);
                }
            });
            if (currentLineWords.length > 0) flush(currentLineWords, lineInside);
        };

        const render = async () => {
            hasCalledReady.current = false;
            const layout = templateSnapshot.layout;

            await Promise.all([
                document.fonts.load("bold 80px 'Poppins'").catch(() => {}),
                document.fonts.load("500 40px 'Poppins'").catch(() => {}),
            ]);

            const sigSlots = Array.isArray(layout.signatures) ? layout.signatures : [];

            // Background + every signature source, loaded in parallel
            const [bgImg, presOverride, presDefault, ...slotImgs] = await Promise.all([
                loadImg(templateSnapshot.backgroundUrl),
                presidentSignatureUrl ? loadImg(presidentSignatureUrl) : Promise.resolve(null),
                loadImg("/images/signature/president_signature.jpeg"),
                ...sigSlots.map(slot => {
                    if (slot.source === "upload") return loadImg(slot.imageUrl);
                    if (slot.source === "lead") return loadImg(leadSignatureUrl); // may be null
                    return Promise.resolve(null);
                }),
            ]);

            if (!bgImg) return;

            // Lead smart-match (keyword fallback) for "lead" slots without upload
            const roleLower = (rightSignatureRole || "").toLowerCase();
            let matchedFile = null;
            if (roleLower.includes("se club") || (roleLower.includes("se") && roleLower.includes("lead"))) {
                matchedFile = "se_club_lead.jpeg";
            } else if (roleLower.includes("ai club") || (roleLower.includes("ai") && roleLower.includes("lead"))) {
                matchedFile = "ai_club_lead.jpeg";
            } else if (roleLower.includes("trainer") || roleLower.includes("speaker")) {
                matchedFile = "trainer_signature.jpeg";
            } else if (
                roleLower.includes("chief") ||
                roleLower.includes("organizer") ||
                roleLower.includes("patron") ||
                roleLower.includes("general") ||
                roleLower === "css"
            ) {
                matchedFile = "cheif-organizer.jpeg";
            }
            const leadSmartMatchImg = matchedFile ? await loadImg(`/images/signature/${matchedFile}`) : null;

            canvas.width = bgImg.width;
            canvas.height = bgImg.height;
            const W = canvas.width;
            const H = canvas.height;
            ctx.clearRect(0, 0, W, H);
            ctx.drawImage(bgImg, 0, 0);

            // ── Name ────────────────────────────────────────────────────────
            // The drag editor anchors the name's BOTTOM edge at y (translate
            // -100%, line-height 1.1). With Poppins metrics (asc 1050 /
            // desc 350 per 1000 upm) the baseline sits 0.2em above the box
            // bottom — reproduce that exactly so render = editor placement.
            const nameCfg = layout.name || {};
            const nameSize = Math.round((nameCfg.size ?? 0.055) * W);
            ctx.textAlign = "center";
            ctx.fillStyle = "#1e293b";
            ctx.font = `${nameCfg.weight || "bold"} ${nameSize}px 'Poppins', sans-serif`;
            const nameBaseline = (nameCfg.y ?? 0.45) * H - 0.2 * nameSize;
            ctx.fillText(fullName || "", (nameCfg.x ?? 0.5) * W, nameBaseline);

            // ── Description ─────────────────────────────────────────────────
            // Editor places the text box TOP at y − fontSize, so the first
            // baseline = y + lineHeight/2 − 0.65 × fontSize (half-leading +
            // ascent math with line-height set in px). Match it exactly.
            const descCfg = layout.description;
            if (descCfg && descCfg.enabled !== false && description) {
                const descSize = Math.round((descCfg.size ?? 0.022) * W);
                const descLineH = (descCfg.lineHeight ?? 0.038) * H;
                const firstBaseline =
                    (descCfg.y ?? 0.56) * H + descLineH / 2 - 0.65 * descSize;
                ctx.fillStyle = "#334155";
                drawWrappedText(
                    description,
                    (descCfg.x ?? 0.5) * W,
                    firstBaseline,
                    (descCfg.maxWidth ?? 0.65) * W,
                    descLineH,
                    descSize
                );
            }

            // ── Signature slots ─────────────────────────────────────────────
            const drawCursive = (text, slot) => {
                if (!text) return;
                const fontPx = Math.round(slot.width * W * 0.3);
                ctx.textAlign = "center";
                ctx.fillStyle = "#1e40af";
                ctx.font = `400 ${fontPx}px 'Mrs Saint Delafield', cursive`;
                ctx.fillText(text, slot.x * W, slot.y * H);
            };

            for (let i = 0; i < sigSlots.length; i++) {
                const slot = sigSlots[i];
                if (!slot || slot.source === "none") continue;

                let rawImg = null;
                let cursiveText = slot.label || "";

                if (slot.source === "president") {
                    rawImg = presOverride || presDefault;
                    cursiveText = leftSignatureName || "Muhammad Ilyas";
                } else if (slot.source === "lead") {
                    // Priority: per-record upload > keyword smart match
                    rawImg = slotImgs[i] || leadSmartMatchImg;
                    cursiveText = rightSignatureName || "";
                } else if (slot.source === "upload") {
                    rawImg = slotImgs[i];
                }

                const inked = trimCanvas(removeBg(rawImg));
                if (inked) {
                    const maxH = 0.14 * H;
                    let sW = (slot.width ?? 0.18) * W;
                    let sH = (inked.height / inked.width) * sW;
                    if (sH > maxH) {
                        sH = maxH;
                        sW = (inked.width / inked.height) * sH;
                    }
                    ctx.drawImage(inked, slot.x * W - sW / 2, slot.y * H - sH, sW, sH);
                } else {
                    drawCursive(cursiveText, slot);
                }
            }

            // ── Role label (Patron / entered role) ─────────────────────────
            // Position comes from the drag editor (layout.roleLabel). Older
            // templates without one auto-place under the right-side signature.
            // Center-anchored to match the editor's translate(-50%, -50%).
            if (layout.roleLabel?.enabled !== false) {
                const autoRight = sigSlots.find(
                    (s) => s && (s.source === "lead" || (s.source === "upload" && s.x > 0.5))
                );
                const roleCfg = layout.roleLabel || {};
                const labelPx = Math.round((roleCfg.size ?? 0.018) * W);
                let rx, ry;
                if (roleCfg.x != null && roleCfg.y != null) {
                    rx = roleCfg.x;
                    ry = roleCfg.y;
                } else if (autoRight) {
                    // Default-cert geometry: label CENTER sits 0.014H below
                    // the signature bottom (matches CertificateCanvas's
                    // 0.832 → 0.846 placement). Same formula as the editor.
                    rx = autoRight.x;
                    ry = Math.min(autoRight.y + 0.014, 0.97);
                } else {
                    rx = 0.72;
                    ry = 0.85;
                }
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.font = `bold ${labelPx}px sans-serif`;
                ctx.fillStyle = "#0f172a";
                ctx.fillText(rightSignatureRole || "Patron", rx * W, ry * H);
                ctx.textBaseline = "alphabetic";
            }

            if (onReady && !hasCalledReady.current) {
                hasCalledReady.current = true;
                onReady(canvas.toDataURL("image/png"));
            }
        };

        render();
    }, [
        fullName,
        description,
        leftSignatureName,
        rightSignatureName,
        rightSignatureRole,
        leadSignatureUrl,
        presidentSignatureUrl,
        templateSnapshot,
        onReady,
    ]);

    return (
        <canvas
            ref={canvasRef}
            className={`w-full h-auto border border-gray-200 rounded-lg shadow-inner bg-white ${isPreview ? "block" : "hidden"}`}
            style={{ display: isPreview ? "block" : "none" }}
        />
    );
}
