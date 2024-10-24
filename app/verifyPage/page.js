import { NextResponse } from "next/server";

// POST method to handle OTP verification
export async function POST(request) {
  try {
    const body = await request.json(); // Parse the request body
    const { phoneNumber, otp } = body; // Extract the phone number and OTP from the body

    // Dummy OTP verification logic (replace with your actual logic)
    if (otp === "123456") {
      return NextResponse.json({ success: true, message: "OTP verified" });
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid OTP" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
