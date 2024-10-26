// app/api/socket/route.js
import { Server } from "socket.io";

export const runtime = "nodejs"; // Ensure Node.js runtime on Vercel

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("Setting up Socket.IO server...");

    const io = new Server(res.socket.server, {
      path: "/api/socket",
      transports: ["polling"], // Use polling transport for serverless compatibility
      cors: {
        origin:
          process.env.NEXT_PUBLIC_SOCKET_URL || "https://marsos.vercel.app",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      // Event listener for messages
      socket.on("message", (msg) => {
        console.log("Message received:", msg);
        io.emit("message", msg); // Broadcast message to all connected clients
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });
  }

  // End the response without sending HTTP headers
  res.end();
}
