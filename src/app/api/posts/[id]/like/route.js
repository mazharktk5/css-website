import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";

// PATCH update like status (Anonymous)
export async function PATCH(request, { params }) {
    const { id } = await params;
    const { action } = await request.json(); // "like" or "unlike"

    try {
        await dbConnect();
        
        let update;
        if (action === "unlike") {
            update = { $inc: { likes: -1 } };
        } else {
            update = { $inc: { likes: 1 } };
        }

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
