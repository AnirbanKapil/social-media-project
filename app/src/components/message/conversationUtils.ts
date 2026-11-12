import type { ConversationRole, GetConversationsQuery } from "@/lib/generated";

export type ConversationSummary =
  GetConversationsQuery["getConversations"][number];

export type ConversationMemberSummary = ConversationSummary["members"][number];

type NamedUser = {
  username: string;
  firstName?: string | null;
  lastName?: string | null;
};

export function getMemberDisplayName(user: NamedUser): string {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
  return fullName || user.username;
}

export function getConversationDisplayName(
  conversation: ConversationSummary,
  currentUserId: string | null | undefined,
): string {
  if (conversation.isGroup) {
    return conversation.name?.trim() || "Group chat";
  }

  const otherParticipant = conversation.participants.find(
    (participant) => participant.id !== currentUserId,
  );

  return otherParticipant?.username ?? "Conversation";
}

export function getInitials(value: string): string {
  const words = value.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "??";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

export function canManageGroup(role: ConversationRole | null | undefined) {
  return role === "OWNER" || role === "ADMIN";
}

export function formatMemberCount(count: number): string {
  return count === 1 ? "1 member" : `${count} members`;
}
