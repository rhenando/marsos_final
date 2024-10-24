"use client";

import { useEffect, useState } from "react";
import { db } from "../../../lib/firebase"; // Path to your firebase.js
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore"; // Firestore functions
import { useRouter } from "next/navigation"; // For navigation to Add Product page
import { auth } from "../../../lib/firebase"; // Import Firebase Auth

export default function VendorDashboard() {
  const [companyName, setCompanyName] = useState(""); // Store the vendor's company name
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [vendorId, setVendorId] = useState(null); // Store the vendorId dynamically
  const router = useRouter(); // Use router for navigation

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        // Get the current logged-in user (vendor)
        const user = auth.currentUser;

        if (user) {
          setVendorId(user.uid); // Set the vendorId from Firebase Auth (user.uid)

          // Fetch vendor's company name
          const vendorDoc = await getDoc(doc(db, "vendors", user.uid));
          if (vendorDoc.exists()) {
            setCompanyName(vendorDoc.data().companyName || "Vendor");
          } else {
            console.error("Vendor not found");
          }

          // Fetch vendor's products
          const q = query(
            collection(db, "products"),
            where("vendorId", "==", user.uid)
          );
          const productSnapshot = await getDocs(q);
          setProducts(productSnapshot.docs.map((doc) => doc.data()));

          // Fetch vendor's orders
          const orderQuery = query(
            collection(db, "orders"),
            where("vendorId", "==", user.uid)
          );
          const orderSnapshot = await getDocs(orderQuery);
          setOrders(orderSnapshot.docs.map((doc) => doc.data()));
        } else {
          console.error("No user is logged in");
        }
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      }
    };

    fetchVendorData();
  }, []);

  // Navigate to the Add Product page
  const handleAddProduct = () => {
    router.push("/vendor/dashboard/add-product"); // Navigate to the Add Product page
  };

  return (
    <div>
      {/* Display the Vendor's Company Name */}
      <h1 className='text-2xl font-bold mb-4'>Welcome, {companyName}!</h1>

      <section>
        <h2 className='text-lg font-semibold'>Products</h2>

        {/* Add Product Button */}
        <button
          className='bg-blue-500 text-white p-2 rounded mb-4'
          onClick={handleAddProduct}
        >
          Add Product
        </button>

        {products.length ? (
          <ul>
            {products.map((product, index) => (
              <li key={index}>
                {product.name} - {product.price}
              </li>
            ))}
          </ul>
        ) : (
          <p>No products found</p>
        )}
      </section>

      <section>
        <h2 className='text-lg font-semibold'>Orders</h2>
        {orders.length ? (
          <ul>
            {orders.map((order, index) => (
              <li key={index}>
                Order #{order.id} - {order.status}
              </li>
            ))}
          </ul>
        ) : (
          <p>No orders found</p>
        )}
      </section>
    </div>
  );
}
