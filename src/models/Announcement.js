import mongoose from "mongoose";

const AnnouncementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: "" },
    googleFormLink: { type: String, required: true },
    expiryDate: { type: Date, required: true },
}, { timestamps: true });

export default mongoose.models.Announcement || mongoose.model("Announcement", AnnouncementSchema);
