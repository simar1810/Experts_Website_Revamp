/** Minimal placeholder shown while below-the-fold landing sections lazy-load their JS bundles. */
export function LandingSectionSkeleton({ className = "" }) {
  return (
    <div
      className={`min-h-[12rem] w-full animate-pulse rounded-xl bg-neutral-100/90 sm:min-h-[16rem] ${className}`.trim()}
      aria-hidden
    />
  );
}
