"use client";

import { useRouter } from "next/navigation";
import { footerCityColumns } from "@/lib/data/footerCities";

export default function Footer() {
  const legalLinks = [
    { label: "Terms & Conditions", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "Cookie Settings", href: "#" },
  ];

  const router = useRouter();

  return (
    <footer className="bg-black px-4 py-12 font-sans text-[#a0a0a0] sm:px-6 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 grid grid-cols-1 gap-12 text-center md:mb-20 md:grid-cols-12 md:gap-10 md:text-left lg:gap-12">
          <div className="space-y-6 md:col-span-3">
            <h4 className="text-sm font-medium text-white/90">
              Need the Mobile App?
            </h4>
            <div className="flex flex-col items-center space-y-4 md:items-start">
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
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 text-left sm:grid-cols-4 md:col-span-6 md:gap-8">
            {footerCityColumns.map((column, i) => (
              <div key={i} className="space-y-3 sm:space-y-4">
                {column.map((city) => (
                  <a
                    key={city}
                    href="#"
                    className="block text-xs transition-colors hover:text-white sm:text-sm"
                  >
                    {city}
                  </a>
                ))}
              </div>
            ))}
          </div>

          <div className="space-y-6 md:col-span-3 md:text-right">
            <p className="mx-auto max-w-[260px] text-sm leading-relaxed text-white/80 md:ml-auto">
              Are you a trainer and want to get more exposure by listing here?
            </p>
            <button
              type="button"
              onClick={() => router.push("/experts")}
              className="rounded-lg border border-white/40 px-8 py-3.5 text-[10px] font-black tracking-widest text-white transition-all hover:bg-white hover:text-black sm:px-10 sm:py-4 sm:text-xs"
            >
              GET LISTED
            </button>
          </div>
        </div>

        <div className="border-t border-white/10 pt-10">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 sm:gap-x-10 sm:gap-y-4">
            {legalLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs transition-colors hover:text-white sm:text-sm"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center sm:mt-20">
          <p className="text-[10px] uppercase tracking-widest opacity-40">
            © 2012–2026 WellnessZ
          </p>
        </div>
      </div>
    </footer>
  );
}
