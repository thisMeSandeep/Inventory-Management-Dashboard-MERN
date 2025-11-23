import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  // Timeout settings to prevent hanging requests
  connectionTimeout: 10000, // 10 seconds to establish connection
  socketTimeout: 10000, // 10 seconds for socket operations
  greetingTimeout: 10000, // 10 seconds for SMTP greeting
  // Pool connections for better performance
  pool: true,
  maxConnections: 1,
  maxMessages: 3,
} as any);

// Verify email transporter connection on startup
export const verifyEmailConnection = async (): Promise<boolean> => {
  try {
    await transporter.verify();
    console.log("Email service is ready");
    return true;
  } catch (error) {
    console.error("Email service connection failed:", error);
    return false;
  }
};
