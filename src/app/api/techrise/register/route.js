import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import TechRiseRegistration from "@/models/TechRiseRegistration";
import TechRiseCounter from "@/models/TechRiseCounter";
import TechRiseConfig from "@/models/TechRiseConfig";
import {
    CONFIG_KEY,
    EVENT_DEFAULTS,
    formatRegId,
    generateCheckInToken,
    validateRegistrationInput,
} from "@/lib/techrise";

async function loadConfig() {
    try {
        const doc = await TechRiseConfig.findOne({ key: CONFIG_KEY }).lean();
        if (!doc) return EVENT_DEFAULTS;
        return { ...EVENT_DEFAULTS, ...doc, options: { ...EVENT_DEFAULTS.options, ...(doc.options || {}) } };
    } catch {
        return EVENT_DEFAULTS;
    }
}

// POST — public registration. Returns { regId, token }. Never exposes _id.
export async function POST(request) {
    try {
        await dbConnect();
        const body = await request.json();
        const config = await loadConfig();

        const closesAt = config.registrationClosesAt ? new Date(config.registrationClosesAt) : null;
        if (!config.registrationOpen || (closesAt && closesAt.getTime() < Date.now())) {
            return NextResponse.json({ error: "Registration is currently closed." }, { status: 403 });
        }

        const { ok, errors, value, isSpam } = validateRegistrationInput(body, config.options);
        if (!ok) {
            return NextResponse.json({ error: errors[0], errors }, { status: 400 });
        }

        // Honeypot: pretend success so bots never learn they were filtered.
        if (isSpam) {
            return NextResponse.json({ success: true, regId: formatRegId(0), token: "0".repeat(32) }, { status: 201 });
        }

        const existing = await TechRiseRegistration.findOne({ email: value.email }).select("regId").lean();
        if (existing) {
            return NextResponse.json(
                { error: "This email is already registered.", regId: existing.regId, duplicate: true },
                { status: 409 }
            );
        }

        if (config.seatCap > 0) {
            const count = await TechRiseRegistration.countDocuments();
            if (count >= config.seatCap) {
                return NextResponse.json({ error: "All seats have been filled." }, { status: 409 });
            }
        }

        const counter = await TechRiseCounter.findOneAndUpdate(
            { key: "techrise_registration" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        ).lean();

        try {
            const record = await TechRiseRegistration.create({
                regId: formatRegId(counter.seq),
                seq: counter.seq,
                ...value,
                checkInToken: generateCheckInToken(),
            });
            return NextResponse.json({ success: true, regId: record.regId, token: record.checkInToken }, { status: 201 });
        } catch (err) {
            if (err?.code === 11000) {
                const dupField = Object.keys(err.keyPattern || {})[0] || "field";
                if (dupField === "email") {
                    const dup = await TechRiseRegistration.findOne({ email: value.email }).select("regId").lean();
                    return NextResponse.json(
                        { error: "This email is already registered.", regId: dup?.regId, duplicate: true },
                        { status: 409 }
                    );
                }
                // regId collision from a raced counter — surface as retryable error
                return NextResponse.json({ error: "Could not allocate a registration ID, please try again." }, { status: 500 });
            }
            throw err;
        }
    } catch (error) {
        console.error("techrise register POST:", error);
        return NextResponse.json({ error: "Registration failed, please try again." }, { status: 500 });
    }
}
