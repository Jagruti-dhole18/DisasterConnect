import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: process.env.EMAIL_FROM_NAME,
          email: process.env.EMAIL_FROM,
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
        textContent: text,
      },
      {
        headers: {
          "accept": "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json",
        },
      }
    );

    console.log("✅ Email sent:", response.data);
    return response.data;
  } catch (err) {
    console.error(
      "❌ Brevo API Error:",
      err.response?.data || err.message
    );
    throw err;
  }
};