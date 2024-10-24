import { NextResponse } from "next/server";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebase"; // Firebase config

export async function GET() {
  try {
    const contactsSnapshot = await getDocs(collection(db, "contacts"));
    const contactsList = contactsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json({ contacts: contactsList });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}
