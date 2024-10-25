"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "../../../context/UserContext"; // Import User Context
import { db } from "../../../lib/firebase"; // Adjust based on your project structure
import { collection, query, where, getDocs } from "firebase/firestore"; // Firestore functions

export default function BuyerDashboard() {
  const { user } = useUser(); // Fetch user from UserContext
  const [buyerData, setBuyerData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Normalize phone number (handle cases with or without +966 prefix)
  const normalizePhoneNumber = (phoneNumber) => {
    return phoneNumber.startsWith("+") ? phoneNumber : `+966${phoneNumber}`;
  };

  // Fetch buyer details from Firestore when the user is available
  useEffect(() => {
    const fetchBuyerDetails = async () => {
      if (user && user.phoneNumber) {
        try {
          const normalizedPhoneNumber = normalizePhoneNumber(user.phoneNumber);
          console.log("Normalized Phone Number:", normalizedPhoneNumber);

          // Query Firestore for a buyer with the matching phone number
          const buyersCollection = collection(db, "buyers");
          let q = query(
            buyersCollection,
            where("phoneNumber", "==", normalizedPhoneNumber)
          );

          let querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            // Retry without +966 prefix if not found
            const plainPhoneNumber = normalizedPhoneNumber.replace("+966", "");
            q = query(
              buyersCollection,
              where("phoneNumber", "==", plainPhoneNumber)
            );
            querySnapshot = await getDocs(q);
          }

          if (!querySnapshot.empty) {
            const docData = querySnapshot.docs[0].data();
            setBuyerData(docData);
            console.log("Buyer Data:", docData); // Debugging buyer data
          } else {
            console.log("No buyer details found in Firestore");
          }
        } catch (error) {
          console.error("Error fetching buyer details from Firestore:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBuyerDetails();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!buyerData) {
    return <div>No buyer details found in Firestore</div>;
  }

  return (
    <div className='p-8'>
      <h1 className='text-2xl font-bold mb-4'>
        Welcome, {buyerData.name || "Buyer"}!
      </h1>

      {/* Order Overview Section */}
      <div className='grid grid-cols-2 gap-6'>
        <div className='bg-white shadow-md rounded-lg p-6'>
          <h2 className='text-lg font-semibold'>Total Orders</h2>
          <p className='text-3xl font-bold'>50</p>
        </div>
        <div className='bg-white shadow-md rounded-lg p-6'>
          <h2 className='text-lg font-semibold'>Current Orders</h2>
          <p className='text-3xl font-bold'>2</p>
        </div>
      </div>

      {/* Order History */}
      <div className='mt-8'>
        <h2 className='text-lg font-semibold mb-4'>Order History</h2>
        <table className='min-w-full bg-white'>
          <thead>
            <tr>
              <th className='py-2 px-4'>Order ID</th>
              <th className='py-2 px-4'>Product</th>
              <th className='py-2 px-4'>Status</th>
              <th className='py-2 px-4'>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='border py-2 px-4'>12345</td>
              <td className='border py-2 px-4'>Laptop</td>
              <td className='border py-2 px-4'>Delivered</td>
              <td className='border py-2 px-4'>$1200</td>
            </tr>
            <tr>
              <td className='border py-2 px-4'>12346</td>
              <td className='border py-2 px-4'>Phone</td>
              <td className='border py-2 px-4'>Shipped</td>
              <td className='border py-2 px-4'>$800</td>
            </tr>
            {/* Add more rows as needed */}
          </tbody>
        </table>
      </div>

      {/* Browse Products Section */}
      <div className='mt-8'>
        <Link href='/products'>
          <button className='bg-green-500 text-white px-4 py-2 rounded'>
            Browse Products
          </button>
        </Link>
      </div>

      {/* Profile Information */}
      <div className='mt-8'>
        <h2 className='text-lg font-semibold mb-4'>Profile Information</h2>
        <p>
          <strong>Name:</strong> {buyerData.name || "N/A"}
        </p>
        <p>
          <strong>Phone Number:</strong> {buyerData.phoneNumber}
        </p>
        <p>
          <strong>Location:</strong> {buyerData.location || "N/A"}
        </p>
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
