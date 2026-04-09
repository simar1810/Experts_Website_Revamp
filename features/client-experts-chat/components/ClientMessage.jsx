"use client";

import { nameInitials } from "@/lib/utils";

function timeLabel(createdAt) {
  return new Date(createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function clientBubbleClass(isFirstInGroup, isLastInGroup) {
  const base =
    "bg-[#84cc16] px-4 py-2.5 text-sm leading-relaxed text-white";
  if (isFirstInGroup && isLastInGroup) {
    return `${base} rounded-2xl rounded-tr-sm`;
  }
  if (isFirstInGroup) {
    return `${base} rounded-t-2xl rounded-l-2xl rounded-tr-sm rounded-br-sm`;
  }
  if (isLastInGroup) {
    return `${base} rounded-b-2xl rounded-bl-2xl rounded-br-sm rounded-tl-sm rounded-tr-sm`;
  }
  return `${base} rounded-md rounded-l-2xl rounded-r-2xl`;
}

function coachBubbleClass(isFirstInGroup, isLastInGroup) {
  const base =
    "bg-gray-100 px-4 py-2.5 text-sm leading-relaxed text-gray-900";
  if (isFirstInGroup && isLastInGroup) {
    return `${base} rounded-2xl rounded-tl-sm`;
  }
  if (isFirstInGroup) {
    return `${base} rounded-t-2xl rounded-r-2xl rounded-tl-sm rounded-bl-sm`;
  }
  if (isLastInGroup) {
    return `${base} rounded-b-2xl rounded-br-2xl rounded-tl-sm rounded-tr-sm rounded-bl-sm`;
  }
  return `${base} rounded-md rounded-l-2xl rounded-r-2xl`;
}

/** Client view: own messages right; coach (expert) on the left with avatar. */
export default function ClientMessage({
  message,
  coach,
  isFirstInGroup = true,
  isLastInGroup = true,
}) {
  if (message.senderRole === "client") {
    return (
      <div className="flex justify-end">
        <div className="flex max-w-[70%] flex-col items-end">
          <div className={clientBubbleClass(isFirstInGroup, isLastInGroup)}>
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
