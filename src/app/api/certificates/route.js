import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import CertificateRecord from "@/models/CertificateRecord";
import CertificateTemplate from "@/models/CertificateTemplate";
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

        // Admin: fetch individual records for a specific batch (for edit)
        if (user && !email) {
            const batchEventName = searchParams.get("eventName");
            const batchType = searchParams.get("type");
            if (batchEventName && batchType) {
                const records = await CertificateRecord.find({
                    eventName: batchEventName,
                    type: batchType,
                }).sort({ position: 1 });
                return NextResponse.json(records);
            }
        }

        if (user && !email) {
            const adminType = searchParams.get("adminType"); // "session" | "kahoot"
            // Existing records without a type field are treated as session certs
            let matchStage;
            if (adminType === "session") {
                matchStage = { $match: { $or: [{ type: "session" }, { type: { $exists: false } }, { type: null }] } };
            } else if (adminType === "kahoot") {
                matchStage = { $match: { type: "kahoot" } };
            } else if (adminType === "custom") {
                matchStage = { $match: { type: "custom" } };
            } else {
                matchStage = { $match: {} };
            }

            const batches = await CertificateRecord.aggregate([
                matchStage,
                {
                    $group: {
                        _id: { $ifNull: ["$eventName", "UNNAMED_EVENT"] },
                        type: { $first: { $ifNull: ["$type", "session"] } },
                        templateKey: { $first: "$templateKey" },
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

        // Resolve templates for special / collaboration certificates.
        // The layout is snapshotted onto each record so later template edits
        // (or deletion) never change certificates that were already issued.
        const normalizeKey = (v) => String(v || "").toLowerCase().trim();
        const customRecords = records.filter(r => r.type === "custom");
        if (customRecords.some(r => !normalizeKey(r.templateKey))) {
            return NextResponse.json(
                { error: "templateKey is required for custom certificates" },
                { status: 400 }
            );
        }
        const templateMap = {};
        if (customRecords.length > 0) {
            const keys = [...new Set(customRecords.map(r => normalizeKey(r.templateKey)))];
            const templates = await CertificateTemplate.find({ key: { $in: keys } });
templates.forEach(t => {
                const o = t.toObject();
                templateMap[o.key] = {
                    key: o.key,
                    name: o.name,
                    backgroundUrl: o.backgroundUrl,
                    layout: o.layout,
                };
            });
            const missing = keys.filter(k => !templateMap[k]);
            if (missing.length > 0) {
                return NextResponse.json(
                    { error: `Unknown template key(s): ${missing.join(", ")}` },
                    { status: 400 }
                );
            }
        }

        // Prepare bulk operations for Upsert
        const ops = records.map(reg => {
            // No specific lead → default signature pair: President stays
            // stamped left; blank role resolves to Patron (Dr Waheed ur
            // Rehman) on the right via the smart-match keyword.
            const hasRole = !!String(reg.rightSignatureRole || "").trim();
            const update = {
                fullName: reg.fullName,
                description: reg.description || "",
                rightSignatureName: reg.rightSignatureName || (hasRole ? "" : "Dr Waheed ur Rehman"),
                rightSignatureRole: hasRole ? reg.rightSignatureRole.trim() : "Patron",
                type: reg.type || "session",
                position: reg.position ?? null,
                sessionDate: reg.sessionDate ? new Date(reg.sessionDate) : null,
                issueDate: reg.issueDate || new Date()
            };
            // Persist uploaded signature overrides; only overwrite when a
            // new one is provided so re-imports don't wipe them.
            if (reg.leadSignatureUrl) update.leadSignatureUrl = reg.leadSignatureUrl;
            if (reg.leftSignatureName) update.leftSignatureName = reg.leftSignatureName;
            if (reg.presidentSignatureUrl) update.presidentSignatureUrl = reg.presidentSignatureUrl;

            // Custom certs: store the key + a fresh layout snapshot.
            // Re-importing a batch refreshes its snapshot; batches that are
            // never re-imported stay frozen at their original layout.
            if (reg.type === "custom") {
                const key = normalizeKey(reg.templateKey);
                update.templateKey = key;
                update.templateSnapshot = templateMap[key];
            }

            // Stamp ONLY brand-new records with the current president so
            // certificates issued under previous presidents keep theirs.
            const onInsert = {
                leftSignatureName: "Mazhar Ahmad",
                presidentSignatureUrl: "/images/signature/president_mazhar.jpeg",
            };
            // MongoDB rejects the same path in $set and $setOnInsert.
            for (const key of Object.keys(update)) delete onInsert[key];

            return {
                updateOne: {
                    // Include type in the filter so session + kahoot certs for the
                    // same event name don't collide.
                    filter: {
                        email: reg.email.toLowerCase(),
                        eventName: reg.eventName,
                        type: reg.type || "session"
                    },
                    update: {
                        $set: update,
                        ...(Object.keys(onInsert).length > 0 ? { $setOnInsert: onInsert } : {})
                    },
                    upsert: true
                }
            };
        });

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

// Admin: Batch-edit issued certificates (description / signatory fields).
// Event name + template fields stay fixed — eventName is the batch identity.
export async function PATCH(request) {
    const user = verifyAuth(request);
    if (!user) return unauthorized();

    try {
        await dbConnect();
        const { eventName, type = "custom", updates } = await request.json();

        if (!eventName || typeof eventName !== "string") {
            return NextResponse.json({ error: "eventName is required" }, { status: 400 });
        }

        const allowed = ["description", "rightSignatureName", "rightSignatureRole", "leadSignatureUrl"];
        const $set = {};
        for (const k of allowed) {
            if (k in (updates || {})) $set[k] = String(updates[k] ?? "");
        }
        // Blank role → default Patron pair (same resolution as import).
        if ("rightSignatureRole" in $set && !$set.rightSignatureRole.trim()) {
            $set.rightSignatureRole = "Patron";
            if ("rightSignatureName" in $set && !$set.rightSignatureName.trim()) {
                $set.rightSignatureName = "Dr Waheed ur Rehman";
            }
        }
        if (Object.keys($set).length === 0) {
            return NextResponse.json({ error: "No editable fields provided" }, { status: 400 });
        }

        const result = await CertificateRecord.updateMany(
            { eventName, type },
            { $set }
        );
        return NextResponse.json({ message: "Batch updated", modifiedCount: result.modifiedCount });
    } catch (error) {
        console.error("CERTIFICATE_BATCH_EDIT_ERROR:", error);
        return NextResponse.json({ error: "Failed to update batch", details: error.message }, { status: 500 });
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
