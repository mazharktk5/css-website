import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Registration from "@/models/Registration";
import { verifyAuth, unauthorized } from "@/lib/auth";

// DELETE /api/registrations/:id — admin removes one registration row.
export async function DELETE(request, { params }) {
    const user = verifyAuth(request);
    if (!user) return unauthorized();

    try {
        await dbConnect();
        const { id } = await params;
        const row = await Registration.findByIdAndDelete(id);
        if (!row) return NextResponse.json({ error: "Registration not found" }, { status: 404 });
        return NextResponse.json({ message: "Registration deleted" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete registration" }, { status: 500 });
    }
}
