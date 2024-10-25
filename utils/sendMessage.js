import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const sendMessage = async (chatId, senderId, text) => {
  try {
    const messageRef = collection(db, "chats", chatId, "messages");
    await addDoc(messageRef, {
      sender_id: senderId,
      text: text,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error sending message: ", error);
  }
};
