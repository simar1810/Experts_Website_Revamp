"use client";

import { useRouter } from "next/navigation";
// import { footerCityColumns } from "@/lib/data/footerCities";
import { footerSections } from "@/lib/data/footerCities";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import WellnessZLogoLink from "@/components/WellnessZLogoLink";
import Link from "next/link";

export default function Footer() {
  const legalLinks = [
    { label: "User Terms", href: "/legal/user-terms" },
    { label: "Business Terms", href: "/legal/business-terms" },
    { label: "Privacy Policy", href: "/legal/privacy-policy" },
    { label: "Cookie Policy", href: "/legal/cookie-policy" },
    { label: "Cookie Settings", href: "/legal/cookie-settings" },
  ];

  const router = useRouter();

  return (
    <footer className="bg-black px-4 py-12 font-sans text-[#a0a0a0] sm:px-6 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 grid grid-cols-1 gap-12 text-center md:mb-20 md:grid-cols-12 md:gap-10 md:text-left lg:gap-12">
          <div className="space-y-6 md:col-span-3">
            <div className="mx-auto inline-block md:mx-0">
              <WellnessZLogoLink href="/" isFooter />
            </div>
            {/* <div className="flex flex-col items-center space-y-4 md:items-start">
              <a href="#" className="block transition-opacity hover:opacity-80">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                  alt="App Store"
                  className="h-10 rounded-lg border border-white/20 md:h-12"
                />
              </a>
              <a href="#" className="block transition-opacity hover:opacity-80">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Google Play"
                  className="h-10 rounded-lg border border-white/20 md:h-12"
                />
              </a>
            </div> */}
          </div>

          <div className="order-2 lg:order-1 grid grid-cols-2 gap-10 pl-3 pr-3 text-left md:col-span-6">
            {footerSections.map((section) => (
              <div key={section.title} className="space-y-4">
                <h4 className="text-sm font-black text-white/70 uppercase tracking-wide">
                  {section.title}
                </h4>

                {/* Items */}
                <div className="space-y-2">
                  {section.items.map((item) => (
                    <Link
                      target="_blank"
                      href={item.location}
                      key={item.id}
                      className="block text-xs sm:text-sm text-white/40 hover:text-white transition-colors cursor-pointer"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="order-1 lg:order-2 space-y-6 md:col-span-3 md:text-right flex flex-col items-center justify-center">
            <p className="mx-auto max-w-[230px] text-sm text-center leading-relaxed text-white/70">
              Are you a trainer, dietitian or wellness coach wanting to get more
              exposure by listing here?
            </p>
            <button
              type="button"
              onClick={() => router.push("/experts")}
              className="rounded-lg border border-white/40 px-8 py-3.5 text-[10px] font-black tracking-widest text-white/40 transition-all hover:bg-white hover:text-black sm:px-10 sm:py-4 sm:text-xs"
            >
              GET LISTED
            </button>
          </div>
        </div>

        <div className="border-t border-b border-white/40 pt-8 pb-6 mt-10">
          {/* TOP ROW: Social (left) + Legal (right) */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {/* LEFT: Social Icons */}
            <div className="hidden sm:flex items-center justify-center sm:justify-start gap-5 text-white/70">
              <a
                target="_blank"
                href="https://www.facebook.com/profile.php?id=61553253021745&mibextid=ZbWKwL/"
                className="hover:text-white transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                target="_blank"
                href="https://instagram.com/wellnessz_official?igshid=MzMyNGUyNmU2YQ=="
                className="hover:text-white transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                target="_blank"
                href="https://www.linkedin.com/company/wellnessz/"
                className="hover:text-white transition-colors"
              >
                <Linkedin size={20} />
              </a>
            </div>

            {/* RIGHT: Legal Links */}
            <div className="flex flex-wrap justify-center sm:justify-end gap-x-6 gap-y-2">
              {legalLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-xs sm:text-sm text-white/50 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="flex sm:hidden justify-center gap-5 mt-6 text-white/70">
          <a href="#" className="hover:text-white transition-colors">
            <Facebook size={20} />
          </a>
          <a href="#" className="hover:text-white transition-colors">
            <Instagram size={20} />
          </a>
          <a href="#" className="hover:text-white transition-colors">
            <Linkedin size={20} />
          </a>
        </div>

        <div className="mt-16 text-center sm:mt-20">
          <p className="text-xs font-poppins font-black">
            © 2026 WellnessZ Experts | Mohi Lifestile Solutions Pvt. Ltd.
          </p>
        </div>
      </div>
    </footer>
  );
}
