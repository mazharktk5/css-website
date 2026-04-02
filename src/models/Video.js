import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    youtubeUrl: { type: String, required: true },
    videoId: { type: String, required: true },
    thumbnail: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Video || mongoose.model("Video", VideoSchema);
