"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import useStore from "../../../store/useStore";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTags,
  FaUsers,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import Image from "next/image";

export default function EventDetailsPage() {
  const { id } = useParams();
  const { events, setEvents, updateEvent, user } = useStore();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(true);

  // Load event from store or fetch if missing
  useEffect(() => {
    const loadEvent = async () => {
      let found = events.find((e) => e._id === id);
      if (!found) {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`/api/events?id=${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (data.success) {
            found = data.data;
            setEvents([...events, found]);
          }
        } catch (err) {
          console.error("Error fetching event details:", err);
        }
      }
      setEvent(found);
      setLoading(false);
    };
    loadEvent();
  }, [id, events, setEvents]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!event) return <p className="text-center mt-10">Event not found</p>;

  const handleRSVP = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/events?id=${id}&action=rsvp`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        setEvent(data.data); // always use updated backend response
        updateEvent(data.data);
      }
    } catch (err) {
      console.error("RSVP error:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl border border-gray-200">
      {/* Event banner image */}
      <div className="relative w-40 h-14 mb-4 mx-auto">
        <Image
          src="/logo2.webp"
          alt="Logo"
          fill
          sizes="100vw"
          className="object-contain"
        />
      </div>

      {/* Event title */}
      <h1 className="text-4xl font-extrabold mb-6 text-gray-800 text-center">
        {event.title}
      </h1>

      {/* RSVP button */}
      {user && (
        <button
          onClick={handleRSVP}
          className={`mb-8 w-full sm:w-auto px-6 py-2 rounded-lg font-semibold transition shadow-md ${
            event.attendees.some((a) => a._id === user.id)
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {event.attendees.some((a) => a._id === user.id)
            ? "Cancel RSVP"
            : "RSVP"}
        </button>
      )}

      {/* Event info */}
      <div className="grid grid-cols-1 gap-3 mb-6">
        <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition">
          <FaCalendarAlt className="text-blue-500 text-lg" />
          <span className="font-semibold text-gray-700">Date:</span>
          <span className="text-gray-600">
            {new Date(event.date).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition">
          <FaMapMarkerAlt className="text-red-500 text-lg" />
          <span className="font-semibold text-gray-700">Location:</span>
          <span className="text-gray-600">{event.location}</span>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition">
          <FaTags className="text-green-500 text-lg" />
          <span className="font-semibold text-gray-700">Category:</span>
          <span className="text-gray-600">{event.category}</span>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition">
          <FaUsers className="text-purple-500 text-lg" />
          <span className="font-semibold text-gray-700">Attendees:</span>
          <span className="text-gray-600">{event.attendees.length}</span>
        </div>
      </div>

      {/* Description with collapsible */}
      <div className="border-t pt-4">
        <button
          onClick={() => setDetailsOpen(!detailsOpen)}
          className="flex items-center justify-between w-full text-gray-700 font-medium mb-2 hover:text-blue-600 transition"
        >
          <span>Event Details</span>
          {detailsOpen ? <FaChevronUp /> : <FaChevronDown />}
        </button>

        {detailsOpen && (
          <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg shadow-inner">
            {event.description}
          </p>
        )}
      </div>
    </div>
  );
}
