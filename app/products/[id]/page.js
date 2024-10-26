"use client";

import { useState, useEffect } from "react";
import { db } from "../../../lib/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import jwt from "jsonwebtoken";

export default function ProductDetailsPage({ params }) {
  const { id } = params; // Product ID from route parameters
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true); // Page loading state
  const [name, setName] = useState("Buyer"); // Default to 'Buyer' if no name is set
  const [role, setRole] = useState("buyer"); // Default role as 'buyer'

  useEffect(() => {
    const fetchUserNameAndRole = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwt.decode(token);
          let phoneNumber = decodedToken?.phoneNumber;

          // Normalize phone number by removing country code if it exists
          if (phoneNumber && phoneNumber.startsWith("+966")) {
            phoneNumber = phoneNumber.slice(4);
          }

          if (phoneNumber) {
            const userDoc = await fetchUserFromFirestore(phoneNumber);
            if (userDoc) {
              setName(userDoc.name || "User"); // Use "name" from Firestore
              setRole(userDoc.role); // Set role from fetched user data
            }
          }
        } catch (error) {
          console.error("Error decoding token or fetching user data:", error);
          setName("Buyer");
          setRole("buyer");
        }
      } else {
        console.warn("No token found in localStorage.");
      }
    };

    const fetchProduct = async () => {
      if (!id) {
        console.error("Product ID (id) is missing from the route parameters.");
        setLoading(false);
        return;
      }

      try {
        const productDoc = await getDoc(doc(db, "products", id));
        if (productDoc.exists()) {
          setProductData(productDoc.data());
        } else {
          console.error("Product document not found in Firestore.");
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserNameAndRole();
    fetchProduct();
  }, [id]);

  const fetchUserFromFirestore = async (phoneNumber) => {
    try {
      // Check buyers collection first
      const buyersCollection = collection(db, "buyers");
      const buyerQuery = query(
        buyersCollection,
        where("phoneNumber", "==", phoneNumber)
      );
      const buyerSnapshot = await getDocs(buyerQuery);

      if (!buyerSnapshot.empty) {
        return { ...buyerSnapshot.docs[0].data(), role: "buyer" };
      }

      // Check suppliers collection if not found in buyers
      const suppliersCollection = collection(db, "suppliers");
      const supplierQuery = query(
        suppliersCollection,
        where("phoneNumber", "==", phoneNumber)
      );
      const supplierSnapshot = await getDocs(supplierQuery);

      if (!supplierSnapshot.empty) {
        return { ...supplierSnapshot.docs[0].data(), role: "supplier" };
      }

      console.warn("No user found for this phone number in Firestore.");
      return null;
    } catch (error) {
      console.error("Error fetching user data from Firestore:", error);
      return null;
    }
  };

  const handleOpenChat = () => {
    if (!productData) {
      console.error("Product data is not available to open chat.");
      return;
    }

    const chatUrl = `/chat/${id}?userName=${encodeURIComponent(
      name
    )}&role=${encodeURIComponent(role)}`;
    console.log("Opening chat URL:", chatUrl); // Debugging log
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
                Supplier: {productData.name || "Unknown"}
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
                  onClick={handleOpenChat} // Open chat in a new tab
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
          onClick={handleOpenChat} // Open chat in a new tab
          className='bg-transparent border border-gray-600 text-gray-600 py-2 px-6 rounded'
        >
          Messenger
        </button>
      </div>

      <Footer />
    </>
  );
}
