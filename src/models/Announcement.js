import mongoose from "mongoose";

const AnnouncementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: "" },
    // Optional: empty → popup button opens the built-in /register form
    googleFormLink: { type: String, default: "" },
    // Optional event tag for built-in registrations (?event=<id>)
    linkedEvent: { type: mongoose.Schema.Types.ObjectId, ref: "Event", default: null },
    expiryDate: { type: Date, required: true },
}, { timestamps: true });

// Clear the model in development so schema edits (e.g. making
// googleFormLink optional, adding linkedEvent) take effect on hot-reload
// without a server restart.
if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.Announcement;
}

export default mongoose.models.Announcement || mongoose.model("Announcement", AnnouncementSchema);
