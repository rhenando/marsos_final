"use client"; // Client-side rendering
import { useEffect, useState } from "react";

export default function ChatWindow() {
  const [contacts, setContacts] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState(""); // New message state
  const [user, setUser] = useState(null);

  // Fetch contacts via API
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch("/api/contacts");
        const data = await res.json();
        if (data.contacts) {
          setContacts(data.contacts);
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };
    fetchContacts();
  }, []);

  // Fetch messages for selected chat via API
  useEffect(() => {
    if (selectedChat) {
      const fetchMessages = async () => {
        try {
          const res = await fetch(`/api/messages?chatId=${selectedChat.id}`);
          const data = await res.json();
          if (data.messages) {
            setChatMessages(data.messages);
          }
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };
      fetchMessages();
    }
  }, [selectedChat]);

  // Send message to the chat via API or Firestore
  const sendMessage = async () => {
    if (!message.trim()) return; // Prevent empty messages

    try {
      const res = await fetch(`/api/messages?chatId=${selectedChat.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: message,
          userId: user ? user.uid : "anonymous", // Use authenticated user ID if available
          timestamp: new Date(),
        }),
      });

      if (res.ok) {
        // Clear message input after sending
        setMessage("");
      } else {
        console.error("Error sending message");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className='flex items-center justify-center h-screen bg-gray-50'>
      <div className='flex w-full max-w-5xl h-4/5 bg-white rounded-lg shadow-lg'>
        {/* Main Chat Area */}
        <div className='w-2/3 bg-white flex flex-col items-center justify-center p-8 relative'>
          {selectedChat ? (
            <div className='z-10 flex flex-col w-full h-full'>
              <h2 className='text-xl font-semibold'>{selectedChat.name}</h2>
              {/* Chat Messages */}
              <div className='overflow-y-auto h-64 mb-4'>
                {chatMessages.map((message, index) => (
                  <p key={index} className='text-gray-600'>
                    {message.text}
                  </p>
                ))}
              </div>

              {/* Message input and send button */}
              <div className='flex items-center w-full mt-auto border-t border-gray-200 p-2'>
                <input
                  type='text'
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder='Type a message...'
                  className='flex-1 border p-2 rounded-lg'
                />
                <button
                  onClick={sendMessage}
                  className='ml-4 bg-[#2c6449] text-white p-2 rounded-lg'
                >
                  Send
                </button>
              </div>
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center h-full z-10'>
              <p className='mt-6 text-gray-500 text-lg'>
                Select a chat to start messaging
              </p>
            </div>
          )}
        </div>

        {/* Contacts Sidebar */}
        <div className='w-1/3 bg-gray-100 p-4 border-l border-gray-200'>
          <h2 className='text-xl font-bold mb-4'>Messenger</h2>
          <div className='flex flex-col space-y-4'>
            {contacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => setSelectedChat(contact)}
                className={`flex items-start p-3 rounded-lg cursor-pointer hover:bg-gray-200 ${
                  selectedChat?.id === contact.id ? "bg-gray-200" : ""
                }`}
              >
                <img
                  src={contact.avatar}
                  alt={`${contact.name}'s Avatar`}
                  className='w-10 h-10 rounded-full mr-3'
                />
                <div className='flex-1'>
                  <h3 className='font-semibold'>{contact.name}</h3>
                  <p className='text-sm text-gray-600'>{contact.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
