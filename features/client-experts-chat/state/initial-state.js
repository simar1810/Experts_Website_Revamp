export function buildClientChatInitialState(threads) {
  return {
    stage: "socket-connected",
    threads: Array.isArray(threads) ? threads : [],
    activeThreadId: "",
    hasError: false,
    errorMessage: "",
    threadXMessages: {},
    /** Read receipts received before messages finished loading (race with fetch). */
    pendingReadReceipts: {},
    socket: null,
  };
}
