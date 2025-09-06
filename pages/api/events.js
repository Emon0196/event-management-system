import dbConnect from "../../lib/dbConnect";
import Event from "../../models/Event";
import { verifyToken } from "../../lib/auth";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await dbConnect();
  const { method, query } = req;
  const { id, action } = query;

  try {
// -------- GET EVENT(S) --------
if (method === "GET") {
  if (id) {
    // Single event by ID (public view allowed)
    const event = await Event.findById(id)
      .populate("attendees", "name email")
      .populate("createdBy", "name email");
    if (!event) return res.status(404).json({ success: false, error: "Event not found" });
    return res.status(200).json({ success: true, data: event });
  } else {
    // All events (public, no auth required)
    const events = await Event.find()
      .populate("attendees", "name email")
      .populate("createdBy", "name email")
      .sort({ date: 1 }); // optional: sort by upcoming events first
    return res.status(200).json({ success: true, data: events });
  }
}


    // -------- CREATE EVENT --------
    if (method === "POST" && !action) {
      const user = verifyToken(req);
      if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });

      const event = await Event.create({ ...req.body, createdBy: user.id });
      return res.status(201).json({ success: true, data: event });
    }

    // -------- EDIT EVENT --------
    if (method === "PATCH" && id) {
      const user = verifyToken(req);
      if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });

      const event = await Event.findById(id);
      if (!event) return res.status(404).json({ success: false, error: "Event not found" });
      if (event.createdBy.toString() !== user.id) return res.status(403).json({ success: false, error: "Forbidden" });

      Object.assign(event, req.body);
      await event.save();
      return res.status(200).json({ success: true, data: event });
    }

// -------- DELETE EVENT --------
if (method === "DELETE" && id) {
  const user = verifyToken(req);
  if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });

  try {
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ success: false, error: "Event not found" });

    if (!event.createdBy || event.createdBy.toString() !== user.id)
      return res.status(403).json({ success: false, error: "Forbidden" });

    await Event.deleteOne({ _id: id }); // ✅ updated from event.remove()
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Delete event error:", error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}


    // -------- RSVP --------
    if (method === "POST" && action === "rsvp" && id) {
      const user = verifyToken(req);
      if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });

      const event = await Event.findById(id);
      if (!event) return res.status(404).json({ success: false, error: "Event not found" });

      const isAttending = event.attendees.includes(user.id);
      if (isAttending) {
        event.attendees = event.attendees.filter(uid => uid.toString() !== user.id);
      } else {
        event.attendees.push(user.id);
      }

      await event.save();
      return res.status(200).json({ success: true, data: event });
    }

        
// -------- MY EVENTS --------
if (method === "GET" && action === "my-events") {
  const user = verifyToken(req);
  if (!user) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  try {
    const events = await Event.find({})
      .populate("attendees", "name email")
      .populate("createdBy", "name email");

    // filter manually (same logic as edit/delete checks)
    const myEvents = events.filter(
      (event) => event.createdBy.toString() === user.id
    );

    return res.status(200).json({ success: true, data: myEvents });
  } catch (err) {
    console.error("Fetch my-events error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}


    // If method not handled
    res.setHeader("Allow", ["GET", "POST", "PATCH", "DELETE"]);
    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
