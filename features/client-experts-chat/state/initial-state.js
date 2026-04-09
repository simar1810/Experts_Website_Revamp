export function buildClientChatInitialState(threads) {
  return {
    stage: "building-connection",
    threads,
    hasError: false,
    errorMessage: "",
    threadXMessages: {},
    socket: null,
  };
}
