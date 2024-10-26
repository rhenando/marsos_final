// app/api/socket/route.js
import { Server } from "socket.io";

export const runtime = "nodejs"; // Ensures the use of Node.js runtime on Vercel

export default async function handler(req, res) {
  // Check if the Socket.IO server has already been initialized
  if (!res.socket.server.io) {
    console.log("Setting up Socket.IO server with polling...");

    // Initialize a new instance of Socket.IO on the server
    const io = new Server(res.socket.server, {
      path: "/api/socket",
      transports: ["polling"], // Use polling transport to ensure serverless compatibility
      cors: {
        origin:
          process.env.NEXT_PUBLIC_SOCKET_URL || "https://marsos.vercel.app",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    res.socket.server.io = io;

    // Define event listeners
    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      // Listen for a message event
      socket.on("message", (msg) => {
        console.log("Message received:", msg);
        io.emit("message", msg); // Broadcast the message to all clients
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
