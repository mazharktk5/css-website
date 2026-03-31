import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";

export async function GET(request) {
    const user = verifyAuth(request);
    
    if (!user) {
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    // Optionally check for admin role if your token includes it
    if (user.role !== 'admin') {
        return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
    }

    return NextResponse.json({ 
        message: "Authenticated", 
        user: { 
            id: user.userId, 
            email: user.email,
            role: user.role
        } 
    });
}
