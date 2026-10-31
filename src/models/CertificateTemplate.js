import mongoose from "mongoose";

// A named certificate design for special / collaboration events.
// The static art (logos, headings, underlines, labels) is baked into the
// uploaded background; this layout only describes the OVERLAY positions
// drawn by CustomCertificateCanvas. Coordinates are fractions (0-1) of the
// background's width/height so any image resolution works.
const SignatureSlotSchema = new mongoose.Schema({
    x: { type: Number, required: true },   // center-x fraction
    y: { type: Number, required: true },   // baseline (bottom edge of sig) fraction
    width: { type: Number, default: 0.18 },// drawn width as fraction of canvas width
    source: { type: String, enum: ["president", "lead", "upload", "none"], default: "president" },
    imageUrl: { type: String, default: "" },// used when source === "upload"
    label: { type: String, default: "" },  // optional fallback cursive name
}, { _id: false });

const CertificateTemplateSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true },
    // Uploaded certificate art. MUST stay in the schema: mongoose strict
    // mode silently strips unknown keys on create, which once saved
    // templates without their background and broke rendering.
    backgroundUrl: { type: String, required: true },
    enabled: { type: Boolean, default: true },
    layout: {
        name: {
            x: { type: Number, default: 0.5 },
            y: { type: Number, default: 0.45 },
            size: { type: Number, default: 0.055 }, // fraction of canvas width
            weight: { type: String, default: "bold" },
        },
        description: {
            // null/false-ish layout disables the description overlay
            enabled: { type: Boolean, default: true },
            x: { type: Number, default: 0.5 },
            y: { type: Number, default: 0.56 },
            maxWidth: { type: Number, default: 0.65 },
            lineHeight: { type: Number, default: 0.038 }, // fraction of canvas height
            size: { type: Number, default: 0.022 },
        },
        signatures: { type: [SignatureSlotSchema], default: [] },
    },
}, { timestamps: true });

// Clear the model in development so schema edits (e.g. restoring
// backgroundUrl) take effect on hot-reload without a server restart.
if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.CertificateTemplate;
}

export default mongoose.models.CertificateTemplate ||
    mongoose.model("CertificateTemplate", CertificateTemplateSchema);
