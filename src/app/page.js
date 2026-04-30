import Hero from "../components/Home/Hero";
import dynamic from "next/dynamic";

const AboutPreview = dynamic(() => import("../components/Home/AboutPreview"), { loading: () => <div className="h-96" /> });
const Highlights = dynamic(() => import("../components/Home/EventsPreview"), { loading: () => <div className="h-96" /> });
const GalleryPreview = dynamic(() => import("../components/Home/GalleryPreview"), { loading: () => <div className="h-96" /> });
const DevelopersPreview = dynamic(() => import("@/components/Home/DevelopersPreview"), { loading: () => <div className="h-96" /> });
import PopupWrapper from "@/components/Home/PopupWrapper";

export const metadata = {
  title: "Computing Students Society | Empowering Students Through Technology",
  description: "Official website of the Computing Students Society. Explore our workshops, hackathons, community events, and gallery.",
  openGraph: {
    title: "Computing Students Society",
    description: "Workshops, hackathons, and a student-first tech community.",
    images: ["/images/og/home.jpg"],
  },
};

export default function Home() {
  return (
    <>
      <main className="pt-16">
        <Hero />
        <AboutPreview />
        <Highlights />
        <GalleryPreview />
        <DevelopersPreview />
        <PopupWrapper />
      </main>
    </>
  );
}
