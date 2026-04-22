import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

const HeroPricing = function () {
  return (
    <section className="relative w-full bg-white p-4 relative">
      <div className="relative mx-auto max-w-[1400px] rounded-[40px] bg-gradient-to-br pb-0 pt-16 text-center text-white rounded-[20px] md:pt-24">
        <Image
          fill
          priority
          src="/images/pricing-hero.svg"
          className="z-[0] object-cover rounded-[20px]"
          alt=""
        />
        <div className="mx-auto px-6 z-[1] relative flex flex-col items-center justify-center h-[60vh] md:h-[75vh] leading-tight">
          <h1 className="text-[30px] font-bold tracking-tight md:text-[60px]">
            Manage 100+ clients, not just 10-20.
          </h1>

          <p className="mx-auto max-w-[100ch] mb-8 text-sm text-white/90 md:text-lg">
            Automate onboarding, plans, progress tracking, reports, payments,
            and communication so you can scale your wellness business with
            WellnessZ.
          </p>

          <div className="mx-auto mb-10 inline-block rounded-full border border-white/20 bg-white/10 px-6 py-2 text-xs font-medium backdrop-blur-md md:text-sm">
            Made for wellness coaches, nutritionists, fitness trainers,
            dietitians, clinics, and studios.
          </div>

          <div className="mb-6 flex items-center justify-center gap-4 flex-row">
            <a
              href="#pricing-plans"
              className={cn(
                buttonVariants({ variant: "default", size: "default" }),
                "h-12 rounded-xl bg-white px-8 text-sm font-semibold text-[#1B5E20] hover:bg-white/90 hover:text-[#1B5E20] sm:w-auto md:h-14 md:text-base lg:w-full"
              )}
            >
              Start your 14-day trial
            </a>
            <Button
              variant="outline"
              className="h-12 lg:w-full rounded-xl border-none bg-[#76C733] px-8 text-sm font-semibold text-white hover:bg-[#68b12d] sm:w-auto md:h-14 md:text-base"
            >
              Book a Demo
            </Button>
          </div>

          <p className="mb-20 md:mb-48 text-[10px] text-white/70 md:text-xs">
            14-day free trial - Your own branded app - Built for coaches,
            clinics & studios
          </p>

        </div>
      </div>
      <div className="w-full px-4 -translate-y-[80px] md:translate-y-[-150px]">
        <div className="
          bg-black max-w-xl md:max-w-2xl lg:max-w-3xl aspect-video mx-auto border-4 border-[#67BC2A] rounded-[16px]
          relative after:absolute after:inset-0 after:rounded-[inherit] after:border-2 after:border-[#D9D9D9]
          after:content-[''] after:rotate-[4deg] after:z-[-1]
        " />
      </div>
    </section>
  );
};

export default HeroPricing;