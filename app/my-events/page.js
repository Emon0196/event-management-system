"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useStore from "../../store/useStore";

export default function MyEventsPage() {
  const { user, removeEvent } = useStore();
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's events from backend
  useEffect(() => {
    if (!user) return;

    const fetchMyEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/events?action=my-events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setMyEvents(data.data);
      } catch (err) {
        console.error("Error fetching my events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, [user]);

  // Delete event
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/events?id=${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json",
          Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setMyEvents((prev) => prev.filter((e) => e._id !== id));
        removeEvent(id); // Update global state
      }
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  if (!user) return <p className="text-center mt-10">Please login to view your events.</p>;
  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-center">My Events</h2>
      <div className="flex flex-wrap justify-between gap-4">
        {myEvents.length > 0 ? (
          myEvents.map((event) => (
            <div key={event._id} className="border rounded-lg p-4 shadow-md w-full sm:w-1/2 md:w-1/3">
              <h3 className="text-xl font-semibold">{event.title}</h3>
              <p className="text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
              <p className="text-gray-600">{event.location}</p>
              <div className="flex gap-2 mt-2">
                {/* Edit button now routes to create-event page with id query */}
                <Link
                  href={`/create-event?id=${event._id}`}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(event._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center w-full text-gray-600">No events created yet.</p>
        )}
      </div>
    </div>
  );
}
