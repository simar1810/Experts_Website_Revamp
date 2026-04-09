import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/** Normalize Mongo / API thread id for URLs, WebSocket, and equality checks. */
export function normalizeThreadId(raw) {
  if (raw == null) return "";
  if (typeof raw === "string") {
    const t = raw.trim();
    return t;
  }
  if (typeof raw === "object") {
    if (typeof raw.toHexString === "function") {
      try {
        const h = raw.toHexString();
        if (typeof h === "string" && h.length > 0) return h.trim();
      } catch {
        /* ignore */
      }
    }
    if (typeof raw.$oid === "string") return raw.$oid.trim();
    if (raw.$oid != null) return String(raw.$oid).trim();
  }
  const s = String(raw);
  return s === "[object Object]" ? "" : s.trim();
}

/** Up to two initials from a display name (e.g. "Ada Lovelace" → "AL"). */
export function nameInitials(name) {
  if (name == null || typeof name !== "string") return "";
  return (
    name
      .trim()
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase() || ""
  );
}

function isValidDate(d) {
  return d instanceof Date && !Number.isNaN(d.getTime());
}

/** Compact relative / clock label for chat list sidebar (no extra deps). */
export function getChatTimestamp(value) {
  try {
    if (!value) return "";
    const date = new Date(value);
    if (!isValidDate(date)) return "";
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const minutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMs / 3600000);
    const days = Math.floor(diffMs / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min`;
    if (hours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    if (days === 1) return "Yesterday";
    if (days < 30) return `${days} days ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} months ago`;
    const years = Math.floor(days / 365);
    return `${years} years ago`;
  } catch {
    return "";
  }
}
