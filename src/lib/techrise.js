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
        regions: [
            "Khyber Pakhtunkhwa",
            "Punjab",
            "Sindh",
            "Balochistan",
            "Islamabad Capital Territory",
            "Gilgit-Baltistan",
            "Azad Jammu & Kashmir",
            "FR Peshawar",
            "FR Bannu",
            "FR Tank",
            "FR DI Khan",
            "FR Kohat",
            "FR Lakki Marwat",
            "Bajaur",
            "Khyber",
            "Mohmand",
            "North Waziristan",
            "South Waziristan",
            "Kurram",
            "Orakzai",
            "Other",
        ],
        hearSources: ["Instagram", "WhatsApp", "University", "Friend", "Poster", "Other"],
        partners: [
            "General Attendee / Not via a Partner",
            "AI Community Peshawar",
            "Code Voyagers",
            "Faseel Community",
            "Farabi Science Society UAP",
        ],
        interests: [
            "Web & App Development",
            "AI & Machine Learning",
            "Career Guidance",
            "Networking",
            "Entrepreneurship",
            "Other",
        ],
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
const CNIC_RE = /^\d{5}-?\d{7}-?\d{1}$/;

function normalizeCnic(value) {
    const digits = clean(value).replace(/[^0-9]/g, "");
    if (digits.length !== 13) return clean(value);
    return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
}

export function validateRegistrationInput(body, options) {
    const errors = [];
    const value = {
        name: clean(body?.name),
        email: clean(body?.email).toLowerCase(),
        phone: clean(body?.phone),
        cnic: normalizeCnic(body?.cnic),
        institution: clean(body?.institution),
        department: clean(body?.department),
        semester: clean(body?.semester),
        region: clean(body?.region),
        communityPartner: clean(body?.communityPartner),
        hearSource: clean(body?.hearSource),
        interests: clean(body?.interests),
        consent: Boolean(body?.consent),
        honeypot: clean(body?.honeypot),
    };

    if (value.name.length < 3 || value.name.length > 100) {
        errors.push("Please enter your full name (3-100 characters).");
    }
    if (!EMAIL_RE.test(value.email) || value.email.length > 254) {
        errors.push("Please enter a valid email address.");
    }
    if (!value.phone || !PHONE_RE.test(value.phone)) {
        errors.push("Please enter a valid WhatsApp number.");
    }
    if (!value.cnic || !CNIC_RE.test(value.cnic)) {
        errors.push("Please enter a valid CNIC (e.g. 12345-1234567-1).");
    }
    if (!value.institution || value.institution.length > 150) {
        errors.push("Please enter your university/institution.");
    }
    if (!value.department) errors.push("Please select your department/program.");
    if (value.department.length > 100) errors.push("Department name is too long.");
    if (!value.semester) errors.push("Please select your semester.");
    if (value.semester.length > 30) errors.push("Semester value is too long.");
    if (!value.region) errors.push("Please select your region/district.");
    if (value.region.length > 60) errors.push("Region value is too long.");
    if (!value.communityPartner) errors.push("Please select a community or referral source.");
    if (value.communityPartner.length > 120) errors.push("Community partner value is too long.");
    if (value.hearSource.length > 60) errors.push("Source value is too long.");
    if (value.interests.length > 120) errors.push("Interest value is too long.");
    if (!value.consent) errors.push("Please agree to the data usage consent.");

    const allowed = (list, val) => !val || !list?.length || list.includes(val);
    if (!allowed(options?.departments, value.department)) errors.push("Invalid department.");
    if (!allowed(options?.semesters, value.semester)) errors.push("Invalid semester.");
    if (!allowed(options?.regions, value.region)) errors.push("Invalid region.");
    if (!allowed(options?.hearSources, value.hearSource)) errors.push("Invalid source.");
    if (!allowed(options?.partners, value.communityPartner)) errors.push("Invalid community partner.");
    if (!allowed(options?.interests, value.interests)) errors.push("Invalid interest.");

    delete value.honeypot;
    return { ok: errors.length === 0, errors, value, isSpam: Boolean(clean(body?.honeypot)) };
}
