import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Announcement from "@/models/Announcement";
import { verifyAuth, unauthorized } from "@/lib/auth";

// GET announcements with pagination
export async function GET(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const activeOnly = searchParams.get("active") === "true";
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;
        const skip = (page - 1) * limit;

        let query = {};
        if (activeOnly) {
            query.expiryDate = { $gte: new Date() };
        }

        const announcements = await Announcement.find(query)
            .sort({ expiryDate: 1 })
            .skip(skip)
            .limit(limit);

        const total = await Announcement.countDocuments(query);

        return NextResponse.json({
            announcements,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
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
