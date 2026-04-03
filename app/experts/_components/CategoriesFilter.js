"use client";
import { useState } from "react";
import { useValues } from "@/context/valuesContext";
import { getFilteredExperts } from "@/lib/experts_fetch";

export default function CategoriesFilter({
  setFilteredExperts,
  setSelectedSpecialities,
}) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const { values } = useValues();
  const availableCategories = values.expertise_categories;

  const handleSelect = async (category) => {
    if (category === selectedCategory) {
      setSelectedCategory("");
      setSelectedSpecialities([]);
      const data = await getFilteredExperts({});
      setFilteredExperts(Array.isArray(data) ? data : []);
      return;
    }
    setSelectedCategory(category);
    setSelectedSpecialities([category]);
    const data = await getFilteredExperts({
      expertiseTags: [category],
    });
    setFilteredExperts(Array.isArray(data) ? data : []);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 mt-15 mb-10">
      <div className="mb-4 text-center sm:text-left">
        <h2 className="text-xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Popular Categories
        </h2>
        <p className="text-gray-400 text-[10px] sm:text-sm mt-1 uppercase tracking-widest font-bold opacity-80">
          Popular specializations you can choose from
        </p>
      </div>

      <div className="flex flex-wrap justify-center sm:justify-start gap-2.5 sm:gap-3">
        {availableCategories.map((cat, i) => (
          <button
            key={i}
            className={`px-4 sm:px-7 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest border transition-all ${cat === selectedCategory ? "bg-[#84cc16] text-white border-[#84cc16] shadow-lg shadow-lime-500/20" : "bg-white text-gray-500 border-gray-100 hover:border-[#84cc16] hover:text-[#84cc16] hover:shadow-md"}`}
            onClick={() => handleSelect(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </section>
  );
}
