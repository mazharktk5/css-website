import TicketView from "@/components/TechRise/TicketView";

export const metadata = {
    title: "Your TechRise '26 Pass | CSS Society UoP",
    description: "Your TechRise '26 entry ticket and shareable story card.",
    robots: { index: false, follow: false },
    openGraph: {
        title: "I'm attending TechRise '26 🎉",
        description: "Learn • Connect • Rise — 22 October 2026, SSAQ Khan Hall, University of Peshawar. #TechRise26",
        url: "https://cssuop.org/techrise",
        siteName: "CSS UOP",
        images: [
            {
                url: "/images/techrise/techrise26.jpg",
                width: 1374,
                height: 1145,
                alt: "TechRise '26 poster",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "I'm attending TechRise '26 🎉",
        description: "Learn • Connect • Rise — 22 October 2026, SSAQ Khan Hall. #TechRise26",
        images: ["/images/techrise/techrise26.jpg"],
    },
};

export default async function TechRiseTicketPage({ searchParams }) {
    const params = await searchParams;
    const token = typeof params?.tk === "string" ? params.tk : "";
    return <TicketView token={token} />;
}
