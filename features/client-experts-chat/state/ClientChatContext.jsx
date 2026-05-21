"use client";

import { createContext, useContext, useEffect, useReducer } from "react";
import { buildClientChatInitialState } from "./initial-state";
import { clientChatReducer } from "./clientChatReducer";
import { initializeClientChat } from "../utils/socket";
import { useExpertsChatSocketJoin } from "../utils/expertsChatSocket";
import { getClientAuthToken } from "@/lib/clientAuthStorage";

const ClientChatContext = createContext(null);

export function ClientChatProvider({ children, threads, activeThreadId = "" }) {
  const authToken =
    typeof window !== "undefined" ? getClientAuthToken() : null;

  const [state, dispatch] = useReducer(
    clientChatReducer,
    buildClientChatInitialState(threads),
  );

  useEffect(() => {
    dispatch({ type: "set-threads", payload: threads });
  }, [threads]);

  useEffect(() => {
    dispatch({ type: "set-active-thread", payload: activeThreadId });
  }, [activeThreadId]);

  useEffect(() => {
    if (!authToken) {
      return undefined;
    }

    const socket = initializeClientChat(authToken, dispatch);
    dispatch({ type: "setup-socket", payload: socket });
    return () => {
      try {
        socket.close();
      } catch {
        /* ignore */
      }
    };
  }, [authToken]);

  useExpertsChatSocketJoin(state.socket, activeThreadId);

  return (
    <ClientChatContext.Provider
      value={{
        ...state,
        dispatch,
      }}
    >
      {children}
    </ClientChatContext.Provider>
  );
}

export function useClientChatContext() {
  const ctx = useContext(ClientChatContext);
  if (!ctx) {
    throw new Error(
      "useClientChatContext must be used within ClientChatProvider",
    );
  }
  return ctx;
}
