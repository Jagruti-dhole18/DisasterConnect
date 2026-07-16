import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 465,
  secure: false,
  auth: {
    user: process.env.BREVO_LOGIN,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
      await transporter.verify();
  console.log("SMTP VERIFIED");
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent successfully");
  } catch (err) {
    console.error("Email Error:", err);
    throw err;
  }
};