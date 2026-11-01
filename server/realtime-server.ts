import "dotenv/config";
import express from "express";
import Redis from "ioredis";
import { verifyRealtimeToken } from "./realtime-token";

type SseResponse = import("express").Response;

type RealtimeEvent = {
  type: "message.created" | "notification.created";
  recipientId: string;
  recordId: string;
  conversationId?: string;
};

const redisUrl = process.env.REDIS_URL;
const secret = process.env.REALTIME_AUTH_SECRET;
const port = Number(process.env.REALTIME_PORT ?? 4001);

if (!redisUrl) {
  throw new Error("Missing REDIS_URL");
}
if (!secret) {
  throw new Error("Missing REALTIME_AUTH_SECRET");
}
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("REALTIME_PORT must be a valid port number");
}

const app = express();
const allowedOrigin = process.env.REALTIME_ALLOWED_ORIGIN;

app.use((request, response, next) => {
  if (allowedOrigin) {
    response.setHeader("Access-Control-Allow-Origin", allowedOrigin);
    response.setHeader("Vary", "Origin");
  }

  if (request.method === "OPTIONS") {
    response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Cache-Control");
    response.status(204).end();
    return;
  }

  next();
});
const subscriber = new Redis(redisUrl, {
  lazyConnect: false,
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
});

const connections = new Map<string, Set<SseResponse>>();
let redisReady = false;

subscriber.on("ready", () => {
  redisReady = true;
  console.log("Realtime Redis subscriber is ready");
});

subscriber.on("error", (error) => {
  redisReady = false;
  console.error("Realtime Redis subscriber error:", error);
});

subscriber.on("end", () => {
  redisReady = false;
  console.warn("Realtime Redis subscriber disconnected");
});

function addConnection(userId: string, response: SseResponse): void {
  const userConnections = connections.get(userId) ?? new Set<SseResponse>();
  userConnections.add(response);
  connections.set(userId, userConnections);
}

function removeConnection(userId: string, response: SseResponse): void {
  const userConnections = connections.get(userId);
  if (!userConnections) return;

  userConnections.delete(response);
  if (userConnections.size === 0) {
    connections.delete(userId);
  }
}

app.get("/health", (_request, response) => {
  response.json({
    status: redisReady ? "ok" : "degraded",
    redisReady,
    connectedUsers: connections.size,
  });
});

app.get("/events", (request, response) => {
  const token = request.query.token;
  if (typeof token !== "string") {
    response.status(401).json({ error: "Realtime token required" });
    return;
  }

  let userId: string;
  try {
    userId = verifyRealtimeToken(token).userId;
  } catch (error) {
    response.status(401).json({
      error: error instanceof Error ? error.message : "Invalid realtime token",
    });
    return;
  }

  response.status(200);
  response.setHeader("Content-Type", "text/event-stream");
  response.setHeader("Cache-Control", "no-cache, no-transform");
  response.setHeader("Connection", "keep-alive");
  response.setHeader("X-Accel-Buffering", "no");
  response.flushHeaders();
  response.write(": connected\n\n");

  addConnection(userId, response);

  request.on("close", () => {
    removeConnection(userId, response);
  });
});

subscriber.psubscribe("realtime:user:*").catch((error) => {
  console.error("Failed to subscribe to realtime Redis channels:", error);
});

subscriber.on("pmessage", (_pattern, channel, message) => {
  let event: RealtimeEvent;
  try {
    event = JSON.parse(message) as RealtimeEvent;
  } catch {
    console.error(`Ignoring malformed realtime event from ${channel}`);
    return;
  }

  if (
    (event.type !== "message.created" &&
      event.type !== "notification.created") ||
    typeof event.recipientId !== "string" ||
    typeof event.recordId !== "string"
  ) {
    console.error(`Ignoring invalid realtime event from ${channel}`);
    return;
  }

  const recipientConnections = connections.get(event.recipientId);
  if (!recipientConnections) return;

  for (const connection of recipientConnections) {
    if (connection.writableEnded) {
      continue;
    }

    connection.write(`event: ${event.type}\n`);
    connection.write(`data: ${JSON.stringify(event)}\n\n`);
  }
});

const heartbeat = setInterval(() => {
  for (const userConnections of connections.values()) {
    for (const connection of userConnections) {
      if (!connection.writableEnded) {
        connection.write(": keepalive\n\n");
      }
    }
  }
}, 25_000);

heartbeat.unref();

const server = app.listen(port, () => {
  console.log(`Realtime SSE server listening on port ${port}`);
});

async function shutdown(): Promise<void> {
  clearInterval(heartbeat);
  server.close();

  for (const userConnections of connections.values()) {
    for (const connection of userConnections) {
      connection.end();
    }
  }
  connections.clear();

  await subscriber.quit().catch(() => subscriber.disconnect());
  process.exit(0);
}

process.once("SIGINT", () => {
  void shutdown();
});

process.once("SIGTERM", () => {
  void shutdown();
});
