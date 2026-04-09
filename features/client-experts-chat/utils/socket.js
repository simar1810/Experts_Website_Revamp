import toast from "react-hot-toast";

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
        type: "message",
        payload: {
          threadId: parsed?.threadId,
          role: parsed?.role,
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
  const base =
    process.env.NEXT_PUBLIC_EXPERTS_CHAT_SOCKET || "ws://localhost:8085";
  const socket = new WebSocket(`${base}?token=${encodeURIComponent(token)}`);
  socket.addEventListener("message", (ev) => handleSocketMessages(ev, dispatch));
  return socket;
}
