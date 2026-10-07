import mongoose from "mongoose";

const TechRiseRegistrationSchema = new mongoose.Schema({
    regId: { type: String, required: true, unique: true },
    seq: { type: Number, required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, default: "", trim: true },
    institution: { type: String, default: "", trim: true },
    department: { type: String, default: "", trim: true },
    semester: { type: String, default: "", trim: true },
    region: { type: String, default: "", trim: true },
    communityPartner: { type: String, default: "", trim: true },
    hearSource: { type: String, default: "", trim: true },
    interests: { type: String, default: "", trim: true },
    consent: { type: Boolean, default: false },
    photoUrl: { type: String, default: "", trim: true },
    checkInToken: { type: String, required: true, unique: true },
    checkedIn: { type: Boolean, default: false },
    checkedInAt: { type: Date, default: null },
    checkedInMethod: { type: String, default: "" },
}, { timestamps: true });

TechRiseRegistrationSchema.index({ name: "text", email: "text", regId: "text", phone: "text" });

export default mongoose.models.TechRiseRegistration ||
    mongoose.model("TechRiseRegistration", TechRiseRegistrationSchema);
