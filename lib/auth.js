import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "08c72b78869aa74411fa354d911747005d999d3482e98fd10f2e86f59a404b4c3ebd73d64247647db70d221ef414cec80b468f8896da296f8a2017225fc84139";

export function verifyToken(req) {
  let token = null;

  // 🔹 Try Authorization header (Bearer <token>)
  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token || token === "null" || token === "undefined") {
    return null; // 🔹 force invalid
  }
  
  try {
    return jwt.verify(token, JWT_SECRET); // returns { id, name, email }
  } catch {
    return null;
  }
}
