import TechRiseLanding from "@/components/TechRise/TechRiseLanding";

export const metadata = {
    title: "TechRise '26 | Computing Students Society — University of Peshawar",
    description:
        "TechRise '26 — Learn • Connect • Rise. 22 October 2026 at SSAQ Khan Hall, University of Peshawar. Presented by the Computing Students Society, Department of Computer Science.",
    openGraph: {
        title: "TechRise '26 | CSS Society UoP",
        description: "Where Ideas, Talent & Opportunities Come Together. Register now.",
        images: ["/images/techrise/techrise26.jpg"],
    },
};

export default function TechRisePage() {
    return <TechRiseLanding />;
}
