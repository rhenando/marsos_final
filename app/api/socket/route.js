// app/api/socket/route.js
import { Server } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    console.log("Setting up Socket.IO server with polling...");
    const io = new Server(res.socket.server, {
      path: "/api/socket",
      transports: ["polling"], // Use polling for serverless compatibility
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
  } else {
    console.log("Socket.IO server already set up.");
  }
  res.end();
};

export default ioHandler;
