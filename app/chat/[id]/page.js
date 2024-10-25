"use client";
import { useEffect, useState } from "react";
import { db } from "../../../lib/firebase";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useSession } from "next-auth/react"; // Import useSession from NextAuth

export default function ChatPage({ params }) {
  const { id } = params; // The product or chat ID passed as a route parameter
  const [productName, setProductName] = useState(null);
  const [supplierName, setSupplierName] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { data: session, status } = useSession(); // Use useSession to get the authenticated user's info

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        // Fetch product details to get the product name and supplier's name
        const productDoc = await getDoc(doc(db, "products", id));
        if (productDoc.exists()) {
          const productData = productDoc.data();
          setProductName(productData.productName);
          setSupplierName(productData.supplierName || "Supplier"); // Assuming supplier name is stored in the product document
        } else {
          console.error("Product not found.");
        }

        // Fetch chat messages if available
        const chatDoc = await getDoc(doc(db, "chats", id));
        if (chatDoc.exists()) {
          setMessages(chatDoc.data().messages || []);
        }
      } catch (error) {
        console.error("Error fetching chat data:", error);
      }
    };

    fetchChatData();
  }, [id]);

  // Function to handle sending a new message
  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    try {
      const chatRef = collection(db, "chats", id, "messages");
      await addDoc(chatRef, {
        text: newMessage,
        sender: session?.user?.name || "Anonymous", // Use the authenticated user's name from the session
        timestamp: serverTimestamp(),
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: newMessage, sender: session?.user?.name || "Anonymous" },
      ]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className='flex h-screen'>
      {/* Left Chat Section */}
      <div className='w-2/3 bg-gray-100 p-6 flex flex-col'>
        <div className='flex flex-col h-full'>
          <div className='flex-1 overflow-y-auto'>
            <div className='bg-white p-4 rounded-lg shadow'>
              <h2 className='text-2xl font-semibold mb-4'>
                {productName} - {supplierName}
              </h2>
              <div className='bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto'>
                {messages.length > 0 ? (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`mb-2 ${
                        msg.sender === session?.user?.name
                          ? "text-right"
                          : "text-left"
                      }`}
                    >
                      <p className='font-semibold'>{msg.sender}:</p>
                      <p>{msg.text}</p>
                    </div>
                  ))
                ) : (
                  <p>No messages yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Input box */}
          <div className='mt-4'>
            <input
              type='text'
              className='w-full border p-2 rounded-lg mb-2'
              placeholder='Type your message...'
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              onClick={handleSendMessage}
              className='w-full bg-blue-500 text-white py-2 rounded-lg'
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Messenger Section */}
      <div className='w-1/3 bg-white p-6 border-l border-gray-200'>
        <h2 className='text-xl font-semibold mb-4'>Messenger</h2>
        {/* Example of past chat participants */}
        <div className='space-y-4'>
          <div className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer'>
            <img
              src='https://via.placeholder.com/50'
              alt='Supplier'
              className='w-12 h-12 rounded-full object-cover'
            />
            <div>
              <h3 className='font-semibold'>{supplierName || "Supplier"}</h3>
              <p className='text-gray-500 text-sm'>Hi</p>
            </div>
          </div>

          <div className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer'>
            <img
              src='https://via.placeholder.com/50'
              alt='Buyer'
              className='w-12 h-12 rounded-full object-cover'
            />
            <div>
              <h3 className='font-semibold'>
                {session?.user?.name || "Buyer"}
              </h3>
              <p className='text-gray-500 text-sm'>Hello Supplier</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
