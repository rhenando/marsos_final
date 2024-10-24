"use client"; // Client-side rendering
import { useState } from "react";
import { FaComments, FaTimes } from "react-icons/fa";

export default function ChatWindow({ product }) {
  const [isChatOpen, setIsChatOpen] = useState(false); // Control chat window visibility

  // Toggle chat window visibility
  const toggleChatWindow = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={toggleChatWindow}
        className='fixed bottom-5 right-5 bg-[#2c6449] text-white p-4 rounded-full shadow-lg hover:bg-green-600 z-50'
      >
        {isChatOpen ? <FaTimes /> : <FaComments />}
      </button>

      {/* Chat Window */}
      {isChatOpen && (
        <div
          className='fixed bg-white shadow-lg rounded-lg overflow-hidden z-50'
          style={{
            bottom: "50px", // Adjust to your liking
            right: "50px", // Adjust to your liking
            width: "500px", // Enforced width
            height: "600px", // Enforced height
          }}
        >
          <div className='bg-[#2c6449] text-white flex items-center justify-between px-4 py-3'>
            <h2 className='text-lg font-semibold'>Chat</h2>
            <button onClick={toggleChatWindow}>
              <FaTimes />
            </button>
          </div>

          <div className='p-4 h-full'>
            <div className='text-center'>
              <p>This is the chat window.</p>
              <p>Size should now be enforced!</p>
            </div>

            {/* Display product information if available */}
            <div className='mt-4'>
              {product ? (
                <div className='flex flex-col items-start space-y-4'>
                  {product.images && product.images[0] && (
                    <img
                      src={
                        product.images[0].thumbnail ||
                        product.images[0].mainImage
                      }
                      alt={product.productName}
                      className='w-32 h-32 object-cover rounded-lg'
                    />
                  )}
                  <h3 className='text-lg font-semibold'>
                    {product.productName || "Unknown Product"}
                  </h3>
                  <p className='text-gray-700'>
                    SAR {product.price || "Not available"}
                  </p>
                </div>
              ) : (
                <p>Product information not available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
