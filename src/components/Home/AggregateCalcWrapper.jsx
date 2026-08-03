"use client";
import dynamic from "next/dynamic";

const AggregateCalcFloat = dynamic(() => import("@/components/Home/AggregateCalcFloat"), {
    ssr: false,
});

export default function AggregateCalcWrapper() {
    return <AggregateCalcFloat />;
}
