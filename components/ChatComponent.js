"use client";

import { useEffect, useState } from "react";
import { initSocket } from "../lib/socket";

const ChatComponent = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const socket = initSocket();

    // Listen for messages from the server
    socket.on("serverMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Cleanup on unmount
    return () => {
      socket.off("serverMessage");
    };
  }, []);

  const sendMessage = () => {
    const socket = initSocket();
    socket.emit("clientMessage", message);
    setMessage(""); // Clear the input after sending
  };

  return (
    <div>
      <h2>Real-Time Chat</h2>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <input
        type='text'
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder='Enter message'
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatComponent;
