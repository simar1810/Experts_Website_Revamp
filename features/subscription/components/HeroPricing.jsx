import { Button } from "@/components/ui/button";
import Image from "next/image";

const HeroPricing = function () {
  return (
    <section className="relative min-h-screen w-full bg-white px-4 mt-8 md:mb-20 relative">
      <div className="relative mx-auto max-w-[1400px] rounded-[40px] bg-gradient-to-br pb-0 pt-16 text-center text-white rounded-[20px] md:pt-24">
        <Image
          fill
          src="/images/pricing-hero.svg"
          className="z-[0] object-cover rounded-[20px]"
          alt=""
        />
        <div className="mx-auto px-6 z-[1] relative flex flex-col items-center justify-center md:h-[75vh] leading-tight">
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

          <div className="mb-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              className="h-12 w-full rounded-xl bg-white px-8 text-sm font-semibold text-[#1B5E20] hover:bg-white/90 sm:w-auto md:h-14 md:text-base"
            >
              Start your 14-day trial
            </Button>
            <Button
              variant="outline"
              className="h-12 w-full rounded-xl border-none bg-[#76C733] px-8 text-sm font-semibold text-white hover:bg-[#68b12d] sm:w-auto md:h-14 md:text-base"
            >
              Book a Demo
            </Button>
          </div>

          <p className="md:mb-48 text-[10px] text-white/70 md:text-xs">
            14-day free trial - Your own branded app - Built for coaches,
            clinics & studios
          </p>

          <div className="mx-auto flex max-w-4xl w-full justify-center px-4 absolute bottom-0 translate-y-1/2 z-20">
            <div className="relative z-10 w-full overflow-hidden rounded-3xl border-[6px] border-[#67BC2A] bg-black shadow-2xl transition-transform duration-500 hover:scale-[1.01]">
              <div className="aspect-[18/9] w-full" />
            </div>

            <div className="absolute -bottom-2 left-1/2 h-full w-[95%] -translate-x-1/2 rounded-t-3xl border border-white/20 bg-white/5 opacity-30" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroPricing;