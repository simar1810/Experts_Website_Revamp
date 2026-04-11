import { normalizeThreadId } from "@/lib/utils";

function threadRowId(thread) {
  return normalizeThreadId(thread?._id ?? thread?.id ?? thread?.threadId);
}

function sortThreadsDesc(threads) {
  return [...threads].sort(
    (a, b) =>
      new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0),
  );
}

function messageId(msg) {
  return normalizeThreadId(msg?._id ?? msg?.id);
}

export function clientChatReducer(state, action) {
  switch (action.type) {
    case "setup-socket":
      return {
        ...state,
        socket: action.payload,
      };
    case "connected":
      return {
        ...state,
        stage: "socket-connected",
      };
    case "set-active-thread": {
      const id = normalizeThreadId(action.payload);
      return { ...state, activeThreadId: id };
    }
    case "clear-ui-error":
      return {
        ...state,
        hasError: false,
        errorMessage: "",
      };
    case "error":
      return {
        ...state,
        hasError: true,
        errorMessage: action.payload ?? "",
        stage:
          state.stage === "building-connection"
            ? "socket-connected"
            : state.stage,
      };
    case "retry-connection":
      return {
        ...state,
        hasError: false,
        errorMessage: "",
      };
    case "clear-unread": {
      const tid = normalizeThreadId(action.payload?.threadId);
      if (!tid) return state;
      const threads = state.threads.map((t) =>
        threadRowId(t) === tid ? { ...t, unreadForClient: 0 } : t,
      );
      return { ...state, threads };
    }
    case "update-thread-messages": {
      const tid = normalizeThreadId(action.payload.threadId);
      return {
        ...state,
        threadXMessages: {
          ...state.threadXMessages,
          [tid]: action.payload.messages,
        },
      };
    }
    case "read-receipt": {
      const tid = normalizeThreadId(action.payload?.threadId);
      const { role, readAt } = action.payload || {};
      if (!tid || !readAt || !role) return state;

      const senderToMark = role === "coach" ? "client" : "coach";
      const list = state.threadXMessages[tid];
      if (!Array.isArray(list)) return state;

      const nextList = list.map((m) =>
        m.senderRole === senderToMark && !m.readAt
          ? { ...m, readAt }
          : m,
      );
      return {
        ...state,
        threadXMessages: {
          ...state.threadXMessages,
          [tid]: nextList,
        },
      };
    }
    case "message": {
      const payload = action.payload;
      const threadId = normalizeThreadId(payload?.thread ?? payload?.threadId);
      if (!threadId || typeof payload?.text !== "string") return state;

      const isCoachMsg = payload.senderRole === "coach";
      const incrementUnread =
        isCoachMsg && threadId !== state.activeThreadId;

      const threads = sortThreadsDesc(
        state.threads.map((t) => {
          if (threadRowId(t) !== threadId) return t;
          const createdAt = payload.createdAt || new Date().toISOString();
          const text = String(payload.text || "");
          return {
            ...t,
            lastMessageAt: createdAt,
            lastMessagePreview: text.slice(0, 100),
            unreadForClient: incrementUnread
              ? (Number(t.unreadForClient) || 0) + 1
              : Number(t.unreadForClient) || 0,
          };
        }),
      );

      const existing = state.threadXMessages[threadId];
      if (!Array.isArray(existing)) {
        return { ...state, threads };
      }

      const mid = messageId(payload);
      if (
        mid &&
        existing.some((m) => messageId(m) === mid && messageId(m) !== "")
      ) {
        return { ...state, threads };
      }

      return {
        ...state,
        threads,
        threadXMessages: {
          ...state.threadXMessages,
          [threadId]: [...existing, payload],
        },
      };
    }
    default:
      return state;
  }
}
