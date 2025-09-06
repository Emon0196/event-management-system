"use client";

import useStore from "../store/useStore";
import Link from "next/link";

export default function EventCard({ event, onRSVP }) {
  const { user } = useStore();
  const isAttending = user ? event.attendees?.includes(user._id) : false;

  return (
    <div className="bg-white border rounded-lg shadow-md p-4 w-full sm:w-[48%] 
                    flex flex-col justify-between transition-transform transform hover:scale-105">
      <h3 className="text-xl font-semibold mb-2 truncate">{event.title}</h3>

      <p className="text-gray-500 text-sm mb-2">
        📅 {new Date(event.date).toLocaleDateString()} | 📍 {event.location}
      </p>

      <p className="text-sm mb-2">
        Attendees: {event.attendees?.length || 0}
      </p>

      <div className="flex gap-2 mt-2">
        <Link
          href={`/events/${event._id}`}
          className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
