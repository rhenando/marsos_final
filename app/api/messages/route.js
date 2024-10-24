import { NextResponse } from "next/server";
import { collection, getDocs, addDoc, doc } from "firebase/firestore";
import { db } from "../../../lib/firebase";

// Fetch messages for a given chat ID
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get("chatId");

  if (!chatId) {
    return NextResponse.json(
      { error: "Chat ID not provided" },
      { status: 400 }
    );
  }

  try {
    const chatRef = doc(db, "chats", chatId);
    const messagesSnapshot = await getDocs(collection(chatRef, "messages"));
    const messagesList = messagesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ messages: messagesList });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// Post a new message to a chat
export async function POST(request) {
  const { chatId, text, userId } = await request.json();

  if (!chatId || !text || !userId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    const chatRef = doc(db, "chats", chatId);
    await addDoc(collection(chatRef, "messages"), {
      text,
      userId,
      timestamp: new Date(),
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to post message" },
      { status: 500 }
    );
  }
}
