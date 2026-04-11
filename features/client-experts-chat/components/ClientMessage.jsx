"use client";

import { Check, CheckCheck } from "lucide-react";
import { nameInitials } from "@/lib/utils";

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
    "font-sans bg-[#84cc16] px-4 py-2.5 text-sm leading-relaxed text-white";
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

/** Client view: own messages right; coach (expert) on the left with avatar. */
export default function ClientMessage({
  message,
  coach,
  isFirstInGroup = true,
  isLastInGroup = true,
}) {
  if (message.senderRole === "client") {
    const read = Boolean(message.readAt);
    const time = timeLabel(message.createdAt ?? message.updatedAt);
    return (
      <div className="flex justify-end">
        <div className="flex max-w-[70%] flex-col items-end">
          <div className={clientBubbleClass(isFirstInGroup, isLastInGroup)}>
            {message.text}
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
        <div className={coachBubbleClass(isFirstInGroup, isLastInGroup)}>
          {message.text}
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
