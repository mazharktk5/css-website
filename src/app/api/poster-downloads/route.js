import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import PosterDownload from "@/models/PosterDownload";
import cloudinary from "@/lib/cloudinary";
import { verifyAuth } from "@/lib/auth";

// GET — public returns {count}; authenticated admin returns full list
export async function GET(request) {
    try {
        await dbConnect();
        const user = verifyAuth(request);
        if (user) {
            const downloads = await PosterDownload.find({})
                .sort({ createdAt: -1 })
                .limit(500);
            return NextResponse.json(downloads);
        }
        const count = await PosterDownload.countDocuments();
        return NextResponse.json({ count });
    } catch {
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}

// POST — public, saves a poster download record + 270px thumbnail to Cloudinary
export async function POST(request) {
    try {
        await dbConnect();
        const { name, role, template, thumbDataUrl } = await request.json();

        if (!template) return NextResponse.json({ error: "Missing template" }, { status: 400 });

        let posterUrl = "";
        if (thumbDataUrl) {
            try {
                const result = await cloudinary.uploader.upload(thumbDataUrl, {
                    folder: "css-society/posters",
                    transformation: [{ width: 540, height: 540, crop: "scale", quality: "auto" }],
                });
                posterUrl = result.secure_url;
            } catch {
                // upload failure is non-fatal — we still save the metadata
            }
        }

        const record = await PosterDownload.create({
            name: name || "Anonymous",
            role: role || "",
            template,
            posterUrl,
        });

        return NextResponse.json({ success: true, id: record._id }, { status: 201 });
    } catch (err) {
        console.error("poster-downloads POST:", err);
        return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }
}
