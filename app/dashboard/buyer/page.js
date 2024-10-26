"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../../../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import jwt from "jsonwebtoken";

export default function BuyerDashboard() {
  const [buyerData, setBuyerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBuyerDetails = async () => {
      // Step 1: Retrieve token from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found. Redirecting to login.");
        router.push("/auth/registration");
        return;
      }

      try {
        // Step 2: Decode token without verifying (matches the Header component)
        const decodedToken = jwt.decode(token);
        let phoneNumber = decodedToken?.phoneNumber;

        if (!phoneNumber) {
          console.error(
            "No phone number found in token. Redirecting to login."
          );
          router.push("/auth/registration");
          return;
        }

        // Remove country code prefix if necessary to match Firestore
        if (phoneNumber.startsWith("+966")) {
          phoneNumber = phoneNumber.slice(4);
        }

        console.log("Phone Number for Firestore Query:", phoneNumber);

        // Step 3: Fetch user data from Firestore
        const userDoc = await fetchUserFromFirestore(phoneNumber);
        if (userDoc) {
          setBuyerData(userDoc);
        } else {
          console.error("No buyer details found in Firestore.");
        }
      } catch (error) {
        console.error("Error decoding token or fetching user data:", error);
        router.push("/auth/registration");
      } finally {
        setLoading(false);
      }
    };

    fetchBuyerDetails();
  }, [router]);

  // Firestore query function
  const fetchUserFromFirestore = async (phoneNumber) => {
    try {
      const buyersCollection = collection(db, "buyers");
      const q = query(
        buyersCollection,
        where("phoneNumber", "==", phoneNumber)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        return userData;
      } else {
        console.warn("No user found for this phone number in Firestore.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data from Firestore:", error);
      return null;
    }
  };

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
        <button
          className='bg-red-500 text-white px-4 py-2 rounded'
          onClick={() => {
            localStorage.removeItem("token");
            router.push("/auth/registration");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
