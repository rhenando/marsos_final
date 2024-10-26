// lib/socketClient.js
import { io } from "socket.io-client";

let socket;

export const initSocket = () => {
  if (!socket) {
    // Use environment variable for Socket.IO server URL
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      path: "/api/socket",
      transports: ["polling"], // Use polling for Vercel compatibility
    });

    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server.");
    });
  }
  return socket;
};
