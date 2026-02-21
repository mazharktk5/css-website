import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import GalleryItem from "@/models/GalleryItem";
import { verifyAuth, unauthorized } from "@/lib/auth";

// PUT update gallery item
export async function PUT(request, { params }) {
    const user = verifyAuth(request);
    if (!user) return unauthorized();

    try {
        await dbConnect();
        const { id } = await params;
        const body = await request.json();
        const item = await GalleryItem.findByIdAndUpdate(id, body, { new: true });
        if (!item) return NextResponse.json({ error: "Gallery item not found" }, { status: 404 });
        return NextResponse.json(item);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update gallery item" }, { status: 500 });
    }
}

// DELETE gallery item
export async function DELETE(request, { params }) {
    const user = verifyAuth(request);
    if (!user) return unauthorized();

    try {
        await dbConnect();
        const { id } = await params;
        const item = await GalleryItem.findByIdAndDelete(id);
        if (!item) return NextResponse.json({ error: "Gallery item not found" }, { status: 404 });
        return NextResponse.json({ message: "Gallery item deleted" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete gallery item" }, { status: 500 });
    }
}
