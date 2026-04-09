"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Ellipsis,
} from "lucide-react";

export default function ExpertsPagination({
  page = 1,
  onPageChange,
  hasNextPage = false,
  hasPrevPage = false,
  totalPages = 0,
}) {
  const resolvedTotalPages =
    Number(totalPages) > 0
      ? Number(totalPages)
      : hasNextPage
        ? Math.max(page + 1, 10)
        : Math.max(page, 1);
  const pages = [1, 2, 3].filter((p) => p <= resolvedTotalPages);
  const showDots = resolvedTotalPages > 4;
  const showLast = resolvedTotalPages > 3;

  const baseBtn =
    "inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 text-xs font-semibold hover:border-[#70C136] hover:text-[#70C136] transition-colors";

  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-10"
      aria-label="Pagination"
    >
      <button
        type="button"
        disabled={!hasPrevPage || page <= 1}
        onClick={() => onPageChange(1)}
        className={`${baseBtn} disabled:opacity-40 disabled:pointer-events-none`}
        aria-label="First page"
      >
        <ChevronsLeft className="w-4 h-4" />
      </button>
      <button
        type="button"
        disabled={!hasPrevPage || page <= 1}
        onClick={() => onPageChange(page - 1)}
        className={`${baseBtn} disabled:opacity-40 disabled:pointer-events-none`}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          className={
            p === page
              ? "inline-flex h-7 w-7 items-center justify-center rounded-md border border-[#70C136] bg-[#70C136] text-white text-xs font-semibold transition-colors"
              : baseBtn
          }
        >
          {p}
        </button>
      ))}
      {showDots && (
        <span className="px-1 text-gray-400 text-xs font-semibold" aria-hidden>
          <Ellipsis className="w-4 h-4" />
        </span>
      )}
      {showLast && (
        <button
          type="button"
          onClick={() => onPageChange(resolvedTotalPages)}
          className={
            page === resolvedTotalPages
              ? "inline-flex h-7 w-7 items-center justify-center rounded-md border border-[#70C136] bg-[#70C136] text-white text-xs font-semibold transition-colors"
              : baseBtn
          }
        >
          {resolvedTotalPages}
        </button>
      )}
      <button
        type="button"
        disabled={!hasNextPage}
        onClick={() => onPageChange(page + 1)}
        className={`${baseBtn} disabled:opacity-40 disabled:pointer-events-none`}
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
      <button
        type="button"
        disabled={!hasNextPage}
        onClick={() => onPageChange(resolvedTotalPages)}
        className={`${baseBtn} disabled:opacity-40 disabled:pointer-events-none`}
        aria-label="Last page"
      >
        <ChevronsRight className="w-4 h-4" />
      </button>
    </nav>
  );
}
