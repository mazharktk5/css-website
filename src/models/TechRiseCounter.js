import mongoose from "mongoose";

const TechRiseCounterSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    seq: { type: Number, default: 0 },
});

export default mongoose.models.TechRiseCounter ||
    mongoose.model("TechRiseCounter", TechRiseCounterSchema);
