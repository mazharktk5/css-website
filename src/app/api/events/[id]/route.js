import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Event from "@/models/Event";
import { verifyAuth, unauthorized } from "@/lib/auth";

// PUT update event
export async function PUT(request, { params }) {
    const user = verifyAuth(request);
    if (!user) return unauthorized();

    try {
        await dbConnect();
        const { id } = await params;
        const body = await request.json();
        const event = await Event.findByIdAndUpdate(id, body, { new: true });
        if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });
        return NextResponse.json(event);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
    }
}

// DELETE event
export async function DELETE(request, { params }) {
    const user = verifyAuth(request);
    if (!user) return unauthorized();

    try {
        await dbConnect();
        const { id } = await params;
        const event = await Event.findByIdAndDelete(id);
        if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });
        return NextResponse.json({ message: "Event deleted" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
    }
}
