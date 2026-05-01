"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

const HANDLE = 8;
const MIN_LIST = 220;
const MAX_LIST = 480;
const MIN_FILES = 200;
const MAX_FILES = 440;
const MIN_CHAT = 260;
const DEFAULT_LIST = 280;
const DEFAULT_FILES = 280;

const STORAGE_LIST = "enquiries.chatListWidth";
const STORAGE_FILES = "enquiries.chatFilesWidth";

function useIsLargeScreen() {
  const [lg, setLg] = useState(false);
  useLayoutEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setLg(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return lg;
}

function ColumnResizeHandle({ onDelta }) {
  const dragging = useRef(false);

  const onPointerDown = (e) => {
    e.preventDefault();
    const target = e.currentTarget;
    dragging.current = true;
    target.setPointerCapture(e.pointerId);
    let lastX = e.clientX;

    const onMove = (ev) => {
      if (!dragging.current) return;
      const dx = ev.clientX - lastX;
      lastX = ev.clientX;
      onDelta(dx);
    };

    const onUp = (ev) => {
      dragging.current = false;
      try {
        target.releasePointerCapture(ev.pointerId);
      } catch {
        /* ignore */
      }
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize panels"
      onPointerDown={onPointerDown}
      className={cn(
        "group relative z-10 hidden shrink-0 cursor-col-resize select-none md:flex",
        "w-2 items-stretch justify-center bg-transparent px-0 touch-none",
      )}
    >
      <span
        className={cn(
          "pointer-events-none my-3 w-px flex-1 rounded-full bg-gray-200",
          "transition-colors group-hover:bg-[var(--brand-primary)]/60 group-active:bg-[var(--brand-primary)]",
        )}
      />
    </div>
  );
}

export default function EnquiriesResizableLayout({
  selectedThreadId,
  chatsColumn,
  chatColumn,
  filesColumn,
}) {
  const containerRef = useRef(null);
  const [containerW, setContainerW] = useState(0);
  const [listWidth, setListWidth] = useState(DEFAULT_LIST);
  const [filesWidth, setFilesWidth] = useState(DEFAULT_FILES);
  const isLg = useIsLargeScreen();

  useEffect(() => {
    try {
      const l = localStorage.getItem(STORAGE_LIST);
      const f = localStorage.getItem(STORAGE_FILES);
      if (l) {
        const n = Number(l);
        if (!Number.isNaN(n)) setListWidth(n);
      }
      if (f) {
        const n = Number(f);
        if (!Number.isNaN(n)) setFilesWidth(n);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LIST, String(Math.round(listWidth)));
    } catch {
      /* ignore */
    }
  }, [listWidth]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_FILES, String(Math.round(filesWidth)));
    } catch {
      /* ignore */
    }
  }, [filesWidth]);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setContainerW(el.getBoundingClientRect().width);
    });
    ro.observe(el);
    setContainerW(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  const clampList = useCallback(
    (w) => {
      const handles = isLg ? 2 : 1;
      const reserveFiles = isLg ? filesWidth : 0;
      const max =
        containerW > 0
          ? Math.min(
              MAX_LIST,
              containerW - handles * HANDLE - MIN_CHAT - reserveFiles,
            )
          : MAX_LIST;
      return Math.min(Math.max(MIN_LIST, w), Math.max(MIN_LIST, max));
    },
    [containerW, filesWidth, isLg],
  );

  const clampFiles = useCallback(
    (w) => {
      const max =
        containerW > 0
          ? Math.min(
              MAX_FILES,
              containerW - 2 * HANDLE - listWidth - MIN_CHAT,
            )
          : MAX_FILES;
      return Math.min(Math.max(MIN_FILES, w), Math.max(MIN_FILES, max));
    },
    [containerW, listWidth],
  );

  const onDragList = useCallback(
    (dx) => {
      setListWidth((prev) => clampList(prev + dx));
    },
    [clampList],
  );

  const onDragFiles = useCallback(
    (dx) => {
      setFilesWidth((prev) => clampFiles(prev + dx));
    },
    [clampFiles],
  );

  useEffect(() => {
    setListWidth((w) => clampList(w));
  }, [clampList, containerW, isLg]);

  useEffect(() => {
    if (!isLg) return;
    setFilesWidth((w) => clampFiles(w));
  }, [clampFiles, containerW, isLg, listWidth]);

  const shellClass =
    "w-full min-w-0 px-0 sm:px-1 sm:pb-2 mb-2 ms-1 flex min-h-0 flex-1 flex-col overflow-hidden";

  return (
    <div className={shellClass}>
      {/* Mobile */}
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden md:hidden">
        <div
          className={cn(
            "flex min-h-0 w-full flex-1 flex-col bg-white",
            "max-md:rounded-none max-md:border-0 max-md:border-b max-md:border-gray-100 max-md:shadow-none",
            selectedThreadId ? "hidden" : "flex",
          )}
        >
          {chatsColumn}
        </div>
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          {chatColumn}
        </div>
      </div>

      {/* Tablet + desktop */}
      <div
        ref={containerRef}
        className="hidden min-h-0 min-w-0 flex-1 overflow-hidden md:flex md:flex-row md:items-stretch"
      >
        <div
          className={cn(
            "flex min-h-0 shrink-0 flex-col bg-white sm:rounded-2xl sm:border sm:border-gray-100 sm:shadow-sm",
            "max-md:rounded-none max-md:border-0 max-md:border-b max-md:border-gray-100 max-md:shadow-none",
            selectedThreadId ? "hidden min-[768px]:flex" : "flex",
          )}
          style={{ width: listWidth }}
        >
          {chatsColumn}
        </div>

        <ColumnResizeHandle onDelta={onDragList} />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          {chatColumn}
        </div>

        {isLg ? (
          <>
            <ColumnResizeHandle onDelta={onDragFiles} />
            <div
              className="flex min-h-0 shrink-0 flex-col overflow-hidden"
              style={{ width: filesWidth }}
            >
              {filesColumn}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
