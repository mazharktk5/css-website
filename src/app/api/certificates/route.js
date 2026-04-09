import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import CertificateRecord from "@/models/CertificateRecord";
import { verifyAuth, unauthorized } from "@/lib/auth";

// Public: Find certificates by email
// Admin: If auth is provided and no email, returns aggregated event batches
export async function GET(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const email = searchParams.get("email");

        // If it's an admin looking for batches
        const user = verifyAuth(request);
        if (user && !email) {
            // Aggressive aggregate to find any records, even corrupted ones
            const batches = await CertificateRecord.aggregate([
                {
                    $group: {
                        _id: { $ifNull: ["$eventName", "UNNAMED_EVENT"] },
                        description: { $first: "$description" },
                        rightSignatureName: { $first: "$rightSignatureName" },
                        rightSignatureRole: { $first: "$rightSignatureRole" },
                        leadSignatureUrl: { $first: "$leadSignatureUrl" },
                        count: { $sum: 1 },
                        lastUpdated: { $max: "$updatedAt" }
                    }
                },
                // Filter out records that have no valid ID (optional, but let's see them for debugging)
                { $sort: { lastUpdated: -1 } }
            ]);
            
            console.log(`FETCH_BATCHES: Found ${batches.length} groups.`);
            return NextResponse.json(batches);
        }

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const records = await CertificateRecord.find({ email: email.toLowerCase() }).sort({ createdAt: -1 });
        return NextResponse.json(records);
    } catch (error) {
        console.error("GET_CERTIFICATES_ERROR:", error);
        return NextResponse.json({ error: "Failed to fetch certificates", details: error.message }, { status: 500 });
    }
}

// Admin: Bulk upload certificate records with DUPLICATE PREVENTION (Upsert)
export async function POST(request) {
    const user = verifyAuth(request);
    if (!user) return unauthorized();

    try {
        await dbConnect();
        const { records } = await request.json();

        if (!Array.isArray(records) || records.length === 0) {
            return NextResponse.json({ error: "Invalid records format" }, { status: 400 });
        }

        // Prepare bulk operations for Upsert
        const ops = records.map(reg => ({
            updateOne: {
                filter: { email: reg.email.toLowerCase(), eventName: reg.eventName },
                update: {
                    $set: {
                        fullName: reg.fullName,
                        description: reg.description,
                        leftSignatureName: "Muhammad Ilyas",
                        rightSignatureName: reg.rightSignatureName,
                        rightSignatureRole: reg.rightSignatureRole || "Club Lead",
                        issueDate: reg.issueDate || new Date()
                    }
                },
                upsert: true
            }
        }));

        const result = await CertificateRecord.bulkWrite(ops);

        return NextResponse.json({ 
            message: "Records processed successfully",
            details: `${result.upsertedCount} new, ${result.modifiedCount} updated`
        }, { status: 201 });
    } catch (error) {
        console.error("CERTIFICATE_IMPORT_ERROR:", error);
        return NextResponse.json({ error: "Failed to import records", details: error.message }, { status: 500 });
    }
}

// Admin: Delete an entire batch or a specific record
export async function DELETE(request) {
    const user = verifyAuth(request);
    if (!user) return unauthorized();

    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id"); // Specific record ID
        const eventName = searchParams.get("eventName"); // Batch delete
        const clearAll = searchParams.get("clearAll");

        if (clearAll) {
            const result = await CertificateRecord.deleteMany({});
            console.log("CLEAR_ALL_RESULT:", result);
            return NextResponse.json({ message: "Database cleared successfully" });
        }

        if (eventName) {
            // Match exactly or if it was unnamed
            const filter = eventName === "UNNAMED_EVENT" ? { eventName: { $in: [null, ""] } } : { eventName };
            const result = await CertificateRecord.deleteMany(filter);
            console.log(`DELETE_BATCH_RESULT (${eventName}):`, result);
            return NextResponse.json({ message: "Batch deleted" });
        }

        if (id) {
            await CertificateRecord.findByIdAndDelete(id);
            return NextResponse.json({ message: "Record deleted" });
        }

        return NextResponse.json({ error: "ID or Event Name is required" }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete record", details: error.message }, { status: 500 });
    }
}
