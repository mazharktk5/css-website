import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import CertificateTemplate from "@/models/CertificateTemplate";
import CertificateRecord from "@/models/CertificateRecord";
import { verifyAuth, unauthorized } from "@/lib/auth";

// PUT update template (records already issued keep their own snapshot)
export async function PUT(request, { params }) {
    const user = verifyAuth(request);
    if (!user) return unauthorized();

    try {
        await dbConnect();
        const { id } = await params;
        const body = await request.json();
        const { _id, ...updateData } = body;
        Object.keys(updateData).forEach(key => key.startsWith("$") && delete updateData[key]);

        const template = await CertificateTemplate.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );
        if (!template) return NextResponse.json({ error: "Template not found" }, { status: 404 });

        // Self-heal broken snapshots. Older saves lost backgroundUrl (schema
        // gap), so those records rendered with the default certificate.
        // Refresh ONLY snapshots missing their background — healthy issued
        // certificates stay frozen at their original layout.
        if (template.backgroundUrl) {
            const t = template.toObject();
            const snap = {
                key: t.key,
                name: t.name,
                backgroundUrl: t.backgroundUrl,
                layout: t.layout,
            };
            await CertificateRecord.updateMany(
                {
                    type: "custom",
                    templateKey: t.key,
                    $or: [
                        { "templateSnapshot.backgroundUrl": { $exists: false } },
                        { "templateSnapshot.backgroundUrl": null },
                        { "templateSnapshot.backgroundUrl": "" },
                    ],
                },
                { $set: { templateSnapshot: snap } }
            );
        }

        return NextResponse.json(template);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update template", details: error.message }, { status: 500 });
    }
}

// DELETE template only — issued certificates keep their snapshot and still render
export async function DELETE(request, { params }) {
    const user = verifyAuth(request);
    if (!user) return unauthorized();

    try {
        await dbConnect();
        const { id } = await params;
        const template = await CertificateTemplate.findByIdAndDelete(id);
        if (!template) return NextResponse.json({ error: "Template not found" }, { status: 404 });
        return NextResponse.json({ message: "Template deleted" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete template", details: error.message }, { status: 500 });
    }
}
