// app/about/page.jsx
import Hero from "../../components/About/AboutHero";
import MissionVision from "../../components/About/MissionVision";
import OurTeam from "../../components/About/OurTeam";
// import OurStory from "../../components/About/OurStory";

import History from "../../components/About/History";
// import CTA from "../../components/About/CTA";

export default function AboutPage() {
    return (
        <main className="pt-16">
            {/* Hero */}
            <Hero />

            {/* Mission & Vision */}
            <MissionVision />

            {/* Our Story */}
            {/* <OurStory /> */}

            {/* History / Timeline */}
            <History />

            {/* Our Team */}
            <OurTeam />

            {/* CTA */}
            {/* <CTA /> */}
        </main>
    );
}
