import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request) {
    try {
        const authHeader = request.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ valid: false }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return NextResponse.json({ valid: true, email: decoded.email });
    } catch {
        return NextResponse.json({ valid: false }, { status: 401 });
    }
}
