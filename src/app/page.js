import Head from "next/head";
import Hero from "../components/Home/Hero";
import AboutPreview from "../components/Home/AboutPreview";
import Highlights from "../components/Home/EventsPreview";
import GalleryPreview from "../components/Home/GalleryPreview";
import DevelopersPreview from "@/components/Home/DevelopersPreview";
import RegistrationPopup from "@/components/Home/RegistrationPopup";
// import EventsPreview from "@/components/EventsPreview";
// import GalleryPreview from "@/components/GalleryPreview";
// import FooterCTA from "@/components/FooterCTA";

export default function Home() {
  return (
    <>
      <Head>
        <title>
          Computing Students Society | Empowering Students Through Technology
        </title>
        <meta
          name="description"
          content="Official website of the Computing Students Society. Explore our workshops, hackathons, community events, and gallery."
        />
        <meta property="og:title" content="Computing Students Society" />
        <meta
          property="og:description"
          content="Workshops, hackathons, and a student-first tech community."
        />
        <meta property="og:image" content="/images/og/home.jpg" />
        <link rel="canonical" href="https://yoursite.edu/" />
      </Head>

      <main className="pt-16">
        <Hero />
        <AboutPreview />
        <Highlights />
        {/* <EventsPreview /> */}
        <GalleryPreview />
        <DevelopersPreview />
        {/* <FooterCTA /> */}
        <RegistrationPopup />
      </main>

      {/* <Footer /> */}
    </>
  );
}
