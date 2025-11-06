import { transporter } from "@/config/nodemailer.js";

type Email = {
    to: string;
    subject: string;
    text: string;
    html: string;
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
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (err) {
    console.error("❌ Error sending email:", err);
    throw err;
  }
};
