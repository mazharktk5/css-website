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
            const adminType = searchParams.get("adminType"); // "session" | "kahoot"
            // Existing records without a type field are treated as session certs
            let matchStage;
            if (adminType === "session") {
                matchStage = { $match: { $or: [{ type: "session" }, { type: { $exists: false } }, { type: null }] } };
            } else if (adminType === "kahoot") {
                matchStage = { $match: { type: "kahoot" } };
            } else {
                matchStage = { $match: {} };
            }

            const batches = await CertificateRecord.aggregate([
                matchStage,
                {
                    $group: {
                        _id: { $ifNull: ["$eventName", "UNNAMED_EVENT"] },
                        type: { $first: { $ifNull: ["$type", "session"] } },
                        description: { $first: "$description" },
                        rightSignatureName: { $first: "$rightSignatureName" },
                        rightSignatureRole: { $first: "$rightSignatureRole" },
                        leadSignatureUrl: { $first: "$leadSignatureUrl" },
                        count: { $sum: 1 },
                        lastUpdated: { $max: "$updatedAt" }
                    }
                },
                { $sort: { lastUpdated: -1 } }
            ]);

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
                // Include type in the filter so session + kahoot certs for the
                // same event name don't collide.
                filter: {
                    email: reg.email.toLowerCase(),
                    eventName: reg.eventName,
                    type: reg.type || "session"
                },
                update: {
                    $set: {
                        fullName: reg.fullName,
                        description: reg.description || "",
                        leftSignatureName: "Muhammad Ilyas",
                        rightSignatureName: reg.rightSignatureName || "",
                        rightSignatureRole: reg.rightSignatureRole || "Club Lead",
                        type: reg.type || "session",
                        position: reg.position ?? null,
                        sessionDate: reg.sessionDate ? new Date(reg.sessionDate) : null,
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
        const batchType = searchParams.get("type");       // "session" | "kahoot"
        const clearAll = searchParams.get("clearAll");

        if (clearAll) {
            await CertificateRecord.deleteMany({});
            return NextResponse.json({ message: "Database cleared successfully" });
        }

        if (eventName) {
            // Match exactly or if it was unnamed; optionally scope to a cert type
            let filter = eventName === "UNNAMED_EVENT" ? { eventName: { $in: [null, ""] } } : { eventName };
            if (batchType) filter = { ...filter, type: batchType };
            await CertificateRecord.deleteMany(filter);

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
