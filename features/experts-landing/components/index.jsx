"use server"
import Image from "next/image";
import Navbar from "./navbar"
import ExpertSection from "./expert-section"
import ProgramsSection from "./programs-section"
import Footer from "./footer"
import { Button } from "@/components/ui/button";

export default async function ExpertsListing({ partner }) {
  const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/experts/public/config", {
    headers: {
      'xhost': "acme"
    }
  })
  const brand = await response.json();

  const brandInfo = brand?.x || {}
  
  return (
    <main
      style={{
        '--brand-primary': brand?.branding?.primaryColor || '#67bc2a',
        '--brand-secondary': brand?.branding?.secondaryColor || '#b1271c',
      }}
    >
      <Navbar brand={brandInfo} />
      <section className="relative w-full bg-white py-12 md:py-20 lg:py-24">
        <Image
          src="/images/experts-listing-hero-bg.png"
          fill
          alt="Hero section image"
        />

        <div className="container relative z-10 mx-auto px-6 text-center">
          <h1 className="mb-6 font-extrabold tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl max-w-5xl mx-auto leading-tight">
            <span className="text-black">FIND THE</span>{" "}
            <span className="text-[var(--brand-secondary)]">RIGHT EXPERT</span>{" "}
            <span className="text-black">FOR YOUR</span>{" "}
            <span className="text-[var(--brand-primary)]">HEALTH</span>
          </h1>

          <p className="mx-auto mb-12 max-w-2xl text-lg md:text-xl font-medium text-[#7d778d]">
            Search from 7,000+ verified wellness experts and connect with the right expert for your health goals.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              className="rounded-full px-10 py-6 bg-[var(--brand-primary)] text-white hover:opacity-90 font-bold shadow-md w-full sm:w-auto border-none"
            >
              Find Your Expert
            </Button>

            <Button
              variant="outline"
              className="rounded-full px-10 py-6 border-[var(--brand-primary)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-white font-bold transition-colors w-full sm:w-auto"
            >
              How it Works
            </Button>
          </div>
        </div>
      </section>
      {brandInfo?.settings?.showOnlyAssignedExperts && <ExpertSection partner={partner} />}
      {brandInfo?.settings?.allowPublicPrograms && <ProgramsSection partner={partner} listingId={brandInfo._id} />}
      <Footer brand={brandInfo} />
      {console.log({_id: brandInfo._id})}
    </main>
  )
}