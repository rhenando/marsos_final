"use client";
import { useState, useEffect } from "react";
import { db } from "../../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";

export default function ProductDetailsPage({ params }) {
  console.log("Route parameters:", params);

  const { id } = params; // Use id from route parameters
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true); // Page loading state

  useEffect(() => {
    async function fetchProduct() {
      console.log("Starting to fetch product details...");

      if (!id) {
        console.error("Product ID (id) is missing from the route parameters.");
        setLoading(false);
        return;
      }

      try {
        const productDoc = await getDoc(doc(db, "products", id));
        if (productDoc.exists()) {
          const product = productDoc.data();
          setProductData(product);
          console.log("Fetched product data:", product);
        } else {
          console.error("Product document not found in Firestore.");
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
        console.log("Finished fetching product details.");
      }
    }

    fetchProduct();
  }, [id]);

  const handleOpenChat = () => {
    if (!productData) {
      console.error("Product data is not available to open chat.");
      return;
    }

    const chatUrl = `/chat/${id}?productName=${encodeURIComponent(
      productData.productName || ""
    )}&buyerName=${encodeURIComponent(productData.name || "")}`;
    window.open(chatUrl, "_blank");
  };

  if (loading) {
    return <Preloader />;
  }

  if (!productData) {
    return <div className='text-center'>Product not found.</div>;
  }

  return (
    <>
      <Header />
      <div className='flex items-center justify-center min-h-screen'>
        <div className='max-w-screen-xl w-full p-6'>
          <div className='grid grid-cols-1 lg:grid-cols-5 gap-12'>
            <div className='col-span-3 flex'>
              <div className='flex flex-col space-y-4 mr-4'>
                {productData.images &&
                  productData.images.map((image, index) => (
                    <img
                      key={index}
                      src={image.thumbnail}
                      alt={productData.productName}
                      className='w-20 h-20 object-cover cursor-pointer rounded border'
                    />
                  ))}
              </div>
              <div className='mt-4'>
                <img
                  src={productData.images && productData.images[0].mainImage}
                  alt={productData.productName}
                  className='w-full object-cover'
                  style={{ maxHeight: "500px" }}
                />
              </div>
            </div>

            <div className='col-span-2'>
              <h1 className='text-3xl font-bold mb-4'>
                {productData.productName || "N/A"}
              </h1>
              <p className='text-gray-600 mb-4'>
                Seller: {productData.name || "Unknown"}
              </p>
              <div className='flex items-center mb-4'>
                <span className='text-yellow-500 text-lg'>★ ★ ★ ★ ☆</span>
                <span className='ml-2 text-gray-600'>(7 Reviews)</span>
              </div>
              {productData.priceRanges && (
                <div className='grid grid-cols-2 gap-4 mb-6'>
                  {productData.priceRanges.map((range, idx) => (
                    <div key={idx} className='text-sm font-semibold'>
                      {range.minQuantity} - {range.maxQuantity} Piece/s: SAR{" "}
                      {range.price}
                    </div>
                  ))}
                </div>
              )}
              {productData.stockQuantity && (
                <p className='text-gray-600 mb-4'>
                  Stock: {productData.stockQuantity}
                </p>
              )}
              <div className='flex space-x-4'>
                <button
                  className='bg-[#2c6449] text-white py-2 px-6 rounded'
                  onClick={() => setIsModalOpen(true)}
                >
                  Start order request
                </button>
                <button
                  onClick={handleOpenChat} // Handle open chat
                  className='bg-transparent border border-gray-600 text-gray-600 py-2 px-6 rounded'
                >
                  Contact supplier
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='fixed bottom-4 right-4'>
        <button
          onClick={handleOpenChat} // Handle open chat
          className='bg-transparent border border-gray-600 text-gray-600 py-2 px-6 rounded'
        >
          Messenger
        </button>
      </div>

      <Footer />
    </>
  );
}
