import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    youtubeUrl: { type: String, required: true },
    videoId: { type: String, required: true },
    thumbnail: { type: String, required: true },
    description: { type: String, default: "" },
    category: { type: String, default: "Computing" },
}, { timestamps: true });

export default mongoose.models.Video || mongoose.model("Video", VideoSchema);
