import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import GalleryItem from "@/models/GalleryItem";
import { verifyAuth, unauthorized } from "@/lib/auth";

// GET gallery items with pagination (public)
export async function GET(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 12;
        const category = searchParams.get("category");
        const skip = (page - 1) * limit;

        const query = {};
        if (category && category !== "All") {
            query.category = { $regex: new RegExp(`^${category}$`, 'i') };
        }

        const items = await GalleryItem.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await GalleryItem.countDocuments(query);

        // Fetch all unique categories for the filter bar (normalized)
        const rawCategories = await GalleryItem.distinct("category");
        const normalizedCategories = ["All", ...new Set(rawCategories.map(c =>
            c.charAt(0).toUpperCase() + c.slice(1).toLowerCase()
        ))];

        return NextResponse.json({
            items,
            categories: normalizedCategories,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
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
