// app/api/sendOtp/route.js
import { sendOTP } from "../../../lib/twilio";

export async function POST(req) {
  const { phoneNumber } = await req.json();

  try {
    await sendOTP(phoneNumber);
    return new Response(
      JSON.stringify({ success: true, message: "OTP sent" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending OTP:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
