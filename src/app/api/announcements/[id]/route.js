import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Announcement from "@/models/Announcement";
import { verifyAuth, unauthorized } from "@/lib/auth";

// PUT update announcement (auth required)
export async function PUT(request, { params }) {
    const user = verifyAuth(request);
    if (!user) return unauthorized();

    try {
        await dbConnect();
        const { id } = await params;
        const body = await request.json();

        // Remove _id from body if it exists to avoid Mongoose immutable field error
        const { _id, ...updateData } = body;

        const announcement = await Announcement.findByIdAndUpdate(id, updateData, { new: true });

        if (!announcement) {
            return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
        }

        return NextResponse.json(announcement);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update announcement" }, { status: 500 });
    }
}

// DELETE announcement (auth required)
export async function DELETE(request, { params }) {
    const user = verifyAuth(request);
    if (!user) return unauthorized();

    try {
        await dbConnect();
        const { id } = await params;
        const announcement = await Announcement.findByIdAndDelete(id);

        if (!announcement) {
            return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Announcement deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete announcement" }, { status: 500 });
    }
}
