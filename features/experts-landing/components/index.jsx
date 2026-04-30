"use server"
import Image from "next/image";
import ExpertSection from "./expert-section"
import ProgramsSection from "./programs-section"
import BrandDynamicHead from "./build-dynamic-head"
import InvalidPartner from "./invalid-partner"
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Navbar from "./navbar"
import Footer from "./footer"

export default async function ExpertsListing({ partner }) {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_PARTNER_ENDPOINT + "/experts/public/config", {
      headers: {
        'x-tenant': partner
      }
    })
    const brand = await response.json();
    if (brand.message === "Partner not found") {
      return <InvalidPartner />
    }
    const brandInfo = brand?.partner || {}
    const resolveHtmlString = (value) => {
      if (typeof value === "string") return value;
      if (value && typeof value === "object" && typeof value.__html === "string") {
        return value.__html;
      }
      return "";
    };

    const headerHtml = resolveHtmlString(brandInfo?.header);
    const footerHtml = resolveHtmlString(brandInfo?.footer);

    return (
      <main
        style={{
          '--brand-primary': brandInfo?.branding?.primaryColor || '#67bc2a',
          '--brand-secondary': brandInfo?.branding?.secondaryColor || '#b1271c',
        }}
      >
        <BrandDynamicHead brandInfo={brandInfo} />
        {/* <Navbar brand={brandInfo} /> */}
        {headerHtml ? <div dangerouslySetInnerHTML={{ __html: headerHtml }} /> : null}
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
        {/* <Footer brand={brandInfo} /> */}
        {footerHtml ? <div dangerouslySetInnerHTML={{ __html: footerHtml }} /> : null}
      </main>
    )
  } catch (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#b1271c10_100%)]" />

        <div className="max-w-md">
          <div className="mb-6 flex justify-center">
            <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-100">
              <AlertCircle className="h-12 w-12 text-[#b1271c]" />
            </div>
          </div>

          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-black sm:text-5xl">
            Partner <span className="text-[#b1271c]">Not Found</span>
          </h1>

          <p className="mb-10 text-lg font-medium text-[#7d778d]">
            The wellness portal you're looking for doesn't seem to exist or has been moved. Please check the URL or contact support.
          </p>
        </div>
      </div>
    )
  }
}