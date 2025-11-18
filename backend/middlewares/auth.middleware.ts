import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { generateJwtToken } from "@/utils/generateJwtToken.js";
import { getCookieOptions } from "@/constants/cookieOption.js";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies.accessToken;
    
    if (!accessToken) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    
    try {
      const decoded = jwt.verify(
        accessToken,
        process.env.JWT_SECRET_KEY!
      ) as JwtPayload;

      req.user = decoded;
      return next();
      
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        const refreshToken = req.cookies.refreshToken;
        
        if (!refreshToken) {
          return res.status(401).json({
            success: false,
            message: "Access token expired",
            error: "TOKEN_EXPIRED",
          });
        }
        
        try {
          const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_SECRET_KEY!
          ) as JwtPayload;
          
          const { id, role } = decoded;
          
          const newAccessToken = generateJwtToken(
            id,
            role,
            process.env.ACCESS_TOKEN_EXPIRY!
          );
          
          //refresh access token - 15min
          res.cookie("accessToken", newAccessToken, getCookieOptions(15 * 60 * 1000));
          
          req.user = { id, role };
          return next();
          
        } catch (refreshError: any) {
          return res.status(401).json({
            success: false,
            message: refreshError.name === "TokenExpiredError"
              ? "Refresh token expired" 
              : "Invalid refresh token",
          });
        }
      }
      
      return res.status(403).json({
        success: false,
        message: "Invalid token",
      });
    }
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default authMiddleware;
