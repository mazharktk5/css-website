import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Registration from "@/models/Registration";
import { verifyAuth, unauthorized } from "@/lib/auth";

const OBJECT_ID_RE = /^[a-f\d]{24}$/i;

// GET /api/registrations?q=&event= — admin list with search + event filter.
export async function GET(request) {
    const user = verifyAuth(request);
    if (!user) return unauthorized();

    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const q = (searchParams.get("q") || "").trim();
        const eventFilter = (searchParams.get("event") || "").trim();

        const query = {};
        if (OBJECT_ID_RE.test(eventFilter)) {
            query["event.id"] = eventFilter;
        } else if (eventFilter === "global") {
            query["event.id"] = null;
        }
        if (q) {
            const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
            query.$or = [
                { name: rx },
                { email: rx },
                { program: rx },
                { university: rx },
                { department: rx },
                { "event.title": rx },
            ];
        }

        const registrations = await Registration.find(query)
            .sort({ createdAt: -1 })
            .limit(5000);
        return NextResponse.json(registrations);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch registrations" }, { status: 500 });
    }
}
