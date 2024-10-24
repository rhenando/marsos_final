import { parse } from "cookie";
import jwt from "jsonwebtoken";

export function verifyTokenFromCookie(req, res, next) {
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : null;

  if (!cookies || !cookies.token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const token = cookies.token;

  try {
    // Verify the token and check the role
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "vendor") {
      // Check if the user is a vendor
      return res.status(403).json({ message: "Access denied: Vendors only" });
    }

    req.user = decoded; // Attach the user data to the request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
