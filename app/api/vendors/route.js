// app/api/vendors/route.js
import { db } from "@/lib/firebase"; // Firestore instance
import { collection, addDoc } from "firebase/firestore";

// Handle POST request to add a vendor to Firestore
export async function POST(req) {
  try {
    const {
      mobileNumber,
      companyName,
      crNumber,
      crLicensePath,
      location,
      region,
      city,
      otherCitiesCovered,
      deliveryOption,
    } = await req.json();

    // Add the new vendor to the 'vendors' collection in Firestore
    const docRef = await addDoc(collection(db, "vendors"), {
      mobileNumber,
      companyName,
      crNumber,
      crLicensePath,
      location,
      region,
      city,
      otherCitiesCovered,
      deliveryOption,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Return success response
    return new Response(
      JSON.stringify({ message: "Vendor added successfully", id: docRef.id }),
      { status: 201 }
    );
  } catch (error) {
    // Return error response if something goes wrong
    return new Response(
      JSON.stringify({ error: "Error adding vendor: " + error.message }),
      { status: 500 }
    );
  }
}
