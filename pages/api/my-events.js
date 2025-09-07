// pages/api/my-events.js OR app/api/my-events/route.js (App Router)

import dbConnect from "../../lib/dbConnect";
import Event from "../../models/Event";
import { verifyToken } from "../../lib/auth";

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;

  if (method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ success: false, error: `Method ${method} Not Allowed` });
  }

  // 1️⃣ Extract user from token
  const user = verifyToken(req);
  if (!user) {
    return res.status(401).json({ success: false, error: "Unauthorized: Token missing or invalid" });
  }

  try {
    // 2️⃣ Fetch only events created by the logged-in user
    const myEvents = await Event.find({ createdBy: user.id })
      .populate("attendees", "name email")
      .populate("createdBy", "name email")
      .sort({ date: 1 }); // optional: sort by upcoming events

    // 3️⃣ Return the events
    return res.status(200).json({ success: true, data: myEvents });
  } catch (err) {
    console.error("My-events fetch error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}
