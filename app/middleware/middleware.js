import jwt from "jsonwebtoken";

export const config = {
  matcher: ["/vendor/:path*", "/admin/:path*"],
};

export function middleware(req) {
  const token = req.headers.get("authorization");

  if (!token) {
    return new Response(JSON.stringify({ error: "No token provided" }), {
      status: 403,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return NextResponse.next();
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to authenticate token" }),
      { status: 500 }
    );
  }
}
