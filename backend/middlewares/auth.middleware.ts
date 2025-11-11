import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //   extract token from cookie
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    //   verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY!
    ) as JwtPayload;

    //   attach user to request
    req.user = decoded;

    next();
  } catch (error) {
    if (error) {
      return res.status(401).json({
        success: false,
        message: "Access token expired",
        error: "TOKEN_EXPIRED",
      });
    }
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

export default authMiddleware;
