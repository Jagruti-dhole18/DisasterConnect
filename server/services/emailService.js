import Brevo from "@getbrevo/brevo";
import dotenv from "dotenv";

dotenv.config();

const apiInstance = new Brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    await apiInstance.sendTransacEmail({
      sender: {
        email: process.env.EMAIL_FROM,
        name: process.env.EMAIL_FROM_NAME,
      },
      to: [
        {
          email: to,
        },
      ],
      subject,
      htmlContent: html,
      textContent: text,
    });

    console.log("✅ Email sent successfully");
    return { success: true };
  } catch (err) {
    console.error("❌ Brevo API Error:", err.response?.body || err);
    throw err;
  }
};