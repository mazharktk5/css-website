import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import TechRiseRegistration from "@/models/TechRiseRegistration";
import TechRiseConfig from "@/models/TechRiseConfig";
import { CONFIG_KEY, EVENT_DEFAULTS } from "@/lib/techrise";

// GET — public: fetch the minimal ticket payload for a check-in token.
// Deliberately returns only what the ticket graphic needs (no phone/email).
export async function GET(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const token = (searchParams.get("token") || "").trim();
        if (!/^[a-f0-9]{32}$/.test(token)) {
            return NextResponse.json({ error: "Invalid ticket link" }, { status: 400 });
        }

        const doc = await TechRiseRegistration.findOne({ checkInToken: token })
            .select("regId name department communityPartner checkedIn checkedInAt photoUrl")
            .lean();
        if (!doc) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });

        const config = await TechRiseConfig.findOne({ key: CONFIG_KEY }).lean();
        const merged = { ...EVENT_DEFAULTS, ...(config || {}) };

        return NextResponse.json({
            regId: doc.regId,
            name: doc.name,
            department: doc.department,
            communityPartner: doc.communityPartner,
            checkedIn: doc.checkedIn,
            photoUrl: doc.photoUrl || "",
            event: { title: merged.title, tagline: merged.tagline, dateLabel: merged.dateLabel, dateISO: merged.dateISO, venue: merged.venue },
        });
    } catch (error) {
        console.error("techrise lookup GET:", error);
        return NextResponse.json({ error: "Failed to load ticket" }, { status: 500 });
    }
}
