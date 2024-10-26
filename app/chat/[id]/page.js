"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { io } from "socket.io-client";

let socket;

const initSocket = () => {
  if (!socket) {
    // Use the environment variable for the server URL, defaulting to the production URL if undefined
    const serverUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL || "https://marsos.vercel.app";
    socket = io(serverUrl, {
      path: "/api/socket",
      transports: ["polling"], // Use polling for Vercel compatibility
    });

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server.");
    });
  }
  return socket;
};

export default function ChatPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const [userName, setUserName] = useState("Anonymous");
  const [role, setRole] = useState("buyer");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Read `userName` and `role` from URL parameters once on mount
    const userNameParam = searchParams.get("userName") || "Anonymous";
    const roleParam = searchParams.get("role") || "buyer";

    setUserName(userNameParam);
    setRole(roleParam);

    console.log(`User connected as ${userNameParam} with role ${roleParam}`);

    const socket = initSocket();

    socket.on("chatHistory", (history) => {
      setMessages(history);
    });

    socket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("typing", (userName) => {
      setIsTyping(`${userName} is typing...`);
      setTimeout(() => setIsTyping(false), 2000);
    });

    return () => {
      socket.off("chatHistory");
      socket.off("newMessage");
      socket.off("typing");
    };
  }, []); // Run only once on component mount

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const socket = initSocket();
    const messageData = {
      text: newMessage,
      sender: userName,
      role,
      timestamp: new Date().toLocaleString(),
    };

    socket.emit("newMessage", messageData);
    setNewMessage("");
  };

  return (
    <div className='flex h-screen'>
      <div className='w-2/3 bg-gray-100 p-6 flex flex-col'>
        <div className='flex-1 overflow-y-auto'>
          <div className='bg-white p-4 rounded-lg shadow'>
            <h2 className='text-2xl font-semibold mb-4'>Chat Room</h2>
            <div className='bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto'>
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <div key={index} className='mb-2 text-left'>
                    <p className='font-semibold'>
                      {msg.sender} ({msg.role}):
                    </p>
                    <p>{msg.text}</p>
                    <span className='text-gray-500 text-xs'>
                      {msg.timestamp}
                    </span>
                  </div>
                ))
              ) : (
                <p>No messages yet.</p>
              )}
            </div>
            {isTyping && <p className='text-gray-500 text-xs'>{isTyping}</p>}
          </div>
        </div>

        <div className='mt-4'>
          <input
            type='text'
            className='w-full border p-2 rounded-lg mb-2'
            placeholder='Type your message...'
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={() => initSocket().emit("typing", userName)}
            onKeyUp={() => setIsTyping(false)}
          />
          <button
            onClick={handleSendMessage}
            className='w-full bg-blue-500 text-white py-2 rounded-lg'
          >
            Send
          </button>
        </div>
      </div>

      <div className='w-1/3 bg-white p-6 border-l border-gray-200'>
        <h2 className='text-xl font-semibold mb-4'>Messenger</h2>
        <div className='space-y-4'>
          <div className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer'>
            <img
              src='https://via.placeholder.com/50'
              alt='User'
              className='w-12 h-12 rounded-full object-cover'
            />
            <div>
              <h3 className='font-semibold'>{userName}</h3>
            </div>
          </div>
          {role === "supplier" && (
            <p className='text-gray-600 text-sm mt-4'>
              You are logged in as a supplier. Buyers will contact you here.
            </p>
          )}
          {role === "buyer" && (
            <p className='text-gray-600 text-sm mt-4'>
              You are logged in as a buyer. You can contact the supplier here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
