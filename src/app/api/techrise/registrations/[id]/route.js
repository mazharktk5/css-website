import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import TechRiseRegistration from "@/models/TechRiseRegistration";
import { verifyAuth, unauthorized } from "@/lib/auth";

// PATCH — admin: manual check-in toggle / edit registrant details
export async function PATCH(request, { params }) {
    const user = verifyAuth(request);
    if (!user) return unauthorized();

    try {
        await dbConnect();
        const { id } = await params;
        const body = await request.json();

        const update = {};
        if (typeof body.checkedIn === "boolean") {
            update.checkedIn = body.checkedIn;
            update.checkedInAt = body.checkedIn ? new Date() : null;
            update.checkedInMethod = body.checkedIn ? "manual" : "";
        }
        const editable = ["name", "phone", "institution", "department", "semester", "communityPartner", "hearSource"];
        for (const field of editable) {
            if (typeof body[field] === "string") update[field] = body[field].trim();
        }

        if (Object.keys(update).length === 0) {
            return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
        }

        const doc = await TechRiseRegistration.findByIdAndUpdate(id, { $set: update }, { new: true })
            .select("-__v")
            .lean();
        if (!doc) return NextResponse.json({ error: "Registration not found" }, { status: 404 });

        return NextResponse.json(doc);
    } catch (error) {
        console.error("techrise registration PATCH:", error);
        return NextResponse.json({ error: "Failed to update registration" }, { status: 500 });
    }
}

// DELETE — admin: remove a registration
export async function DELETE(request, { params }) {
    const user = verifyAuth(request);
    if (!user) return unauthorized();

    try {
        await dbConnect();
        const { id } = await params;
        const doc = await TechRiseRegistration.findByIdAndDelete(id).select("regId").lean();
        if (!doc) return NextResponse.json({ error: "Registration not found" }, { status: 404 });
        return NextResponse.json({ success: true, regId: doc.regId });
    } catch (error) {
        console.error("techrise registration DELETE:", error);
        return NextResponse.json({ error: "Failed to delete registration" }, { status: 500 });
    }
}
