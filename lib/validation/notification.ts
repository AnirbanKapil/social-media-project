import { z } from "zod";
import { cursorSchema, idSchema, pageSizeSchema } from "./common";

export const markNotificationReadSchema = z.object({
  notificationId: idSchema,
});

export const getNotificationsSchema = z.object({
  first: pageSizeSchema.optional().default(20),
  after: cursorSchema,
  unreadOnly: z.boolean().optional().default(false),
});
