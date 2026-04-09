"use client";

import { useEffect, useState } from "react";
import { Search, Loader } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { fetchAPI } from "@/lib/api";
import { ClientChatProvider } from "@/features/client-experts-chat/state/ClientChatContext";
import ClientChatListings from "@/features/client-experts-chat/components/ClientChatListings";
import ClientChatbox from "@/features/client-experts-chat/components/ClientChatbox";
import ClientChatFilesPanel from "@/features/client-experts-chat/components/ClientChatFilesPanel";
import EnquiriesResizableLayout from "./_components/EnquiriesResizableLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function ThreadsLoading() {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center bg-[#F9FAFB]">
      <Loader className="h-7 w-7 animate-spin text-gray-400" />
      <p className="mt-4 text-sm text-gray-600">Loading your conversations…</p>
    </div>
  );
}

function ChatShell({ threads }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedThreadId, setSelectedThreadId] = useState("");
  const { user } = useAuth();
  const firstName =
    user?.name && typeof user.name === "string"
      ? user.name.trim().split(/\s+/)[0]
      : "";

  const chatsColumn = (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-hidden sm:rounded-2xl",
        "max-md:rounded-none",
      )}
    >
      <div className="shrink-0 border-b border-gray-100 p-4">
        <div className="mb-4 flex items-center gap-2 font-serif text-lg font-bold text-gray-900">
          <span>Chats</span>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 font-sans text-xs font-bold text-gray-600">
            {threads.length}
          </span>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-gray-100/50 px-3 py-2 transition-colors focus-within:bg-gray-100">
          <Search
            className="pointer-events-none h-5 w-5 shrink-0 text-gray-400"
            aria-hidden
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by expert name"
            className="min-w-0 flex-1 border-0 bg-transparent py-1.5 pl-0 pr-1 text-sm text-gray-900 placeholder:text-gray-400 outline-none ring-0 focus:ring-0"
          />
        </div>
      </div>
      <ClientChatListings
        searchQuery={searchQuery}
        selectedThreadId={selectedThreadId}
        onSelectThread={setSelectedThreadId}
      />
    </div>
  );

  const chatColumn = (
    <div
      className={cn(
        "flex min-h-0 h-full min-w-0 flex-1 flex-col bg-white",
        "rounded-2xl border border-gray-100 shadow-sm",
        "max-md:rounded-none max-md:border-0 max-md:border-t max-md:border-gray-100 max-md:shadow-none",
      )}
    >
      <div
        className={cn(
          "flex min-h-0 h-full min-w-0 flex-1 flex-col overflow-hidden rounded-2xl",
          "max-md:rounded-none",
        )}
      >
        <ClientChatbox
          selectedThreadId={selectedThreadId}
          onClearSelection={() => setSelectedThreadId("")}
        />
      </div>
    </div>
  );

  const filesColumn = (
    <ClientChatFilesPanel
      threadSelected={Boolean(selectedThreadId)}
      className="h-full min-h-0 w-full"
    />
  );

  return (
    <ClientChatProvider threads={threads}>
      <main className="flex min-h-0 w-full max-w-[100vw] flex-1 flex-col overflow-hidden bg-[#F9FAFB]">
        <header className="shrink-0 bg-[#F9FAFB] px-4 py-4 sm:px-6 sm:py-5">
          <div>
            <h1 className="mb-1 font-serif text-2xl font-bold text-gray-900">
              Your chats
            </h1>
            {firstName ? (
              <p className="text-sm text-gray-500">
                Welcome back, {firstName}. Message experts you&apos;ve connected
                with.
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                Message experts you&apos;ve connected with.
              </p>
            )}
          </div>
        </header>
        <EnquiriesResizableLayout
          selectedThreadId={selectedThreadId}
          chatsColumn={chatsColumn}
          chatColumn={chatColumn}
          filesColumn={filesColumn}
        />
      </main>
    </ClientChatProvider>
  );
}

export default function EnquiriesPage() {
  const { isAuthenticated, openLoginModal } = useAuth();
  const [threads, setThreads] = useState(null);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setThreads(null);
      setLoadError(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchAPI(
          "/experts/chat/threads-client",
          undefined,
          "GET",
        );
        if (cancelled) return;
        if (Array.isArray(data.threads)) {
          setThreads(data.threads);
          setLoadError(null);
        } else {
          setLoadError(data?.message || "Could not load conversations.");
          setThreads([]);
        }
      } catch (e) {
        if (!cancelled) {
          setLoadError(
            e instanceof Error ? e.message : "Something went wrong.",
          );
          setThreads([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="mx-auto flex min-h-0 flex-1 max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Your chats</h1>
        <p className="mt-3 text-gray-600">
          Sign in to see enquiries and message experts you&apos;ve contacted.
        </p>
        <Button
          type="button"
          className="mt-8 rounded-xl bg-[#84cc16] px-8 py-3 font-semibold text-white hover:bg-[#6ca832]"
          onClick={openLoginModal}
        >
          Log in
        </Button>
      </div>
    );
  }

  if (threads === null) {
    return <ThreadsLoading />;
  }

  if (loadError && (!threads || threads.length === 0)) {
    return (
      <div className="mx-auto flex min-h-0 flex-1 max-w-lg flex-col items-center justify-center px-6 text-center">
        <p className="text-sm font-medium text-gray-900">{loadError}</p>
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return <ChatShell threads={threads} />;
}
