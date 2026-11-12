import { z } from "zod";
import { idSchema } from "./common";

export const MAX_MESSAGE_LENGTH = 4000;
export const MAX_GROUP_NAME_LENGTH = 100;
export const MAX_GROUP_PARTICIPANTS = 100;

const uniqueIdsSchema = z
  .array(idSchema)
  .min(1, "Select at least one member")
  .max(
    MAX_GROUP_PARTICIPANTS,
    `You can select at most ${MAX_GROUP_PARTICIPANTS} members`,
  )
  .refine(
    (ids) => new Set(ids).size === ids.length,
    "Duplicate members are not allowed",
  );

export const messageContentSchema = z
  .string()
  .trim()
  .min(1, "Message cannot be empty")
  .max(
    MAX_MESSAGE_LENGTH,
    `Message must be at most ${MAX_MESSAGE_LENGTH} characters`,
  );

export const groupNameSchema = z
  .string()
  .trim()
  .min(1, "Group name is required")
  .max(
    MAX_GROUP_NAME_LENGTH,
    `Group name must be at most ${MAX_GROUP_NAME_LENGTH} characters`,
  );

export const createConversationSchema = z.object({ userId: idSchema });

export const createGroupConversationSchema = z.object({
  name: groupNameSchema,
  participantIds: uniqueIdsSchema,
});

export const addGroupMembersSchema = z.object({
  conversationId: idSchema,
  userIds: uniqueIdsSchema,
});

export const removeGroupMemberSchema = z.object({
  conversationId: idSchema,
  userId: idSchema,
});

export const assignableConversationRoleSchema = z.enum(["ADMIN", "MEMBER"]);

export const setMemberRoleSchema = z.object({
  conversationId: idSchema,
  userId: idSchema,
  role: assignableConversationRoleSchema,
});

export const renameGroupSchema = z.object({
  conversationId: idSchema,
  name: groupNameSchema,
});

export const transferOwnershipSchema = z.object({
  conversationId: idSchema,
  userId: idSchema,
});

export const leaveGroupSchema = z.object({ conversationId: idSchema });

export const sendMessageSchema = z.object({
  conversationId: idSchema,
  content: messageContentSchema,
});

export const conversationIdArgsSchema = z.object({ conversationId: idSchema });
