import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Registration from "@/models/Registration";
import Event from "@/models/Event";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const OBJECT_ID_RE = /^[a-f\d]{24}$/i;

// POST /api/register — PUBLIC. Stores one registration from the built-in form.
export async function POST(request) {
    try {
        await dbConnect();
        const body = await request.json();

        // Honeypot: bots fill the hidden field — fake success, store nothing.
        if (body.website) return NextResponse.json({ success: true });

        const name = String(body.name || "").trim();
        const email = String(body.email || "").trim().toLowerCase();
        const program = String(body.program || "").trim();
        const university = String(body.university || "").trim();
        const department = String(body.department || "").trim();

        if (name.length < 2 || name.length > 120)
            return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
        if (!EMAIL_RE.test(email) || email.length > 200)
            return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
        if (!program || program.length > 120)
            return NextResponse.json({ error: "Please enter your program." }, { status: 400 });
        if (!university || university.length > 160)
            return NextResponse.json({ error: "Please enter your university." }, { status: 400 });
        if (!department || department.length > 160)
            return NextResponse.json({ error: "Please enter your department." }, { status: 400 });

        // Resolve the event tag — invalid/unknown ids fall back to the
        // generic (untagged) group instead of failing the submission.
        let eventId = null;
        let eventTitle = "";
        const rawEvent = String(body.eventId || "").trim();
        if (OBJECT_ID_RE.test(rawEvent)) {
            const ev = await Event.findById(rawEvent).select("title").lean();
            if (ev) {
                eventId = ev._id;
                eventTitle = ev.title;
            }
        }

        try {
            await Registration.create({
                event: { id: eventId, title: eventTitle },
                name, email, program, university, department,
            });
        } catch (err) {
            if (err?.code === 11000) {
                return NextResponse.json({
                    error: eventTitle
                        ? `You're already registered for ${eventTitle}. You can close this page.`
                        : "You're already registered. You can close this page.",
                }, { status: 409 });
            }
            throw err;
        }

        return NextResponse.json({ success: true, event: eventTitle });
    } catch (error) {
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
}
