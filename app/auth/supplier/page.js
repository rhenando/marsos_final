"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { db, storage } from "../../../lib/firebase"; // Import Firestore and Storage from firebase.js
import { collection, addDoc } from "firebase/firestore"; // For Firestore database
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // For Firebase storage
import Image from "next/image";
import authLogo from "../../../public/logo.svg";

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
  const [crLicenseFile, setCrLicenseFile] = useState(null); // For handling CR license file
  const [uploading, setUploading] = useState(false); // For showing upload progress

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle CR license file change
  const handleFileChange = (e) => {
    setCrLicenseFile(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async () => {
    setUploading(true);

    try {
      let crLicenseURL = null;

      // Upload CR license file to Firebase Storage if a file is selected
      if (crLicenseFile) {
        const storageRef = ref(storage, `cr-licenses/${crLicenseFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, crLicenseFile);

        // Wait for file upload to complete
        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              // Progress logic here if needed
            },
            (error) => {
              console.error("File upload error:", error);
              reject(error);
            },
            async () => {
              crLicenseURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      }

      // Save form data to Firestore
      const supplierRef = collection(db, "suppliers"); // 'suppliers' collection in Firestore
      await addDoc(supplierRef, {
        ...formData,
        crLicenseURL, // Add the CR license file URL if it exists
      });

      setUploading(false);

      // Redirect to supplier dashboard after successful registration
      router.push("/dashboard/supplier");
    } catch (error) {
      console.error("Error registering supplier:", error);
      setUploading(false);
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
          Supplier Registration
        </h1>

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

        {/* Company Name (required) */}
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

        {/* CR Number (required) */}
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

        {/* File upload for CR license */}
        <label className='block mb-2 text-[#2c6449] font-medium'>
          CR License (optional)
        </label>
        <input
          type='file'
          name='crLicense'
          onChange={handleFileChange}
          className='block w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none'
        />

        {/* Location, City, Region */}
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

        {/* Other Cities Served */}
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

        {/* Delivery Option */}
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

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          className='w-full py-3 bg-[#2c6449] text-white rounded-md hover:bg-[#1d4d36] transition-all ease-in-out duration-200 disabled:opacity-50'
          disabled={uploading}
        >
          {uploading ? "Registering..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
