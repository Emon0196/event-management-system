"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import useStore from "../../../store/useStore";
import { FaCalendarAlt, FaMapMarkerAlt, FaTags, FaUsers, FaChevronDown, FaChevronUp } from "react-icons/fa";
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
        setEvent(data.data);   // always use updated backend response
        updateEvent(data.data);
      }
    } catch (err) {
      console.error("RSVP error:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl border border-gray-200">
      
      {/* Event banner image */}
<div className="relative w-36 h-12"> {/* parent container */}
  <Image
    src="/logo2.webp"
    alt="Logo"
    fill
    className="object-contain"
  />
</div>

      {/* Event title */}
      <h1 className="text-4xl font-bold mb-4 text-gray-800">{event.title}</h1>

      {/* RSVP button */}
      {user && (
        <button
          onClick={handleRSVP}
          className={`mb-6 px-6 py-2 rounded-lg font-semibold transition ${
            event.attendees.some((a) => a._id === user.id)
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {event.attendees.some((a) => a._id === user.id) ? "Cancel RSVP" : "RSVP"}
        </button>
      )}

      {/* Event info */}
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div className="flex items-center gap-2 text-gray-700">
          <FaCalendarAlt className="text-blue-500" /> 
          <span>{new Date(event.date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <FaMapMarkerAlt className="text-red-500" /> 
          <span>{event.location}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <FaTags className="text-green-500" /> 
          <span>{event.category}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <FaUsers className="text-purple-500" /> 
          <span>{event.attendees.length} attending</span>
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
          <p className="text-gray-600 leading-relaxed">{event.description}</p>
        )}
      </div>

      {/* Optional additional info can go here */}
    </div>
  );
}
