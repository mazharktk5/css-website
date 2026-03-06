import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Event from "@/models/Event";
import { verifyAuth, unauthorized } from "@/lib/auth";

// GET events with pagination (public)
export async function GET(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;
        const skip = (page - 1) * limit;

        const events = await Event.find({})
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Event.countDocuments();

        return NextResponse.json({
            events,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
    }
}

// POST create event (auth required)
export async function POST(request) {
    const user = verifyAuth(request);
    if (!user) return unauthorized();

    try {
        await dbConnect();
        const body = await request.json();
        const event = await Event.create(body);
        return NextResponse.json(event, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
    }
}
