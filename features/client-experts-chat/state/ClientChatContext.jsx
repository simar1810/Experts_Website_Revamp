"use client";

import { createContext, useContext, useEffect, useReducer } from "react";
import { buildClientChatInitialState } from "./initial-state";
import { clientChatReducer } from "./clientChatReducer";
import ClientChatLoader from "../components/ClientChatLoader";
import { initializeClientChat } from "../utils/socket";

const ClientChatContext = createContext(null);

export function ClientChatProvider({ children, threads, activeThreadId = "" }) {
  const [state, dispatch] = useReducer(
    clientChatReducer,
    buildClientChatInitialState(threads),
  );

  useEffect(() => {
    dispatch({ type: "set-active-thread", payload: activeThreadId });
  }, [activeThreadId]);

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? window.localStorage.getItem("client_token")
        : null;
    if (!token) {
      dispatch({
        type: "error",
        payload: "Not signed in",
      });
      return undefined;
    }
    const socket = initializeClientChat(token, dispatch);
    dispatch({ type: "setup-socket", payload: socket });
    return () => {
      try {
        socket.close();
      } catch {
        /* ignore */
      }
    };
  }, []);

  return (
    <ClientChatContext.Provider
      value={{
        ...state,
        dispatch,
      }}
    >
      {state.stage === "building-connection" ? <ClientChatLoader /> : children}
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
