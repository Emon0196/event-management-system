"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EventCard from "../components/EventCard";
import useStore from "../store/useStore";

export default function HomePage() {
  const { events, setEvents, user } = useStore();
  const router = useRouter();
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  // Fetch all events once (public)
  useEffect(() => {
    const fetchEvents = async () => {
      if (events.length === 0) {
        try {
          const res = await fetch("/api/events"); // Public GET
          const data = await res.json();
          if (data.success) setEvents(data.data);
        } catch (err) {
          console.error("Error fetching events:", err);
        }
      }
    };
    fetchEvents();
  }, [events.length, setEvents]);

  // Filter events based on search/category
  useEffect(() => {
    let temp = [...events];
    if (search) temp = temp.filter((e) => e.title.toLowerCase().includes(search.toLowerCase()));
    if (category) temp = temp.filter((e) => e.category === category);
    setFilteredEvents(temp);
  }, [search, category, events]);

  // Handle RSVP (only if logged in)
  const handleRSVP = async (eventId) => {
    if (!user) {
      router.push("/login"); // Guests redirected to login if they try to RSVP
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/events?id=${eventId}&action=rsvp`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        // Update global state
        useStore.getState().updateEvent(data.data);
      }
    } catch (err) {
      console.error("RSVP error:", err);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-center">Upcoming Events</h2>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <input
          type="text"
          placeholder="Search by title..."
          className="border p-2 rounded w-full sm:w-1/2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border p-2 rounded w-full sm:w-1/4"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Conference">Conference</option>
          <option value="Workshop">Workshop</option>
          <option value="Meetup">Meetup</option>
        </select>
      </div>

<div className="flex flex-wrap justify-between gap-4">
  {filteredEvents.length > 0 ? (
    filteredEvents.map((event, index) => (
      <EventCard
        key={event._id}
        event={event}
        currentUser={user}
        onRSVP={handleRSVP}
      />
    ))
  ) : (
    <p className="text-center w-full text-gray-600">No events found.</p>
  )}
</div>

    </div>
  );
}
