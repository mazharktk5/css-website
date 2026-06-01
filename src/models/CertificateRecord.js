import mongoose from "mongoose";

const CertificateRecordSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    eventName: { type: String, required: true },
    description: { type: String, default: "" },
    leftSignatureName: { type: String, default: "Muhammad Ilyas" },
    rightSignatureName: { type: String },
    rightSignatureRole: { type: String, default: "Club Lead" },
    leadSignatureUrl: { type: String },
    // Kahoot-specific fields
    type: { type: String, enum: ["session", "kahoot"], default: "session" },
    position: { type: Number },       // 1, 2, or 3 (kahoot winners only)
    sessionDate: { type: Date },      // date of the kahoot session
    issueDate: { type: Date, default: Date.now },
}, { timestamps: true });

// Include type so a person can have both a session cert AND a kahoot cert
// for the same event name without conflict.
// NOTE: if upgrading an existing DB, drop the old { email_1_eventName_1 } index manually.
CertificateRecordSchema.index({ email: 1, eventName: 1, type: 1 }, { unique: true });

// Clear the model in development to allow schema changes without server restart
if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.CertificateRecord;
}

export default mongoose.models.CertificateRecord || mongoose.model("CertificateRecord", CertificateRecordSchema);
