declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    NODE_ENV?: "development" | "production" | "test";
    MONGODB_URI: string;
    // JWT_SECRET?: string;
    EMAIL_USER: string;
    SMTP_PASSWORD: string;
    JWT_SECRET_KEY: string;
    ACCESS_TOKEN_EXPIRY: string;
    REFRESH_TOKEN_EXPIRY: string;
  }
}
