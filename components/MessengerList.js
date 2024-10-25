// app/components/MessengerList.js
"use client";

import { useEffect, useState } from "react";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  onSnapshot,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

const MessengerList = () => {
  const [conversations, setConversations] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const q = query(collection(db, "conversations"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const chats = [];
      querySnapshot.forEach((doc) => {
        chats.push({ id: doc.id, ...doc.data() });
      });
      setConversations(chats);
    });

    return () => unsubscribe();
  }, []);

  const openChat = (chatId) => {
    router.push(`/chat/${chatId}`);
  };

  return (
    <div className='w-full h-full p-4 bg-gray-100'>
      <h2 className='text-lg font-bold mb-4'>Messenger</h2>
      <div className='space-y-4'>
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className='flex items-center space-x-3 p-3 bg-white rounded-lg shadow cursor-pointer hover:bg-gray-200'
            onClick={() => openChat(conversation.id)}
          >
            <img
              src={conversation.profilePic}
              alt={conversation.name}
              className='w-10 h-10 rounded-full'
            />
            <div>
              <p className='font-semibold'>{conversation.name}</p>
              <p className='text-sm text-gray-500'>
                {conversation.lastMessage}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessengerList;
