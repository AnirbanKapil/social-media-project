import "dotenv/config";
import { Redis } from "@upstash/redis";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!url || !token) {
  console.error(
    "Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN in .env",
  );
  process.exit(1);
}

const redis = new Redis({ url, token });

async function checkRedisTransport() {
  const ping = await redis.ping();

  if (ping !== "PONG") {
    throw new Error(`Unexpected Redis ping response: ${String(ping)}`);
  }

  const channel = "realtime:transport-check";
  const subscriberCount = await redis.publish(
    channel,
    JSON.stringify({
      type: "transport.check",
      checkedAt: new Date().toISOString(),
    }),
  );

  console.log("Redis ping: PONG");
  console.log(`Publish channel: ${channel}`);
  console.log(`Subscriber count: ${subscriberCount}`);
}

checkRedisTransport().catch((error) => {
  console.error("Redis transport check failed:", error);
  process.exit(1);
});
