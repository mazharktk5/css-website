"use client";
import FadeIn from "@/components/FadeIn";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Users } from "lucide-react";

export function EventCard({ event, index }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <FadeIn delay={index * 100}>
      <Link href={`/events/${event._id}`}>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition">
          <div className="relative h-48">
            <Image
              src={event.image || "/images/gallery/placeholder.jpg"}
              alt={event.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-4 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#1e3a8a]" />
                {formatDate(event.date)}
              </div>
              <span className="text-xs font-medium text-[#1e3a8a]">
                {event.category}
              </span>
            </div>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 line-clamp-2">
              {event.title}
            </h3>

            <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-6">
              {event.description}
            </p>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-slate-500">
                <Users className="w-4 h-4" />
                {event.participants || "Participants"}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </FadeIn>
  );
}
