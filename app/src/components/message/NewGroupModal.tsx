"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Check, Search, Users, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCreateGroupConversationMutation,
  useGetCurrentUserQuery,
  useSearchUsersQuery,
} from "@/lib/generated";
import { useToast } from "@/app/context/toast-provider";
import { getInitials } from "./conversationUtils";

type SelectedUser = {
  id: string;
  username: string;
  profileImgUrl: string | null;
};

type Props = {
  onClose: () => void;
  onCreated: (conversationId: string) => void;
};

export default function NewGroupModal({ onClose, onCreated }: Props) {
  const [name, setName] = useState("");
  const [keyword, setKeyword] = useState("");
  const [selected, setSelected] = useState<SelectedUser[]>([]);
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { data: currentUserData } = useGetCurrentUserQuery();
  const currentUserId = currentUserData?.currUser?.id;

  const { data: searchData, isLoading: isSearching } = useSearchUsersQuery(
    { keyword },
    { enabled: keyword.trim().length >= 2 },
  );

  const createGroupConversation = useCreateGroupConversationMutation();

  const selectedIds = useMemo(
    () => new Set(selected.map((user) => user.id)),
    [selected],
  );

  const results = (searchData?.searchUsers ?? []).filter(
    (user) => user.id !== currentUserId && !selectedIds.has(user.id),
  );

  const addUser = (user: SelectedUser) => {
    setSelected((current) =>
      current.some((selectedUser) => selectedUser.id === user.id)
        ? current
        : [...current, user],
    );
    setKeyword("");
    setError(null);
  };

  const removeUser = (userId: string) => {
    setSelected((current) => current.filter((user) => user.id !== userId));
  };

  const handleCreate = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Give your group a name.");
      return;
    }
    if (selected.length === 0) {
      setError("Select at least one member.");
      return;
    }

    setError(null);

    try {
      const result = await createGroupConversation.mutateAsync({
        name: trimmedName,
        participantIds: selected.map((user) => user.id),
      });

      await queryClient.invalidateQueries({ queryKey: ["GetConversations"] });
      showToast({ title: "Group created", description: trimmedName });
      onCreated(result.createGroupConversation.id);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to create the group.",
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0d111b] text-slate-100 shadow-2xl shadow-black/40"
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-group-title"
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300 ring-1 ring-inset ring-indigo-400/20">
            <Users size={19} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="new-group-title" className="text-base font-semibold text-white">
              New group
            </h2>
            <p className="text-xs text-slate-400">
              Add people and give your group a name.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            <X size={17} />
          </button>
        </div>

        <div className="thin-scrollbar flex-1 overflow-y-auto px-5 py-4">
          <label className="block text-xs font-medium uppercase tracking-wide text-slate-500">
            Group name
          </label>
          <input
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setError(null);
            }}
            placeholder="Weekend plans"
            maxLength={100}
            className="mt-2 w-full rounded-xl border border-white/10 bg-[#080b12] px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-indigo-400/50"
          />

          {selected.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selected.map((user) => (
                <span
                  key={user.id}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] py-1 pl-1 pr-2.5 text-xs text-slate-200"
                >
                  <span className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-indigo-500/20 text-[10px] font-semibold text-indigo-200">
                    {user.profileImgUrl ? (
                      <Image
                        src={user.profileImgUrl}
                        alt={user.username}
                        width={24}
                        height={24}
                        className="h-6 w-6 rounded-full object-cover"
                      />
                    ) : (
                      getInitials(user.username)
                    )}
                  </span>
                  {user.username}
                  <button
                    type="button"
                    onClick={() => removeUser(user.id)}
                    aria-label={`Remove ${user.username}`}
                    className="text-slate-500 transition-colors hover:text-white"
                  >
                    <X size={13} />
                  </button>
                </span>
              ))}
            </div>
          )}

          <label className="mt-5 block text-xs font-medium uppercase tracking-wide text-slate-500">
            Add members
          </label>
          <div className="mt-2 flex items-center gap-2.5 rounded-xl border border-white/10 bg-[#080b12] px-3 py-2.5 focus-within:border-indigo-400/50">
            <Search size={15} className="shrink-0 text-slate-500" />
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Search by username"
              className="min-w-0 flex-1 bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
            />
          </div>

          {keyword.trim().length >= 2 && (
            <div className="mt-2 max-h-52 overflow-y-auto rounded-xl border border-white/10 bg-[#080b12] p-1">
              {isSearching ? (
                <p className="px-3 py-3 text-xs text-slate-500">Searching...</p>
              ) : results.length === 0 ? (
                <p className="px-3 py-3 text-xs text-slate-500">
                  No users found.
                </p>
              ) : (
                results.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => addUser(user)}
                    className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-white/[0.05]"
                  >
                    {user.profileImgUrl ? (
                      <Image
                        src={user.profileImgUrl}
                        alt={user.username}
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20 text-[11px] font-semibold text-indigo-200">
                        {getInitials(user.username)}
                      </span>
                    )}
                    <span className="min-w-0 flex-1 truncate text-sm text-slate-200">
                      {user.username}
                    </span>
                    <Check size={15} className="text-emerald-400" />
                  </button>
                ))
              )}
            </div>
          )}

          {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-white/10 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-white/[0.06]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleCreate()}
            disabled={createGroupConversation.isPending}
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-white/[0.07] disabled:text-slate-500"
          >
            {createGroupConversation.isPending ? "Creating..." : "Create group"}
          </button>
        </div>
      </div>
    </div>
  );
}
