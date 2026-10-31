import { Redis } from "@upstash/redis";

const globalForRedis = global as typeof globalThis & {
  upstashRedis?: Redis;
};

export function getRedisClient(): Redis {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error(
      "Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN",
    );
  }

  if (!globalForRedis.upstashRedis) {
    globalForRedis.upstashRedis = new Redis({ url, token });
  }

  return globalForRedis.upstashRedis;
}
