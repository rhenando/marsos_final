"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../../../lib/firebase"; // Import Firestore from firebase.js
import { collection, addDoc } from "firebase/firestore"; // For Firestore database
import authLogo from "../../../public/logo.svg";
import Image from "next/image";

export default function BuyerQuestionnaire() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    phoneNumber: "",
    name: "",
    email: "", // Email is optional
  });
  const [uploading, setUploading] = useState(false); // For showing submission progress

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async () => {
    setUploading(true);

    try {
      // Save form data to Firestore
      const buyerRef = collection(db, "buyers"); // 'buyers' collection in Firestore
      await addDoc(buyerRef, formData);

      setUploading(false);

      // Redirect to buyer dashboard after successful registration
      router.push("/dashboard/buyer");
    } catch (error) {
      console.error("Error registering buyer:", error);
      setUploading(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50'>
      <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-lg'>
        {/* Logo */}
        <div className='flex justify-center mb-8'>
          {/* Replace this with the logo image */}
          <Image src={authLogo} alt='Logo' className='w-28 h-28' />
        </div>

        {/* Form Title */}
        <h1 className='text-2xl text-center text-[#2c6449] font-semibold mb-4'>
          Buyer Registration
        </h1>
        <p className='text-center text-gray-500 mb-6'>
          Please enter your phone number
        </p>

        {/* Phone Number (required) */}
        <label className='block mb-2 text-[#2c6449] font-medium'>
          Phone Number *
        </label>
        <div className='flex items-center mb-4'>
          <div className='flex items-center bg-gray-100 border border-gray-300 rounded-l-md px-3 h-10'>
            <span className='text-gray-700'>🇸🇦 +966</span>
          </div>
          <input
            type='text'
            name='phoneNumber'
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder='Enter your phone number'
            className='flex-grow p-2 h-10 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-[#2c6449] focus:border-transparent'
            required
          />
        </div>

        {/* Name (required) */}
        <label className='block mb-2 text-[#2c6449] font-medium'>Name *</label>
        <input
          type='text'
          name='name'
          value={formData.name}
          onChange={handleChange}
          placeholder='Enter your name'
          className='block w-full p-2 h-10 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-[#2c6449] focus:border-transparent'
          required
        />

        {/* Email (optional) */}
        <label className='block mb-2 text-[#2c6449] font-medium'>
          Email (optional)
        </label>
        <input
          type='email'
          name='email'
          value={formData.email}
          onChange={handleChange}
          placeholder='Enter your email (optional)'
          className='block w-full p-2 h-10 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-[#2c6449] focus:border-transparent'
        />

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          className='w-full py-3 bg-[#2c6449] text-white rounded-md hover:bg-[#1d4d36] transition-all ease-in-out duration-200 disabled:opacity-50'
          disabled={uploading}
        >
          {uploading ? "Registering..." : "Continue"}
        </button>

        {/* Optional footer link for existing users */}
        <p className='text-center mt-6 text-[#2c6449] font-semibold'>
          <a href='#' className='underline'>
            Login as a guest
          </a>
        </p>
      </div>
    </div>
  );
}
