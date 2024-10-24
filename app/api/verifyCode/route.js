import { NextResponse } from "next/server";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_SERVICE_ID;
const client = twilio(accountSid, authToken);

export async function POST(request) {
  try {
    const body = await request.json();
    const { phoneNumber, otp } = body;

    // Verify OTP
    const response = await client.verify
      .services(serviceId)
      .verificationChecks.create({ to: phoneNumber, code: otp });

    if (response.status === "approved") {
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
      { success: false, message: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
