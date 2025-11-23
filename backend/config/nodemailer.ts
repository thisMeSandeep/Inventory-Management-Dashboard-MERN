import nodemailer from "nodemailer";

// Ethereal Email test account (created automatically)
let etherealAccount: nodemailer.TestAccount | null = null;
let transporter: nodemailer.Transporter | null = null;
let isCreatingAccount = false;

// Create Ethereal test account and transporter with retry logic
export const createEtherealAccount = async (retries = 3, forceRecreate = false): Promise<void> => {
  if (isCreatingAccount && !forceRecreate) {
    // Wait for existing creation to complete
    while (isCreatingAccount) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    if (transporter) return;
  }

  isCreatingAccount = true;
  
  // Reset transporter if forcing recreation
  if (forceRecreate) {
    transporter = null;
    etherealAccount = null;
  }
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Creating Ethereal account (attempt ${attempt}/${retries})...`);
      
      // Create a test account on Ethereal Email with timeout
      const createAccountPromise = nodemailer.createTestAccount();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Account creation timeout")), 15000)
      );
      
      etherealAccount = await Promise.race([createAccountPromise, timeoutPromise]) as nodemailer.TestAccount;
      
      if (!etherealAccount) {
        throw new Error("Failed to create Ethereal account");
      }
      
      console.log("Ethereal account created:", etherealAccount.user);
      
      // Create transporter using Ethereal SMTP
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: etherealAccount.user,
          pass: etherealAccount.pass,
        },
        // Increased timeout settings for production
        connectionTimeout: 20000, // 20 seconds
        socketTimeout: 20000, // 20 seconds
        greetingTimeout: 20000, // 20 seconds
        // Additional options for better reliability
        tls: {
          rejectUnauthorized: false,
        },
      });
      
      // Verify the transporter works
      await transporter.verify();
      
      console.log("✅ Ethereal Email account created successfully");
      console.log("📧 Ethereal Email:", etherealAccount.user);
      console.log("🔑 Ethereal Password:", etherealAccount.pass);
      console.log("🌐 View emails at: https://ethereal.email");
      console.log("⚠️  Note: Emails are not delivered to real addresses. View them on Ethereal website.");
      
      isCreatingAccount = false;
      return;
    } catch (error: any) {
      console.error(`Attempt ${attempt} failed:`, error.message || error);
      
      if (attempt === retries) {
        isCreatingAccount = false;
        console.error("❌ Failed to create Ethereal account after all retries");
        throw new Error(`Failed to create Ethereal account: ${error.message || error}`);
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  
  isCreatingAccount = false;
};

// Get the transporter (creates account if not exists)
export const getTransporter = async (): Promise<nodemailer.Transporter> => {
  if (!transporter) {
    try {
      await createEtherealAccount();
    } catch (error) {
      console.error("Error in getTransporter:", error);
      throw error;
    }
  }
  
  if (!transporter) {
    throw new Error("Failed to create email transporter - transporter is null");
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
