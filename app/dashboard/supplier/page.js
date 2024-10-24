"use client";

import { useState } from "react";
import Link from "next/link"; // Import Link for navigation

export default function SupplierDashboard() {
  // Initial form data state
  const [formData, setFormData] = useState({
    companyName: "Company XYZ",
    phoneNumber: "+966123456789",
    crLicense: null, // For file upload
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file change for CR License
  const handleFileChange = (e) => {
    setFormData({ ...formData, crLicense: e.target.files[0] });
  };

  // Handle form submission (this is just a placeholder for now)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted", formData);
    // Add form submission logic here (e.g., API calls)
  };

  return (
    <div className='p-8'>
      <h1 className='text-2xl font-bold mb-4'>Welcome to Supplier Dashboard</h1>

      {/* Overview Section */}
      <div className='grid grid-cols-2 gap-6'>
        <div className='bg-white shadow-md rounded-lg p-6'>
          <h2 className='text-lg font-semibold'>Total Orders</h2>
          <p className='text-3xl font-bold'>120</p>
        </div>
        <div className='bg-white shadow-md rounded-lg p-6'>
          <h2 className='text-lg font-semibold'>Revenue</h2>
          <p className='text-3xl font-bold'>$50,000</p>
        </div>
      </div>

      {/* Profile Management */}
      <div className='mt-8'>
        <h2 className='text-lg font-semibold mb-4'>Profile Information</h2>
        <form onSubmit={handleSubmit}>
          {/* Company Name */}
          <label className='block mb-2'>Company Name</label>
          <input
            className='w-full p-2 border rounded mb-4'
            type='text'
            name='companyName'
            value={formData.companyName}
            onChange={handleChange} // Handle change event
          />

          {/* Phone Number */}
          <label className='block mb-2'>Phone Number</label>
          <input
            className='w-full p-2 border rounded mb-4'
            type='text'
            name='phoneNumber'
            value={formData.phoneNumber}
            onChange={handleChange} // Handle change event
          />

          {/* CR License File Upload */}
          <label className='block mb-2'>CR License</label>
          <input
            className='w-full p-2 border rounded mb-4'
            type='file'
            name='crLicense'
            onChange={handleFileChange} // Handle file change
          />

          {/* Submit Button */}
          <button
            type='submit'
            className='bg-blue-500 text-white px-4 py-2 rounded'
          >
            Save Changes
          </button>
        </form>
      </div>

      {/* Add Products Button */}
      <div className='mt-8'>
        <Link href='/vendor/dashboard/add-product'>
          <button className='bg-green-500 text-white px-4 py-2 rounded'>
            Add Products
          </button>
        </Link>
      </div>

      {/* Logout Button */}
      <div className='mt-8'>
        <button className='bg-red-500 text-white px-4 py-2 rounded'>
          Logout
        </button>
      </div>
    </div>
  );
}
