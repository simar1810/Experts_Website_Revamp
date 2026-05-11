"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const QUOTE =
  "We admire the butterfly's beauty, but rarely admit the changes it went through to achieve it.";

const VISIBLE_SLIDE = 3;

export default function ExpertClientTransformations({ details }) {
  const items = useMemo(
    () =>
      Array.isArray(details?.clientTransformations)
        ? details.clientTransformations.filter(
            (row) =>
              row &&
              typeof row.beforeUrl === "string" &&
              typeof row.afterUrl === "string" &&
              row.beforeUrl.trim() &&
              row.afterUrl.trim(),
          )
        : [],
    [details?.clientTransformations],
  );

  const maxStart = Math.max(0, items.length - VISIBLE_SLIDE);
  const [start, setStart] = useState(0);

  useEffect(() => {
    setStart(0);
  }, [items.length]);

  if (items.length === 0) return null;

  const visible = items.slice(start, start + VISIBLE_SLIDE);

  return (
    <section className="w-full bg-white px-4 py-10 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center font-serif text-3xl font-bold text-[#0d3b1f] sm:text-4xl">
          Client Transformations
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-[#7a8a82] sm:text-[15px]">
          {QUOTE}
        </p>

        <div className="relative mt-10">
          <div className="mx-auto flex max-w-5xl flex-wrap items-stretch justify-center gap-4 sm:gap-5 lg:flex-nowrap">
            {visible.map((row, i) => (
              <div
                key={`${row.beforeUrl}-${start + i}`}
                className="w-full max-w-[340px] shrink-0 rounded-2xl border border-gray-200/90 bg-white p-3 shadow-sm sm:max-w-[300px] lg:w-[30%] lg:min-w-0"
              >
                <div className="grid grid-cols-2 gap-2">
                  <div className="overflow-hidden rounded-xl bg-[#f0f4f2]">
                    <div className="relative aspect-3/4 w-full">
                      <Image
                        src={row.beforeUrl}
                        alt="Before"
                        fill
                        sizes="(max-width: 768px) 45vw, 200px"
                        className="object-cover"
                      />
                    </div>
                    <p className="py-1.5 text-center text-[11px] font-semibold uppercase tracking-wide text-[#5d6d65]">
                      Before
                    </p>
                  </div>
                  <div className="overflow-hidden rounded-xl bg-[#f0f4f2]">
                    <div className="relative aspect-3/4 w-full">
                      <Image
                        src={row.afterUrl}
                        alt="After"
                        fill
                        sizes="(max-width: 768px) 45vw, 200px"
                        className="object-cover"
                      />
                    </div>
                    <p className="py-1.5 text-center text-[11px] font-semibold uppercase tracking-wide text-[#5d6d65]">
                      After
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {items.length > VISIBLE_SLIDE && (
            <div className="mt-8 flex justify-center gap-4">
              <button
                type="button"
                aria-label="Previous transformations"
                disabled={start <= 0}
                onClick={() => setStart((s) => Math.max(0, s - 1))}
                className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#7ABE39] text-[#2d7a1f] transition enabled:hover:bg-[#7ABE39]/10 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronLeft className="h-6 w-6" strokeWidth={2} />
              </button>
              <button
                type="button"
                aria-label="Next transformations"
                disabled={start >= maxStart}
                onClick={() =>
                  setStart((s) => Math.min(maxStart, s + 1))
                }
                className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#7ABE39] text-[#2d7a1f] transition enabled:hover:bg-[#7ABE39]/10 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronRight className="h-6 w-6" strokeWidth={2} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
