"use client";

import { Check, CheckCheck, ChevronDown, Copy } from "lucide-react";
import toast from "react-hot-toast";
import { nameInitials, cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function timeLabel(createdAt) {
  if (createdAt == null) return "";
  const d = new Date(createdAt);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function clientBubbleClass(isFirstInGroup, isLastInGroup) {
  const base =
    "font-sans bg-[var(--brand-primary)] px-4 py-2.5 text-sm leading-relaxed text-white";
  if (isFirstInGroup && isLastInGroup) {
    return `${base} rounded-xl rounded-tr-sm`;
  }
  if (isFirstInGroup) {
    return `${base} rounded-t-xl rounded-l-xl rounded-tr-sm rounded-br-sm`;
  }
  if (isLastInGroup) {
    return `${base} rounded-b-xl rounded-bl-xl rounded-br-sm rounded-tl-sm rounded-tr-sm`;
  }
  return `${base} rounded-md rounded-l-xl rounded-r-xl`;
}

function hasReadReceipt(message) {
  const r = message?.readAt ?? message?.read_at;
  return r != null && r !== "";
}

function coachBubbleClass(isFirstInGroup, isLastInGroup) {
  const base =
    "font-sans bg-gray-100 px-4 py-2.5 text-sm leading-relaxed text-gray-900";
  if (isFirstInGroup && isLastInGroup) {
    return `${base} rounded-xl rounded-tl-sm`;
  }
  if (isFirstInGroup) {
    return `${base} rounded-t-xl rounded-r-xl rounded-tl-sm rounded-bl-sm`;
  }
  if (isLastInGroup) {
    return `${base} rounded-b-xl rounded-br-xl rounded-tl-sm rounded-tr-sm rounded-bl-sm`;
  }
  return `${base} rounded-md rounded-l-xl rounded-r-xl`;
}

async function copyMessageBody(text) {
  const t = typeof text === "string" ? text : "";
  if (!t) return;
  try {
    await navigator.clipboard.writeText(t);
    toast.success("Copied to clipboard");
  } catch {
    toast.error("Could not copy");
  }
}

function BubbleOptions({ text, variant }) {
  const isSelf = variant === "self";
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Message options"
          className={cn(
            "absolute right-1.5 top-1.5 z-10 rounded-md p-0.5 opacity-0 transition-opacity focus-visible:opacity-100 group-hover/bubble:opacity-100",
            isSelf
              ? "text-white/90 hover:bg-white/15"
              : "text-gray-500 hover:bg-gray-200/80",
          )}
        >
          <ChevronDown className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isSelf ? "end" : "start"} className="min-w-[9rem]">
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={() => {
            copyMessageBody(text);
          }}
        >
          <Copy className="h-4 w-4" />
          Copy
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Client view: own messages right; coach (expert) on the left with avatar. */
export default function ClientMessage({
  message,
  coach,
  isFirstInGroup = true,
  isLastInGroup = true,
}) {
  const body = typeof message?.text === "string" ? message.text : "";

  if (message.senderRole === "client") {
    const read = hasReadReceipt(message);
    const time = timeLabel(message.createdAt ?? message.updatedAt);
    return (
      <div className="flex justify-end">
        <div className="flex max-w-[70%] flex-col items-end">
          <div
            className={cn(
              clientBubbleClass(isFirstInGroup, isLastInGroup),
              "group/bubble relative pr-9",
            )}
          >
            <span className="whitespace-pre-wrap break-words">{body}</span>
            <BubbleOptions text={body} variant="self" />
          </div>
          {isLastInGroup ? (
            <div className="mt-1 flex items-center justify-end gap-1">
              {time ? (
                <span className="text-[10px] font-medium tabular-nums text-gray-500">
                  {time}
                </span>
              ) : null}
              {read ? (
                <CheckCheck
                  className="h-3.5 w-3.5 shrink-0 text-emerald-600"
                  strokeWidth={2.5}
                  aria-label="Read"
                />
              ) : (
                <Check
                  className="h-3.5 w-3.5 shrink-0 text-gray-400"
                  strokeWidth={2.5}
                  aria-label="Delivered"
                />
              )}
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start gap-2">
      {isFirstInGroup ? (
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-200">
          {coach?.profilePhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coach.profilePhoto}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-xs font-semibold text-gray-600">
              {nameInitials(coach?.name || "E")}
            </span>
          )}
        </div>
      ) : (
        <div className="h-10 w-10 shrink-0" aria-hidden />
      )}
      <div className="flex max-w-[70%] flex-col items-start">
        <div
          className={cn(
            coachBubbleClass(isFirstInGroup, isLastInGroup),
            "group/bubble relative pr-9",
          )}
        >
          <span className="whitespace-pre-wrap break-words">{body}</span>
          <BubbleOptions text={body} variant="peer" />
        </div>
        {isLastInGroup ? (
          <span className="mt-1 text-[10px] text-gray-400">
            {timeLabel(message.createdAt)}
          </span>
        ) : null}
      </div>
    </div>
  );
}
