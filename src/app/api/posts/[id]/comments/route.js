import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";

// POST add a comment
export async function POST(request, { params }) {
    const { id } = await params;
    const { text } = await request.json();

    if (!text) {
        return NextResponse.json({ error: "Comment text is required" }, { status: 400 });
    }

    try {
        await dbConnect();
        
        // Use findByIdAndUpdate to push the comment
        await BlogPost.findByIdAndUpdate(
            id,
            { $push: { comments: { text } } },
            { runValidators: true }
        );

        // ALWAYS re-fetch from the database to avoid stale model cache issues in memory
        // Using .lean() ensures we get a plain JS object with all fields from the DB
        const postDoc = await BlogPost.findById(id).lean();

        if (!postDoc) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        // Defensive check: if comments still don't exist, we might have a massive staleness issue
        if (!postDoc.comments || postDoc.comments.length === 0) {
            return NextResponse.json({ error: "Database updated, but comments are still not visible. Please refresh the page." }, { status: 500 });
        }

        const addedComment = postDoc.comments[postDoc.comments.length - 1];
        return NextResponse.json(addedComment, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: `Server Error: ${error.message}` }, { status: 500 });
    }
}
