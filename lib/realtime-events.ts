import { getRedisClient } from "./redis";

export type RealtimeEvent =
  | {
      type: "message.created";
      recipientId: string;
      recordId: string;
      conversationId: string;
    }
  | {
      type: "notification.created";
      recipientId: string;
      recordId: string;
    };

export async function publishRealtimeEvent(
  event: RealtimeEvent,
): Promise<boolean> {
  try {
    const channel = `realtime:user:${event.recipientId}`;
    await getRedisClient().publish(channel, JSON.stringify(event));
    return true;
  } catch (error) {
    console.error(
      `Failed to publish Redis event "${event.type}" for recipient "${event.recipientId}":`,
      error,
    );
    return false;
  }
}
