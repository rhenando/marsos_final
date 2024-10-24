import { auth, db } from "../../lib/firebase"; // Adjusted to import from the root
import { doc, setDoc, getDoc } from "firebase/firestore";

// Function to register a new user and assign a role
export async function registerUser(email, password, role) {
  const userCredential = await auth.createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  // Add the role to Firestore
  await setDoc(doc(db, "users", user.uid), { role });

  return user;
}

// Function to fetch user role after login
export async function getUserRole(uid) {
  const userDoc = await getDoc(doc(db, "users", uid));
  return userDoc.exists() ? userDoc.data().role : null;
}
