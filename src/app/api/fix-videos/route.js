import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Video from "@/models/Video";

export async function GET() {
    try {
        await dbConnect();
        
        // Find all videos that use maxresdefault.jpg
        const videos = await Video.find({ thumbnail: /maxresdefault\.jpg/ });
        
        let count = 0;
        for (const video of videos) {
            video.thumbnail = video.thumbnail.replace("maxresdefault.jpg", "hqdefault.jpg");
            await video.save();
            count++;
        }
        
        return NextResponse.json({ 
            message: `Successfully updated ${count} videos.`,
            status: "success" 
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
