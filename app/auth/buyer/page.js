"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../../../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import Image from "next/image";
import authLogo from "../../../public/logo.svg"; // Ensure this logo path is correct

export default function BuyerQuestionnaire() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    countryCode: "+966", // Default country code
    phoneNumber: "",
    name: "",
    email: "", // Email is optional
  });
  const [otp, setOtp] = useState(""); // For OTP input
  const [otpSent, setOtpSent] = useState(false); // Track OTP sent status
  const [otpVerified, setOtpVerified] = useState(false); // Track if OTP is verified
  const [uploading, setUploading] = useState(false); // For showing submission progress

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOTP = async () => {
    const formattedPhoneNumber = `${formData.countryCode}${formData.phoneNumber}`;

    try {
      const response = await fetch("/api/sendOtp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber: formattedPhoneNumber }),
      });

      const result = await response.json();
      if (result.success) {
        setOtpSent(true);
        alert("OTP sent! Please enter the code to continue.");
      } else {
        alert("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOTP = async () => {
    const formattedPhoneNumber = `${formData.countryCode}${formData.phoneNumber}`;

    try {
      const response = await fetch("/api/verifyOtp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: formattedPhoneNumber,
          otpCode: otp,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setOtpVerified(true);
        alert("OTP verified! Proceeding with registration.");
      } else {
        alert("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Failed to verify OTP. Please try again.");
    }
  };

  const handleSubmit = async () => {
    if (!otpSent) {
      await handleSendOTP();
      return;
    }

    if (otpSent && !otpVerified) {
      await handleVerifyOTP();
      return;
    }

    if (otpVerified) {
      setUploading(true);
      try {
        const formattedPhoneNumber = `${formData.countryCode}${formData.phoneNumber}`;

        const buyerRef = collection(db, "buyers");
        await addDoc(buyerRef, {
          ...formData,
          phoneNumber: formattedPhoneNumber,
          otpVerified: true,
          role: "buyer",
        });

        setUploading(false);
        router.push("/login");
      } catch (error) {
        console.error("Error registering buyer:", error);
        setUploading(false);
      }
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50'>
      <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-lg'>
        <div className='flex justify-center mb-8'>
          <Image src={authLogo} alt='Logo' className='w-28 h-28' />
        </div>

        <h1 className='text-2xl text-center text-[#2c6449] font-semibold mb-4'>
          Buyer Registration
        </h1>
        <p className='text-center text-gray-500 mb-6'>
          Please enter your phone number
        </p>

        {/* Country Code and Phone Number Input */}
        <label className='block mb-2 text-[#2c6449] font-medium'>
          Phone Number *
        </label>
        <div className='flex items-center mb-4'>
          {/* Country Code Selector */}
          <select
            name='countryCode'
            value={formData.countryCode}
            onChange={handleChange}
            className='p-2 border border-gray-300 rounded-l-md bg-gray-100 focus:outline-none'
          >
            {/* Add other country codes as options */}
            <option value='+966'>+966</option>
            <option value='+1'>+1</option>
            <option value='+44'>+44</option>
            <option value='+63'>+63</option>
            {/* Add more options as needed */}
          </select>

          {/* Phone Number Input */}
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

        {/* OTP input shown after OTP is sent */}
        {otpSent && !otpVerified && (
          <div className='mb-4'>
            <label className='block mb-2 text-[#2c6449] font-medium'>
              Enter OTP
            </label>
            <input
              type='text'
              name='otp'
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder='Enter the OTP sent to your phone'
              className='block w-full p-2 border border-gray-300 rounded-md'
              required
            />
          </div>
        )}

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          className='w-full py-3 bg-[#2c6449] text-white rounded-md hover:bg-[#1d4d36] transition-all ease-in-out duration-200 disabled:opacity-50'
          disabled={uploading}
        >
          {uploading
            ? "Registering..."
            : otpSent && !otpVerified
            ? "Verify OTP"
            : "Continue"}
        </button>

        <p className='text-center mt-6 text-[#2c6449] font-semibold'>
          <a href='#' className='underline'>
            Login as a guest
          </a>
        </p>
      </div>
    </div>
  );
}
