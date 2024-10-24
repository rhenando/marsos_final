"use client"; // Client-side rendering
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase"; // Import Firebase Firestore instance
import { collection, getDocs } from "firebase/firestore"; // Import Firestore functions

export default function ChatWindow() {
  const [contacts, setContacts] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState(""); // New message state
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]); // State for products

  // Fetch contacts via API (this can remain the same)
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

  // Fetch products from Firebase Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products")); // Fetch products from the 'products' collection
        const productList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(), // Get product data (name, image, price, etc.)
        }));
        setProducts(productList); // Set product state
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts(); // Call the function when component mounts
  }, []);

  // Fetch messages for selected chat via API (this can remain the same)
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

  // Send message to the chat via API or Firestore (this can remain the same)
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

        {/* Products Sidebar */}
        <div className='w-1/3 bg-gray-100 p-4 border-l border-gray-200'>
          <h2 className='text-xl font-bold mb-4'>Products</h2>
          <div className='flex flex-col space-y-4'>
            {products.map((product) => (
              <div
                key={product.id}
                className='flex items-start p-3 rounded-lg bg-white shadow hover:bg-gray-200'
              >
                <img
                  src={product.imageUrl} // Assuming the product has an 'imageUrl' field in Firestore
                  alt={product.name}
                  className='w-16 h-16 object-cover rounded mr-4'
                />
                <div className='flex-1'>
                  <h3 className='font-semibold'>{product.name}</h3>
                  <p className='text-gray-600'>SAR {product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
