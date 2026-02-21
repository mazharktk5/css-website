import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, default: "" },
    location: { type: String, default: "" },
    image: { type: String, default: "" },
    description: { type: String, default: "" },
    tags: [{ type: String }],
    registrationLink: { type: String, default: "#" },
    category: { type: String, required: true },
    participants: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
