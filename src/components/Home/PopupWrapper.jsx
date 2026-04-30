"use client";
import dynamic from "next/dynamic";

const RegistrationPopup = dynamic(() => import("@/components/Home/RegistrationPopup"), {
  ssr: false,
});

export default function PopupWrapper() {
  return <RegistrationPopup />;
}
