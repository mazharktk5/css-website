import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Announcement from "@/models/Announcement";
import { verifyAuth, unauthorized } from "@/lib/auth";

// GET all announcements or only active ones
export async function GET(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const activeOnly = searchParams.get("active") === "true";

        let query = {};
        if (activeOnly) {
            query.expiryDate = { $gte: new Date() };
        }

        const announcements = await Announcement.find(query).sort({ expiryDate: 1 });
        return NextResponse.json(announcements);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
    }
}

// POST create announcement (auth required)
export async function POST(request) {
    const user = verifyAuth(request);
    if (!user) return unauthorized();

    try {
        await dbConnect();
        const body = await request.json();
        const announcement = await Announcement.create(body);
        return NextResponse.json(announcement, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 });
    }
}
