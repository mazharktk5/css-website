import crypto from "crypto";

export const CONFIG_KEY = "techrise26";

export const EVENT_DEFAULTS = {
    title: "TechRise '26",
    tagline: "Learn • Connect • Rise",
    subtitle: "Where Ideas, Talent & Opportunities Come Together.",
    dateISO: "2026-10-22",
    dateLabel: "22 October 2026",
    venue: "SSAQ Khan Hall, University of Peshawar",
    registrationOpen: true,
    registrationClosesAt: null,
    seatCap: 0,
    options: {
        departments: [
            "Computer Science",
            "Software Engineering",
            "Information Technology",
            "Other",
        ],
        semesters: ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "Graduated", "Other"],
        hearSources: ["Instagram", "WhatsApp", "University", "Friend", "Poster", "Other"],
        partners: ["Not a partner / General attendee"],
    },
};

export const REG_ID_PREFIX = "TR26";

export function formatRegId(seq) {
    return `${REG_ID_PREFIX}-${String(seq).padStart(4, "0")}`;
}

export function generateCheckInToken() {
    return crypto.randomBytes(16).toString("hex");
}

function clean(value) {
    return typeof value === "string" ? value.trim() : "";
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[0-9+\-\s()]{7,20}$/;

export function validateRegistrationInput(body, options) {
    const errors = [];
    const value = {
        name: clean(body?.name),
        email: clean(body?.email).toLowerCase(),
        phone: clean(body?.phone),
        institution: clean(body?.institution),
        department: clean(body?.department),
        semester: clean(body?.semester),
        communityPartner: clean(body?.communityPartner),
        hearSource: clean(body?.hearSource),
        honeypot: clean(body?.honeypot),
    };

    if (value.name.length < 3 || value.name.length > 100) {
        errors.push("Please enter your full name (3-100 characters).");
    }
    if (!EMAIL_RE.test(value.email) || value.email.length > 254) {
        errors.push("Please enter a valid email address.");
    }
    if (value.phone && !PHONE_RE.test(value.phone)) {
        errors.push("Please enter a valid phone number.");
    }
    if (value.institution.length > 150) errors.push("Institution name is too long.");
    if (value.department.length > 100) errors.push("Department name is too long.");
    if (value.semester.length > 30) errors.push("Semester value is too long.");
    if (value.communityPartner.length > 120) errors.push("Community partner value is too long.");
    if (value.hearSource.length > 60) errors.push("Source value is too long.");

    const allowed = (list, val) => !val || !list?.length || list.includes(val);
    if (!allowed(options?.departments, value.department)) errors.push("Invalid department.");
    if (!allowed(options?.semesters, value.semester)) errors.push("Invalid semester.");
    if (!allowed(options?.hearSources, value.hearSource)) errors.push("Invalid source.");
    if (!allowed(options?.partners, value.communityPartner)) errors.push("Invalid community partner.");

    delete value.honeypot;
    return { ok: errors.length === 0, errors, value, isSpam: Boolean(clean(body?.honeypot)) };
}
