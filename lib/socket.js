// lib/socket.js
import { io } from "socket.io-client";

let socket;

export const initSocket = () => {
  if (!socket) {
    socket = io("https://marsos.vercel.ap"); //  http://localhost:3001
  }
  return socket;
};
