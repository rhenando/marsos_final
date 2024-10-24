import { NextResponse } from "next/server";
import twilio from "twilio";

// Setup Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(request) {
  const { phoneNumber } = await request.json();

  try {
    const verification = await client.verify
      .services(process.env.TWILIO_SERVICE_SID)
      .verifications.create({ to: phoneNumber, channel: "sms" });

    return NextResponse.json({ status: "OTP Sent" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
