import mongoose from "mongoose";

const CertificateRecordSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    eventName: { type: String, required: true },
    description: { type: String, required: true },
    leftSignatureName: { type: String, default: "Muhammad Ilyas" },
    rightSignatureName: { type: String, required: true },
    rightSignatureRole: { type: String, default: "Club Lead" },
    leadSignatureUrl: { type: String }, // Dynamic signature image
    issueDate: { type: Date, default: Date.now },
}, { timestamps: true });

CertificateRecordSchema.index({ email: 1, eventName: 1 }, { unique: true });

// Clear the model in development to allow schema changes without server restart
if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.CertificateRecord;
}

export default mongoose.models.CertificateRecord || mongoose.model("CertificateRecord", CertificateRecordSchema);
