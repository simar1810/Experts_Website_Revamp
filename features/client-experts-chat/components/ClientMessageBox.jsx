"use client";

import { useCallback, useState } from "react";
import { Send } from "lucide-react";
import { useClientChatContext } from "../state/ClientChatContext";

export default function ClientMessageBox({ activeThreadId }) {
  const [disabled, setDisabled] = useState(false);
  const [text, setText] = useState("");
  const { socket } = useClientChatContext();

  const sendMessage = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || !activeThreadId || !socket) return;
    if (socket.readyState !== WebSocket.OPEN) return;
    setDisabled(true);
    socket.send(
      JSON.stringify({
        type: "send",
        threadId: activeThreadId,
        text: trimmed,
      }),
    );
    setText("");
    setDisabled(false);
  }, [text, activeThreadId, socket]);

  return (
    <div className="shrink-0 bg-white px-6 py-4">
      <div className="relative flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-2 shadow-sm">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Type a message"
          className="flex-1 border-none bg-transparent py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
        />
        <button
          type="button"
          className="text-[#84cc16] transition-colors hover:text-[#6ca832] disabled:opacity-40"
          disabled={disabled || text.trim() === ""}
          onClick={sendMessage}
          aria-label="Send message"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
