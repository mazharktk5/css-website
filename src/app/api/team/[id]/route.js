import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import TeamMember from "@/models/TeamMember";
import { verifyAuth, unauthorized } from "@/lib/auth";

// PUT update team member
export async function PUT(request, { params }) {
    const user = verifyAuth(request);
    if (!user) return unauthorized();

    try {
        await dbConnect();
        const { id } = await params;
        const body = await request.json();
        const { _id, ...updateData } = body;
        
        // Prevent NoSQL operator injection
        Object.keys(updateData).forEach(key => key.startsWith('$') && delete updateData[key]);

        const member = await TeamMember.findByIdAndUpdate(id, { $set: updateData }, { new: true });
        if (!member) return NextResponse.json({ error: "Team member not found" }, { status: 404 });
        return NextResponse.json(member);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update team member" }, { status: 500 });
    }
}

// DELETE team member
export async function DELETE(request, { params }) {
    const user = verifyAuth(request);
    if (!user) return unauthorized();

    try {
        await dbConnect();
        const { id } = await params;
        const member = await TeamMember.findByIdAndDelete(id);
        if (!member) return NextResponse.json({ error: "Team member not found" }, { status: 404 });
        return NextResponse.json({ message: "Team member deleted" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete team member" }, { status: 500 });
    }
}
