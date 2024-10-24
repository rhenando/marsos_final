"use client"; // For client-side rendering
import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase"; // Firebase configuration

export default function ChatPage() {
  const [message, setMessage] = useState(""); // Holds the message typed by the user
  const [messages, setMessages] = useState([]); // Holds all messages fetched from Firestore
  const [selectedChat, setSelectedChat] = useState(null); // Holds selected chat contact
  const [contacts, setContacts] = useState([]); // Will hold contacts fetched from Firestore

  // Fetch contacts from Firestore
  useEffect(() => {
    const contactsRef = collection(db, "contacts"); // Firestore collection for contacts
    const unsubscribe = onSnapshot(contactsRef, (snapshot) => {
      const contactsArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setContacts(contactsArray); // Set contacts state with Firestore data
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, []);

  // Fetch messages in real-time from Firestore for the selected chat
  useEffect(() => {
    if (selectedChat) {
      const messagesRef = collection(db, "chats", selectedChat.id, "messages");
      const q = query(messagesRef, orderBy("timestamp", "asc"));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messagesArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messagesArray); // Set the real-time messages
      });

      return () => unsubscribe(); // Cleanup listener when unmounting or when chat changes
    }
  }, [selectedChat]);

  // Send message to Firestore
  const sendMessage = async () => {
    if (message.trim() === "") return; // Avoid sending empty messages

    try {
      const messagesRef = collection(db, "chats", selectedChat.id, "messages");
      await addDoc(messagesRef, {
        text: message,
        userId: "user_123", // Replace with authenticated user ID
        timestamp: new Date(),
      });
      setMessage(""); // Clear the input field after sending
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className='flex h-screen bg-gray-100'>
      {/* Left chat window (Empty state or chat content) */}
      <div className='flex-1 bg-white flex flex-col justify-center items-center relative'>
        {selectedChat ? (
          <div className='w-full h-full flex flex-col'>
            {/* Messages List */}
            <div className='flex-1 overflow-y-auto p-4'>
              {messages.map((msg) => (
                <div key={msg.id} className='mb-2'>
                  <strong>{msg.userId}: </strong>
                  <span>{msg.text}</span>
                </div>
              ))}
            </div>

            {/* Input field and send button */}
            <div className='p-4 flex items-center border-t'>
              <input
                type='text'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder='Type a message...'
                className='flex-1 border rounded-md p-2'
              />
              <button
                onClick={sendMessage}
                className='ml-2 bg-blue-500 text-white p-2 rounded-md'
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          <div className='text-center flex flex-col justify-center items-center h-full'>
            <img
              src='/your-placeholder-image.png' // Add appropriate image path
              alt='Placeholder'
              className='w-64 h-64 opacity-50'
            />
            <p className='text-gray-500 mt-4'>
              Chat and source on the go with{" "}
              <span className='text-blue-500'>Marsos Platform</span>
            </p>
          </div>
        )}
      </div>

      {/* Right contacts sidebar */}
      <div className='w-1/3 bg-white border-l flex flex-col'>
        {/* Messenger Header */}
        <div className='flex items-center justify-between p-4 border-b'>
          <h2 className='text-xl font-bold'>Messenger</h2>
          <span className='bg-red-500 text-white px-2 py-1 text-sm rounded-full'>
            2
          </span>{" "}
          {/* Notification badge */}
        </div>

        {/* Contacts List */}
        <div className='flex-1 overflow-y-auto p-4'>
          {contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setSelectedChat(contact)}
              className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${
                selectedChat?.id === contact.id ? "bg-gray-200" : ""
              }`}
            >
              <img
                src={contact.avatar || "/default-avatar.png"} // Default avatar if none
                alt={`${contact.name}'s Avatar`}
                className='w-10 h-10 rounded-full mr-3'
              />
              <div className='flex-1'>
                <h3 className='font-semibold'>{contact.name}</h3>
                <p className='text-sm text-gray-600'>
                  {contact.lastMessage || "No message yet"}
                </p>
              </div>
              <span className='text-xs text-gray-500'>{contact.timestamp}</span>
            </div>
          ))}
        </div>

        {/* Footer (Optional search or close icon) */}
        <div className='p-4 border-t flex justify-end'>
          <button className='text-gray-500 hover:text-gray-700'>Close</button>
        </div>
      </div>
    </div>
  );
}
