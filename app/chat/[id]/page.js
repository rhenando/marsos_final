"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { db } from "../../../lib/firebase";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import jwt from "jsonwebtoken";

export default function ChatPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const userNameParam = searchParams.get("userName") || "Anonymous";

  const [userName, setUserName] = useState(userNameParam);
  const [productName, setProductName] = useState(null);
  const [supplierName, setSupplierName] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false); // New state for typing indicator

  // Fetch user and product details
  useEffect(() => {
    const fetchUserName = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwt.decode(token);
          const phoneNumber = decodedToken?.phoneNumber;

          if (phoneNumber) {
            const userDoc = await fetchUserFromCollections(phoneNumber);
            setUserName(userDoc?.name || userNameParam);
          }
        } catch (error) {
          console.error("Error decoding token or fetching user data:", error);
          setUserName(userNameParam);
        }
      }
    };

    fetchUserName();

    const fetchChatData = async () => {
      if (!id) return;

      try {
        const productDoc = await getDoc(doc(db, "products", id));
        if (productDoc.exists()) {
          const productData = productDoc.data();
          setProductName(productData.productName);
          setSupplierName(productData.supplierName || "Supplier");
        } else {
          console.error("Product not found.");
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    const chatRef = collection(db, "chats", id, "messages");
    const unsubscribe = onSnapshot(chatRef, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          timestamp: doc.data().timestamp?.toDate().toLocaleString() || "",
        }))
      );
    });

    fetchChatData();
    return () => unsubscribe();
  }, [id, userNameParam]);

  const fetchUserFromCollections = async (phoneNumber) => {
    const formattedPhoneNumber = phoneNumber.startsWith("+966")
      ? phoneNumber
      : `+966${phoneNumber}`;

    const collections = ["buyers", "suppliers"];
    for (const userCollection of collections) {
      try {
        const usersCollection = collection(db, userCollection);
        const q = query(
          usersCollection,
          where("phoneNumber", "==", formattedPhoneNumber)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          return querySnapshot.docs[0].data();
        }
      } catch (error) {
        console.error(
          `Error fetching user data from ${userCollection} collection:`,
          error
        );
      }
    }
    return null;
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    try {
      const chatRef = collection(db, "chats", id, "messages");
      await addDoc(chatRef, {
        text: newMessage,
        sender: userName,
        timestamp: serverTimestamp(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className='flex h-screen'>
      <div className='w-2/3 bg-gray-100 p-6 flex flex-col'>
        <div className='flex-1 overflow-y-auto'>
          <div className='bg-white p-4 rounded-lg shadow'>
            <h2 className='text-2xl font-semibold mb-4'>
              {productName} - {supplierName}
            </h2>
            <div className='bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto'>
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <div key={msg.id} className='mb-2 text-left'>
                    <p className='font-semibold'>{msg.sender}:</p>
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
            {isTyping && (
              <p className='text-gray-500 text-xs'>Supplier is typing...</p>
            )}
          </div>
        </div>

        <div className='mt-4'>
          <input
            type='text'
            className='w-full border p-2 rounded-lg mb-2'
            placeholder='Type your message...'
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={() => setIsTyping(true)} // Set typing status
            onKeyUp={() => setIsTyping(false)} // Reset typing status after message
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
              alt='Supplier'
              className='w-12 h-12 rounded-full object-cover'
            />
            <div>
              <h3 className='font-semibold'>{supplierName || "Supplier"}</h3>
            </div>
          </div>

          <div className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer'>
            <img
              src='https://via.placeholder.com/50'
              alt='Buyer'
              className='w-12 h-12 rounded-full object-cover'
            />
            <div>
              <h3 className='font-semibold'>{userName}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
