"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth"; // Import Firebase registration method
import { auth } from "../../lib/firebase"; // Import the auth instance from firebase.js

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      ); // Firebase registration
      const user = userCredential.user;
      console.log("Registered user:", user);
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder='Email'
        required
      />
      <input
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder='Password'
        required
      />
      <button type='submit'>Register</button>
    </form>
  );
}
