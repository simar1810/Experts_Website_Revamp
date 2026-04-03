"use client";

import Link from "next/link";
import { useRef, useState, useEffect, useCallback, useMemo } from "react";

/** PNG assets in `public/png` (filenames must match disk exactly). */
const EXPERT_CATEGORY_ITEMS = [
  { name: "Strength Training", file: "Strebth Training.png" },
  { name: "Zumba", file: "Zumba.png" },
  { name: "Yoga", file: "Yoga.png" },
  { name: "Sports Nutrition", file: "Sports Nutrition.png" },
  { name: "Clinical Nutrition", file: "Clinical Nutrition.png" },
  { name: "Pain Management", file: "Pain Management.png" },
  { name: "Powerlifting", file: "Powerlifting.png" },
  { name: "Crossfit", file: "Crossfit.png" },
  { name: "Calisthenics", file: "Calisthenics.png" },
  { name: "Sports Specific Training", file: "Sport Specific Training.png" },
  { name: "Women Health Specialization", file: "Women Health.png" },
  { name: "Pilates", file: "Pilates.png" },
  { name: "Power Yoga", file: "Power Yoga.png" },
  { name: "Martial Arts", file: "Martial Arts.png" },
  { name: "Weightlifting", file: "Weight Lifting.png" },
  { name: "HIIT", file: "HIIT.png" },
  { name: "Physiotherapy", file: "Physiotherapy.png" },
  { name: "Well Being", file: "well Being.png" },
  { name: "Education", file: "Education.png" },
  { name: "Home Workouts", file: "Home Workout.png" },
];

function categoryPngSrc(file) {
  return `/png/${encodeURIComponent(file)}`;
}

export default function ExpertCategories() {
  const scrollRef = useRef(null);
  const trackRef = useRef(null);
  const thumbRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const thumbWidth = 120;

  const carouselItems = useMemo(() => {
    const minSlots = 10;
    if (EXPERT_CATEGORY_ITEMS.length >= minSlots) {
      return EXPERT_CATEGORY_ITEMS;
    }
    const out = [];
    while (out.length < minSlots) {
      for (const item of EXPERT_CATEGORY_ITEMS) {
        out.push(item);
        if (out.length >= minSlots) break;
      }
    }
    return out;
  }, []);

  const updateThumbPosition = useCallback(() => {
    if (scrollRef.current && thumbRef.current && trackRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const totalScroll = scrollWidth - clientWidth;

      if (totalScroll > 0) {
        const progress = scrollLeft / totalScroll;
        const maxTranslate = clientWidth - thumbWidth;
        const translateX = progress * maxTranslate;
        thumbRef.current.style.transform = `translateX(${translateX}px)`;
      }
    }
  }, [thumbWidth]);

  const handleScroll = () => {
    window.requestAnimationFrame(updateThumbPosition);
  };

  useEffect(() => {
    if (scrollRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        updateThumbPosition();
      });
      resizeObserver.observe(scrollRef.current);
      updateThumbPosition();
      return () => resizeObserver.disconnect();
    }
  }, [updateThumbPosition, carouselItems.length]);

  const handleDrag = useCallback(
    (e) => {
      if (!isDragging && e.type !== "mousedown" && e.type !== "touchstart")
        return;

      const track = trackRef.current;
      const scrollContainer = scrollRef.current;
      if (!track || !scrollContainer) return;

      const rect = track.getBoundingClientRect();
      const clientX = e.clientX || e.touches?.[0]?.clientX;
      const clickX = clientX - rect.left - thumbWidth / 2;
      const maxTrackX = rect.width - thumbWidth;

      const progress = Math.max(0, Math.min(clickX / maxTrackX, 1));
      const scrollAmount =
        progress * (scrollContainer.scrollWidth - scrollContainer.clientWidth);

      scrollContainer.scrollTo({
        left: scrollAmount,
        behavior: isDragging ? "auto" : "smooth",
      });
    },
    [isDragging, thumbWidth],
  );

  const handleDragStart = (e) => {
    setIsDragging(true);
    handleDrag(e);
  };

  useEffect(() => {
    const onEnd = () => setIsDragging(false);
    const onMove = (e) => isDragging && handleDrag(e);

    if (isDragging) {
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onEnd);
      window.addEventListener("touchmove", onMove, { passive: false });
      window.addEventListener("touchend", onEnd);
    }
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [isDragging, handleDrag]);

  return (
    <section className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">
          Explore Categories
        </h2>
        <p className="text-gray-400 mb-8 text-xs sm:text-sm uppercase tracking-widest font-medium">
          Find the best experts to help you reach your goals
        </p>

        <>
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x snap-mandatory select-none scroll-smooth"
          >
            {carouselItems.map(({ name, file }, index) => (
              <Link
                key={`${name}-${index}`}
                href={`/experts?speciality=${encodeURIComponent(name)}`}
                className="shrink-0 w-56 sm:w-64 bg-gray-900 p-5 rounded-2xl border border-gray-800 hover:border-lime-500 transition-all cursor-pointer group snap-start block"
              >
                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-800 rounded-xl mb-4 group-hover:bg-lime-500/20 transition-colors flex items-center justify-center p-1.5 sm:p-2"
                  aria-hidden
                >
                  <img
                    src={categoryPngSrc(file)}
                    alt=""
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <h3 className="font-bold text-gray-200 group-hover:text-lime-500 transition-colors text-sm sm:text-base leading-tight">
                  {name}
                </h3>
              </Link>
            ))}
          </div>

          <div
            ref={trackRef}
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            className="w-full h-1 bg-gray-800 mt-8 rounded-full relative cursor-pointer group/track"
          >
            <div
              ref={thumbRef}
              className={`h-full bg-lime-500 rounded-full absolute top-0 left-0 will-change-transform ${isDragging ? "" : "transition-transform duration-150 ease-out"}`}
              style={{
                width: `${thumbWidth}px`,
              }}
            />
          </div>
        </>
      </div>
    </section>
  );
}
