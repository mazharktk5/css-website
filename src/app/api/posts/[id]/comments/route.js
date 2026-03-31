import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";

// POST add a comment (Anonymous)
export async function POST(request, { params }) {
    const { id } = await params;
    const { text } = await request.json();

    if (!text) {
        return NextResponse.json({ error: "Comment text is required" }, { status: 400 });
    }

    try {
        await dbConnect();
        
        // Push the new comment without userId
        const post = await BlogPost.findByIdAndUpdate(
            id,
            { $push: { comments: { text } } },
            { new: true, runValidators: true }
        );

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        const addedComment = post.comments[post.comments.length - 1];
        return NextResponse.json(addedComment, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
    }
}
