import toast from "react-hot-toast";
import {
  attachExpertsChatSocketLifecycle,
  expertsChatSocketUrl,
} from "./expertsChatSocket";

function handleSocketMessages(raw, dispatch) {
  const parsed = JSON.parse(raw.data);
  switch (parsed.type) {
    case "connected":
      dispatch({ type: "connected" });
      break;
    case "error": {
      const msg = parsed?.message;
      if (msg === "threadId required") {
        toast.error("Could not join this chat. Try again.");
        break;
      }
      dispatch({
        type: "error",
        payload: msg,
      });
      break;
    }
    case "join_failed":
      toast.error(
        parsed?.reason
          ? `Chat: ${String(parsed.reason).replace(/_/g, " ")}`
          : "Could not open this conversation.",
      );
      break;
    case "joined":
      break;
    case "message":
      dispatch({
        type: "message",
        payload: parsed?.message,
      });
      break;
    case "read":
      dispatch({
        type: "read-receipt",
        payload: {
          threadId: parsed?.threadId,
          role: parsed?.role,
          readAt: parsed?.readAt,
        },
      });
      break;
    default:
      break;
  }
}

/**
 * Opens expert chat WebSocket. Does not send a bare `join` on open (server requires threadId).
 */
export function initializeClientChat(token, dispatch) {
  const socket = new WebSocket(expertsChatSocketUrl(token));
  attachExpertsChatSocketLifecycle(socket, dispatch);
  socket.addEventListener("message", (ev) => handleSocketMessages(ev, dispatch));
  return socket;
}
