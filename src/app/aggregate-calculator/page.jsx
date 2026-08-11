// import AggregateCalculatorClient from "./AggregateCalculatorClient"; // temporarily disabled
import Link from "next/link";

export const metadata = {
    title: "Aggregate Calculator | CSS UoP",
    description: "Calculate your University of Peshawar admission aggregate.",
};

export default function AggregateCalculatorPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center px-6">
            <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold mb-3">
                Temporarily Unavailable
            </p>
            <h1 className="text-3xl font-black text-slate-900 mb-4">Aggregate Calculator</h1>
            <p className="text-slate-500 max-w-md text-sm leading-relaxed">
                The calculator will be back soon. In the meantime, celebrate Independence Day
                with your personalised CSS Society poster!
            </p>
            <Link
                href="/independence-day"
                className="mt-8 inline-flex items-center gap-2 bg-[#0D5E2A] text-white font-bold px-6 py-3 rounded-full hover:bg-[#0a4a20] transition-colors text-sm"
            >
                🇵🇰 Create Your Independence Day Poster
            </Link>
            <Link
                href="/"
                className="mt-4 text-slate-400 hover:text-slate-600 text-sm transition-colors"
            >
                ← Back to Home
            </Link>
        </div>
    );
}

