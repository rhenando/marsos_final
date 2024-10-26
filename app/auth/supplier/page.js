"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db, storage } from "../../../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default function SupplierQuestionnaire() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    countryCode: "+966", // Default country code
    phoneNumber: "",
    name: "",
    email: "",
    companyName: "",
    crNumber: "",
    location: "",
    city: "",
    region: "",
    otherCitiesServed: "",
    deliveryOption: "own",
  });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [crLicenseFile, setCrLicenseFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setCrLicenseFile(e.target.files[0]);
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
        let crLicenseURL = null;
        if (crLicenseFile) {
          const storageRef = ref(storage, `cr-licenses/${crLicenseFile.name}`);
          const uploadTask = uploadBytesResumable(storageRef, crLicenseFile);

          await new Promise((resolve, reject) => {
            uploadTask.on("state_changed", null, reject, async () => {
              crLicenseURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            });
          });
        }

        const formattedPhoneNumber = `${formData.countryCode}${formData.phoneNumber}`;
        const supplierRef = collection(db, "suppliers");
        await addDoc(supplierRef, {
          ...formData,
          phoneNumber: formattedPhoneNumber,
          crLicenseURL,
          otpVerified: true,
          role: "supplier",
        });

        setUploading(false);
        router.push("/login");
      } catch (error) {
        console.error("Error registering supplier:", error);
        setUploading(false);
      }
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50'>
      <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-lg'>
        <h1 className='text-2xl text-center text-[#2c6449] font-semibold mb-4'>
          Supplier Registration
        </h1>

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
            <option value='+966'>+966</option>
            <option value='+1'>+1</option>
            <option value='+44'>+44</option>
            <option value='+63'>+63</option>
            {/* Add more country codes as needed */}
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

        {/* Other input fields remain unchanged */}

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
      </div>
    </div>
  );
}
