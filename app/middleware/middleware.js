// middleware.js
import { NextResponse } from "next/server";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { auth, db } from "./lib/firebase";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Only apply middleware on protected paths
  if (pathname.startsWith("/dashboard")) {
    const user = auth.currentUser;
    if (!user) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const userDoc = await getDoc(doc(db, "users", user.uid));
    const role = userDoc.exists() ? userDoc.data().role : null;

    if (pathname.startsWith("/dashboard/supplier") && role !== "supplier") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (pathname.startsWith("/dashboard/buyer") && role !== "buyer") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}
