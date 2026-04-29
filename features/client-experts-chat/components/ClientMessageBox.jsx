"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { useClientChatContext } from "../state/ClientChatContext";

export default function ClientMessageBox({
  activeThreadId,
  initialComposerText = "",
  onComposerPrefillApplied,
}) {
  const [disabled, setDisabled] = useState(false);
  const [text, setText] = useState("");
  const { socket } = useClientChatContext();
  const textRef = useRef(text);
  const textareaRef = useRef(null);
  const prefillKeyRef = useRef("");

  useEffect(() => {
    textRef.current = text;
  }, [text]);

  useEffect(() => {
    const t = typeof initialComposerText === "string" ? initialComposerText : "";
    if (!t.trim() || !activeThreadId) return;
    const key = `${activeThreadId}::${t}`;
    if (prefillKeyRef.current === key) return;
    prefillKeyRef.current = key;
    queueMicrotask(() => {
      setText(t);
      textRef.current = t;
      requestAnimationFrame(() => {
        const el = textareaRef.current;
        if (el) {
          el.style.height = "auto";
          el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
          el.focus({ preventScroll: true });
        }
      });
      onComposerPrefillApplied?.();
    });
  }, [activeThreadId, initialComposerText, onComposerPrefillApplied]);

  useEffect(() => {
    if (!activeThreadId) return;
    const id = requestAnimationFrame(() => {
      textareaRef.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(id);
  }, [activeThreadId]);

  const sendMessage = useCallback(() => {
    const el = textareaRef.current;
    const raw =
      (typeof el?.value === "string" ? el.value : textRef.current) ?? "";
    const trimmed = raw.trim();
    const s = socket;
    const tid = activeThreadId;
    if (!trimmed || !tid || !s) return;
    if (s.readyState !== WebSocket.OPEN) return;
    setDisabled(true);
    s.send(
      JSON.stringify({
        type: "send",
        threadId: tid,
        text: trimmed,
      }),
    );
    setText("");
    textRef.current = "";
    setDisabled(false);
    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (el) {
        el.style.height = "auto";
      }
    });
  }, [activeThreadId, socket]);

  return (
    <div className="shrink-0 bg-white px-6 py-4">
      <form
        className="relative flex items-end gap-3 rounded-xl border border-gray-100 bg-white px-4 py-2 shadow-sm"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <textarea
          ref={textareaRef}
          value={text}
          rows={1}
          onChange={(e) => {
            textRef.current = e.target.value;
            setText(e.target.value);
          }}
          onInput={(e) => {
            const el = e.target;
            el.style.height = "auto";
            el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
          }}
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            if (e.shiftKey) return;
            if (e.nativeEvent.isComposing || e.keyCode === 229) return;
            e.preventDefault();
            e.stopPropagation();
            sendMessage();
          }}
          placeholder="Type a message..."
          className="max-h-40 min-h-10 flex-1 resize-none border-none bg-transparent py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
          aria-label="Message"
        />
        <button
          type="submit"
          className="flex h-10 shrink-0 items-center justify-center text-[#84cc16] transition-colors hover:text-[#6ca832] disabled:opacity-40"
          disabled={disabled || text.trim() === ""}
          aria-label="Send message"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}
