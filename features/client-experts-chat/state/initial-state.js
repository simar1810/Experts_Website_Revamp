export function buildClientChatInitialState(threads) {
  return {
    stage: "building-connection",
    threads: Array.isArray(threads) ? threads : [],
    activeThreadId: "",
    hasError: false,
    errorMessage: "",
    threadXMessages: {},
    socket: null,
  };
}
