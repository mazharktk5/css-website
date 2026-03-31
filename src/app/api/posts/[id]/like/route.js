import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";

// PATCH increment/decrement likes
export async function PATCH(request, { params }) {
    const { id } = await params;
    const body = await request.json();
    const { action } = body; // "like" or "unlike"

    try {
        await dbConnect();
        
        const update = action === "unlike" 
            ? { $inc: { likes: -1 } } 
            : { $inc: { likes: 1 } };

        const post = await BlogPost.findByIdAndUpdate(
            id,
            update,
            { new: true }
        );

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        return NextResponse.json({ likes: post.likes });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update like status" }, { status: 500 });
    }
}
