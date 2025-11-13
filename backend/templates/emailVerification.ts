export const emailVerificationTemplate = (
  token: number,
  name: string,
  expiry_minutes: number
) => {
  return `
    <!DOCTYPE html>
<html>
<head>
    <title>Email Verification</title>
</head>
<body>
    <h1>Hello, ${name}!</h1>
    <p>Thank you for signing up. Your One-Time Password (OTP) is:</p>
    <p style="font-size: 24px; font-weight: bold;">${token}</p>
    <p>This OTP is valid for the next ${expiry_minutes} minutes.</p>
    <p>If you did not request this, please ignore this email.</p>
    <p>Best regards,</p>
    <p>Your Application Team</p>
</body>
</html>
    `;
};
