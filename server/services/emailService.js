import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
      html,
    });

    if (error) {
      console.error(error);
      throw error;
    }

    console.log("Email sent:", data);

    return { success: true };
  } catch (err) {
    console.error("Email send failed:", err);
    throw err;
  }
};