"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ExpertsReviewCard({
  name,
  role,
  content,
  imageSrc,
  className = "",
}) {
  const hasLongContent = typeof content === "string" && content.length > 190;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const backdropOverlay =
    isDialogOpen && typeof document !== "undefined"
      ? createPortal(
          <button
            type="button"
            aria-label="Close testimonial dialog"
            onClick={() => setIsDialogOpen(false)}
            className="fixed inset-0 z-40 border-0 bg-black/35 p-0 supports-backdrop-filter:backdrop-blur-sm"
          />,
          document.body,
        )
      : null;

  const openDialog = () => {
    const scroller = document.scrollingElement;
    const scrollTop = scroller?.scrollTop ?? window.scrollY ?? 0;
    setIsDialogOpen(true);
    requestAnimationFrame(() => {
      if (scroller) scroller.scrollTop = scrollTop;
      window.scrollTo(0, scrollTop);
      requestAnimationFrame(() => {
        if (scroller) scroller.scrollTop = scrollTop;
        window.scrollTo(0, scrollTop);
      });
    });
  };

  return (
    <div
      className={`flex h-[420px] sm:h-[320px] flex-col sm:flex-row overflow-hidden rounded-2xl bg-white shadow-xl w-[320px] sm:w-[560px] shrink-0 ${className}`}
    >
      <div className="relative h-44 sm:h-full sm:w-2/5 shrink-0">
        <Image
          src={imageSrc}
          alt={name}
          fill
          className="object-cover object-top"
        />
      </div>

      <div className="flex flex-col p-5 sm:p-6 sm:w-3/5 bg-white relative font-lato">
        <span className="text-3xl text-wz-top-green leading-none">“</span>

        <p className="text-xs leading-relaxed text-neutral-700 font-medium italic line-clamp-6 sm:line-clamp-7">
          {content}
        </p>

        {hasLongContent ? (
          <>
            {backdropOverlay}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} modal={false}>
              <button
                type="button"
                onClick={openDialog}
                className="mt-1 self-start text-xs font-bold text-wz-top-green underline underline-offset-2 transition-opacity hover:opacity-80"
                aria-label={`Read full testimonial by ${name}`}
              >
                Read more
              </button>
              <DialogContent
                className="max-w-[92vw] sm:max-w-2xl p-0 overflow-hidden"
                onOpenAutoFocus={(e) => {
                  // Prevent browser from scrolling the page to focus dialog content.
                  e.preventDefault();
                }}
                onCloseAutoFocus={(e) => {
                  // Prevent focus restoration from scrolling back to trigger position.
                  e.preventDefault();
                }}
              >
                <DialogHeader className="border-b px-5 py-4 sm:px-6">
                  <DialogTitle className="font-lato text-lg font-black tracking-tight text-neutral-900">
                    {name}
                  </DialogTitle>
                  <DialogDescription className="font-lato text-xs font-semibold italic text-neutral-500">
                    {role}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 p-5 sm:grid-cols-[180px_1fr] sm:gap-6 sm:p-6">
                  <div className="relative h-36 overflow-hidden rounded-xl sm:h-full sm:min-h-[220px]">
                    <Image
                      src={imageSrc}
                      alt={name}
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="max-h-[56vh] overflow-y-auto pr-1">
                    <p className="font-lato text-sm leading-relaxed text-neutral-700 italic">
                      {content}
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </>
        ) : null}

        <div className="mt-auto pt-4">
          <h4 className="text-base font-extrabold uppercase tracking-tight text-neutral-900">
            {name}
          </h4>
          <p className="text-xs font-bold text-neutral-500 italic">
            {role}
          </p>

          <div className="mt-4 flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className="fill-orange-400 text-orange-400"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}