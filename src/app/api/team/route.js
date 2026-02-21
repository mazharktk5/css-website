import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import TeamMember from "@/models/TeamMember";
import { verifyAuth, unauthorized } from "@/lib/auth";

// GET all team members (public)
export async function GET() {
    try {
        await dbConnect();
        const members = await TeamMember.find({}).sort({ section: 1, order: 1 });
        return NextResponse.json(members);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch team members" }, { status: 500 });
    }
}

// POST create team member (auth required)
export async function POST(request) {
    const user = verifyAuth(request);
    if (!user) return unauthorized();

    try {
        await dbConnect();
        const body = await request.json();
        const member = await TeamMember.create(body);
        return NextResponse.json(member, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create team member" }, { status: 500 });
    }
}
