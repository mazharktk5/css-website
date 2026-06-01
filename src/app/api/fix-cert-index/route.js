import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { verifyAuth, unauthorized } from "@/lib/auth";
import mongoose from "mongoose";

// One-time migration: drop the old 2-field unique index so the new
// 3-field index (email + eventName + type) can work correctly.
export async function POST(request) {
    const user = verifyAuth(request);
    if (!user) return unauthorized();

    try {
        await dbConnect();
        const collection = mongoose.connection.collection("certificaterecords");

        // List existing indexes so we know what to drop
        const indexes = await collection.indexes();
        const oldIndex = indexes.find(idx => idx.name === "email_1_eventName_1");

        if (!oldIndex) {
            return NextResponse.json({ message: "Old index not found — nothing to do." });
        }

        await collection.dropIndex("email_1_eventName_1");

        return NextResponse.json({ message: "Old index dropped. The new index (email + eventName + type) is now active." });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fix index: " + error.message }, { status: 500 });
    }
}
