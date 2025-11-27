import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type Email = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export const sendMail = async ({ to, subject, text, html }: Email) => {
  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject,
      text,
      html,
    });

    if (data.error) {
      console.error("Resend API Error:", data.error);
      throw new Error(data.error.message);
    }

    return data;
  } catch (err) {
    console.error("Error sending email:", err);
    throw err;
  }
};
