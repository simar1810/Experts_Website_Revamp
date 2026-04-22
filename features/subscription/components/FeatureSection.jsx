"use client";

import { MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { features } from "../utils/config";

export default function FeatureSection() {
  return (
    <section className="w-full bg-[#f8fafc]">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="py-20 text-center text-3xl font-semibold tracking-tight md:py-28 md:text-5xl">
          Why do{" "}
          <span className="bg-gradient-to-r from-[#76C733] to-[#4CAF50] bg-clip-text text-transparent">
            7000+ Health Coaches
          </span>{" "}
          use WellnessZ App?
        </h2>
      </div>

      <div className="relative mx-auto max-w-[1400px] px-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="sticky top-0 flex h-screen items-center py-10"
            style={{
              zIndex: index + 1,
            }}
          >
            <div className="w-full rounded-2xl bg-white/80 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-gray-100 p-6 md:p-10 transition-all duration-500">
              <div
                className={`flex flex-col items-center gap-12 md:flex-row md:gap-20 ${
                  feature.imageSide === "right"
                    ? "md:flex-row-reverse"
                    : ""
                }`}
              >
                <div className="w-full md:w-1/2">
                  <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200">
                    <div className="aspect-[4/5] w-full md:aspect-[3/4]" />

                    <div className="absolute inset-0 bg-black/5" />
                  </div>
                </div>

                <div className="w-full space-y-6 md:w-1/2">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-black p-2 text-white">
                      <MoveRight className="h-4 w-4" />
                    </div>

                    <h3 className="text-2xl font-semibold leading-tight md:text-3xl">
                      {feature.title}
                    </h3>
                  </div>

                  <p className="text-base leading-relaxed text-gray-500">
                    {feature.description}
                  </p>

                  <div className="space-y-3 pt-4">
                    {feature.subFeatures.map((sub, i) => (
                      <div
                        key={i}
                        className="group flex items-center justify-between rounded-md border border-gray-100 px-4 py-3 text-sm font-medium text-gray-500 transition hover:border-gray-300 hover:bg-gray-50"
                      >
                        {sub}
                      </div>
                    ))}
                  </div>

                  <div className="pt-6">
                    <Button
                      asChild
                      className="rounded-lg bg-[#2E7D32] px-6 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-[#256628]"
                    >
                      <a href="#pricing-plans">Start your 14-day trial</a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="h-screen" />
      </div>
    </section>
  );
}