"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useStore from "../../store/useStore";

export default function CreateEventPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get("id");

  const { user, events, addEvent, updateEvent } = useStore();

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "Conference",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  // Load event if editing
  useEffect(() => {
    if (eventId) {
      const found = events.find((e) => e._id === eventId);
      if (found) {
        setForm({
          title: found.title || "",
          description: found.description || "",
          date: found.date ? found.date.split("T")[0] : "",
          location: found.location || "",
          category: found.category || "Conference",
        });
        setLoading(false);
      } else {
        fetch(`/api/events?id=${eventId}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              const e = data.data;
              setForm({
                title: e.title || "",
                description: e.description || "",
                date: e.date ? e.date.split("T")[0] : "",
                location: e.location || "",
                category: e.category || "Conference",
              });
            }
          })
          .finally(() => setLoading(false));
      }
    } else {
      setLoading(false);
    }
  }, [eventId, events]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token"); // ✅ get JWT

      if (!token) {
        alert("You must be logged in to perform this action.");
        router.push("/login");
        return;
      }

      if (eventId) {
        // ✅ Edit event
        const res = await fetch(`/api/events?id=${eventId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ attach token
          },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (data.success) {
          updateEvent(data.data);
          router.push("/my-events");
        } else {
          alert(data.error || "Failed to update event");
        }
      } else {
        // ✅ Create event
        const res = await fetch("/api/events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ attach token
          },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (data.success) {
          addEvent(data.data);
          router.push("/my-events");
        } else {
          alert(data.error || "Failed to create event");
        }
      }
    } catch (err) {
      console.error("Error submitting event:", err);
      alert("Something went wrong while submitting.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {eventId ? "Edit Event" : "Create Event"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Event Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          required
        />
        <textarea
          name="description"
          placeholder="Event Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          required
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          required
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="Conference">Conference</option>
          <option value="Workshop">Workshop</option>
          <option value="Meetup">Meetup</option>
        </select>

        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-2 rounded text-white ${
            submitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {submitting
            ? eventId
              ? "Updating..."
              : "Creating..."
            : eventId
            ? "Update Event"
            : "Create Event"}
        </button>
      </form>
    </div>
  );
}
