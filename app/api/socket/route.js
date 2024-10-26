// app/api/socket/route.js
import { Server } from "socket.io";
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // Ensures Node.js compatibility on Vercel

let io;

export function GET(req) {
  if (!io) {
    const httpServer = res.socket.server;
    io = new Server(httpServer, {
      path: "/api/socket",
      transports: ["polling"], // Enable polling transport for compatibility
    });
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      // Example: Listen to message events
      socket.on("message", (msg) => {
        console.log("Message received:", msg);
        io.emit("message", msg); // Broadcast message to all clients
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });
  }

  return NextResponse.json({ message: "Socket.IO server is set up" });
}
