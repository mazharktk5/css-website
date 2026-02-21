import mongoose from "mongoose";

const TeamMemberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    subRole: { type: String, default: "" },
    image: { type: String, default: "" },
    section: { type: String, enum: ["executive", "cabinet", "clubs"], required: true },
    order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.TeamMember || mongoose.model("TeamMember", TeamMemberSchema);
