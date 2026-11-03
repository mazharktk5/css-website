import mongoose from "mongoose";

// A submission through the built-in public form at /register — replaces the
// old "Google Form → download CSV" flow. Tagged with the event it belongs to;
// event.title is denormalized so rows stay meaningful if the event is deleted.
const RegistrationSchema = new mongoose.Schema({
    event: {
        // null id = submitted from the generic form (e.g. home popup without event)
        id: { type: mongoose.Schema.Types.ObjectId, ref: "Event", default: null },
        title: { type: String, default: "" },
    },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
    program: { type: String, required: true, trim: true, maxlength: 120 },
    university: { type: String, required: true, trim: true, maxlength: 160 },
    department: { type: String, required: true, trim: true, maxlength: 160 },
}, { timestamps: true });

// One registration per email per event (null event id counts as its own group)
RegistrationSchema.index({ "event.id": 1, email: 1 }, { unique: true });

// Clear the model in development so schema edits take effect on hot-reload
// without a server restart (same trick as CertificateTemplate).
if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.Registration;
}

export default mongoose.models.Registration ||
    mongoose.model("Registration", RegistrationSchema);
