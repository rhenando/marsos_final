"use client";

import { useState, useEffect } from "react";
import { db } from "../../../lib/firebase"; // Adjust path as needed
import { doc, getDoc } from "firebase/firestore";
import jsPDF from "jspdf"; // Import jsPDF for PDF generation
import autoTable from "jspdf-autotable"; // Import autoTable for tables
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ProductDetailsPage({ params }) {
  const { id } = params; // Get the product ID from the dynamic route
  const [product, setProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // For controlling the modal
  const [quantity, setQuantity] = useState(""); // Example input in modal
  const [additionalNotes, setAdditionalNotes] = useState(""); // Another example input

  // Shipping cost is hardcoded for now
  const shippingCost = 0.0;

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
      }
    }
    fetchProduct();
  }, [id]);

  // Function to calculate the subtotal based on quantity and price ranges
  function calculateSubtotal(quantity, priceRanges) {
    if (!quantity || !priceRanges || priceRanges.length === 0) {
      return 0;
    }

    let applicablePrice = 0;

    // Loop through the price ranges to find the matching price for the entered quantity
    for (const range of priceRanges) {
      if (quantity >= range.minQuantity && quantity <= range.maxQuantity) {
        applicablePrice = parseFloat(range.price);
        break;
      }
    }

    // If no specific range is found, apply the highest price
    if (applicablePrice === 0) {
      applicablePrice = parseFloat(priceRanges[priceRanges.length - 1].price);
    }

    return applicablePrice * quantity;
  }

  // Function to convert an image to Base64 format
  const convertImageToBase64 = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result); // Convert blob to Base64
      reader.readAsDataURL(blob);
    });
  };

  // Function to generate a PDF with the order details
  const generatePDF = async (quotationData, subtotal, total) => {
    const doc = new jsPDF();

    // Load the logo image (adjust path to your logo)
    const logoUrl = "/logo.png"; // Update with the correct logo path
    const logoImg = await convertImageToBase64(logoUrl);

    // Add the logo to the PDF
    doc.addImage(logoImg, "PNG", 10, 10, 50, 20); // Adjust position and size

    // Title of the PDF
    doc.setFontSize(20);
    doc.text("Quotation", 105, 40, null, null, "center"); // Title centered

    // Company Info (can be updated as needed)
    doc.setFontSize(12);
    doc.text("Marsos Platform", 105, 50, null, null, "center"); // English company name

    // Product Information
    doc.setFontSize(10);
    doc.text(`Product Name: ${quotationData.productName}`, 10, 70);
    doc.text(`Quantity: ${quotationData.quantity} Piece/s`, 10, 80);

    // Example table for price ranges (using autoTable for better formatting)
    autoTable(doc, {
      startY: 90,
      head: [["Min Quantity", "Max Quantity", "Price (SAR)"]],
      body: quotationData.priceRanges.map((range) => [
        range.minQuantity,
        range.maxQuantity,
        range.price,
      ]),
    });

    // Add Subtotal, Shipping, and Total in the summary section
    const finalY = doc.lastAutoTable.finalY + 10; // Get where the table ends

    doc.setFontSize(10);
    doc.text(`Subtotal: SAR ${subtotal}`, 10, finalY);
    doc.text(`Shipping: SAR ${shippingCost.toFixed(2)}`, 10, finalY + 10);
    doc.text(`Total: SAR ${total}`, 10, finalY + 20);

    // Additional notes if any
    if (quotationData.additionalNotes) {
      doc.text(
        `Additional Notes: ${quotationData.additionalNotes}`,
        10,
        finalY + 30
      );
    }

    // Save the PDF
    doc.save(`${quotationData.productName}_quotation.pdf`);
  };

  // Handle the modal submission logic here
  const handleSubmitRequest = () => {
    const quotationData = {
      productName: product.productName,
      productId: id,
      vendorId: product.vendorId,
      quantity: quantity,
      additionalNotes: additionalNotes,
      priceRanges: product.priceRanges, // Include price ranges in the quotation data
    };

    console.log("Submitting request with data: ", quotationData);

    // Calculate subtotal and total
    const subtotal = calculateSubtotal(quantity, product.priceRanges).toFixed(
      2
    );
    const total = (parseFloat(subtotal) + shippingCost).toFixed(2);

    // Generate the PDF
    generatePDF(quotationData, subtotal, total);

    // Close the modal after submission
    setIsModalOpen(false);
    alert("Request submitted and PDF generated!");
  };

  // This is the function that opens the modal (previous error was here)
  const requestQuotation = () => {
    setIsModalOpen(true); // This opens the modal
  };

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
                  onClick={requestQuotation} // Ensure this function is available
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

          {/* Modal for requesting quotation */}
          {isModalOpen && (
            <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
              <div className='bg-white p-6 rounded-lg shadow-lg w-full max-w-lg'>
                <div className='flex justify-between items-center mb-4'>
                  <h2 className='text-xl font-semibold'>Select Quantity</h2>
                  <button
                    className='text-gray-500 hover:text-gray-700'
                    onClick={() => setIsModalOpen(false)}
                  >
                    X {/* Close button */}
                  </button>
                </div>

                {/* Price Ranges Section */}
                <div className='mb-4'>
                  <h3 className='font-semibold mb-2'>Price before shipping</h3>
                  <div className='grid grid-cols-2 gap-4'>
                    {product.priceRanges &&
                      product.priceRanges.map((range, idx) => (
                        <div key={idx} className='text-sm font-semibold'>
                          {range.minQuantity} - {range.maxQuantity} Piece/s: SAR{" "}
                          {range.price}
                        </div>
                      ))}
                  </div>
                </div>

                {/* Quantity Section */}
                <div className='mb-4'>
                  <h3 className='font-semibold mb-2'>Enter Quantity</h3>
                  <div className='flex items-center justify-between space-x-2'>
                    <input
                      type='number'
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder='Enter quantity'
                      className='w-full border rounded p-2'
                    />
                  </div>
                </div>

                {/* Shipping Section */}
                <div className='mb-4'>
                  <h3 className='font-semibold mb-2'>Shipping</h3>
                  <p className='text-sm text-gray-500'>
                    Shipping solutions for the selected quantity are currently
                    unavailable
                  </p>
                </div>

                {/* Summary Section */}
                <div className='mb-4 border-t pt-4'>
                  {/* Subtotal Calculation */}
                  <div className='flex justify-between text-sm mb-2'>
                    <span>Item subtotal ({quantity || 0} Piece/s):</span>
                    <span>
                      SAR{" "}
                      {calculateSubtotal(quantity, product.priceRanges).toFixed(
                        2
                      )}
                    </span>
                  </div>

                  {/* Shipping Total */}
                  <div className='flex justify-between text-sm mb-2'>
                    <span>Shipping total:</span>
                    <span>SAR {shippingCost.toFixed(2)}</span>
                  </div>

                  {/* Total Calculation */}
                  <div className='flex justify-between text-sm font-semibold'>
                    <span>Total:</span>
                    <span>
                      SAR{" "}
                      {(
                        calculateSubtotal(quantity, product.priceRanges) +
                        shippingCost
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Complete Order Button */}
                <button
                  className='bg-[#2c6449] text-white py-2 px-6 rounded w-full'
                  onClick={handleSubmitRequest} // Generates PDF
                >
                  Complete order request
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
