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

  // Send OTP by calling the server-side API route
  const handleSendOTP = async () => {
    // Ensure the phone number includes the "+" symbol and country code
    const formattedPhoneNumber = formData.phoneNumber.startsWith("+")
      ? formData.phoneNumber
      : `+966${formData.phoneNumber}`; // Prepend +966 if not already present

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
        setOtpSent(true); // OTP was successfully sent
        alert("OTP sent! Please enter the code to continue.");
      } else {
        alert("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please try again.");
    }
  };

  // Verify OTP by calling the server-side API route
  const handleVerifyOTP = async () => {
    const formattedPhoneNumber = formData.phoneNumber.startsWith("+")
      ? formData.phoneNumber
      : `+966${formData.phoneNumber}`; // Ensure consistency in format

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
        setOtpVerified(true); // OTP successfully verified
        alert("OTP verified! Proceeding with registration.");
      } else {
        alert("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Failed to verify OTP. Please try again.");
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    // If OTP hasn't been sent yet, send it and wait for user input
    if (!otpSent) {
      await handleSendOTP(); // Send OTP on the first "Continue" click
      return;
    }

    // If OTP is sent but not yet verified, ask for OTP input
    if (otpSent && !otpVerified) {
      await handleVerifyOTP(); // Verify OTP when user clicks continue after entering OTP
      return;
    }

    // Once OTP is verified, proceed with registration
    if (otpVerified) {
      setUploading(true);
      try {
        // Save form data to Firestore with the "buyer" role
        const buyerRef = collection(db, "buyers");
        await addDoc(buyerRef, {
          ...formData,
          otpVerified: true, // Mark phone as verified
          role: "buyer", // Assign the buyer role
        });

        setUploading(false);

        // Redirect to buyer dashboard after successful registration
        router.push("/dashboard/buyer");
      } catch (error) {
        console.error("Error registering buyer:", error);
        setUploading(false);
      }
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50'>
      <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-lg'>
        {/* Logo */}
        <div className='flex justify-center mb-8'>
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
