"use client";
import { useState } from "react";
import { Play } from "lucide-react";

export default function TestimonialShowcase({
  videos,
}) {
  const [active, setActive] = useState(Math.floor(videos.length / 2));

  return (
    <section className="w-full bg-[#1f7a34] p-10 md:p-16 relative overflow-hidden mt-40">
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:40px_40px]" />

      <h2 className="relative z-10 text-center text-3xl md:text-5xl font-semibold text-white mb-16">
        Why do <span className="font-bold">6000+ professionals</span> believe in
        WellnessZ?
      </h2>

      <div className="relative z-10 flex items-center justify-center gap-4">
        {videos.map((video, index) => {
          const isActive = index === active;

          return (
            <div
              key={index}
              onClick={() => setActive(index)}
              className={`relative cursor-pointer transition-all duration-500 ease-in-out ${
                isActive
                  ? "w-[280px] md:w-[420px] h-[380px] md:h-[500px]"
                  : "w-[60px] md:w-[80px] h-[320px] md:h-[420px]"
              }`}
            >
              <video
                src={video.src}
                className="h-full w-full object-cover rounded-xl"
                muted
                loop
                autoPlay={isActive}
              />

              <div
                className={`absolute inset-0 rounded-xl transition ${
                  isActive
                    ? "bg-black/20"
                    : "bg-black/60 flex items-center justify-center"
                }`}
              >
                {!isActive && (
                  <span className="rotate-90 text-white text-xs md:text-sm tracking-widest font-semibold">
                    {video.name.toUpperCase()}
                  </span>
                )}
              </div>

              {isActive && (
                <>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/80 backdrop-blur-md p-3 rounded-full">
                      <Play className="h-5 w-5 text-black" />
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="font-semibold">{video.name}</p>
                    <p className="text-xs opacity-80">Professional</p>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}