import mongoose from "mongoose";

const PosterDownloadSchema = new mongoose.Schema({
    name: { type: String, default: "Anonymous" },
    role: { type: String, default: "" },
    template: { type: String, required: true },
    posterUrl: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.models.PosterDownload ||
    mongoose.model("PosterDownload", PosterDownloadSchema);
