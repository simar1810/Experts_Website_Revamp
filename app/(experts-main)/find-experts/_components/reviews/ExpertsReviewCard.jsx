"use client";

import Image from "next/image";
import { Star } from "lucide-react";

export default function ExpertsReviewCard({
  name,
  role,
  content,
  imageSrc,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col sm:flex-row overflow-hidden rounded-2xl bg-white shadow-xl w-[320px] sm:w-[600px] shrink-0 ${className}`}
    >
      <div className="relative h-64 sm:h-auto sm:w-2/5 shrink-0">
        <Image
          src={imageSrc}
          alt={name}
          fill
          className="object-cover object-top"
        />
      </div>

      <div className="flex flex-col p-6 sm:p-8 sm:w-3/5 bg-white relative">
        <div className="mb-4 inline-block self-start bg-wz-top-green px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
          Client Testimonial
        </div>

        <span className="text-4xl font-serif text-wz-top-green leading-none">“</span>

        <p className="mt-2 text-sm leading-relaxed text-neutral-700 font-medium italic">
          {content}
        </p>

        <div className="mt-auto pt-6">
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