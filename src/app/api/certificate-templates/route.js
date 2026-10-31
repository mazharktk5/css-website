import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import CertificateTemplate from "@/models/CertificateTemplate";
import { verifyAuth, unauthorized } from "@/lib/auth";

// Admin: list all templates (optionally ?key= for one)
export async function GET(request) {
    const user = verifyAuth(request);
    if (!user) return unauthorized();

    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const key = searchParams.get("key");
        if (key) {
            const template = await CertificateTemplate.findOne({ key: key.toLowerCase() });
            if (!template) return NextResponse.json({ error: "Template not found" }, { status: 404 });
            return NextResponse.json(template);
        }
        const templates = await CertificateTemplate.find({}).sort({ updatedAt: -1 });
        return NextResponse.json(templates);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch templates", details: error.message }, { status: 500 });
    }
}

// Admin: create a template
export async function POST(request) {
    const user = verifyAuth(request);
    if (!user) return unauthorized();

    try {
        await dbConnect();
        const body = await request.json();
        const { _id, ...data } = body;
        Object.keys(data).forEach(key => key.startsWith("$") && delete data[key]);

        if (!data.key || !data.name || !data.backgroundUrl) {
            return NextResponse.json({ error: "key, name and backgroundUrl are required" }, { status: 400 });
        }
        data.key = String(data.key).toLowerCase().trim().replace(/\s+/g, "-");

        const existing = await CertificateTemplate.findOne({ key: data.key });
        if (existing) {
            return NextResponse.json({ error: `A template with key "${data.key}" already exists` }, { status: 409 });
        }

        const template = await CertificateTemplate.create(data);
        return NextResponse.json(template, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create template", details: error.message }, { status: 500 });
    }
}
