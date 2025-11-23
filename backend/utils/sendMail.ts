import nodemailer from "nodemailer";
import { getTransporter } from "@/config/nodemailer.js";

type Email = {
    to: string;
    subject: string;
    text: string;
    html: string;
};

export const sendMail = async ({ to, subject, text, html }: Email) => {
  let emailTransporter = await getTransporter();
  
  const mailOptions = {
    from: `"Product management" <${process.env.EMAIL_USER || "noreply@example.com"}>`,
    to,
    subject,
    text,
    html,
  };

  try {
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
  } catch (error: any) {
    // If connection fails, try to recreate the transporter
    if (error.code === "ETIMEDOUT" || error.code === "ECONNECTION" || error.code === "ESOCKET") {
      console.warn("Connection error, attempting to recreate transporter...");
      // Recreate transporter and retry once
      const { createEtherealAccount } = await import("@/config/nodemailer.js");
      await createEtherealAccount(3, true); // Force recreate
      emailTransporter = await getTransporter();
      
      const info = await emailTransporter.sendMail(mailOptions);
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log("Email sent! Preview URL:", previewUrl);
      }
      
      return {
        info,
        previewUrl: previewUrl || null,
      };
    }
    throw error;
  }
};
