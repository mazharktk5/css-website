import PosterGeneratorClient from "./PosterGeneratorClient";

export const metadata = {
    title: "Jashn-e-Azadi 2026 Poster | CSS Society UoP",
    description:
        "Create your personalised 79th Independence Day poster. Design & download your custom frame for 14 August 2026 — by Computing Students Society, University of Peshawar.",
    openGraph: {
        title: "Dil Hai Pakistan · Jashn-e-Azadi 2026 | CSS Society",
        description: "Make your free Independence Day poster with CSS Society.",
    },
};

export default function IndependenceDayPage() {
    return <PosterGeneratorClient />;
}
