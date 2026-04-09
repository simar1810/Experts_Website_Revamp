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
        return (
          <button
            key={rowId || JSON.stringify(chat)}
            type="button"
            onClick={() => selectChat(chat)}
            className={cn(
              "flex w-full items-start gap-4 border-b border-gray-50 p-4 text-left transition-colors last:border-0 hover:bg-gray-50",
              selectedThreadId &&
                rowId &&
                selectedThreadId === rowId &&
                "bg-gray-50",
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
              <div className="mb-1 flex items-baseline justify-between">
                <h3 className="truncate pr-2 font-bold text-gray-900">
                  {chat?.coach?.name || "Expert"}
                </h3>
                <span className="shrink-0 text-xs font-medium text-gray-400">
                  {getChatTimestamp(chat?.lastMessageAt)}
                </span>
              </div>
              <p className="truncate pr-4 text-sm text-gray-500">
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
