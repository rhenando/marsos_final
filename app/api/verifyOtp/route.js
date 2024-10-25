// app/api/verifyOtp/route.js
import { verifyOTP } from "../../../lib/twilio";

export async function POST(req) {
  const { phoneNumber, otpCode } = await req.json();

  try {
    const verified = await verifyOTP(phoneNumber, otpCode);
    return new Response(JSON.stringify({ success: verified }), { status: 200 });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
