/** Shared WebSocket URL + lifecycle for expert listing chat (client + coach UIs). */

import { useEffect } from "react";
import { normalizeThreadId } from "@/lib/utils";

export function normalizeExpertsChatWsBase(raw) {
  const base = String(
    raw || process.env.NEXT_PUBLIC_EXPERTS_CHAT_SOCKET || "ws://localhost:8085",
  ).trim();
  return base.replace(/\/+$/, "");
}

export function expertsChatSocketUrl(token) {
  const base = normalizeExpertsChatWsBase();
  return `${base}?token=${encodeURIComponent(token || "")}`;
}

/**
 * @param {WebSocket} socket
 * @param {import("react").Dispatch<unknown>} dispatch
 */
export function attachExpertsChatSocketLifecycle(socket, dispatch) {
  const timeout = window.setTimeout(() => {
    dispatch({
      type: "error",
      payload:
        "Could not connect to chat. Ensure the experts chat server is running (port 8085 locally).",
    });
  }, 12000);

  const clearConnectTimeout = () => window.clearTimeout(timeout);

  socket.addEventListener("open", () => {
    clearConnectTimeout();
    dispatch({ type: "connected" });
  });

  socket.addEventListener("error", () => {
    clearConnectTimeout();
    dispatch({
      type: "error",
      payload: "Chat connection failed. Check NEXT_PUBLIC_EXPERTS_CHAT_SOCKET.",
    });
  });

  socket.addEventListener("close", (ev) => {
    clearConnectTimeout();
    if (ev.wasClean) return;
    dispatch({
      type: "error",
      payload: "Chat disconnected. Refresh the page to reconnect.",
    });
  });
}

/** Join the active thread when selection or socket readiness changes. */
export function useExpertsChatSocketJoin(socket, threadId) {
  useEffect(() => {
    const tid = normalizeThreadId(threadId);
    if (!tid || !socket) return;

    const payload = JSON.stringify({ type: "join", threadId: tid });
    const send = () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(payload);
      }
    };
    if (socket.readyState === WebSocket.OPEN) send();
    else if (socket.readyState === WebSocket.CONNECTING) {
      socket.addEventListener("open", send, { once: true });
    }
  }, [socket, threadId]);
}
