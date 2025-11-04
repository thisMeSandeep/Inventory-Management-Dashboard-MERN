declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    NODE_ENV?: "development" | "production" | "test";
    // Add your other environment variables here
    // Example:
    // DATABASE_URL?: string;
    // JWT_SECRET?: string;
  }
}
