import React, { useState } from "react";
import { Button } from "../ui/button";

const MessageDrawer = ({ isOpen, onClose, product }) => {
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleSendMessage = () => {
    if (message.trim() === "") {
      alert("Please enter a message.");
      return;
    }
    // Simulate sending a message here
    console.log(`Message to vendor: ${product.vendor}`);
    console.log(`Message content: ${message}`);
    // Reset message after sending
    setMessage("");
    onClose();
    alert("Message sent!");
  };

  return (
    <div className='fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex justify-end'>
      <div className='w-[400px] bg-white p-6 shadow-xl h-screen overflow-y-auto'>
        <button onClick={onClose} className='text-gray-500 float-right mb-4'>
          X Close
        </button>

        <h3 className='text-xl font-semibold mb-4'>Message Supplier</h3>

        <p className='text-sm text-gray-700 mb-2'>
          Contact {product.vendor} about the product: {product.name}
        </p>

        <textarea
          className='w-full h-32 p-2 border rounded mb-4'
          placeholder='Enter your message'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <Button
          onClick={handleSendMessage}
          className=' text-white px-4 py-2 rounded w-full bg-green-900'
        >
          Send Message
        </Button>
      </div>
    </div>
  );
};

export default MessageDrawer;
