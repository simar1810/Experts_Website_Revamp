"use client"
import ContactSection from "@/features/subscription/components/ContactSection"
import DeliverySection from "@/features/subscription/components/DeliverySection"
import FeatureSection from "@/features/subscription/components/FeatureSection"
import HeroPricing from "@/features/subscription/components/HeroPricing"
import PricingSection from "@/features/subscription/components/PricingSection"
import TestimonialShowcase from "@/features/subscription/components/TestimonialShowcase"
import { PRICING_TESTIMONIAL_VIDEOS } from "@/features/subscription/utils/testimonialVideos"
export default function Page() {
	return (
		<main className="min-h-dvh scroll-smooth bg-white font-lato text-neutral-900 antialiased">
			<HeroPricing />
			<FeatureSection />
			<TestimonialShowcase
				testimonialsLabel="View all testimonials"
				testimonialsHref="/testimonials"
				videos={PRICING_TESTIMONIAL_VIDEOS}
			/>
			<DeliverySection />
			<PricingSection />
			<ContactSection />
		</main>
	)
}