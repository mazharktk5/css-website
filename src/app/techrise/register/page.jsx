import TechRiseRegisterForm from "@/components/TechRise/TechRiseRegisterForm";

export const metadata = {
    title: "Register for TechRise '26 | CSS Society UoP",
    description:
        "Register for TechRise '26 — 22 October 2026, SSAQ Khan Hall, University of Peshawar. Get your unique TR26-#### registration ID and QR entry pass.",
    robots: { index: true },
};

export default function TechRiseRegisterPage() {
    return <TechRiseRegisterForm />;
}
