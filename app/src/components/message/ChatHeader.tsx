
import { ArrowLeft, Settings, UserRound, Users } from "lucide-react";
import {
  formatMemberCount,
  getConversationDisplayName,
  type ConversationSummary,
} from "./conversationUtils";

type Props = {
  conversation: ConversationSummary;
  currentUserId: string | null | undefined;
  onBack?: () => void;
  onOpenSettings?: () => void;
};

export default function ChatHeader({
  conversation,
  currentUserId,
  onBack,
  onOpenSettings,
}: Props) {
  const displayName = getConversationDisplayName(conversation, currentUserId);
  const subtitle = conversation.isGroup
    ? formatMemberCount(conversation.memberCount)
    : "Messages with this person";

  return (
    <header className="flex items-center gap-3 border-b border-white/10 px-5 py-4 sm:px-7">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to messages"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/[0.05] hover:text-white"
        >
          <ArrowLeft size={18} />
        </button>
      )}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400/30 to-violet-500/20 text-indigo-100 ring-1 ring-inset ring-white/10">
        {conversation.isGroup ? <Users size={18} /> : <UserRound size={18} />}
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-sm font-semibold text-white">{displayName}</h2>
        <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>
      </div>
      {conversation.isGroup && onOpenSettings && (
        <button
          type="button"
          onClick={onOpenSettings}
          aria-label="Open group settings"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/[0.05] hover:text-white"
        >
          <Settings size={18} />
        </button>
      )}
    </header>
  );
}
