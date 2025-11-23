declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    CLIENT_URL: string;
    PROD_CLIENT_URL: string;
    NODE_ENV?: "development" | "production" | "test";
    MONGODB_URI: string;
    JWT_SECRET_KEY: string;
    EMAIL_USER?: string; // Optional - used for "from" field, has fallback
    SMTP_PASSWORD?: string; // No longer needed with Ethereal
    ACCESS_TOKEN_EXPIRY: string;
    REFRESH_TOKEN_EXPIRY: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
    CLOUDINARY_CLOUD: string;
    REDIS_URL: string;
    UPSTASH_REDIS_REST_URL?: string;
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: import("jsonwebtoken").JwtPayload | string;
    }
  }
}

export {};