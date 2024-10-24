import { NextResponse } from "next/server";
import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(req) {
  try {
    const { phoneNumber } = await req.json();

    // Send OTP using Twilio
    const otpResponse = await client.verify
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({ to: `+966${phoneNumber}`, channel: "sms" });

    return NextResponse.json({ success: true, message: "OTP sent!" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to send OTP.",
    });
  }
}
