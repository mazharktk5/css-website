import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import { verifyAuth, unauthorized } from "@/lib/auth";

// GET all posts
export async function GET() {
    try {
        await dbConnect();
        // Fetch posts without user population
        const posts = await BlogPost.find({}).sort({ createdAt: -1 }).lean();
        return NextResponse.json(posts);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
    }
}

// POST a new post
export async function POST(request) {
    const user = verifyAuth(request);
    if (!user || user.role !== 'admin') return unauthorized();

    try {
        await dbConnect();
        const body = await request.json();
        const post = await BlogPost.create(body);
        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
    }
}
