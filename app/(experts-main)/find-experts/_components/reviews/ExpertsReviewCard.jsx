"use client";

export default function ExpertsReviewCard({ className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-white/25 bg-white/15 backdrop-blur-md p-5 sm:p-6 w-64 sm:w-72 shrink-0 ${className}`}
    >
      <div className="w-10 h-10 bg-white/25 rounded-lg mb-4" aria-hidden />
      <p className="text-white font-medium text-sm leading-relaxed">
        Lorem ipsum dolor sit amet
      </p>
    </div>
  );
}
