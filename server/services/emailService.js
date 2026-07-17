// import nodemailer from "nodemailer";
// import dotenv from "dotenv";

// dotenv.config();

// // const transporter = nodemailer.createTransport({
// //   host: process.env.EMAIL_HOST || "smtp.gmail.com",
// //   port: Number(process.env.EMAIL_PORT) || 587,
// //   secure: false, 
// //   auth: {
// //     user: process.env.EMAIL_USER,
// //     pass: process.env.EMAIL_PASS,
// //   },
// // });
// // const transporter = nodemailer.createTransport({
// //   host: "smtp.gmail.com",
// //   port: 465,
// //   secure: true,
// //   family: 4,
// //   auth: {
// //     user: process.env.EMAIL_USER,
// //     pass: process.env.EMAIL_PASS,
// //   },
// // });

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
//   connectionTimeout: 60000,
//   greetingTimeout: 30000,
//   socketTimeout: 60000,
// });

// export const sendEmail = async ({ to, subject, text, html }) => {
//   try {
//     const info = await transporter.sendMail({
//       from: `"DisasterConnect" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       text,
//       html,
//     });

//     console.log("✅ Email sent:", info.messageId);
//     return info;
//   } catch (err) {
//     console.error("❌ Nodemailer Error:", err);
//     throw err;
//   }
// };

import Mailjet from "node-mailjet";
import dotenv from "dotenv";

dotenv.config();

const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_SECRET_KEY
);

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const response = await mailjet
      .post("send", { version: "v3.1" })
      .request({
        Messages: [
          {
            From: {
              Email: process.env.EMAIL_FROM,
              Name: "DisasterConnect",
            },
            To: [
              {
                Email: to,
              },
            ],
            Subject: subject,
            TextPart: text,
            HTMLPart: html,
          },
        ],
      });

    console.log("✅ Email sent successfully");
    return response.body;
  } catch (error) {
    console.error(
      "❌ Mailjet Error:",
      error.statusCode,
      error.message,
      error.response?.body || ""
    );
    throw error;
  }
};