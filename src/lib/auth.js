import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function verifyAuth(request) {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }
    try {
        return jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
    } catch {
        return null;
    }
}

export function unauthorized() {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
