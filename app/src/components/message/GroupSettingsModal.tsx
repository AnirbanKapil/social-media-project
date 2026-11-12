"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Crown,
  Plus,
  Search,
  Shield,
  Trash2,
  UserMinus,
  Users,
  X,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAddGroupMembersMutation,
  useDeleteGroupMutation,
  useLeaveGroupMutation,
  useRemoveGroupMemberMutation,
  useRenameGroupMutation,
  useSearchUsersQuery,
  useSetMemberRoleMutation,
  useTransferOwnershipMutation,
  type ConversationRole,
} from "@/lib/generated";
import { useToast } from "@/app/context/toast-provider";
import {
  canManageGroup,
  formatMemberCount,
  getInitials,
  getMemberDisplayName,
  type ConversationSummary,
} from "./conversationUtils";

type Props = {
  conversation: ConversationSummary;
  currentUserId: string | null | undefined;
  onClose: () => void;
  onExited: () => void;
};

const ROLE_LABELS: Record<ConversationRole, string> = {
  OWNER: "Owner",
  ADMIN: "Admin",
  MEMBER: "Member",
};

export default function GroupSettingsModal({
  conversation,
  currentUserId,
  onClose,
  onExited,
}: Props) {
  const [name, setName] = useState(conversation.name ?? "");
  const [addKeyword, setAddKeyword] = useState("");
  const [transferTargetId, setTransferTargetId] = useState<string | null>(null);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const renameGroup = useRenameGroupMutation();
  const addMembers = useAddGroupMembersMutation();
  const removeMember = useRemoveGroupMemberMutation();
  const setMemberRole = useSetMemberRoleMutation();
  const transferOwnership = useTransferOwnershipMutation();
  const leaveGroup = useLeaveGroupMutation();
  const deleteGroup = useDeleteGroupMutation();

  const viewerRole = conversation.myRole;
  const isOwner = viewerRole === "OWNER";
  const isManager = canManageGroup(viewerRole);

  const { data: searchData, isLoading: isSearching } = useSearchUsersQuery(
    { keyword: addKeyword },
    { enabled: isManager && addKeyword.trim().length >= 2 },
  );

  const memberIds = useMemo(
    () => new Set(conversation.members.map((member) => member.user.id)),
    [conversation.members],
  );

  const addResults = (searchData?.searchUsers ?? []).filter(
    (user) => user.id !== currentUserId && !memberIds.has(user.id),
  );

  const isBusy =
    renameGroup.isPending ||
    addMembers.isPending ||
    removeMember.isPending ||
    setMemberRole.isPending ||
    transferOwnership.isPending ||
    leaveGroup.isPending ||
    deleteGroup.isPending;

  const refresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["GetConversations"] }),
      queryClient.invalidateQueries({ queryKey: ["GetMessages"] }),
      queryClient.invalidateQueries({ queryKey: ["UnreadMessageCount"] }),
    ]);
  };

  const run = async (
    action: () => Promise<unknown>,
    options?: { success?: string; exit?: boolean },
  ) => {
    setError(null);
    try {
      await action();
      await refresh();
      if (options?.success) {
        showToast({ title: options.success });
      }
      if (options?.exit) {
        onExited();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
    }
  };

  const handleRename = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Group name cannot be empty.");
      return;
    }
    void run(
      () =>
        renameGroup.mutateAsync({
          conversationId: conversation.id,
          name: trimmedName,
        }),
      { success: "Group renamed" },
    );
  };

  const handleAdd = (userId: string) => {
    void run(
      () =>
        addMembers.mutateAsync({
          conversationId: conversation.id,
          userIds: [userId],
        }),
      { success: "Member added" },
    );
    setAddKeyword("");
  };

  const handleRemove = (userId: string) => {
    void run(
      () =>
        removeMember.mutateAsync({
          conversationId: conversation.id,
          userId,
        }),
      { success: "Member removed" },
    );
  };

  const handleRoleChange = (userId: string, role: ConversationRole) => {
    if (role === "OWNER") return;
    void run(
      () =>
        setMemberRole.mutateAsync({
          conversationId: conversation.id,
          userId,
          role,
        }),
      { success: role === "ADMIN" ? "Promoted to admin" : "Demoted to member" },
    );
  };

  const handleTransfer = (userId: string) => {
    void run(
      () =>
        transferOwnership.mutateAsync({
          conversationId: conversation.id,
          userId,
        }),
      { success: "Ownership transferred" },
    );
    setTransferTargetId(null);
  };

  const handleLeave = () => {
    void run(
      () =>
        leaveGroup.mutateAsync({
          conversationId: conversation.id,
        }),
      { success: "You left the group", exit: true },
    );
  };

  const handleDelete = () => {
    void run(
      () =>
        deleteGroup.mutateAsync({
          conversationId: conversation.id,
        }),
      { success: "Group deleted", exit: true },
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0d111b] text-slate-100 shadow-2xl shadow-black/40"
        role="dialog"
        aria-modal="true"
        aria-labelledby="group-settings-title"
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300 ring-1 ring-inset ring-indigo-400/20">
            <Users size={19} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="group-settings-title" className="text-base font-semibold text-white">
              Group settings
            </h2>
            <p className="truncate text-xs text-slate-400">
              {conversation.name?.trim() || "Group chat"} ·{" "}
              {formatMemberCount(conversation.memberCount)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close group settings"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            <X size={17} />
          </button>
        </div>

        <div className="thin-scrollbar flex-1 space-y-6 overflow-y-auto px-5 py-5">
          {isManager && (
            <section>
              <h3 className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Group name
              </h3>
              <div className="mt-2 flex items-center gap-2">
                <input
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setError(null);
                  }}
                  maxLength={100}
                  className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#080b12] px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-indigo-400/50"
                />
                <button
                  type="button"
                  onClick={handleRename}
                  disabled={
                    renameGroup.isPending || name.trim() === (conversation.name ?? "")
                  }
                  className="rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-white/[0.07] disabled:text-slate-500"
                >
                  Save
                </button>
              </div>
            </section>
          )}

          <section>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Members
              </h3>
              <span className="text-xs text-slate-500">
                {formatMemberCount(conversation.memberCount)}
              </span>
            </div>

            <ul className="mt-3 divide-y divide-white/[0.06]">
              {conversation.members.map((member) => {
                const isSelf = member.user.id === currentUserId;
                const memberIsOwner = member.role === "OWNER";
                const canChangeRole = isOwner && !isSelf && !memberIsOwner;
                const canRemove =
                  !isSelf &&
                  !memberIsOwner &&
                  (isOwner ||
                    (viewerRole === "ADMIN" && member.role === "MEMBER"));
                const canTransfer = isOwner && !isSelf && !memberIsOwner;

                return (
                  <li key={member.user.id} className="py-3">
                    <div className="flex items-center gap-3">
                      {member.user.profileImgUrl ? (
                        <Image
                          src={member.user.profileImgUrl}
                          alt={member.user.username}
                          width={38}
                          height={38}
                          className="h-[38px] w-[38px] rounded-full object-cover"
                        />
                      ) : (
                        <span className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-gradient-to-br from-indigo-400/30 to-violet-500/20 text-xs font-semibold text-indigo-100 ring-1 ring-inset ring-white/10">
                          {getInitials(getMemberDisplayName(member.user))}
                        </span>
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-100">
                          {getMemberDisplayName(member.user)}
                          {isSelf && (
                            <span className="ml-1.5 text-xs text-slate-500">(you)</span>
                          )}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          @{member.user.username}
                        </p>
                      </div>

                      <RoleBadge role={member.role} />

                      {canChangeRole && (
                        <select
                          value={member.role}
                          onChange={(event) =>
                            handleRoleChange(
                              member.user.id,
                              event.target.value as ConversationRole,
                            )
                          }
                          disabled={isBusy}
                          aria-label={`Change role for ${member.user.username}`}
                          className="rounded-lg border border-white/10 bg-[#080b12] px-2 py-1 text-xs text-slate-200 outline-none focus:border-indigo-400/50 disabled:opacity-50"
                        >
                          <option value="ADMIN">Admin</option>
                          <option value="MEMBER">Member</option>
                        </select>
                      )}

                      {canTransfer && (
                        <button
                          type="button"
                          onClick={() =>
                            setTransferTargetId((current) =>
                              current === member.user.id ? null : member.user.id,
                            )
                          }
                          disabled={isBusy}
                          title="Transfer ownership"
                          aria-label={`Transfer ownership to ${member.user.username}`}
                          className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-amber-500/10 hover:text-amber-300 disabled:opacity-50"
                        >
                          <Crown size={16} />
                        </button>
                      )}

                      {canRemove && (
                        <button
                          type="button"
                          onClick={() => handleRemove(member.user.id)}
                          disabled={isBusy}
                          title="Remove from group"
                          aria-label={`Remove ${member.user.username} from group`}
                          className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-rose-500/10 hover:text-rose-300 disabled:opacity-50"
                        >
                          <UserMinus size={16} />
                        </button>
                      )}
                    </div>

                    {transferTargetId === member.user.id && (
                      <div className="mt-2 flex items-center justify-between gap-3 rounded-lg border border-amber-400/20 bg-amber-500/5 px-3 py-2">
                        <p className="text-xs text-amber-200">
                          Make {member.user.username} the owner? You will become an admin.
                        </p>
                        <div className="flex shrink-0 items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setTransferTargetId(null)}
                            className="rounded-md px-2 py-1 text-xs text-slate-300 hover:bg-white/[0.06]"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleTransfer(member.user.id)}
                            disabled={isBusy}
                            className="rounded-md bg-amber-500 px-2.5 py-1 text-xs font-medium text-black hover:bg-amber-400 disabled:opacity-50"
                          >
                            Confirm
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>

          {isManager && (
            <section>
              <h3 className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Add members
              </h3>
              <div className="mt-2 flex items-center gap-2.5 rounded-xl border border-white/10 bg-[#080b12] px-3 py-2.5 focus-within:border-indigo-400/50">
                <Search size={15} className="shrink-0 text-slate-500" />
                <input
                  value={addKeyword}
                  onChange={(event) => setAddKeyword(event.target.value)}
                  placeholder="Search by username"
                  className="min-w-0 flex-1 bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
                />
              </div>

              {addKeyword.trim().length >= 2 && (
                <div className="mt-2 max-h-44 overflow-y-auto rounded-xl border border-white/10 bg-[#080b12] p-1">
                  {isSearching ? (
                    <p className="px-3 py-3 text-xs text-slate-500">Searching...</p>
                  ) : addResults.length === 0 ? (
                    <p className="px-3 py-3 text-xs text-slate-500">
                      No users available to add.
                    </p>
                  ) : (
                    addResults.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => handleAdd(user.id)}
                        disabled={addMembers.isPending}
                        className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-white/[0.05] disabled:opacity-50"
                      >
                        {user.profileImgUrl ? (
                          <Image
                            src={user.profileImgUrl}
                            alt={user.username}
                            width={30}
                            height={30}
                            className="h-[30px] w-[30px] rounded-full object-cover"
                          />
                        ) : (
                          <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-indigo-500/20 text-[10px] font-semibold text-indigo-200">
                            {getInitials(user.username)}
                          </span>
                        )}
                        <span className="min-w-0 flex-1 truncate text-sm text-slate-200">
                          {user.username}
                        </span>
                        <Plus size={15} className="text-emerald-400" />
                      </button>
                    ))
                  )}
                </div>
              )}
            </section>
          )}

          {error && <p className="text-sm text-rose-400">{error}</p>}
        </div>

        <div className="space-y-2 border-t border-white/10 px-5 py-4">
          {isOwner ? (
            <p className="text-xs text-slate-500">
              Transfer ownership or delete the group to leave it.
            </p>
          ) : confirmLeave ? (
            <div className="flex items-center justify-between gap-3 rounded-lg border border-rose-400/20 bg-rose-500/5 px-3 py-2">
              <p className="text-xs text-rose-200">Leave this group?</p>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmLeave(false)}
                  className="rounded-md px-2 py-1 text-xs text-slate-300 hover:bg-white/[0.06]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleLeave}
                  disabled={isBusy}
                  className="rounded-md bg-rose-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-rose-500 disabled:opacity-50"
                >
                  Leave
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmLeave(true)}
              disabled={isBusy}
              className="w-full rounded-lg border border-white/10 px-4 py-2.5 text-sm text-slate-300 transition-colors hover:bg-white/[0.06] disabled:opacity-50"
            >
              Leave group
            </button>
          )}

          {isOwner &&
            (confirmDelete ? (
              <div className="flex items-center justify-between gap-3 rounded-lg border border-rose-400/20 bg-rose-500/5 px-3 py-2">
                <p className="text-xs text-rose-200">
                  Delete this group for everyone? This cannot be undone.
                </p>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="rounded-md px-2 py-1 text-xs text-slate-300 hover:bg-white/[0.06]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isBusy}
                    className="rounded-md bg-rose-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-rose-500 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                disabled={isBusy}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-rose-400/20 px-4 py-2.5 text-sm text-rose-300 transition-colors hover:bg-rose-500/10 disabled:opacity-50"
              >
                <Trash2 size={15} />
                Delete group
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}

function RoleBadge({ role }: { role: ConversationRole }) {
  if (role === "OWNER") {
    return (
      <span className="flex shrink-0 items-center gap-1 rounded-full bg-amber-500/10 px-2 py-1 text-[11px] font-medium text-amber-300 ring-1 ring-inset ring-amber-400/20">
        <Crown size={11} />
        {ROLE_LABELS[role]}
      </span>
    );
  }

  if (role === "ADMIN") {
    return (
      <span className="flex shrink-0 items-center gap-1 rounded-full bg-indigo-500/10 px-2 py-1 text-[11px] font-medium text-indigo-300 ring-1 ring-inset ring-indigo-400/20">
        <Shield size={11} />
        {ROLE_LABELS[role]}
      </span>
    );
  }

  return (
    <span className="shrink-0 rounded-full bg-white/[0.06] px-2 py-1 text-[11px] font-medium text-slate-400">
      {ROLE_LABELS[role]}
    </span>
  );
}
