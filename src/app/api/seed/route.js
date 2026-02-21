import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";
import Event from "@/models/Event";
import GalleryItem from "@/models/GalleryItem";
import TeamMember from "@/models/TeamMember";

export async function POST() {
    try {
        await dbConnect();

        // --- Seed Admin ---
        const existingAdmin = await Admin.findOne({ email: "admin@css.uop.edu.pk" });
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash("admin123", 10);
            await Admin.create({ email: "admin@css.uop.edu.pk", password: hashedPassword });
        }

        // --- Seed Events ---
        const eventCount = await Event.countDocuments();
        if (eventCount === 0) {
            const eventsData = [
                { title: "Cybersecurity Seminar", date: "2025-09-25", time: "2:00 PM - 5:00 PM", location: "Computer Lab A", image: "/images/events/CyberBootcamp.png", description: "Join us for an engaging seminar on cybersecurity best practices and emerging threats.", tags: ["Cybersecurity", "Seminar"], category: "AI" },
                { title: "Debate Competition", date: "2025-11-20", time: "9:00 AM - 11:00 AM", location: "Engineering Building", image: "/images/events/DebateCompetition.png", description: "Showcase your debating skills in our annual competition with exciting prizes for the winners.", tags: ["Competition", "Debate"], category: "Web Development" },
                { title: "Debate Competition", date: "2025-11-20", time: "9:00 AM - 11:00 AM", location: "Engineering Building", image: "/images/events/DebateCompetition.png", description: "Showcase your debating skills in our annual competition with exciting prizes for the winners.", tags: ["Competition", "Debate"], category: "Cyber Security" },
                { title: "Web Dev Bootcamp 2025", date: "2025-08-15", description: "A hands-on workshop introducing 50+ students to web development fundamentals including HTML, CSS, JavaScript, and React.", participants: "50+ students", image: "/images/gallery/webdev1.PNG", tags: ["Workshop", "Web Development"], category: "past" },
                { title: "Cybersecurity Seminar", date: "2024-11-22", description: "An engaging seminar on cybersecurity best practices and emerging threats, attended by over 80 students.", participants: "20+ attendees", image: "/images/gallery/Cyber1.jpg", tags: ["Competition", "Hackathon"], category: "past" },
                { title: "Github and LinkedIn Networking Event", date: "2024-10-10", description: "A networking event focused on optimizing GitHub and LinkedIn profiles for career growth.", participants: "100+ students", image: "/images/gallery/github2.jpg", tags: ["Networking", "Career"], category: "past" },
                { title: "AI & Machine Learning", date: "2024-09-20", description: "A Comprehensive event where industry experts shared insights on the latest AI trends and machine learning applications.", participants: "35 students", image: "/images/gallery/Ai1.jpg", tags: ["Workshop", "Programming"], category: "past" },
            ];
            await Event.insertMany(eventsData);
        }

        // --- Seed Gallery ---
        const galleryCount = await GalleryItem.countDocuments();
        if (galleryCount === 0) {
            const galleryData = [
                { eventName: "MoU Signing", category: "Signing Ceremony", image: "/images/gallery/MOU2.JPG", description: "MoU Signing Ceremony." },
                { eventName: "MoU Signing", category: "Signing Ceremony", image: "/images/gallery/MOU1.JPG", description: "MoU Signing Ceremony." },
                { eventName: "Web Development Bootcamp", category: "Bootcamp", image: "/images/gallery/webdev1.PNG", description: "Best practices in Web development" },
                { eventName: "Github and LinkedIn Workshop", category: "Workshop", image: "/images/gallery/github5.JPG", description: "Our Society's President giving a token of appreciation to our guest speaker" },
                { eventName: "AI Bootcamp", category: "Bootcamp", image: "/images/gallery/Ai1.jpg", description: "Best practices in Artificial Intelligence" },
                { eventName: "CyberSecurity BootCamp", category: "Bootcamp", image: "/images/gallery/Cyber1.jpg", description: "Learn the basics of CyberSecurity" },
                { eventName: "Github and LinkedIn Workshop", category: "Workshop", image: "/images/gallery/github2.jpg", description: "Mastering GitHub and LinkedIn for Career Growth" },
                { eventName: "Github and LinkedIn Workshop", category: "Workshop", image: "/images/gallery/github3.JPG", description: "Our guest speaker explaining the importance of GitHub and LinkedIn" },
                { eventName: "Sports Fest 2025", category: "Games", image: "/images/gallery/hero.jpg", description: "Exciting moments from Sports Fest 2025." },
                { eventName: "Sports Fest 2025", category: "Games", image: "/images/gallery/sportsweek2.JPG", description: "Exciting moments from Sports Fest 2025." },
                { eventName: "Sports Fest 2025", category: "Games", image: "/images/gallery/sportsweek4.JPG", description: "Exciting moments from Sports Fest 2025." },
                { eventName: "Sports Fest 2025", category: "Games", image: "/images/gallery/sportsweek5.JPG", description: "Exciting moments from Sports Fest 2025." },
                { eventName: "Sports Fest 2025", category: "Games", image: "/images/gallery/sportsweek6.jpg", description: "Exciting moments from Sports Fest 2025." },
                { eventName: "Sports Fest 2025", category: "Games", image: "/images/gallery/Chess1.jpg", description: "Exciting moments from Sports Fest 2025." },
                { eventName: "Sports Fest 2025", category: "Games", image: "/images/gallery/chess5.jpg", description: "Exciting moments from Sports Fest 2025." },
                { eventName: "Sports Fest 2025", category: "Games", image: "/images/gallery/chess6.jpg", description: "Exciting moments from Sports Fest 2025." },
                { eventName: "Sports Fest 2025", category: "Games", image: "/images/gallery/chess4.jpg", description: "Exciting moments from Sports Fest 2025." },
                { eventName: "Sports Fest 2025", category: "Games", image: "/images/gallery/chess2.jpg", description: "Exciting moments from Sports Fest 2025." },
            ];
            await GalleryItem.insertMany(galleryData);
        }

        // --- Seed Team Members ---
        const teamCount = await TeamMember.countDocuments();
        if (teamCount === 0) {
            const teamData = [
                { name: "Dr Shah Khusro", role: "Patron-in-Chief", subRole: "Chairman, Dept. of CS", image: "/images/team/chairman.jpg", section: "executive", order: 1 },
                { name: "Dr Waheed ur Rehman", role: "Chief Organizer", subRole: "Coordinator, Dept. of CS", image: "/images/team/coordinator.jpg", section: "executive", order: 2 },
                { name: "Muhammad Ilyas", role: "President", image: "/images/team/president.jpg", section: "cabinet", order: 1 },
                { name: "Abdullah Ahmad", role: "Vice President", image: "/images/team/vp.jpg", section: "cabinet", order: 2 },
                { name: "Fatima Ijaz", role: "Female Vice President", image: "/images/team/fatima.png", section: "cabinet", order: 3 },
                { name: "Mati Ullah Bangash", role: "Chief Secretary", image: "/images/team/chief-secretary.jpg", section: "cabinet", order: 4 },
                { name: "Safia Zulfiqar", role: "Information Secretary", image: "/images/developers/safia.jpg", section: "cabinet", order: 5 },
                { name: "Abubakar Dayan", role: "Media Secretary", image: "/images/team/app-lead.jpg", section: "cabinet", order: 6 },
                { name: "Mazhar Ahmad", role: "Software Engineering Lead", image: "/images/team/software-lead.jpg", section: "clubs", order: 1 },
                { name: "Hashir Ahmad", role: "Cyber Security Lead", image: "/images/team/information-secretary.jpg", section: "clubs", order: 2 },
                { name: "Junaid Ahmad", role: "AI & DS Lead", image: "/images/team/app-lead.jpg", section: "clubs", order: 3 },
                { name: "Amna Amir", role: "Content & Graphics Head", image: "/images/team/graphic-head.jpg", section: "clubs", order: 4 },
                { name: "Bilal Shahid", role: "Management Head", image: "/images/team/management-head.jpg", section: "clubs", order: 5 },
                { name: "M Uzair", role: "External PR Head", image: "/images/team/pr-lead.jpg", section: "clubs", order: 6 },
                { name: "Yahya Jan", role: "Literary Club Head", image: "/images/team/app-lead.jpg", section: "clubs", order: 7 },
                { name: "M Ali", role: "Creative Club Head", image: "/images/team/creative-head.jpg", section: "clubs", order: 8 },
            ];
            await TeamMember.insertMany(teamData);
        }

        return NextResponse.json({
            message: "Database seeded successfully!",
            admin: "admin@css.uop.edu.pk / admin123",
        });
    } catch (error) {
        return NextResponse.json({ error: "Seed failed: " + error.message }, { status: 500 });
    }
}
