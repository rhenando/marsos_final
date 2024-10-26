// lib/socket.js
import { io } from "socket.io-client";

let socket;

export const initSocket = () => {
  if (!socket) {
    socket = io("http://localhost:3001"); // Ensure this matches the server URL
  }
  return socket;
};
