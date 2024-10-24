"use client";
import { useState, useEffect } from "react";
import { db } from "../../../lib/firebase"; // Adjust path as needed
import { doc, getDoc } from "firebase/firestore";
import jsPDF from "jspdf"; // Import jsPDF for PDF generation
import autoTable from "jspdf-autotable"; // Import autoTable for tables
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader"; // Import Preloader component
import { FaComments, FaTimes } from "react-icons/fa"; // Import icons for chat button and close button

export default function ProductDetailsPage({ params }) {
  const { id } = params; // Get the product ID from the dynamic route
  const [product, setProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // For controlling the modal
  const [quantity, setQuantity] = useState(""); // Example input in modal
  const [additionalNotes, setAdditionalNotes] = useState(""); // Another example input
  const [loading, setLoading] = useState(true); // Add loading state
  const [isChatOpen, setIsChatOpen] = useState(false); // Control chat window visibility

  // Shipping cost is hardcoded for now
  const shippingCost = 0.0;

  // Toggle chat window visibility
  const toggleChatWindow = () => {
    setIsChatOpen(!isChatOpen);
  };

  // Fetch the product from Firestore
  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;

      try {
        const productDoc = await getDoc(doc(db, "products", id));
        if (productDoc.exists()) {
          setProduct(productDoc.data());
        } else {
          console.error("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false); // Stop loading after fetching data
      }
    }
    fetchProduct();
  }, [id]);

  // Function to handle quotation request
  const requestQuotation = () => {
    const quotationData = {
      productName: product.productName,
      productId: id,
      vendorId: product.vendorId,
      quantity: quantity,
      additionalNotes: additionalNotes,
      priceRanges: product.priceRanges, // Include price ranges in the quotation data
      items: [
        {
          remarks: "First item remarks",
          details1: "Detail 1 of item",
          details2: "Detail 2 of item",
          description: "Description of the product",
          price: 100, // Example price
        },
        {
          remarks: "Second item remarks",
          details1: "Detail 1 of second item",
          details2: "Detail 2 of second item",
          description: "Description of the second product",
          price: 200, // Example price
        },
      ],
    };

    console.log("Submitting request with data: ", quotationData);

    // Close the modal after submission
    setIsModalOpen(false);
    alert("Request submitted!");
  };

  // Show preloader while loading
  if (loading) {
    return <Preloader />;
  }

  if (!product) {
    return <div className='text-center'>Loading product details...</div>;
  }

  return (
    <>
      <Header />
      <div className='flex items-center justify-center min-h-screen'>
        <div className='max-w-screen-xl w-full p-6'>
          <div className='grid grid-cols-1 lg:grid-cols-5 gap-12'>
            {/* Left Section: Product Images */}
            <div className='col-span-3 flex'>
              <div className='flex flex-col space-y-4 mr-4'>
                {product.images &&
                  product.images.map((image, index) => (
                    <img
                      key={index}
                      src={image.thumbnail}
                      alt={product.productName}
                      className='w-20 h-20 object-cover cursor-pointer rounded border'
                    />
                  ))}
              </div>
              {/* Main Image */}
              <div className='mt-4'>
                <img
                  src={product.images && product.images[0].mainImage}
                  alt={product.productName}
                  className='w-full object-cover'
                  style={{ maxHeight: "500px" }}
                />
              </div>
            </div>

            {/* Right Section: Product Details */}
            <div className='col-span-2'>
              {/* Product Name */}
              <h1 className='text-3xl font-bold mb-4'>
                {product.productName || "N/A"}
              </h1>

              {/* Product Rating */}
              <div className='flex items-center mb-4'>
                <span className='text-yellow-500 text-lg'>★ ★ ★ ★ ☆</span>
                <span className='ml-2 text-gray-600'>(7 Reviews)</span>
              </div>

              {/* Category */}
              {product.category && (
                <p className='text-gray-600 mb-4'>
                  Category: {product.category}
                </p>
              )}

              {/* Price Ranges in 2 Columns */}
              {product.priceRanges && (
                <div className='grid grid-cols-2 gap-4 mb-6'>
                  {product.priceRanges.map((range, idx) => (
                    <div key={idx} className='text-sm font-semibold'>
                      {range.minQuantity} - {range.maxQuantity} Piece/s: SAR{" "}
                      {range.price}
                    </div>
                  ))}
                </div>
              )}

              {/* Stock Quantity */}
              {product.stockQuantity && (
                <p className='text-gray-600 mb-4'>
                  Stock: {product.stockQuantity}
                </p>
              )}

              {/* Contact Supplier and Start Order Request */}
              <div className='flex space-x-4'>
                <button
                  className='bg-[#2c6449] text-white py-2 px-6 rounded'
                  onClick={requestQuotation}
                >
                  Start order request
                </button>
                <a
                  href='/chat' // Link to the chat page
                  target='_blank' // Opens in a new tab
                  rel='noopener noreferrer' // Ensures safe external links
                  className='bg-transparent border border-gray-600 text-gray-600 py-2 px-6 rounded hover:border-[#2c6449] hover:text-[#2c6449]'
                >
                  Contact supplier
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <button
        onClick={toggleChatWindow}
        className='fixed bottom-5 right-5 bg-[#2c6449] text-white p-4 rounded-full shadow-lg hover:bg-green-600 z-50'
      >
        {isChatOpen ? <FaTimes /> : <FaComments />}
      </button>

      {/* Chat Window */}
      {isChatOpen && (
        <div className='fixed bottom-20 right-5 bg-white w-100 h-auto shadow-lg rounded-lg overflow-hidden z-50'>
          <div className='bg-[#2c6449] text-white flex items-center justify-between px-4 py-2'>
            <h2 className='text-lg font-semibold'>Chat</h2>
            <button onClick={toggleChatWindow}>
              <FaTimes />
            </button>
          </div>

          <div className='p-4 flex flex-col justify-between h-full'>
            {/* Display chat messages here */}
            <div className='flex flex-col w-full h-full'>
              <h2 className='text-xl font-semibold'>Chat with Supplier</h2>
              {/* Chat Messages */}
              <div className='overflow-y-auto h-48 mb-4'>
                {/* Chat messages would be displayed here */}
                <p className='text-gray-600'>This is a sample message.</p>
              </div>

              {/* Message input and send button */}
              <div className='flex items-center w-full mt-auto border-t border-gray-200 p-2'>
                <input
                  type='text'
                  placeholder='Type a message...'
                  className='flex-1 border p-2 rounded-lg'
                />
                <button className='ml-4 bg-[#2c6449] text-white p-2 rounded-lg'>
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className='border-t p-4'>
            {product && (
              <div className='flex flex-col items-start space-y-4'>
                <img
                  src={product.images && product.images[0].thumbnail}
                  alt={product.productName}
                  className='w-32 h-32 object-cover rounded-lg'
                />
                <h3 className='text-lg font-semibold'>{product.productName}</h3>
                <p className='text-gray-700'>SAR {product.price}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
