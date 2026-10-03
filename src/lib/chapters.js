const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

// A society session runs August through July, so it is labelled by its
// starting and ending years, e.g. 2025-2026.
const SESSION_START_MONTH = 7;

export function getAcademicSession(value) {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return null;

    // Dates are stored as UTC midnight, so read the calendar parts in UTC.
    // Local getters would shift the day in timezones west of UTC and could
    // push an August image into the previous chapter.
    const year = date.getUTCFullYear();
    const startsInCurrentYear = date.getUTCMonth() >= SESSION_START_MONTH;
    const startYear = startsInCurrentYear ? year : year - 1;

    return {
        label: `${startYear}-${startYear + 1}`,
        sortKey: startYear,
        long: `${MONTHS[SESSION_START_MONTH]} ${startYear} - ${MONTHS[6]} ${startYear + 1}`,
    };
}

export function groupBySession(items, getDate) {
    const groups = new Map();

    items.forEach((item) => {
        const session = getAcademicSession(getDate(item));
        if (!session) return;

        if (!groups.has(session.label)) {
            groups.set(session.label, { ...session, items: [] });
        }
        groups.get(session.label).items.push(item);
    });

    return Array.from(groups.values()).sort((a, b) => b.sortKey - a.sortKey);
}
