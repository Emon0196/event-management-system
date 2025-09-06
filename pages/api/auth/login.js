import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  await dbConnect();
  const { method } = req;

  if (method !== "POST") {
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, error: "Invalid credentials" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, error: "Invalid credentials" });

    // Create JWT
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return token and user info in JSON (no cookie)
    res.status(200).json({
      success: true,
      token, // <-- frontend stores this in localStorage
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login API error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
