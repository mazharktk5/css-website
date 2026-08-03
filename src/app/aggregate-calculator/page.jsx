import AggregateCalculatorClient from "./AggregateCalculatorClient";

export const metadata = {
    title: "Aggregate Calculator | University of Peshawar | CSS UoP",
    description:
        "Calculate your University of Peshawar admission aggregate using the official formula: 20% Matric + 30% FSc + 50% Entry Test.",
    openGraph: {
        title: "UoP Aggregate Calculator | CSS",
        description: "Quickly calculate your UoP admission aggregate for free.",
    },
};

export default function AggregateCalculatorPage() {
    return <AggregateCalculatorClient />;
}
