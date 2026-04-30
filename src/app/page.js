import Hero from "../components/Home/Hero";
import AboutPreview from "../components/Home/AboutPreview";
import Highlights from "../components/Home/EventsPreview";
import GalleryPreview from "../components/Home/GalleryPreview";
import DevelopersPreview from "@/components/Home/DevelopersPreview";
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
