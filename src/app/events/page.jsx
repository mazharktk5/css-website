"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users, ExternalLink } from "lucide-react";
import eventsData from "../../data/events.json";

const Events = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...Object.keys(eventsData)];

  const allEvents = Object.values(eventsData).flat();

  const filteredEvents =
    selectedCategory === "All"
      ? allEvents
      : allEvents.filter((event) => event.category === selectedCategory) 

      const displayEvents = filteredEvents.splice(0,8)

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            Events & Activities
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join us for exciting workshops, competitions, and networking
            opportunities that will enhance your skills and expand your
            professional network.
          </p>
        </div>

        {/* Upcoming Events Section */}
        <section className="mb-20 px-4">
          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-blue-900 text-white shadow-lg"
                    : "bg-white text-blue-900 hover:bg-blue-50 border border-blue-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {displayEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-2xl border border-gray-900 overflow-hidden hover:border-[#3c6da1]/30 transition-all duration-500 hover:shadow-xl"
              >
                {/* Event Image */}
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent opacity-60" />
                </div>

                {/* Event Info */}
                <div className="p-4 text-left">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#3c6da1] transition-colors">
                    {event.title}
                  </h3>

                  <p className="text-gray-500 text-sm line-clamp-2 mb-6">
                    {event.description}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600 text-sm">
                      <Calendar className="w-4 h-4 mr-3 text-[#3c6da1]" />
                      {formatDate(event.date)}
                    </div>

                    {event.participants && (
                      <div className="flex items-center text-gray-600 text-sm">
                        <Users className="w-4 h-4 mr-3 text-[#3c6da1]" />
                        {event.participants}+ Participants
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-20 bg-blue-900 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Don't Miss Out!</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Stay updated with our latest events and activities. Follow us to
            receive notifications about upcoming workshops, competitions, and
            networking opportunities.
          </p>
          {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-white text-blue-900 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-300">
                            Join Our Community
                        </button>
                        <button className="border border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-900 transition-colors duration-300">
                            View Calendar
                        </button>
                    </div> */}
        </section>
      </div>
    </div>
  );
};

export default Events;
