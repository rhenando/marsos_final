"use client";
import { useState } from "react";
import Image from "next/image";
import authLogo from "/public/logo.svg"; // Logo for the watermark (replace with actual path)

export default function ChatWindow() {
  const [selectedChat, setSelectedChat] = useState(null);

  // Sample chat data (can be fetched dynamically)
  const contacts = [
    {
      id: 1,
      name: "Marsos Seller",
      lastMessage: "Hello, how are you?",
      timestamp: "2024-10-23",
      avatar: "/public/logo.svg", // replace with actual avatar path
    },
    {
      id: 2,
      name: "Marsos Buyer",
      lastMessage: "Can we schedule a call?",
      timestamp: "2024-10-22",
      avatar: "/public/logo.svg", // replace with actual avatar path
    },
  ];

  return (
    <div className='flex items-center justify-center h-screen bg-gray-50'>
      <div className='flex w-full max-w-5xl h-4/5 bg-white rounded-lg shadow-lg'>
        {/* Main Chat Area on the left */}
        <div className='w-2/3 bg-white flex flex-col items-center justify-center p-8 relative'>
          {/* Watermark Logo */}
          <div className='absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none'>
            <Image src={authLogo} alt='Watermark Logo' className='w-96 h-96' />
          </div>

          {selectedChat ? (
            <div className='z-10'>
              <h2 className='text-xl text-[#2c6449] font-semibold'>
                {selectedChat.name}
              </h2>
              <p className='text-gray-600'>{selectedChat.lastMessage}</p>
              {/* Additional chat interface can go here */}
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
