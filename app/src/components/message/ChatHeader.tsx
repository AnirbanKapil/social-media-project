
import { ArrowLeft, UserRound } from "lucide-react";

type Props = {
  username: string | null | undefined;
  onBack?: () => void;
};

export default function ChatHeader({ username, onBack }: Props) {
  const displayName = username ?? "Conversation";

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
        <UserRound size={18} />
      </div>
      <div className="min-w-0">
        <h2 className="truncate text-sm font-semibold text-white">{displayName}</h2>
        <p className="mt-0.5 text-xs text-slate-400">Messages with this person</p>
      </div>
    </header>
  );
}