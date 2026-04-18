"use client";

import { useMemo } from "react";

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

  /** Two identical sequences for seamless CSS loop (translateX -50%). */
  const marqueeItems = useMemo(
    () => [...carouselItems, ...carouselItems],
    [carouselItems],
  );

  return (
    <section className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">
          Explore Categories
        </h2>
        <p className="text-gray-400 mb-8 text-xs sm:text-sm uppercase tracking-widest font-medium">
          Find the best experts to help you reach your goals
        </p>

        <div className="group/marquee relative overflow-x-hidden">
          <div
            className="flex gap-4 pb-4 select-none animate-marquee-left motion-reduce:animate-none group-hover/marquee:paused"
            style={{ "--marquee-duration": "70s" }}
          >
            {marqueeItems.map(({ name, file }, index) => (
              <div
                key={`${name}-${index}`}
                className="shrink-0 w-56 sm:w-64 bg-gray-900 p-5 rounded-2xl border border-gray-800 hover:border-lime-500 transition-all cursor-default group/item"
              >
                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-800 rounded-xl mb-4 group-hover/item:bg-lime-500/20 transition-colors flex items-center justify-center p-1.5 sm:p-2"
                  aria-hidden
                >
                  <img
                    src={categoryPngSrc(file)}
                    alt=""
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <h3 className="font-bold text-gray-200 group-hover/item:text-lime-500 transition-colors text-sm sm:text-base leading-tight">
                  {name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
