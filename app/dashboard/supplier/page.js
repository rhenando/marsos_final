"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { db } from "../../../lib/firebase"; // Adjust based on your project structure
import { collection, query, where, getDocs } from "firebase/firestore"; // Firestore functions

export default function SupplierDashboard() {
  const router = useRouter();
  const [supplierData, setSupplierData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to normalize phone number (ensure +966 prefix)
  const normalizePhoneNumber = (phoneNumber) => {
    return phoneNumber.startsWith("+") ? phoneNumber : `+966${phoneNumber}`;
  };

  // Fetch supplier details from Firestore using phone number from localStorage
  useEffect(() => {
    const fetchSupplierDetails = async () => {
      const phoneNumber = localStorage.getItem("phoneNumber");

      if (!phoneNumber) {
        // Redirect to registration if no phone number is found (user not logged in)
        router.replace("/auth/registration");
        return;
      }

      try {
        const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);
        console.log("Normalized Phone Number:", normalizedPhoneNumber);

        // Use a query to search for the supplier by phone number
        const suppliersCollection = collection(db, "suppliers");
        const q = query(
          suppliersCollection,
          where("phoneNumber", "==", normalizedPhoneNumber)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0].data();
          setSupplierData(docData);
          console.log("Supplier Data:", docData); // Debugging supplier data
        } else {
          console.log("No supplier details found in Firestore");
        }
      } catch (error) {
        console.error("Error fetching supplier details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSupplierDetails();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!supplierData) {
    return <div>No supplier details found in Firestore</div>;
  }

  return (
    <div className='p-8'>
      {/* Display Supplier's company name */}
      <h1 className='text-2xl font-bold mb-4'>
        Welcome, {supplierData.companyName || "Supplier"}!
      </h1>

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

      {/* Profile Information */}
      <div className='mt-8'>
        <h2 className='text-lg font-semibold mb-4'>Profile Information</h2>

        {/* Display company details */}
        <p>
          <strong>Company Name:</strong> {supplierData.companyName}
        </p>
        <p>
          <strong>Phone Number:</strong> {supplierData.phoneNumber}
        </p>
        <p>
          <strong>CR Number:</strong> {supplierData.crNumber}
        </p>
        <p>
          <strong>Delivery Option:</strong> {supplierData.deliveryOption}
        </p>
        <p>
          <strong>Location:</strong> {supplierData.location}
        </p>
        <p>
          <strong>Email:</strong> {supplierData.email || "No email provided"}
        </p>
        <p>
          <strong>Other Cities Served:</strong>{" "}
          {supplierData.otherCitiesServed || "N/A"}
        </p>
        <p>
          <strong>Region:</strong> {supplierData.region}
        </p>
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
