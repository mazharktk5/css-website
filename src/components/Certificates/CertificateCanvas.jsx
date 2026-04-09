"use client";

import { useEffect, useRef } from "react";

export default function CertificateCanvas({
    fullName,
    description,
    leftSignatureName,
    rightSignatureName,
    rightSignatureRole,
    leadSignatureUrl, // New: Dynamic signature image
    isPreview = false, // New: Whether to show the canvas or keep it hidden
    onReady
}) {
    const canvasRef = useRef(null);
    const hasCalledReady = useRef(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const image = new Image();

        image.src = "/images/certificates/Certificates Css.png";
        image.onload = async () => {
            hasCalledReady.current = false; // Reset lock on new image load
            // Helper to load images and wait for them
            const loadImg = (src) => new Promise((resolve) => {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.onload = () => resolve(img);
                img.onerror = () => resolve(null);
                img.src = src;
            });

            // Helper to remove white/gray/shadowy background from a signature photo
            const removeBg = (img) => {
                if (!img) return null;
                const tempCanvas = document.createElement("canvas");
                const tCtx = tempCanvas.getContext("2d");
                tempCanvas.width = img.width;
                tempCanvas.height = img.height;
                tCtx.drawImage(img, 0, 0);

                const imgData = tCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
                const data = imgData.data;

                // 1. Levels Adjustment & Thresholding
                for (let i = 0; i < data.length; i += 4) {
                    let r = data[i], g = data[i+1], b = data[i+2];
                    
                    // Boost contrast: Map gray range [120-255] to pure white
                    // This forces shadowy backgrounds to become transparent
                    const luminance = (r + g + b) / 3;
                    
                    if (luminance > 135) {
                        data[i + 3] = 0; // Pure Transparent
                    } else {
                        // Enhance the remaining "ink" to be solid black/dark blue
                        // This makes the signature look sharp even if the photo was blurry
                        const strength = 1.8; // Ink boost factor
                        data[i] = Math.max(0, Math.min(255, r * strength - 100));
                        data[i+1] = Math.max(0, Math.min(255, g * strength - 100));
                        data[i+2] = Math.max(0, Math.min(255, b * strength - 100));
                    }
                }
                tCtx.putImageData(imgData, 0, 0);
                return tempCanvas;
            };

            // Fuzzy Search for signature files based on keywords in the role
            const roleLower = (rightSignatureRole || "").toLowerCase();
            let matchedFile = null;
            
            if (roleLower.includes("se")) matchedFile = "se_club_lead.jpeg";
            else if (roleLower.includes("ai")) matchedFile = "ai_club_lead.jpeg";
            // ... Add more keywords here as you add more leads (e.g., cyber)
            else {
                // Specific normalization if no keyword matches
                matchedFile = roleLower.trim().replace(/\s+/g, "_") + ".jpeg";
            }

            // Load signatures in parallel
            // 1. President (Fixed)
            // 2. Smart Match (e.g., se_club_lead.jpeg)
            // 3. Dynamic Upload (fallback if provided)
            const [rawPresImg, rawSmartMatchImg, rawDynamicImg] = await Promise.all([
                loadImg("/images/signature/president_signature.jpeg"),
                matchedFile ? loadImg(`/images/signature/${matchedFile}`) : Promise.resolve(null),
                leadSignatureUrl ? loadImg(leadSignatureUrl) : Promise.resolve(null)
            ]);

            // Final Lead Signature Selection: Smart Match > Dynamic Upload
            const rawLeadImg = rawSmartMatchImg || rawDynamicImg;

            // Remove background from signatures
            const presImg = removeBg(rawPresImg);
            const leadImg = removeBg(rawLeadImg);

            // Set canvas size to match background template
            canvas.width = image.width;
            canvas.height = image.height;

            // Draw background template
            ctx.drawImage(image, 0, 0);

            // ... [Text Wrapping Helper logic remains same] ...
            const drawWrappedText = (text, x, y, maxWidth, lineHeight) => {
                const words = text.split(" ");
                let currentY = y;
                let currentLine = [];

                const flush = (line, startInside) => {
                    let totalWidth = 0;
                    let currentInside = startInside;

                    // 1. First pass: Measure total width while tracking bold state
                    line.forEach(word => {
                        const hasQuote = (word.match(/"/g) || []).length;
                        const isBold = currentInside || word.includes('"');
                        ctx.font = isBold ? "bold 38px 'Inter', sans-serif" : "500 38px 'Inter', sans-serif";
                        totalWidth += ctx.measureText(word + " ").width;
                        if (hasQuote % 2 !== 0) currentInside = !currentInside;
                    });

                    // 2. Second pass: Draw words
                    let startX = x - (totalWidth - ctx.measureText(" ").width) / 2;
                    currentInside = startInside;

                    line.forEach((word) => {
                        const hasQuote = (word.match(/"/g) || []).length;
                        const isBold = currentInside || word.includes('"');
                        ctx.font = isBold ? "bold 38px 'Inter', sans-serif" : "500 38px 'Inter', sans-serif";
                        ctx.textAlign = "left";
                        ctx.fillText(word, startX, currentY);
                        startX += ctx.measureText(word + " ").width;
                        if (hasQuote % 2 !== 0) currentInside = !currentInside;
                    });
                    currentY += lineHeight;
                };

                let lineInside = false;
                words.forEach((word) => {
                    const hasQuote = (word.match(/"/g) || []).length;
                    const isBold = lineInside || word.includes('"');
                    
                    ctx.font = isBold ? "bold 38px 'Inter', sans-serif" : "500 38px 'Inter', sans-serif";
                    const wordWidth = ctx.measureText(word + " ").width;

                    const currentLineWidth = currentLine.reduce((acc, w) => {
                        return acc + ctx.measureText(w + " ").width; 
                    }, 0);

                    if (currentLineWidth + wordWidth > maxWidth && currentLine.length > 0) {
                        flush(currentLine, lineInside);
                        // Update lineInside state for the next line based on the words we just flushed
                        currentLine.forEach(w => {
                            const qCount = (w.match(/"/g) || []).length;
                            if (qCount % 2 !== 0) lineInside = !lineInside;
                        });
                        currentLine = [word];
                    } else {
                        currentLine.push(word);
                    }
                });
                if (currentLine.length > 0) flush(currentLine, lineInside);
            };

            // Configure Text Styles
            ctx.textAlign = "center";
            ctx.fillStyle = "#1e293b";

            // 1. Draw Student Name (Switched to modern Sans-Serif to match reference)
            ctx.font = "bold 85px 'Inter', sans-serif";
            ctx.fillText(fullName, canvas.width / 2, canvas.height * 0.485); 

            // 2. Draw Description (Optimized spacing and size)
            ctx.fillStyle = "#334155"; 
            drawWrappedText(description, canvas.width / 2, canvas.height * 0.57, canvas.width * 0.65, 54);

            // 3. Draw Signatures & Labels
            ctx.textAlign = "center";
            ctx.fillStyle = "#1e293b";

            // --- Left Signature (President - Fixed Image) ---
            if (presImg) {
                const sWidth = 400; // Increased from 350
                const sHeight = (presImg.height / presImg.width) * sWidth;
                // Lowered by 25px from 0.81
                ctx.drawImage(presImg, canvas.width * 0.28 - sWidth / 2, (canvas.height * 0.81 + 25) - sHeight, sWidth, sHeight);
            } else {
                await document.fonts.load("400 110px 'Mrs Saint Delafield'");
                ctx.font = "400 110px 'Mrs Saint Delafield', cursive";
                ctx.fillStyle = "#1e40af";
                ctx.fillText("Muhammad Ilyas", canvas.width * 0.28, canvas.height * 0.81);
            }

            // --- Right Signature (Club Lead - Dynamic Image) ---
            if (leadImg) {
                const sWidth = 400; // Increased to 400 to match President
                const sHeight = (leadImg.height / leadImg.width) * sWidth;
                // Lowered by 45px from 0.81 to sit closer to the line
                ctx.drawImage(leadImg, canvas.width * 0.72 - sWidth / 2, (canvas.height * 0.81 + 45) - sHeight, sWidth, sHeight);
            } else {
                if (leadSignatureUrl) console.log("DEBUG: leadSignatureUrl is present but image failed to load:", leadSignatureUrl);
                await document.fonts.load("400 110px 'Mrs Saint Delafield'");
                ctx.font = "400 110px 'Mrs Saint Delafield', cursive";
                ctx.fillStyle = "#1e40af";
                ctx.fillText(rightSignatureName, canvas.width * 0.72, canvas.height * 0.81);
            }

            // --- Dynamic Labels (Role Titles) ---
            ctx.textAlign = "center";
            ctx.font = "bold 30px sans-serif"; // Using generic sans-serif for better template match
            ctx.fillStyle = "#0f172a"; 
            
            // Note: President Label is already in the background image.
            // We match its style and vertical alignment for the Lead Role.

            // Draw Dynamic Lead Role
            const labelX = canvas.width * 0.72;
            const labelY = canvas.height * 0.855; // Lowered slightly to match President's gap
            
            ctx.fillText(rightSignatureRole || "Club Lead", labelX, labelY);

            if (onReady && !hasCalledReady.current) {
                hasCalledReady.current = true;
                onReady(canvas.toDataURL("image/png"));
            }
        };
    }, [fullName, description, leftSignatureName, rightSignatureName, rightSignatureRole, leadSignatureUrl, onReady]);

    return (
        <canvas
            ref={canvasRef}
            className={`w-full h-auto border border-gray-200 rounded-lg shadow-inner bg-white ${isPreview ? 'block' : 'hidden'}`}
            style={{ display: isPreview ? "block" : "none" }} 
        />
    );
}
