"use client";

import React from 'react';
import Image from 'next/image';
import { Calendar, Clock, MapPin, Users, ExternalLink } from 'lucide-react';
import eventsData from '../../data/events.json';

const Events = () => {
    const { upcoming, past } = eventsData;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
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
                        Join us for exciting workshops, competitions, and networking opportunities 
                        that will enhance your skills and expand your professional network.
                    </p>
                </div>

                {/* Upcoming Events Section */}
                <section className="mb-20">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold text-blue-900">
                            Upcoming Events
                        </h2>
                        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {upcoming.length} Events
                        </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2  gap-8">
                        {upcoming.map((event) => (
                            <div key={event.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                {/* Event Image */}
                                <div className="relative h-48">
                                    <Image
                                        src={event.image}
                                        alt={event.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                                    
                                </div>
                                
                                <div className="p-6">
                                {/* Event Details */}
                                    <div className="mb-4">
                                        <div className="mb-4">
                                            <h3 className=" text-black text-xl font-bold mb-2">
                                                {event.title}
                                            </h3>
                                            <p className="text-black text-sm line-clamp-2">
                                                {event.description}
                                            </p>
                                        </div>
                                       {/* Date and Time */}
                                        <div className="flex items-center text-gray-600">
                                            <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                                            <span className="text-sm font-medium">{formatDate(event.date)}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <Clock className="w-4 h-4 mr-2 text-blue-600" />
                                            <span className="text-sm">{event.time}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Location */}
                                    <div className="flex items-center text-gray-600 mb-4">
                                        <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                                        <span className="text-sm">{event.location}</span>
                                    </div>
                                    
                                    {/* Event Highlights */}
                                    <div className="mb-4">
                                        <h4 className="text-sm font-semibold text-gray-800 mb-2">Event Highlights:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {event.tags.map((tag, index) => (
                                                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* Register Button */}
                                    <div className="flex gap-3">
                                        <button className="flex-1 bg-blue-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center">
                                            Register Now
                                            <ExternalLink className="w-4 h-4 ml-2" />
                                        </button>
                                        <button className="px-4 py-2 border border-blue-900 text-blue-900 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-300">
                                            Agenda
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Past Events Section */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold text-blue-900">
                            Past Events
                        </h2>
                        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            {past.length} Completed
                        </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {past.map((event) => (
                            <div key={event.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                {/* Event Image */}
                                <div className="relative h-48">
                                    <Image
                                        src={event.image}
                                        alt={event.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                            Completed
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Event Details */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-blue-900 mb-3">
                                        {event.title}
                                    </h3>
                                    
                                    <div className="flex items-center text-gray-600 mb-4">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        <span className="text-sm">{formatDate(event.date)}</span>
                                    </div>
                                    
                                    <p className="text-gray-700 text-sm leading-relaxed mb-4">
                                        {event.description}
                                    </p>
                                    
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center text-blue-600">
                                            <Users className="w-4 h-4 mr-1" />
                                            <span className="text-sm font-medium">{event.participants}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {event.tags.slice(0, 2).map((tag, index) => (
                                                <span key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="mt-20 bg-blue-900 rounded-2xl p-12 text-center text-white">
                    <h2 className="text-3xl font-bold mb-4">
                        Don't Miss Out!
                    </h2>
                    <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                        Stay updated with our latest events and activities. Follow us to receive notifications about upcoming workshops, competitions, and networking opportunities.
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
