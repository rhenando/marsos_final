const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
const authToken = process.env.TWILIO_AUTH_TOKEN; // Your Auth Token from www.twilio.com/console
const verifySid = process.env.TWILIO_VERIFY_SERVICE_SID;

const client = twilio(accountSid, authToken);

async function sendTestOTP() {
  try {
    const result = await client.verify
      .services(verifySid)
      .verifications.create({
        to: "+1234567890", // Replace with your phone number
        channel: "sms",
      });
    console.log("OTP sent successfully:", result);
  } catch (error) {
    console.error("Error sending OTP:", error);
  }
}

sendTestOTP();
