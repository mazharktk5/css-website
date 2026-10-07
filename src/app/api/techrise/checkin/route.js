import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import TechRiseRegistration from "@/models/TechRiseRegistration";
import { verifyAuth, unauthorized } from "@/lib/auth";

function publicShape(doc) {
    return {
        regId: doc.regId,
        name: doc.name,
        department: doc.department,
        communityPartner: doc.communityPartner,
        checkedIn: doc.checkedIn,
        checkedInAt: doc.checkedInAt,
    };
}

// POST — admin: check in by QR token or registration ID (idempotent)
export async function POST(request) {
    const user = verifyAuth(request);
    if (!user) return unauthorized();

    try {
        await dbConnect();
        const body = await request.json();
        const token = (body.token || "").trim();
        const regId = (body.regId || "").trim().toUpperCase();

        if (!token && !regId) {
            return NextResponse.json({ error: "Missing token or registration ID" }, { status: 400 });
        }

        const query = token ? { checkInToken: token } : { regId };
        const doc = await TechRiseRegistration.findOne(query).select("-__v").lean();
        if (!doc) {
            return NextResponse.json({ error: token ? "Invalid QR code" : "Registration not found" }, { status: 404 });
        }

        if (doc.checkedIn) {
            return NextResponse.json({
                success: true,
                alreadyCheckedIn: true,
                checkedInAt: doc.checkedInAt,
                registration: publicShape(doc),
            });
        }

        doc.checkedIn = true;
        doc.checkedInAt = new Date();
        doc.checkedInMethod = "qr";
        await TechRiseRegistration.updateOne(
            { _id: doc._id },
            { $set: { checkedIn: true, checkedInAt: doc.checkedInAt, checkedInMethod: "qr" } }
        );

        return NextResponse.json({ success: true, alreadyCheckedIn: false, registration: publicShape(doc) });
    } catch (error) {
        console.error("techrise checkin POST:", error);
        return NextResponse.json({ error: "Check-in failed" }, { status: 500 });
    }
}
