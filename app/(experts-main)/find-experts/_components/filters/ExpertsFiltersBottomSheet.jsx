"use client";

import { useState, useRef, useCallback } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const DISMISS_DRAG_PX = 80;

/**
 * Mobile filters in a shadcn Sheet (bottom). Drag the handle downward to close.
 */
export default function ExpertsFiltersBottomSheet({
  open,
  onOpenChange,
  children,
}) {
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const activeRef = useRef(false);

  const handleOpenChange = useCallback(
    (next) => {
      setDragY(0);
      setIsDragging(false);
      activeRef.current = false;
      onOpenChange(next);
    },
    [onOpenChange],
  );

  const endDrag = useCallback(
    (clientY) => {
      if (!activeRef.current) return;
      activeRef.current = false;
      setIsDragging(false);
      const dy = Math.max(0, clientY - startYRef.current);
      setDragY(0);
      if (dy > DISMISS_DRAG_PX) {
        handleOpenChange(false);
      }
    },
    [handleOpenChange],
  );

  const handlePointerDown = (e) => {
    activeRef.current = true;
    setIsDragging(true);
    startYRef.current = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!activeRef.current) return;
    setDragY(Math.max(0, e.clientY - startYRef.current));
  };

  const handlePointerUp = (e) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    endDrag(e.clientY);
  };

  const handlePointerCancel = (e) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    activeRef.current = false;
    setIsDragging(false);
    setDragY(0);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="bottom"
        showCloseButton
        className="flex max-h-[min(92dvh,920px)] flex-col gap-0 overflow-hidden rounded-t-2xl border border-gray-200 bg-white p-0 shadow-lg [&>button]:top-3"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>
            Refine experts by distance, specializations, and consultation mode.
          </SheetDescription>
        </SheetHeader>
        <div
          className="flex min-h-0 max-h-[min(92dvh,920px)] flex-1 flex-col"
          style={{
            transform: dragY > 0 ? `translateY(${dragY}px)` : undefined,
            transition: isDragging ? "none" : "transform 0.2s ease-out",
          }}
        >
          <div
            role="button"
            tabIndex={0}
            aria-label="Drag down to close filters"
            className="flex shrink-0 cursor-grab touch-none flex-col items-center bg-white py-3 active:cursor-grabbing"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleOpenChange(false);
              }
            }}
          >
            <div className="h-1.5 w-11 shrink-0 rounded-full bg-gray-300" />
          </div>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            {children}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
