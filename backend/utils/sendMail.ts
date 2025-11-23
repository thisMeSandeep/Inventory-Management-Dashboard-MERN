import nodemailer from "nodemailer";
import { getTransporter } from "@/config/nodemailer.js";

type Email = {
    to: string;
    subject: string;
    text: string;
    html: string;
};

export const sendMail = async ({ to, subject, text, html }: Email) => {
  const emailTransporter = await getTransporter();
  
  const mailOptions = {
    from: `"Product management" <${process.env.EMAIL_USER || "noreply@example.com"}>`,
    to,
    subject,
    text,
    html,
  };

  const info = await emailTransporter.sendMail(mailOptions);
  
  // Get the Ethereal email preview URL
  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log("Email sent! Preview URL:", previewUrl);
  }
  
  return {
    info,
    previewUrl: previewUrl || null,
  };
};
