import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import TechRiseConfig from "@/models/TechRiseConfig";
import { verifyAuth, unauthorized } from "@/lib/auth";
import { CONFIG_KEY, EVENT_DEFAULTS } from "@/lib/techrise";

function withDefaults(doc) {
    const merged = { ...EVENT_DEFAULTS, ...(doc || {}) };
    merged.options = { ...EVENT_DEFAULTS.options, ...(doc?.options || {}) };
    delete merged._id;
    delete merged.__v;
    return merged;
}

// GET — public: event config + form option lists
export async function GET() {
    try {
        await dbConnect();
        const doc = await TechRiseConfig.findOne({ key: CONFIG_KEY }).lean();
        return NextResponse.json(withDefaults(doc));
    } catch {
        return NextResponse.json(withDefaults(null));
    }
}

// PUT — admin: update event config
export async function PUT(request) {
    const user = verifyAuth(request);
    if (!user) return unauthorized();

    try {
        await dbConnect();
        const body = await request.json();
        const allowed = [
            "title", "tagline", "subtitle", "dateISO", "dateLabel", "venue",
            "registrationOpen", "registrationClosesAt", "seatCap", "options",
        ];
        const update = {};
        for (const key of allowed) {
            if (body[key] !== undefined) update[key] = body[key];
        }
        if (update.seatCap !== undefined) update.seatCap = Math.max(0, Number(update.seatCap) || 0);
        if (update.registrationClosesAt === "" || update.registrationClosesAt === null) {
            update.registrationClosesAt = null;
        } else if (update.registrationClosesAt) {
            const d = new Date(update.registrationClosesAt);
            update.registrationClosesAt = Number.isNaN(d.getTime()) ? null : d;
        }

        const doc = await TechRiseConfig.findOneAndUpdate(
            { key: CONFIG_KEY },
            { $set: update },
            { new: true, upsert: true }
        ).lean();

        return NextResponse.json(withDefaults(doc));
    } catch (error) {
        console.error("techrise config PUT:", error);
        return NextResponse.json({ error: "Failed to update config" }, { status: 500 });
    }
}
