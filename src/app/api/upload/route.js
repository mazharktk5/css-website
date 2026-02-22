import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { verifyAuth, unauthorized } from "@/lib/auth";

export async function POST(request) {
    const user = verifyAuth(request);
    if (!user) return unauthorized();

    try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        console.log("Cloudinary Config Check:", {
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "Set" : "Missing",
            api_key: process.env.CLOUDINARY_API_KEY ? "Set" : "Missing",
            api_secret: process.env.CLOUDINARY_API_SECRET ? "Set" : "Missing",
        });

        const uploadResponse = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "css-society",
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });

        return NextResponse.json({
            url: uploadResponse.secure_url,
            public_id: uploadResponse.public_id,
        });
    } catch (error) {
        console.error("Full Upload error object:", error);
        return NextResponse.json({
            error: "Failed to upload image",
            details: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
