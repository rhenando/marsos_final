"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // To handle redirection after form submission
import { Button } from "@/components/ui/button"; // Adjust the path if needed
import { Input } from "@/components/ui/input"; // Adjust the path if needed
import Image from "next/image";
import logo from "../../../public/logo.svg"; // Path to your logo

export default function VendorForm() {
  const [formData, setFormData] = useState({
    mobileNumber: "",
    companyName: "",
    crNumber: "",
    crLicensePath: "",
    location: "",
    region: "",
    city: "",
    otherCitiesCovered: "",
    deliveryOption: "",
  });

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Vendor added successfully!");
        router.push("/thank-you"); // Redirect after success
      } else {
        const errorData = await response.json();
        console.error("Error adding vendor:", errorData.error);
        alert("Error adding vendor: " + errorData.error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50'>
      {/* Outer container */}
      <div className='bg-white p-8 rounded-2xl shadow-lg max-w-md w-full relative'>
        {/* Language Switch Button */}
        <div className='absolute top-4 right-4'>
          <Button className='bg-gray-200 hover:bg-gray-300 text-black py-1 px-3 rounded-md'>
            EN
          </Button>
        </div>

        {/* Logo at the top */}
        <div className='flex justify-center mb-6'>
          <Image src={logo} alt='Logo' width={80} height={80} />
        </div>

        {/* Heading */}
        <h1 className='text-center text-2xl font-semibold mb-4'>
          Vendor Registration
        </h1>

        {/* Form starts here */}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-4'>
            <Input
              type='tel'
              name='mobileNumber'
              placeholder='Mobile Number'
              value={formData.mobileNumber}
              onChange={handleChange}
              required
              className='w-full border border-gray-300 rounded-lg py-2'
            />

            <Input
              type='text'
              name='companyName'
              placeholder='Company Name'
              value={formData.companyName}
              onChange={handleChange}
              required
              className='w-full border border-gray-300 rounded-lg py-2'
            />

            <Input
              type='text'
              name='crNumber'
              placeholder='CR Number'
              value={formData.crNumber}
              onChange={handleChange}
              required
              className='w-full border border-gray-300 rounded-lg py-2'
            />

            {/* File Upload for CR License */}
            <div className='flex flex-col'>
              <label className='mb-1'>Upload CR License (Optional)</label>
              <input
                type='file'
                name='crLicensePath'
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    crLicensePath: e.target.files[0].name,
                  })
                }
                className='border border-gray-300 rounded-lg py-2'
              />
            </div>

            <Input
              type='text'
              name='location'
              placeholder='Location'
              value={formData.location}
              onChange={handleChange}
              className='w-full border border-gray-300 rounded-lg py-2'
            />

            <Input
              type='text'
              name='region'
              placeholder='Region'
              value={formData.region}
              onChange={handleChange}
              className='w-full border border-gray-300 rounded-lg py-2'
            />

            <Input
              type='text'
              name='city'
              placeholder='City'
              value={formData.city}
              onChange={handleChange}
              className='w-full border border-gray-300 rounded-lg py-2'
            />

            <Input
              type='text'
              name='otherCitiesCovered'
              placeholder='Other Cities Covered'
              value={formData.otherCitiesCovered}
              onChange={handleChange}
              className='w-full border border-gray-300 rounded-lg py-2'
            />

            {/* Delivery Options */}
            <select
              name='deliveryOption'
              value={formData.deliveryOption}
              onChange={handleChange}
              className='w-full border border-gray-300 rounded-lg py-2'
            >
              <option value=''>Select Delivery Option</option>
              <option value='own'>I have my own delivery</option>
              <option value='outside'>I need outside delivery</option>
            </select>

            {/* Submit Button */}
            <Button
              type='submit'
              className='w-full bg-[#2c6449] hover:bg-[#204b36] text-white py-2 rounded-lg'
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
