import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";

export async function POST(request) {
    try {
        await dbConnect();
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const token = jwt.sign(
            { id: admin._id, email: admin.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return NextResponse.json({ token, email: admin.email });
    } catch (error) {
        console.error("Login API error:", error);

        // Help diagnose Vercel build/runtime issues
        if (error.message?.includes("MONGO_URI")) {
            return NextResponse.json({ error: "Configuration Error: MONGO_URI is not defined." }, { status: 500 });
        }
        if (error.name === "MongooseServerSelectionError") {
            return NextResponse.json({ error: "Database Connection Error: IP might not be whitelisted." }, { status: 500 });
        }

        return NextResponse.json({
            error: "Server error",
            message: process.env.NODE_ENV === "development" ? error.message : undefined
        }, { status: 500 });
    }
}
