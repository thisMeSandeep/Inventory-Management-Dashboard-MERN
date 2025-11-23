import nodemailer from "nodemailer";

// Ethereal Email test account (created automatically)
let etherealAccount: nodemailer.TestAccount | null = null;
let transporter: nodemailer.Transporter | null = null;

// Create Ethereal test account and transporter
export const createEtherealAccount = async (): Promise<void> => {
  try {
    // Create a test account on Ethereal Email
    etherealAccount = await nodemailer.createTestAccount();
    
    // Create transporter using Ethereal SMTP
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: etherealAccount.user,
        pass: etherealAccount.pass,
      },
      // Timeout settings
      connectionTimeout: 10000,
      socketTimeout: 10000,
      greetingTimeout: 10000,
    });
  } catch (error) {
    console.error("Failed to create Ethereal account:", error);
    throw error;
  }
};

// Get the transporter (creates account if not exists)
export const getTransporter = async (): Promise<nodemailer.Transporter> => {
  if (!transporter) {
    await createEtherealAccount();
  }
  if (!transporter) {
    throw new Error("Failed to create email transporter");
  }
  return transporter;
};

// Verify email transporter connection on startup
export const verifyEmailConnection = async (): Promise<boolean> => {
  try {
    const emailTransporter = await getTransporter();
    await emailTransporter.verify();
    console.log("Email service (Ethereal) is ready");
    return true;
  } catch (error) {
    console.error("Email service connection failed:", error);
    return false;
  }
};
