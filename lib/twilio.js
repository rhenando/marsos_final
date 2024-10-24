import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

const client = twilio(accountSid, authToken);

console.log("TWILIO_VERIFY_SERVICE_SID:", verifyServiceSid);

export const sendOTP = async (phoneNumber) => {
  try {
    // Ensure that the verifyServiceSid is being passed correctly
    const response = await client.verify.v2
      .services(verifyServiceSid)
      .verifications.create({ to: phoneNumber, channel: "sms" });
    return response;
  } catch (error) {
    console.error("Error in Twilio OTP sending:", error);
    throw new Error("Failed to send OTP");
  }
};

export const verifyOTP = async (phoneNumber, code) => {
  try {
    const verification = await client.verify.v2
      .services(verifyServiceSid)
      .verificationChecks.create({ to: phoneNumber, code });
    return verification;
  } catch (error) {
    console.error("Error in Twilio OTP verification:", error);
    throw new Error("Failed to verify OTP");
  }
};
