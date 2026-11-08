import crypto from "crypto";
import { getRedisClient } from "./redis";

const RESET_TOKEN_TTL_SECONDS = 30 * 60;
const RESET_TOKEN_PREFIX = "pwreset:token:";
const RESET_USER_PREFIX = "pwreset:user:";
const RATE_LIMIT_PREFIX = "pwreset:rate:";
const RATE_LIMIT_WINDOW_SECONDS = 60 * 60;
const RATE_LIMIT_MAX_REQUESTS = 3;

export function generateResetToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function hashResetToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function tokenKey(tokenHash: string): string {
  return `${RESET_TOKEN_PREFIX}${tokenHash}`;
}

function userKey(userId: string): string {
  return `${RESET_USER_PREFIX}${userId}`;
}

export async function storeResetToken(userId: string): Promise<string> {
  const redis = getRedisClient();
  const rawToken = generateResetToken();
  const tokenHash = hashResetToken(rawToken);

  const previousHash = await redis.get<string>(userKey(userId));

  const pipeline = redis.pipeline();
  if (previousHash) {
    pipeline.del(tokenKey(previousHash));
  }
  pipeline.set(tokenKey(tokenHash), userId, { ex: RESET_TOKEN_TTL_SECONDS });
  pipeline.set(userKey(userId), tokenHash, { ex: RESET_TOKEN_TTL_SECONDS });
  await pipeline.exec();

  return rawToken;
}

export async function consumeResetToken(rawToken: string): Promise<string | null> {
  const redis = getRedisClient();
  const tokenHash = hashResetToken(rawToken);

  const userId = await redis.get<string>(tokenKey(tokenHash));
  if (!userId) {
    return null;
  }

  const currentHash = await redis.get<string>(userKey(userId));

  const pipeline = redis.pipeline();
  pipeline.del(tokenKey(tokenHash));
  if (currentHash === tokenHash) {
    pipeline.del(userKey(userId));
  }
  await pipeline.exec();

  return userId;
}

export async function isRateLimited(identifier: string): Promise<boolean> {
  const redis = getRedisClient();
  const key = `${RATE_LIMIT_PREFIX}${identifier}`;

  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, RATE_LIMIT_WINDOW_SECONDS);
  }

  return count > RATE_LIMIT_MAX_REQUESTS;
}
