"use client"
import FeatureSection from "@/features/subscription/components/FeatureSection"
import HeroPricing from "@/features/subscription/components/HeroPricing"
import PricingSection from "@/features/subscription/components/PricingSection"
import TestimonialShowcase from "@/features/subscription/components/TestimonialShowcase"
import { PRICING_TESTIMONIALS } from "@/features/subscription/utils/testimonialVideos"

export default function Page() {
	return (
		<main className="min-h-dvh w-full max-w-full overflow-x-clip scroll-smooth bg-white font-lato text-neutral-900 antialiased">
			<HeroPricing />
			<FeatureSection />
			<TestimonialShowcase
				testimonialsLabel="View all testimonials"
				testimonialsHref="/testimonials"
				testimonials={PRICING_TESTIMONIALS}
			/>
			<PricingSection />
		</main>
	)
}
