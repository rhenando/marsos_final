"use client";
import { useState, useEffect } from "react";
import { db } from "../../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import { FaComments } from "react-icons/fa";

export default function ProductDetailsPage({ params }) {
  const { id } = params;
  const [product, setProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the product details from Firestore
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
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  const handleContactClick = () => {
    const url = `/contact-supplier?id=${id}&productName=${encodeURIComponent(
      product?.productName || ""
    )}`;
    window.open(url, "_blank");
  };

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
              <div className='mt-4'>
                <img
                  src={product.images && product.images[0].mainImage}
                  alt={product.productName}
                  className='w-full object-cover'
                  style={{ maxHeight: "500px" }}
                />
              </div>
            </div>

            <div className='col-span-2'>
              <h1 className='text-3xl font-bold mb-4'>
                {product.productName || "N/A"}
              </h1>
              <div className='flex items-center mb-4'>
                <span className='text-yellow-500 text-lg'>★ ★ ★ ★ ☆</span>
                <span className='ml-2 text-gray-600'>(7 Reviews)</span>
              </div>
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
              {product.stockQuantity && (
                <p className='text-gray-600 mb-4'>
                  Stock: {product.stockQuantity}
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
                  onClick={() => window.open(`/chat?productId=${id}`, "_blank")}
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
          onClick={() => window.open(`/chat?productId=${id}`, "_blank")}
          className='bg-transparent border border-gray-600 text-gray-600 py-2 px-6 rounded'
        >
          Messenger
        </button>
      </div>

      <Footer />
    </>
  );
}
