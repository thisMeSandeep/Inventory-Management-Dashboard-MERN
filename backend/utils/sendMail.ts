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
    console.error("❌ Error sending email:", err);
    
    // Provide more specific error messages
    if (err.message?.includes("timeout")) {
      throw new Error("Email service timeout - please try again later");
    }
    if (err.code === "EAUTH") {
      throw new Error("Email authentication failed - check credentials");
    }
    if (err.code === "ECONNECTION") {
      throw new Error("Failed to connect to email service");
    }
    
    throw err;
  }
};
