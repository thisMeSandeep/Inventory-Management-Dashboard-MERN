import nodemailer from "nodemailer";

// Use explicit SMTP configuration for better compatibility in production
// This works better on cloud platforms like Render
export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  // Timeout settings to prevent hanging requests
  connectionTimeout: 10000, // 10 seconds to establish connection
  socketTimeout: 10000, // 10 seconds for socket operations
  greetingTimeout: 10000, // 10 seconds for SMTP greeting
  // Use STARTTLS for port 587
  requireTLS: true,
  // Pool connections for better performance
  pool: true,
  maxConnections: 1,
  maxMessages: 3,
  // Additional options for better reliability
  tls: {
    // Do not fail on invalid certificates (useful for some network setups)
    rejectUnauthorized: false,
  },
});

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
