import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function POST(request) {
    try {
        await dbConnect();
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        // Find Admin
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
        }

        // Generate Admin JWT
        const token = jwt.sign(
            { userId: admin._id, role: "admin", email: admin.email },
            process.env.JWT_SECRET || "fallback_secret",
            { expiresIn: "1d" }
        );

        return NextResponse.json({ token, message: "Admin login successful" });

    } catch (error) {
        return NextResponse.json({ error: `Server Error: ${error.message}` }, { status: 500 });
    }
}
