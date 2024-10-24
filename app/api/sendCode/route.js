import { NextResponse } from "next/server";
import twilio from "twilio";

// Twilio Setup
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = VAadea098f7fe0ffafc62c6b2927e2b1bf; // Make sure this is correct and from Twilio Verify
const client = twilio(accountSid, authToken);

export async function POST(request) {
  try {
    const body = await request.json();
    const { phoneNumber } = body;

    // Log the serviceId to verify it's loaded correctly
    console.log("Twilio Service ID:", serviceId);

    // Send OTP using Twilio Verify API
    const response = await client.verify.v2
      .services(serviceId)
      .verifications.create({
        to: phoneNumber,
        channel: "sms", // Use "call" if you want voice OTPs
      });

    // Log and return the response from Twilio for debugging
    console.log("Twilio Response:", response);

    return NextResponse.json({ success: true, message: "OTP sent", response });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send OTP", error: error.message },
      { status: 500 }
    );
  }
}
