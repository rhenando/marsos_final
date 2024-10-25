"use client";

import { SessionProvider } from "next-auth/react"; // Import SessionProvider from NextAuth.js
import { UserProvider } from "../context/UserContext"; // Your custom UserProvider

import localFont from "next/font/local";
import "./globals.css";

// Font configuration
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Root layout for the application
export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Wrap the app with NextAuth's SessionProvider */}
        <SessionProvider>
          {/* Nested custom UserProvider if additional state is needed */}
          <UserProvider>{children}</UserProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
