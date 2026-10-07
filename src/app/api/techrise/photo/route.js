import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";
import TechRiseRegistration from "@/models/TechRiseRegistration";

const MAX_BYTES = 8 * 1024 * 1024; // 8MB
const TOKEN_RE = /^[a-f0-9]{32}$/;

// POST — public: attendee uploads their own share-card photo, identified by
// their check-in token (proves they own the registration; no admin auth
// needed since this is a self-service step on the public ticket page).
export async function POST(request) {
    try {
        await dbConnect();
        const formData = await request.formData();
        const token = String(formData.get("token") || "").trim();
        const file = formData.get("file");

        if (!TOKEN_RE.test(token)) {
            return NextResponse.json({ error: "Invalid ticket link" }, { status: 400 });
        }
        if (!file || typeof file === "string") {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }
        if (!file.type?.startsWith("image/")) {
            return NextResponse.json({ error: "Please upload an image file" }, { status: 400 });
        }
        if (file.size > MAX_BYTES) {
            return NextResponse.json({ error: "Image is too large (max 8MB)" }, { status: 400 });
        }

        const existing = await TechRiseRegistration.findOne({ checkInToken: token }).select("_id").lean();
        if (!existing) {
            return NextResponse.json({ error: "Registration not found" }, { status: 404 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const uploadResponse = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: "techrise26-photos", resource_type: "image" },
                (error, result) => (error ? reject(error) : resolve(result))
            ).end(buffer);
        });

        await TechRiseRegistration.updateOne(
            { _id: existing._id },
            { $set: { photoUrl: uploadResponse.secure_url } }
        );

        return NextResponse.json({ success: true, photoUrl: uploadResponse.secure_url });
    } catch (error) {
        console.error("techrise photo POST:", error);
        return NextResponse.json({ error: "Failed to upload photo" }, { status: 500 });
    }
}
