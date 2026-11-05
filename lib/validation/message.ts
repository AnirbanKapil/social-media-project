import { z } from "zod";
import { idSchema } from "./common";

export const MAX_MESSAGE_LENGTH = 4000;

export const messageContentSchema = z
  .string()
  .trim()
  .min(1, "Message cannot be empty")
  .max(
    MAX_MESSAGE_LENGTH,
    `Message must be at most ${MAX_MESSAGE_LENGTH} characters`,
  );

export const createConversationSchema = z.object({ userId: idSchema });

export const sendMessageSchema = z.object({
  conversationId: idSchema,
  content: messageContentSchema,
});

export const conversationIdArgsSchema = z.object({ conversationId: idSchema });
