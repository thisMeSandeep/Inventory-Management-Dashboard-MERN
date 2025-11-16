import { createClient } from "redis";

const redis: ReturnType<typeof createClient> = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.error("Too many Redis connection retries");
        return new Error("Too many retries");
      }
      return retries * 500;
    },
  },
});

redis.on("error", (err) => console.log("Redis Client Error", err));

redis.on("connect", () => {
  console.log("Connected to Redis");
});

export const connectRedis = async () => {
  try {
    if (!redis.isOpen) {
      await redis.connect();
      console.log("Redis connection established");
    }
  } catch (error) {
    console.error("Failed to connect to Redis", error);
    throw error;
  }
};

export default redis;
