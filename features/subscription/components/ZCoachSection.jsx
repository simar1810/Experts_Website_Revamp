import { buttonVariants } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const BENEFITS = [
  "Get discovered across the ZeeFit ecosystem",
  "Build trust with WZ Assured and premium placements",
  "Get featured on blogs, articles, and partner platforms",
  "Gain wider reach through centralized paid promotion",
  "Strengthen your personal brand with a branded app",
];

const APPLY_MAIL =
  "mailto:support@wellnessz.in?subject=Z-Coach%20Application&body=Please%20share%20a%20bit%20about%20your%20coaching%20practice%20and%20goals%20for%20Z-Coach.";

export default function ZCoachSection() {
  return (
    <section
      id="z-coach"
      className="w-full border-t border-gray-100 bg-gradient-to-b from-[#0f1f16] to-[#1a2e1f] py-20 text-white md:py-28"
    >
      <div className="mx-auto max-w-[1000px] px-4 md:px-6">
        <h2 className="text-center text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          Built for Coaches Ready to Operate in a Different League
        </h2>
        <p className="mx-auto mt-5 max-w-[70ch] text-center text-base leading-relaxed text-white/80 md:text-lg">
          Z-Coach is for coaches who want more than just visibility. It is designed
          for those who want stronger trust, better placements, premium exposure, and
          a brand that feels bigger than a single page on social media.
        </p>
        <ul className="mx-auto mt-12 max-w-[560px] space-y-4">
          {BENEFITS.map((line) => (
            <li key={line} className="flex items-start gap-3 text-[15px] leading-snug md:text-base">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#67BC2A]">
                <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
              </span>
              <span className="text-white/90">{line}</span>
            </li>
          ))}
        </ul>
        <div className="mt-12 flex justify-center">
          <a
            href={APPLY_MAIL}
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-14 rounded-xl bg-white px-10 text-base font-semibold text-[#0f1f16] hover:bg-white/90"
            )}
          >
            Apply for Z-Coach
          </a>
        </div>
      </div>
    </section>
  );
}
