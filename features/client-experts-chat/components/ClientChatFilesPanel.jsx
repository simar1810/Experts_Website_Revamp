"use client";

import { cn } from "@/lib/utils";

/**
 * Placeholder third column matching desktop reference. Wire to a files API when available.
 */
export default function ClientChatFilesPanel({ threadSelected, className }) {
  return (
    <aside
      className={cn(
        "flex h-full min-h-0 w-full min-w-0 flex-col rounded-2xl border border-gray-100 bg-white shadow-sm",
        className,
      )}
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl">
        <div className="shrink-0 border-b border-gray-100 p-4">
          <div className="flex items-center gap-2 font-serif text-lg font-bold text-gray-900">
            <span>Files</span>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 font-sans text-xs font-bold text-gray-600">
              0
            </span>
          </div>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-10 text-center">
          <p className="max-w-[200px] text-sm font-medium leading-relaxed text-gray-500">
            {threadSelected
              ? "No files shared in this chat yet."
              : "Select a conversation to see shared files."}
          </p>
        </div>
      </div>
    </aside>
  );
}
