import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Event from "@/models/Event";
import { verifyAuth, unauthorized } from "@/lib/auth";

// GET all events (public)
export async function GET() {
    try {
        await dbConnect();
        const events = await Event.find({}).sort({ date: -1 });
        return NextResponse.json(events);
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
