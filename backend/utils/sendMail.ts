import { transporter } from "@/config/nodemailer.js";

type Email = {
    to: string;
    subject: string;
    text: string;
    html: string;
};

// Helper function to add timeout to promises
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
    ),
  ]);
};

export const sendMail = async ({ to, subject, text, html }: Email) => {
  const mailOptions = {
    from: `"Product management" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  };

  try {
    // Add a 15 second timeout to prevent hanging requests
    const info = await withTimeout(transporter.sendMail(mailOptions), 15000);
    return info;
  } catch (err: any) {
    console.error("Error sending email:", err);
    console.error("Error code:", err.code);
    console.error("Error command:", err.command);
    
    // Provide more specific error messages
    if (err.code === "ETIMEDOUT" || err.message?.includes("timeout") || err.message?.includes("Connection timeout")) {
      throw new Error("Email service timeout - unable to connect to SMTP server. This may be due to network restrictions in your hosting environment.");
    }
    if (err.code === "EAUTH") {
      throw new Error("Email authentication failed - check credentials");
    }
    if (err.code === "ECONNECTION" || err.code === "ESOCKET") {
      throw new Error("Failed to connect to email service - check network connectivity and firewall settings");
    }
    if (err.code === "EENVELOPE") {
      throw new Error("Email address validation failed");
    }
    
    throw err;
  }
};
