"use client";

import { useRouter } from "next/navigation";
// import { footerCityColumns } from "@/lib/data/footerCities";
import { footerSections } from "@/lib/data/footerCities";
import { Facebook, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  const legalLinks = [
    { label: "User Terms", href: "#" },
    { label: "Bussiness Terms", href: "#" },
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
            <h4 className="text-3xl font-medium text-[#FFFFFF] font-serif">
              WellnessZ <br/><span className="text-[#67BC2A] ml-20">Experts</span>
            </h4>
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

         <div className=" order-2 lg:order-1 grid grid-cols-3 gap-10 pl-3 pr-3 text-left md:col-span-6">
            {footerSections.map((section) => (
              <div key={section.title} className="space-y-4">
                {/* Title */}
                <h4 className="text-sm font-semibold text-white/90 uppercase tracking-wide">
                  {section.title}
                </h4>

                {/* Items */}
                <div className="space-y-2">
                  {section.items.map((item) => (
                    <p
                      key={item}
                      className="text-xs sm:text-sm text-white/60 hover:text-white transition-colors cursor-pointer"
                    >
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className=" order-1 lg:order-2 space-y-6 md:col-span-3 md:text-right">
            <p className="mx-auto max-w-[230px] text-sm text-center leading-relaxed text-white/80 md:ml-auto">
              Are you a trainer,dietitian or wellness coach want to get more exposure by listing here?
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

        <div className="border-t border-b border-white/10 pt-8 pb-6 mt-10">
  
          {/* TOP ROW: Social (left) + Legal (right) */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
    
            {/* LEFT: Social Icons */}
            <div className="hidden sm:flex items-center justify-center sm:justify-start gap-5 text-white/70">
              <a href="#" className="hover:text-white transition-colors">
                <Facebook size={20}/>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Instagram size={20}/>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Linkedin size={20}/>
              </a>
            </div>

           {/* RIGHT: Legal Links */}
           <div className="flex flex-wrap justify-center sm:justify-end gap-x-6 gap-y-2">
             {legalLinks.map((link) => (
               <a
                 key={link.label}
                 href={link.href}
                 className="text-xs sm:text-sm text-white/70 hover:text-white transition-colors"
               >
                 {link.label}
               </a>
             ))}
           </div>
         </div>
       </div>

       <div className="flex sm:hidden justify-center gap-5 mt-6 text-white/70">
        <a href="#" className="hover:text-white transition-colors">
          <Facebook size={20}/>
        </a>
        <a href="#" className="hover:text-white transition-colors">
          <Instagram size={20}/>
        </a>
        <a href="#" className="hover:text-white transition-colors">
          <Linkedin size={20}/>
        </a>
      </div>

        <div className="mt-16 text-center sm:mt-20">
          <p className="text-[10px] uppercase tracking-widest opacity-40">
            © 2026 WellnessZ Experts | Mohi Lifestile Solutions Pvt.Ltd.
          </p>
        </div>
      </div>
    </footer>
  );
}
