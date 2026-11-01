import {
  createHmac,
  timingSafeEqual,
} from "node:crypto";

export type RealtimeTokenPayload = {
  userId: string;
  expiresAt: number;
};

function getSecret(): string {
  const secret = process.env.REALTIME_AUTH_SECRET;
  if (!secret) {
    throw new Error("Missing REALTIME_AUTH_SECRET");
  }
  return secret;
}

function encode(value: string): string {
  return Buffer.from(value).toString("base64url");
}

function decode(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signPayload(payload: string): string {
  return createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");
}

export function createRealtimeToken(
  userId: string,
  lifetimeSeconds = 300,
): string {
  const payload: RealtimeTokenPayload = {
    userId,
    expiresAt: Date.now() + lifetimeSeconds * 1000,
  };
  const encodedPayload = encode(JSON.stringify(payload));
  return `${encodedPayload}.${signPayload(encodedPayload)}`;
}

export function verifyRealtimeToken(token: string): RealtimeTokenPayload {
  const parts = token.split(".");
  if (parts.length !== 2) {
    throw new Error("Invalid realtime token");
  }

  const [encodedPayload, signature] = parts;
  const expectedSignature = signPayload(encodedPayload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    throw new Error("Invalid realtime token signature");
  }

  const payload = JSON.parse(decode(encodedPayload)) as RealtimeTokenPayload;
  if (
    typeof payload.userId !== "string" ||
    payload.userId.length === 0 ||
    typeof payload.expiresAt !== "number" ||
    payload.expiresAt <= Date.now()
  ) {
    throw new Error("Expired or invalid realtime token");
  }

  return payload;
}
