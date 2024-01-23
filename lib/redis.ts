import { Redis } from "ioredis";

const globalForRedis = global as unknown as { redis: Redis };

export const RedisClient =
  globalForRedis.redis ||
  new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
    username: process.env.REDIS_USER,
    password: process.env.REDIS_PASSWORD,
    db: Number(process.env.REDIS_DB) || 0,
  });

if (process.env.NODE_ENV !== "production") globalForRedis.redis = RedisClient;

export default RedisClient;
