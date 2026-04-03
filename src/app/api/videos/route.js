import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Video from "@/models/Video";
import { verifyAuth, unauthorized } from "@/lib/auth";

// Helper to extract Video ID from various YouTube URL formats
function getYoutubeVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// GET videos with pagination (public)
export async function GET(request) {
    try {
        await dbConnect();
        const videos = await Video.find({}).sort({ createdAt: -1 });
        return NextResponse.json(videos);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
    }
}

// POST create video (auth required)
export async function POST(request) {
    const user = verifyAuth(request);
    if (!user) return unauthorized();

    try {
        await dbConnect();
        const body = await request.json();
        const { title, youtubeUrl } = body;

        if (!title || !youtubeUrl) {
            return NextResponse.json({ error: "Title and YouTube URL are required" }, { status: 400 });
        }

        const videoId = getYoutubeVideoId(youtubeUrl);
        if (!videoId) {
            return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
        }

        const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

        const video = await Video.create({
            title,
            youtubeUrl,
            videoId,
            thumbnail,
        });

        return NextResponse.json(video, { status: 201 });
    } catch (error) {
        console.error("Video creation error:", error);
        return NextResponse.json({ error: "Failed to create video" }, { status: 500 });
    }
}

// PUT update video (auth required)
export async function PUT(request) {
    const user = verifyAuth(request);
    if (!user) return unauthorized();

    try {
        await dbConnect();
        const body = await request.json();
        const { _id, title, youtubeUrl } = body;

        if (!_id || !title || !youtubeUrl) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const videoId = getYoutubeVideoId(youtubeUrl);
        if (!videoId) {
            return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
        }

        const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

        const video = await Video.findByIdAndUpdate(
            _id,
            { title, youtubeUrl, videoId, thumbnail },
            { new: true }
        );

        if (!video) {
            return NextResponse.json({ error: "Video not found" }, { status: 404 });
        }

        return NextResponse.json(video);
    } catch (error) {
        console.error("Video update error:", error);
        return NextResponse.json({ error: "Failed to update video" }, { status: 500 });
    }
}

// DELETE video (auth required)
export async function DELETE(request) {
    const user = verifyAuth(request);
    if (!user) return unauthorized();

    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Video ID is required" }, { status: 400 });
        }

        await Video.findByIdAndDelete(id);
        return NextResponse.json({ message: "Video deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete video" }, { status: 500 });
    }
}
