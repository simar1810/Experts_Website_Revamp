import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { features } from "../utils/config";

const FeatureSection = function () {
  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="mb-16 text-center text-2xl font-bold md:mb-24 md:text-4xl">
          Why do <span className="text-[#76C733]">6000+ Health Coaches</span> use
          WellnessZ App?
        </h2>

        <div className="flex flex-col gap-20 md:gap-32">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex flex-col items-center gap-10 md:flex-row md:gap-20 ${
                feature.imageSide === "right" ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="w-full md:w-1/2">
                <div className="aspect-[4/5] md:max-h-[70vh] w-full rounded-sm bg-[#E5E5E5] shadow-sm md:aspect-[3/4]" />
              </div>

              <div className="w-full space-y-6 md:w-1/2">
                <div className="flex items-start gap-2">
                  <MoveRight className="mt-1.5 h-5 w-5 shrink-0 text-black" />
                  <h3 className="text-xl font-bold leading-tight tracking-tight text-black md:text-2xl">
                    {feature.title}
                  </h3>
                </div>

                <p className="text-sm leading-relaxed text-gray-500 md:text-base">
                  {feature.description}
                </p>

                <div className="space-y-4 border-t border-gray-100 pt-6">
                  {feature.subFeatures.map((sub, i) => (
                    <div
                      key={i}
                      className="border-b border-gray-100 pb-3 text-xs font-semibold tracking-widest text-gray-400 md:text-sm"
                    >
                      {sub}
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <Button
                    variant="outline"
                    className="h-10 rounded-lg border-[#2E7D32] px-6 text-xs font-bold text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white"
                  >
                    Start your 14-day trial
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;