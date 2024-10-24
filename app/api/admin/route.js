import { verifyToken } from "../../../lib/auth";

export async function GET(req) {
  const authHeader = req.headers.get("authorization");
  try {
    const user = verifyToken(authHeader);
    return new Response(
      JSON.stringify({
        message: `Welcome to the admin panel, ${user.phoneNumber}!`,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
}
