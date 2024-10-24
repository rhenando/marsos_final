// Import necessary Firebase libraries and Next.js components
"use client";
import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import Image from "next/image";
import firebaseApp from "../../lib/firebase"; // Import your Firebase config

// Initialize Firebase services
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
const auth = getAuth(firebaseApp);

export default function ChatWindow() {
  const [contacts, setContacts] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [logoUrl, setLogoUrl] = useState("/logo.svg"); // Default path, replaced by Firebase

  // Fetch contacts from Firestore
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const contactsSnapshot = await getDocs(collection(db, "contacts"));
        const contactsList = contactsSnapshot.docs.map((doc) => doc.data());
        setContacts(contactsList);
      } catch (error) {
        console.error("Error fetching contacts: ", error);
      }
    };
    fetchContacts();
  }, []);

  // Fetch logo from Firebase Storage
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const logoRef = ref(storage, "logo.svg"); // Replace with your logo path in Firebase Storage
        const logoUrl = await getDownloadURL(logoRef);
        setLogoUrl(logoUrl);
      } catch (error) {
        console.error("Error fetching logo: ", error);
      }
    };
    fetchLogo();
  }, []);

  // Fetch chat messages for the selected contact in real-time
  useEffect(() => {
    if (selectedChat) {
      const chatRef = doc(db, "chats", selectedChat.id);
      const unsubscribe = onSnapshot(
        collection(chatRef, "messages"),
        (snapshot) => {
          const messages = snapshot.docs.map((doc) => doc.data());
          setChatMessages(messages);
        }
      );

      return () => unsubscribe(); // Cleanup listener on unmount
    }
  }, [selectedChat]);

  // Handle Firebase Authentication for user-based chats
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // Store the authenticated user info
      } else {
        setUser(null); // Handle when the user is not authenticated
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return (
    <div className='flex items-center justify-center h-screen bg-gray-50'>
      <div className='flex w-full max-w-5xl h-4/5 bg-white rounded-lg shadow-lg'>
        {/* Main Chat Area on the left */}
        <div className='w-2/3 bg-white flex flex-col items-center justify-center p-8 relative'>
          {/* Watermark Logo */}
          <div className='absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none'>
            <Image
              src={logoUrl}
              alt='Watermark Logo'
              width={400} // Set a fixed width
              height={400} // Set a fixed height
              className='w-96 h-96'
            />
          </div>

          {selectedChat ? (
            <div className='z-10'>
              <h2 className='text-xl text-[#2c6449] font-semibold'>
                {selectedChat.name}
              </h2>
              <div className='overflow-y-auto h-64'>
                {chatMessages.map((message, index) => (
                  <p key={index} className='text-gray-600'>
                    {message.text}
                  </p>
                ))}
              </div>
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center h-full z-10'>
              <p className='mt-6 text-gray-500 text-lg'>
                Chat and source on the go with{" "}
                <span className='text-[#2c6449] font-semibold'>
                  Marsos Platform
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Contacts Sidebar on the right */}
        <div className='w-1/3 bg-gray-100 p-4 border-l border-gray-200'>
          <h2 className='text-xl font-bold mb-4 text-[#2c6449]'>Messenger</h2>
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
                  <h3 className='font-semibold text-[#2c6449]'>
                    {contact.name}
                  </h3>
                  <p className='text-sm text-gray-600'>{contact.lastMessage}</p>
                </div>
                <span className='text-xs text-gray-500 ml-2'>
                  {contact.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
