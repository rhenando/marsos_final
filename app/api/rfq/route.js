import { db } from "../../../lib/firebase"; // Adjust the path according to your project
import { addDoc, collection } from "firebase/firestore";

export async function POST(req) {
  try {
    const { productId, buyerId, message } = await req.json(); // Parse JSON body

    // Add the RFQ (Request for Quotation) to Firestore
    const docRef = await addDoc(collection(db, "rfqs"), {
      productId,
      buyerId,
      message,
      createdAt: new Date(),
      status: "pending",
    });

    return new Response(
      JSON.stringify({ message: "RFQ submitted successfully!" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error submitting RFQ" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
