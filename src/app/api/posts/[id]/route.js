import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import { verifyAuth, unauthorized } from "@/lib/auth";

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
