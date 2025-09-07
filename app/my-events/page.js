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
        const res = await fetch("/api/my-events", {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          cache: "no-store", // ensures server call every time
        });
        const data = await res.json();
        if (data.success) {
          setMyEvents(data.data);
        }
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
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
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
    <div className="px-4 sm:px-8 md:px-12">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800">
        🎉 My Events
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {myEvents.length > 0 ? (
          myEvents.map((event) => (
            <div
              key={event._id}
              className="border rounded-xl p-5 shadow-md bg-white transition-transform transform hover:scale-[1.03] hover:shadow-xl hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 duration-300"
            >
              <h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>
              <p className="text-sm text-gray-500 mt-1">
                📅 {new Date(event.date).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">📍 {event.location}</p>

              <div className="flex gap-3 mt-4">
                <Link
                  href={`/create-event?id=${event._id}`}
                  className="flex-1 text-center bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 transition-colors duration-200"
                >
                  ✏️ Edit
                </Link>

                <button
                  onClick={() => handleDelete(event._id)}
                  className="flex-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
                >
                  🗑 Delete
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
