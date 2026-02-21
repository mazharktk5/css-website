import mongoose from "mongoose";

const GalleryItemSchema = new mongoose.Schema({
    eventName: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.models.GalleryItem || mongoose.model("GalleryItem", GalleryItemSchema);
