// socketServer.js
import { Server } from "socket.io";

const io = new Server(3001, {
  cors: {
    origin: "http://localhost:3000", // Set to your frontend origin
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("newMessage", (message) => {
    io.emit("newMessage", message);
  });

  socket.on("typing", (userName) => {
    socket.broadcast.emit("typing", userName);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

console.log("Socket.IO server running on port 3001");
