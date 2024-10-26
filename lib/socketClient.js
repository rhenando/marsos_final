// lib/socketClient.js
import { io } from "socket.io-client";

let socket;

export const initSocket = () => {
  if (!socket) {
    // Connect to the Vercel serverless function with polling enabled
    socket = io({
      path: "/api/socket",
      transports: ["polling"], // Enable polling for serverless compatibility
    });

    socket.on("connect", () => {
      console.log("Connected to server with polling:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server.");
    });
  }
  return socket;
};
