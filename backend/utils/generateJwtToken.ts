import jwt, { SignOptions } from "jsonwebtoken";

export const generateJwtToken = (id: string, role: string, expiry: string) => {
  const payload = {
    id,
    role,
  };

  const options: SignOptions = {
    expiresIn: expiry as any,
  };

  return jwt.sign(payload, process.env.JWT_SECRET_KEY!, options);
};
