import mongoose from "mongoose";

const TechRiseConfigSchema = new mongoose.Schema({
    key: { type: String, default: "techrise26", unique: true },
    title: { type: String, default: "TechRise '26" },
    tagline: { type: String, default: "Learn • Connect • Rise" },
    subtitle: { type: String, default: "Where Ideas, Talent & Opportunities Come Together." },
    dateISO: { type: String, default: "2026-10-22" },
    dateLabel: { type: String, default: "22 October 2026" },
    venue: { type: String, default: "SSAQ Khan Hall, University of Peshawar" },
    registrationOpen: { type: Boolean, default: true },
    registrationClosesAt: { type: Date, default: null },
    seatCap: { type: Number, default: 0 },
    options: {
        departments: { type: [String], default: undefined },
        semesters: { type: [String], default: undefined },
        institutions: { type: [String], default: undefined },
        regions: { type: [String], default: undefined },
        hearSources: { type: [String], default: undefined },
        partners: { type: [String], default: undefined },
        interests: { type: [String], default: undefined },
    },
}, { timestamps: true });

export default mongoose.models.TechRiseConfig ||
    mongoose.model("TechRiseConfig", TechRiseConfigSchema);
