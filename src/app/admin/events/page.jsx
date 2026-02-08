"use client";

import { useState, useEffect } from "react";

export default function AdminEvents() {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        fetch("/api/events")
            .then(res => res.json())
            .then(data => {
                const allEvents = Object.values(data).flat();
                setEvents(allEvents);
                setFilteredEvents(allEvents);
            });
    }, []);

    const categories = ["All", "AI", "Web Devlopment", "Cyber Security", "past"];

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        if (category === "All") {
            setFilteredEvents(events);
        } else {
            setFilteredEvents(events.filter(ev => ev.category === category));
        }
    };

    const today = new Date();

    const isPublic = (ev) => {
        const eventDate = new Date(ev.date);
        return ev.image && eventDate <= today;
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Manage Events</h1>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-3 mb-4">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => handleCategoryChange(cat)}
                        className={`px-4 py-2 rounded-full font-semibold ${selectedCategory === cat
                            ? "bg-blue-600 text-white"
                            : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Add Event */}
            <button className="mb-6 px-4 py-2 bg-green-600 rounded hover:bg-green-700">
                Add Event
            </button>

            {/* Events Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 rounded">
                    <thead>
                        <tr className="text-left border-b border-gray-700">
                            <th className="px-4 py-2">Title</th>
                            <th className="px-4 py-2">Date</th>
                            <th className="px-4 py-2">Time</th>
                            <th className="px-4 py-2">Location</th>
                            <th className="px-4 py-2">Participants</th>
                            <th className="px-4 py-2">Category</th>
                            <th className="px-4 py-2">Public</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEvents.map(ev => (
                            <tr key={`${ev.category}-${ev.id}`} className="border-b border-gray-700 hover:bg-gray-700">
                                <td className="px-4 py-2">{ev.title}</td>
                                <td className="px-4 py-2">{ev.date}</td>
                                <td className="px-4 py-2">{ev.time || "-"}</td>
                                <td className="px-4 py-2">{ev.location || "-"}</td>
                                <td className="px-4 py-2">{ev.participants || "-"}</td>
                                <td className="px-4 py-2">{ev.category}</td>
                                <td className="px-4 py-2">{isPublic(ev) ? "Yes" : "No"}</td>
                                <td className="px-4 py-2 flex gap-2">
                                    <a
                                        href={ev.registrationLink || "#"}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-2 py-1 bg-blue-500 rounded hover:bg-blue-600 text-sm"
                                    >
                                        Link
                                    </a>
                                    <button className="px-2 py-1 bg-yellow-500 rounded hover:bg-yellow-600 text-sm">
                                        Edit / Upload Image
                                    </button>
                                    <button className="px-2 py-1 bg-red-500 rounded hover:bg-red-600 text-sm">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
