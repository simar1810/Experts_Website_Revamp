"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { MessageCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { fetchAPI } from "@/lib/api";
import { nameInitials, normalizeThreadId } from "@/lib/utils";
import { useClientChatContext } from "../state/ClientChatContext";
import ClientChatLoader from "./ClientChatLoader";
import ClientMessage from "./ClientMessage";
import ClientMessageBox from "./ClientMessageBox";

function sendSocketLeave(socket) {
  if (!socket) return;
  const payload = JSON.stringify({ type: "leave" });
  const run = () => {
    if (socket.readyState === WebSocket.OPEN) socket.send(payload);
  };
  run();
  if (socket.readyState === WebSocket.CONNECTING) {
    socket.addEventListener("open", run, { once: true });
  }
}

export default function ClientChatbox({ selectedThreadId, onClearSelection }) {
  const { hasError, errorMessage, dispatch, socket } = useClientChatContext();
  const activeId = normalizeThreadId(selectedThreadId);

  const prevActiveRef = useRef(undefined);
  useEffect(() => {
    const prev = prevActiveRef.current;
    const cur = activeId || undefined;
    prevActiveRef.current = cur;
    if (prev && !cur) sendSocketLeave(socket);
  }, [activeId, socket]);

  const mobileBack =
    activeId && onClearSelection ? (
      <div className="flex shrink-0 items-center border-b border-gray-100 bg-white px-2 py-2 lg:hidden">
        <button
          type="button"
          onClick={onClearSelection}
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
          All chats
        </button>
      </div>
    ) : null;

  if (!activeId) {
    return (
      <div className="flex h-full min-h-0 w-full flex-1 basis-0 flex-col items-center justify-center gap-2 p-8 text-center">
        <div className="mb-2 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gray-50">
          <MessageCircle className="h-8 w-8 scale-x-[-1] text-gray-300" aria-hidden />
        </div>
        <p className="max-w-sm text-lg font-medium text-gray-600">
          Select a conversation
        </p>
        <p className="max-w-sm text-sm text-gray-500">
          Choose an expert from the list to read messages and continue your chat.
        </p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {mobileBack}
        <div className="flex min-h-48 flex-1 items-center justify-center bg-white lg:min-h-0">
          <div className="flex max-w-sm flex-col items-center px-6 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
              <AlertCircle className="h-6 w-6 text-gray-500" />
            </div>
            <p className="text-sm font-medium text-gray-900">Something went wrong</p>
            <p className="mt-1 text-xs text-gray-500">
              {errorMessage || "We couldn't load this conversation."}
            </p>
            <button
              type="button"
              onClick={() => {
                dispatch({ type: "retry-connection" });
                onClearSelection?.();
              }}
              className="mt-4 rounded-md border border-gray-200 px-4 py-1.5 text-xs font-medium text-gray-900 transition hover:bg-gray-50"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      {mobileBack}
      <ChatThreadPanel threadId={activeId} />
    </div>
  );
}

function ChatThreadPanel({ threadId }) {
  const { threads, threadXMessages, dispatch, socket } = useClientChatContext();
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const bottomRef = useRef(null);

  const tid = normalizeThreadId(threadId);

  const reloadMessages = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const data = await fetchAPI(
        `/experts/chat/thread/${tid}/messages-client`,
        undefined,
        "GET",
      );
      if (Array.isArray(data.messages)) {
        dispatch({
          type: "update-thread-messages",
          payload: { threadId: tid, messages: data.messages },
        });
      } else {
        setFetchError("Invalid response");
      }
    } catch (e) {
      setFetchError(e instanceof Error ? e.message : "Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, [tid, dispatch]);

  useEffect(() => {
    reloadMessages();
  }, [reloadMessages]);

  useEffect(() => {
    if (loading || fetchError || !tid) return;
    dispatch({ type: "clear-unread", payload: { threadId: tid } });
    const payload = JSON.stringify({ type: "read", threadId: tid });
    const sendRead = () => {
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(payload);
      }
    };
    sendRead();
    if (socket?.readyState === WebSocket.CONNECTING) {
      socket.addEventListener("open", sendRead, { once: true });
    }
  }, [loading, fetchError, tid, socket, dispatch]);

  const selectedChat = useMemo(
    () =>
      threads?.find(
        (t) =>
          normalizeThreadId(t?._id ?? t?.id ?? t?.threadId) === tid,
      ),
    [threads, tid],
  );

  const messages = Array.isArray(threadXMessages[tid])
    ? threadXMessages[tid]
    : [];

  const messageGroups = useMemo(() => {
    if (!messages.length) return [];
    const groups = [];
    let current = [messages[0]];
    for (let i = 1; i < messages.length; i++) {
      if (messages[i].senderRole === messages[i - 1].senderRole) {
        current.push(messages[i]);
      } else {
        groups.push(current);
        current = [messages[i]];
      }
    }
    groups.push(current);
    return groups;
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) {
    return <ClientChatLoader />;
  }

  if (fetchError) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center text-center">
          <p className="text-md font-medium text-gray-900">Something went wrong</p>
          <p className="mt-1 text-xs text-gray-500">
            We couldn&apos;t load the messages. Please try again.
          </p>
          <button
            type="button"
            onClick={() => reloadMessages()}
            className="mt-4 rounded-md border border-gray-200 px-4 py-1.5 text-xs font-medium text-gray-900 transition hover:bg-gray-50"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const coach = selectedChat?.coach;

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden overflow-x-hidden lg:h-full">
      <div className="flex shrink-0 items-center gap-4 border-b border-gray-100 px-6 py-4">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-200">
          {coach?.profilePhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coach.profilePhoto}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-xs font-semibold text-gray-600">
              {nameInitials(coach?.name || "E")}
            </span>
          )}
        </div>
        <div>
          <h3 className="font-bold leading-tight text-gray-900">
            {coach?.name || "Expert"}
          </h3>
          <p className="text-xs font-medium text-gray-500">Expert</p>
        </div>
      </div>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden overflow-x-hidden">
        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain p-6">
          <div className="space-y-4">
            {messageGroups.map((group) => (
              <div key={group[0]._id} className="space-y-1">
                {group.map((message, index) => (
                  <ClientMessage
                    key={message._id}
                    message={message}
                    coach={coach}
                    isFirstInGroup={index === 0}
                    isLastInGroup={index === group.length - 1}
                  />
                ))}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </div>
        <ClientMessageBox activeThreadId={tid} />
      </div>
    </div>
  );
}
