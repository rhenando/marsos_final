// app/api/socket/route.js
import { Server } from "socket.io";

export const runtime = "nodejs"; // Ensure Node.js runtime on Vercel

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("Setting up Socket.IO server with polling and CORS...");

    const io = new Server(res.socket.server, {
      path: "/api/socket",
      transports: ["polling"], // Use polling for serverless compatibility
      cors: {
        origin: "https://marsos.vercel.app", // Only allow Vercel production URL
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      // Handle incoming message events
      socket.on("message", (msg) => {
        console.log("Message received:", msg);
        io.emit("message", msg); // Broadcast to all clients
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });
  } else {
    console.log("Socket.IO server is already set up.");
  }

  res.end();
}
