import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import { verifyAuth, unauthorized } from "@/lib/auth";

// PATCH update a post
export async function PATCH(request, { params }) {
    const user = verifyAuth(request);
    if (!user) return unauthorized();

    const { id } = await params;
    const body = await request.json();
    const { content, image } = body;

    try {
        await dbConnect();
        const post = await BlogPost.findByIdAndUpdate(
            id,
            { content, image },
            { new: true }
        );

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
    }
}

// DELETE a post
export async function DELETE(request, { params }) {
    const user = verifyAuth(request);
    if (!user) return unauthorized();
    
    const { id } = await params;

    try {
        await dbConnect();
        const post = await BlogPost.findByIdAndDelete(id);
        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Post deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
    }
}
