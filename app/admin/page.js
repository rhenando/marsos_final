"use client"; // Required for components using hooks in Next.js

import { useState, useEffect } from "react";
import { auth } from "../../lib/firebase"; // Import auth from firebase.js
import { doc, getDoc } from "firebase/firestore"; // Firestore functions
import { db } from "../../lib/firebase"; // Import Firestore db from firebase.js

export default function AdminPanel() {
  const [role, setRole] = useState(null);

  // Function to fetch user role from Firestore
  const getUserRole = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid)); // Fetch the user's document from Firestore
      if (userDoc.exists()) {
        return userDoc.data().role; // Return the role from the user's document
      } else {
        return null; // No user document found
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchRole = async () => {
      const user = auth.currentUser; // Check if a user is logged in
      if (user) {
        const fetchedRole = await getUserRole(user.uid); // Fetch the user's role using their UID
        setRole(fetchedRole); // Set the role in state
      }
    };
    fetchRole(); // Fetch the role when the component mounts
  }, []);

  // Restrict access to the admin panel
  if (role !== "admin") {
    return <p>Access Denied. Only Admins can access this page.</p>;
  }

  return (
    <div>
      <h1>Admin Panel</h1>
      {/* Admin-specific content goes here */}
    </div>
  );
}
