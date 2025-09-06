import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  await dbConnect();
  const { method } = req;

  if (method !== "POST") {
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ success: true, data: { id: user._id, name, email } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
