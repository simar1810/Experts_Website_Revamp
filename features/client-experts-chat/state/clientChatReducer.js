import { normalizeThreadId } from "@/lib/utils";

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
    case "message": {
      const threadId = normalizeThreadId(action.payload?.thread);
      if (!threadId || !state.threadXMessages[threadId]) return state;
      return {
        ...state,
        threadXMessages: {
          ...state.threadXMessages,
          [threadId]: [
            ...(Array.isArray(state.threadXMessages[threadId])
              ? state.threadXMessages[threadId]
              : []),
            action.payload,
          ],
        },
      };
    }
    default:
      return state;
  }
}
