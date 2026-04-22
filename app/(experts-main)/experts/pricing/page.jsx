"use client"
import HeroPricing from "@/features/subscription/components/HeroPricing"
import FeatureSection from "@/features/subscription/components/FeatureSection"
import DeliverySection from "@/features/subscription/components/DeliverySection"
import PricingSection from "@/features/subscription/components/PricingSection"
import LogoMarquee from "@/features/subscription/components/LogoMarquee"
import TestimonialShowcase from "@/features/subscription/components/TestimonialShowcase"
import ContactSection from "@/features/subscription/components/ContactSection"
export default function Page() {
	return (
		<main className="min-h-dvh scroll-smooth bg-white font-lato text-neutral-900 antialiased">
			<HeroPricing />
			<LogoMarquee />
			<FeatureSection />
			<TestimonialShowcase videos={[
				{ src: "/videos/Simarpreet.mp4", name: "Simarpreet" },
				{ src: "/videos/Raghav.mp4", name: "Raghav" },
				{ src: "/videos/Basic.mp4", name: "Basic" },
				{ src: "/videos/Souvik.mp4", name: "Souvik" },
				{ src: "/videos/Sourabh.mp4", name: "Sourabh" },
				{ src: "/videos/WellnessZ.mp4", name: "WellnessZ" },
			]} />
			<DeliverySection />
			<PricingSection />
			<ContactSection />
		</main>
	)
}