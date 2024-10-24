import { db } from "@/lib/firebase"; // Your Firestore setup
import { collection, addDoc } from "firebase/firestore";

export async function POST(request) {
  try {
    const {
      name,
      price,
      size,
      height,
      length,
      weight, // Accept the weight field
      category,
      subcategory,
      vendor,
      location,
      imageUrl,
      description,
    } = await request.json();

    // Reference to the products collection
    const docRef = await addDoc(collection(db, "products"), {
      name,
      price,
      size,
      height,
      length,
      weight,
      category,
      subcategory,
      vendor,
      location,
      imageUrl,
      description,
    });

    return new Response(
      JSON.stringify({ message: "Product added successfully!", id: docRef.id }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to add product" }), {
      status: 500,
    });
  }
}
