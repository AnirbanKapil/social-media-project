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
): Promise<number | null> {
  try {
    const channel = `realtime:user:${event.recipientId}`;
    const subscriberCount = await getRedisClient().publish(
      channel,
      JSON.stringify(event),
    );
    return subscriberCount;
  } catch (error) {
    console.error(
      `Failed to publish Redis event "${event.type}" for recipient "${event.recipientId}":`,
      error,
    );
    return null;
  }
}
