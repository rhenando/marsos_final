"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function Login() {
  const router = useRouter();
  const [countryCode, setCountryCode] = useState("+966"); // Default country code for Saudi Arabia
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle phone number input change
  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  // Handle country code change
  const handleCountryCodeChange = (e) => {
    setCountryCode(e.target.value);
  };

  // Handle OTP input change
  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  // Helper function to normalize phone number format for OTP
  const normalizePhoneNumberForOtp = () => {
    return `${countryCode}${phoneNumber}`;
  };

  // Helper function to remove country code for saving
  const removeCountryCode = (phone) => {
    return phone.startsWith(countryCode)
      ? phone.slice(countryCode.length)
      : phone;
  };

  // Send OTP for login
  const handleSendOtp = async () => {
    if (!phoneNumber) {
      alert("Please enter your phone number.");
      return;
    }

    const formattedPhoneNumber = normalizePhoneNumberForOtp();

    setLoading(true);
    try {
      const response = await fetch("/api/sendOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and store JWT in localStorage
  const handleVerifyOtp = async () => {
    if (!otp) {
      alert("Please enter the OTP.");
      return;
    }

    const formattedPhoneNumber = normalizePhoneNumberForOtp();

    setLoading(true);
    try {
      const response = await fetch("/api/verifyOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: formattedPhoneNumber,
          otpCode: otp,
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert("OTP verified! Logging you in...");

        // Remove country code from the phone number before saving
        const sanitizedPhoneNumber = removeCountryCode(phoneNumber);
        localStorage.setItem("phoneNumber", sanitizedPhoneNumber);
        localStorage.setItem("token", result.token);

        // Redirect to the homepage after login
        router.push("/");
      } else {
        alert("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50'>
      <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-lg'>
        <h1 className='text-2xl text-center text-[#2c6449] font-semibold mb-4'>
          Login
        </h1>
        <p className='text-center text-gray-500 mb-6'>
          Please enter your phone number to log in.
        </p>

        <div>
          {/* Country Code and Phone Number Input */}
          <label className='block mb-2 text-[#2c6449] font-medium'>
            Phone Number *
          </label>
          <div className='flex items-center mb-4'>
            {/* Country Code Selector */}
            <select
              value={countryCode}
              onChange={handleCountryCodeChange}
              className='p-2 border border-gray-300 rounded-l-md bg-gray-100 focus:outline-none'
            >
              <option value='+966'>+966</option>
              <option value='+1'>+1</option>
              <option value='+44'>+44</option>
              <option value='+63'>+63</option>
              {/* Add more country codes as needed */}
            </select>

            {/* Phone Number Input */}
            <input
              type='text'
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              placeholder='Enter your phone number'
              className='flex-grow p-2 h-10 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-[#2c6449] focus:border-transparent'
              required
            />
          </div>

          {/* OTP Input (if OTP has been sent) */}
          {otpSent && (
            <>
              <label className='block mb-2 text-[#2c6449] font-medium'>
                Enter OTP
              </label>
              <input
                type='text'
                value={otp}
                onChange={handleOtpChange}
                placeholder='Enter the OTP sent to your phone'
                className='block w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none'
                required
              />
            </>
          )}

          {/* Button to Send OTP or Verify OTP */}
          <button
            type='button'
            onClick={otpSent ? handleVerifyOtp : handleSendOtp}
            className='w-full py-3 bg-[#2c6449] text-white rounded-md hover:bg-[#1d4d36] transition-all ease-in-out duration-200 disabled:opacity-50'
            disabled={loading}
          >
            {loading ? "Processing..." : otpSent ? "Verify OTP" : "Send OTP"}
          </button>
        </div>
      </div>
    </div>
  );
}
