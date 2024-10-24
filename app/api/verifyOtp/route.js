import { NextResponse } from "next/server";
import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(req) {
  try {
    const { phoneNumber, otpCode } = await req.json();

    // Verify the OTP using Twilio
    const verificationCheck = await client.verify
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({ to: `+966${phoneNumber}`, code: otpCode });

    if (verificationCheck.status === "approved") {
      return NextResponse.json({ success: true, message: "OTP verified!" });
    } else {
      return NextResponse.json({ success: false, message: "Invalid OTP." });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to verify OTP.",
    });
  }
}
