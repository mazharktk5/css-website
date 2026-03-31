import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import { verifyAuth, unauthorized } from "@/lib/auth";

// GET all posts
export async function GET() {
    try {
        await dbConnect();
        const posts = await BlogPost.find({}).sort({ createdAt: -1 });
        return NextResponse.json(posts);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
    }
}

// POST create post (auth required)
export async function POST(request) {
    const user = verifyAuth(request);
    if (!user) return unauthorized();

    try {
        await dbConnect();
        const body = await request.json();
        
        if (!body.content && !body.image) {
            return NextResponse.json({ error: "Content or Image is required" }, { status: 400 });
        }

        const post = await BlogPost.create(body);
        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
    }
}
