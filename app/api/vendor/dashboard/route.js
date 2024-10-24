import jwt from "jsonwebtoken";

export async function GET(req) {
  const token = req.headers.get("cookie"); // Get the cookie header

  if (!token) {
    return new Response(JSON.stringify({ error: "No token provided" }), {
      status: 403,
    });
  }

  try {
    // Extract the JWT token from the cookie
    const tokenValue = token
      .split(";")
      .find((item) => item.trim().startsWith("token="))
      ?.split("=")[1];

    if (!tokenValue) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 403,
      });
    }

    // Verify the JWT token
    const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);

    if (decoded.role !== "vendor") {
      return new Response(JSON.stringify({ error: "Access denied" }), {
        status: 403,
      });
    }

    return new Response(
      JSON.stringify({
        message: `Welcome to the Vendor Dashboard, ${decoded.phoneNumber}!`,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid token" }), {
      status: 401,
    });
  }
}
