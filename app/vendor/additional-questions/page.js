"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db, storage } from "../../../lib/firebase"; // Assuming Firestore and Storage are set up
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // For Firebase Storage

export default function VendorAdditionalQuestions() {
  const [companyName, setCompanyName] = useState("");
  const [crNumber, setCrNumber] = useState("");
  const [crLicenseFile, setCrLicenseFile] = useState(null); // Store the file
  const [crLicensePath, setCrLicensePath] = useState("");
  const [location, setLocation] = useState(""); // Location is now empty by default
  const [city, setCity] = useState(""); // City is also empty by default
  const [mobileNumber, setMobileNumber] = useState("");
  const [otherCitiesCovered, setOtherCitiesCovered] = useState("");
  const [region, setRegion] = useState(""); // Region is empty by default
  const [deliveryOption, setDeliveryOption] = useState(""); // Moved down
  const [uploading, setUploading] = useState(false); // For upload status
  const router = useRouter();

  // Handle file selection
  const handleFileChange = (e) => {
    setCrLicenseFile(e.target.files[0]);
  };

  // Upload file to Firebase Storage
  const uploadFileToStorage = async (file) => {
    const storageRef = ref(storage, `crLicenses/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Optional: Monitor upload progress
        },
        (error) => {
          reject(error);
        },
        async () => {
          // Get the download URL after successful upload
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true); // Set uploading status to true during the process

    try {
      let crLicenseUrl = "";
      if (crLicenseFile) {
        // If a file is selected, upload it to Firebase Storage and get the URL
        crLicenseUrl = await uploadFileToStorage(crLicenseFile);
      }

      // Add the vendor data to Firestore
      await addDoc(collection(db, "vendors"), {
        companyName,
        crNumber,
        crLicensePath: crLicenseUrl, // Store the uploaded file's URL
        location,
        city, // Save city value
        mobileNumber,
        otherCitiesCovered,
        region,
        deliveryOption, // Moved down
        createdAt: Timestamp.now(), // Automatically set timestamp for when this entry is created
      });

      alert("Vendor registration completed!");
      router.push("/vendor/dashboard"); // Redirect to the vendor dashboard
    } catch (error) {
      console.error("Error submitting vendor information:", error);
      alert("Error completing registration. Please try again.");
    } finally {
      setUploading(false); // Reset uploading status
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50'>
      <form
        onSubmit={handleSubmit}
        className='bg-white p-8 rounded-lg shadow-lg max-w-md w-full space-y-4'
      >
        <h1 className='text-2xl font-bold text-center'>Vendor Registration</h1>

        {/* Mobile Number - Moved to the top */}
        <Input
          type='tel'
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          placeholder='Mobile Number'
          className='w-full'
          required
        />

        {/* Company Name */}
        <Input
          type='text'
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder='Company Name'
          className='w-full'
          required
        />

        {/* CR Number */}
        <Input
          type='text'
          value={crNumber}
          onChange={(e) => setCrNumber(e.target.value)}
          placeholder='Commercial Registration Number (CR Number)'
          className='w-full'
          required
        />

        {/* CR License File Upload */}
        <div>
          <label className='block text-gray-700 mb-2'>
            Upload CR License (optional)
          </label>
          <input
            type='file'
            accept='.pdf,.jpg,.jpeg,.png'
            onChange={handleFileChange}
            className='w-full'
          />
        </div>

        {/* Location */}
        <Input
          type='text'
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder='Location'
          className='w-full'
          required
        />

        {/* City - Added after Location */}
        <Input
          type='text'
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder='City'
          className='w-full'
        />

        {/* Other Cities Covered */}
        <Input
          type='text'
          value={otherCitiesCovered}
          onChange={(e) => setOtherCitiesCovered(e.target.value)}
          placeholder='Other Cities Covered'
          className='w-full'
        />

        {/* Region */}
        <Input
          type='text'
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          placeholder='Region'
          className='w-full'
          required
        />

        {/* Delivery Option - Moved down */}
        <select
          value={deliveryOption}
          onChange={(e) => setDeliveryOption(e.target.value)}
          className='border rounded-lg p-2 w-full'
          required
        >
          <option value=''>Select Delivery Option</option>
          <option value='inside'>Inside City</option>
          <option value='outside'>Outside City</option>
        </select>

        {/* Submit Button */}
        <Button
          type='submit'
          className='w-full bg-blue-500 text-white py-2 rounded-lg'
          disabled={uploading} // Disable button during upload
        >
          {uploading ? "Uploading..." : "Complete Registration"}
        </Button>
      </form>
    </div>
  );
}
