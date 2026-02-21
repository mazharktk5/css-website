import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import GalleryItem from "@/models/GalleryItem";
import { verifyAuth, unauthorized } from "@/lib/auth";

// GET all gallery items (public)
export async function GET() {
    try {
        await dbConnect();
        const items = await GalleryItem.find({}).sort({ createdAt: -1 });
        return NextResponse.json(items);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch gallery items" }, { status: 500 });
    }
}

// POST create gallery item (auth required)
export async function POST(request) {
    const user = verifyAuth(request);
    if (!user) return unauthorized();

    try {
        await dbConnect();
        const body = await request.json();
        const item = await GalleryItem.create(body);
        return NextResponse.json(item, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create gallery item" }, { status: 500 });
    }
}
