"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  doc,
  getDoc,
  query,
  where,
  collection,
  getDocs,
} from "firebase/firestore"; // Import Firestore functions
import { db } from "../../lib/firebase"; // Adjust based on your project structure

export default function Login() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const normalizePhoneNumber = (phone) => {
    return phone.startsWith("+") ? phone : `+966${phone}`;
  };

  const handleSendOtp = async () => {
    if (!phoneNumber) {
      alert("Please enter your phone number.");
      return;
    }

    const formattedPhoneNumber = normalizePhoneNumber(phoneNumber);

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

  const handleVerifyOtp = async () => {
    if (!otp) {
      alert("Please enter the OTP.");
      return;
    }

    const formattedPhoneNumber = normalizePhoneNumber(phoneNumber);

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
        setOtpVerified(true);
        alert("OTP verified! Logging you in...");

        // Fetch user from Firestore
        const userRole = await fetchUserRoleFromFirestore(formattedPhoneNumber);

        if (userRole) {
          // Save user info in localStorage, including the name and role
          const userInfo = {
            phoneNumber: formattedPhoneNumber,
            name: userRole.name, // Fetching name
            role: userRole.role, // Fetching role
          };
          localStorage.setItem("userInfo", JSON.stringify(userInfo));

          // Redirect to homepage
          router.push("/");
        } else {
          alert("User not found in the database.");
        }
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

  const fetchUserRoleFromFirestore = async (formattedPhoneNumber) => {
    try {
      const userCollection = collection(db, "suppliers"); // Adjust based on your database structure
      let q = query(
        userCollection,
        where("phoneNumber", "==", formattedPhoneNumber)
      );

      let querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Try querying again without the +966 prefix
        const plainPhoneNumber = formattedPhoneNumber.replace("+966", "");
        q = query(userCollection, where("phoneNumber", "==", plainPhoneNumber));
        querySnapshot = await getDocs(q);
      }

      if (!querySnapshot.empty) {
        // If user found, return their role and name
        const userData = querySnapshot.docs[0].data();
        return {
          role: userData.role,
          name: userData.name || "Anonymous", // Fallback to "Anonymous" if no name found
        };
      } else {
        return null; // User not found
      }
    } catch (error) {
      console.error("Error fetching user role from Firestore:", error);
      return null;
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
          <label className='block mb-2 text-[#2c6449] font-medium'>
            Phone Number *
          </label>
          <div className='flex items-center mb-4'>
            <div className='flex items-center bg-gray-100 border border-gray-300 rounded-l-md px-3 h-10'>
              <span className='text-gray-700'>🇸🇦 +966</span>
            </div>
            <input
              type='text'
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              placeholder='Enter your phone number'
              className='flex-grow p-2 h-10 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-[#2c6449] focus:border-transparent'
              required
            />
          </div>

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
