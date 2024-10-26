// app/api/verifyOtp/route.js
import jwt from "jsonwebtoken";
import { verifyOTP } from "../../../lib/twilio"; // Import your OTP verification function

export async function POST(req) {
  const { phoneNumber, otpCode } = await req.json();

  try {
    // Step 1: Verify the OTP
    const isOtpValid = await verifyOTP(phoneNumber, otpCode);

    if (!isOtpValid) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid OTP" }),
        { status: 401 }
      );
    }

    // Step 2: Generate a JWT token with the phone number as-is
    const token = jwt.sign(
      { phoneNumber }, // No normalization
      process.env.NEXT_PUBLIC_JWT_SECRET,
      { expiresIn: "1d" }
    );

    return new Response(
      JSON.stringify({ success: true, token, message: "OTP verified" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
