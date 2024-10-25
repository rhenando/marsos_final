"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db, storage } from "../../../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default function SupplierQuestionnaire() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
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
    try {
      const formattedPhoneNumber = formData.phoneNumber.startsWith("+966")
        ? formData.phoneNumber
        : `+966${formData.phoneNumber}`;

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
    try {
      const formattedPhoneNumber = formData.phoneNumber.startsWith("+966")
        ? formData.phoneNumber
        : `+966${formData.phoneNumber}`;

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

        // Normalize the phone number by removing +966 if present
        const normalizedPhoneNumber = formData.phoneNumber.startsWith("+966")
          ? formData.phoneNumber.slice(4) // Remove the first 4 characters (+966)
          : formData.phoneNumber;

        const supplierRef = collection(db, "suppliers");
        await addDoc(supplierRef, {
          ...formData,
          phoneNumber: normalizedPhoneNumber, // Save the normalized phone number
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

        <label className='block mb-2 text-[#2c6449] font-medium'>
          Company Name *
        </label>
        <input
          type='text'
          name='companyName'
          value={formData.companyName}
          onChange={handleChange}
          placeholder='Enter your company name'
          className='block w-full p-2 h-10 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-[#2c6449] focus:border-transparent'
          required
        />

        <label className='block mb-2 text-[#2c6449] font-medium'>
          CR Number *
        </label>
        <input
          type='text'
          name='crNumber'
          value={formData.crNumber}
          onChange={handleChange}
          placeholder='Enter your CR number'
          className='block w-full p-2 h-10 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-[#2c6449] focus:border-transparent'
          required
        />

        <label className='block mb-2 text-[#2c6449] font-medium'>
          CR License (optional)
        </label>
        <input
          type='file'
          name='crLicense'
          onChange={handleFileChange}
          className='block w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none'
        />

        <label className='block mb-2 text-[#2c6449] font-medium'>
          Location *
        </label>
        <input
          type='text'
          name='location'
          value={formData.location}
          onChange={handleChange}
          placeholder='Enter your location'
          className='block w-full p-2 h-10 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-[#2c6449] focus:border-transparent'
          required
        />

        <label className='block mb-2 text-[#2c6449] font-medium'>City *</label>
        <input
          type='text'
          name='city'
          value={formData.city}
          onChange={handleChange}
          placeholder='Enter your city'
          className='block w-full p-2 h-10 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-[#2c6449] focus:border-transparent'
          required
        />

        <label className='block mb-2 text-[#2c6449] font-medium'>
          Region *
        </label>
        <input
          type='text'
          name='region'
          value={formData.region}
          onChange={handleChange}
          placeholder='Enter your region'
          className='block w-full p-2 h-10 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-[#2c6449] focus:border-transparent'
          required
        />

        <label className='block mb-2 text-[#2c6449] font-medium'>
          Other Cities Served
        </label>
        <input
          type='text'
          name='otherCitiesServed'
          value={formData.otherCitiesServed}
          onChange={handleChange}
          placeholder='Enter other cities served'
          className='block w-full p-2 h-10 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-[#2c6449] focus:border-transparent'
        />

        <div className='mb-6'>
          <label className='block mb-2 text-[#2c6449] font-medium'>
            Delivery Option *
          </label>
          <div className='flex space-x-4'>
            <label className='flex items-center'>
              <input
                type='radio'
                name='deliveryOption'
                value='own'
                checked={formData.deliveryOption === "own"}
                onChange={handleChange}
                className='mr-2'
              />
              <span>Own Delivery</span>
            </label>
            <label className='flex items-center'>
              <input
                type='radio'
                name='deliveryOption'
                value='outside'
                checked={formData.deliveryOption === "outside"}
                onChange={handleChange}
                className='mr-2'
              />
              <span>Outside Delivery</span>
            </label>
          </div>
        </div>

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
