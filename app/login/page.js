"use client";

import { useState, useEffect } from "react";
import { auth } from "../../lib/firebase";
import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";

export default function PhoneLogin() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationId, setVerificationId] = useState(null);
  const [user, setUser] = useState(null);

  // Ensure that the recaptcha verifier is only initialized when the component is on the client
  useEffect(() => {
    if (typeof window !== "undefined" && auth) {
      // Check if auth is initialized before setting up the ReCAPTCHA
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            console.log("ReCAPTCHA solved", response); // Handle the success here
          },
        },
        auth // Pass the fully initialized Firebase Auth instance here
      );
    }
  }, [auth]); // Run the effect when the auth object is available

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    const appVerifier = window.recaptchaVerifier;

    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier
      );
      setVerificationId(confirmationResult.verificationId); // Save verification ID for later
      console.log("SMS sent to phone number", phoneNumber);
    } catch (error) {
      console.error("Error during phone authentication:", error);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    if (!verificationId) return;

    try {
      const credential = firebase.auth.PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );
      const userCredential = await auth.signInWithCredential(credential);
      setUser(userCredential.user); // Save user to state
      console.log("Logged in user:", userCredential.user);
    } catch (error) {
      console.error("Error verifying code:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handlePhoneSubmit}>
        <h2>Login with Phone Number</h2>
        <input
          type='tel'
          placeholder='Enter phone number'
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <button type='submit'>Send SMS</button>
        <div id='recaptcha-container'></div> {/* ReCAPTCHA container */}
      </form>

      {verificationId && (
        <form onSubmit={handleCodeSubmit}>
          <input
            type='text'
            placeholder='Enter verification code'
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
          />
          <button type='submit'>Verify Code</button>
        </form>
      )}

      {user && (
        <div>
          <h3>Welcome, {user.phoneNumber}</h3>
          <p>User UID: {user.uid}</p>
        </div>
      )}
    </div>
  );
}
