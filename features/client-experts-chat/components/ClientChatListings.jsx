"use client";

import { useCallback, useMemo } from "react";
import { MessageCircle } from "lucide-react";
import {
  cn,
  getChatTimestamp,
  nameInitials,
  normalizeThreadId,
} from "@/lib/utils";
import { useClientChatContext } from "../state/ClientChatContext";

export default function ClientChatListings({
  searchQuery,
  selectedThreadId,
  onSelectThread,
}) {
  const { threads, socket, dispatch } = useClientChatContext();

  const sendSocketJoin = useCallback(
    (threadId) => {
      if (!socket) return;
      const payload = JSON.stringify({ type: "join", threadId });
      const trySend = () => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(payload);
        }
      };
      if (socket.readyState === WebSocket.OPEN) {
        trySend();
        return;
      }
      if (socket.readyState === WebSocket.CONNECTING) {
        socket.addEventListener("open", trySend, { once: true });
      }
    },
    [socket],
  );

  const selectChat = useCallback(
    (doc) => {
      const threadId = normalizeThreadId(
        doc?._id ?? doc?.id ?? doc?.threadId ?? doc?.thread?._id,
      );
      if (!threadId) return;
      dispatch({ type: "clear-ui-error" });
      dispatch({ type: "clear-unread", payload: { threadId } });
      onSelectThread(threadId);
      sendSocketJoin(threadId);
    },
    [dispatch, onSelectThread, sendSocketJoin],
  );

  const filteredThreads = useMemo(() => {
    const q = (searchQuery || "").trim();
    if (!q) return threads;
    try {
      const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      return threads.filter((thread) => re.test(thread?.coach?.name || ""));
    } catch {
      return threads.filter((thread) =>
        (thread?.coach?.name || "").toLowerCase().includes(q.toLowerCase()),
      );
    }
  }, [searchQuery, threads]);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
      {filteredThreads.map((chat) => {
        const rowId = normalizeThreadId(
          chat?._id ?? chat?.id ?? chat?.threadId,
        );
        const unread = Math.max(0, Number(chat?.unreadForClient) || 0);
        const hasUnread = unread > 0;
        const isSelected = Boolean(
          selectedThreadId && rowId && selectedThreadId === rowId,
        );
        return (
          <button
            key={rowId || JSON.stringify(chat)}
            type="button"
            onClick={() => selectChat(chat)}
            className={cn(
              "flex w-full items-start gap-4 border-b border-gray-50 p-4 text-left transition-colors last:border-0 hover:bg-gray-50",
              isSelected &&
                "bg-gray-50 ring-1 ring-inset ring-gray-200/80",
              hasUnread && !isSelected && "border-l-4 border-l-[var(--brand-primary)] bg-lime-50/60",
              hasUnread && isSelected && "border-l-4 border-l-[var(--brand-primary)]",
            )}
          >
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-200">
              {chat?.coach?.profilePhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={chat.coach.profilePhoto}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-xs font-semibold text-gray-600">
                  {nameInitials(chat?.coach?.name || "Expert")}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-baseline justify-between gap-2">
                <h3
                  className={cn(
                    "truncate pr-2 text-gray-900",
                    hasUnread ? "font-semibold" : "font-bold",
                  )}
                >
                  {chat?.coach?.name || "Expert"}
                </h3>
                <span className="flex shrink-0 items-center gap-1.5">
                  {hasUnread ? (
                    <span className="rounded-full bg-[var(--brand-primary)] px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                      {unread > 9 ? "9+" : unread}
                    </span>
                  ) : null}
                  <span className="text-xs font-medium text-gray-400">
                    {getChatTimestamp(chat?.lastMessageAt)}
                  </span>
                </span>
              </div>
              <p
                className={cn(
                  "truncate pr-4 text-sm",
                  hasUnread ? "font-medium text-gray-900" : "text-gray-500",
                )}
              >
                {chat?.lastMessagePreview || "—"}
              </p>
            </div>
          </button>
        );
      })}
      {filteredThreads.length === 0 && (
        <div className="flex h-full min-h-[200px] flex-col items-center justify-center px-6 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <MessageCircle className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-900">
            No conversations found
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Try adjusting your search, or start from an expert profile enquiry.
          </p>
        </div>
      )}
    </div>
  );
}
