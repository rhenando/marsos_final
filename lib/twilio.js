// lib/twilio.js
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

const client = twilio(accountSid, authToken);

export const sendOTP = async (phoneNumber) => {
  const response = await client.verify.v2
    .services(verifyServiceSid)
    .verifications.create({ to: phoneNumber, channel: "sms" });
  return response;
};

export const verifyOTP = async (phoneNumber, code) => {
  const verification = await client.verify.v2
    .services(verifyServiceSid)
    .verificationChecks.create({ to: phoneNumber, code });
  return verification.status === "approved";
};
