import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import { verifyAuth, unauthorized } from "@/lib/auth";

// DELETE a specific comment
export async function DELETE(request, { params }) {
    const user = verifyAuth(request);
    if (!user) return unauthorized();

    const { id, commentId } = await params;

    try {
        await dbConnect();
        const post = await BlogPost.findByIdAndUpdate(
            id,
            { $pull: { comments: { _id: commentId } } },
            { new: true }
        );

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Comment deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
    }
}
