import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import TechRiseRegistration from "@/models/TechRiseRegistration";
import { verifyAuth, unauthorized } from "@/lib/auth";

// GET — admin: registrations list + stats + community performance
export async function GET(request) {
    const user = verifyAuth(request);
    if (!user) return unauthorized();

    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status") || "all";
        const q = (searchParams.get("q") || "").trim();

        const query = {};
        if (status === "checkedin") query.checkedIn = true;
        if (status === "pending") query.checkedIn = false;
        if (q) {
            const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
            query.$or = [{ name: rx }, { email: rx }, { regId: rx }, { phone: rx }, { communityPartner: rx }];
        }

        const rows = await TechRiseRegistration.find(query)
            .sort({ seq: -1 })
            .limit(5000)
            .select("-__v")
            .lean();

        const all = rows.length === 5000 && q
            ? await TechRiseRegistration.find().select("communityPartner checkedIn").lean()
            : rows;

        const total = all.length;
        const checkedIn = all.filter((r) => r.checkedIn).length;

        const partnerMap = new Map();
        for (const r of all) {
            const key = r.communityPartner?.trim() || "General attendee";
            const entry = partnerMap.get(key) || { partner: key, registered: 0, attended: 0 };
            entry.registered += 1;
            if (r.checkedIn) entry.attended += 1;
            partnerMap.set(key, entry);
        }
        const partnerPerformance = [...partnerMap.values()]
            .map((p) => ({ ...p, rate: p.registered ? Math.round((p.attended / p.registered) * 100) : 0 }))
            .sort((a, b) => b.attended - a.attended || b.registered - a.registered);

        return NextResponse.json({
            rows,
            stats: { total, checkedIn, pending: total - checkedIn },
            partnerPerformance,
        });
    } catch (error) {
        console.error("techrise registrations GET:", error);
        return NextResponse.json({ error: "Failed to fetch registrations" }, { status: 500 });
    }
}
