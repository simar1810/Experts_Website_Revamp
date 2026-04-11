"use client"
import HeroPricing from "@/features/subscription/components/HeroPricing"
import FeatureSection from "@/features/subscription/components/FeatureSection"
import DeliverySection from "@/features/subscription/components/DeliverySection"
import PricingSection from "@/features/subscription/components/PricingSection"
// import PricingTable from "./_components/PricingTable";

// export default function PricingPage() {
//   return (
//     <main className="min-h-screen bg-white font-sans selection:bg-lime-200">
//       {/* Detailed Comparison Table */}
//       <PricingTable />

//       {/* Custom Plans CTA */}
//       {/* <section className="bg-gradient-to-r from-[#2B952B] via-[#4CAF50] to-[#2B952B]  py-16 px-6 text-center text-white relative overflow-hidden shadow-xl shadow-green-500/20">
//                     <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">Need Custom Plans?</h2>
//                     <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto mb-10 font-medium">
//                         "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
//                     </p>
//                     <div className="flex flex-wrap justify-center gap-4">
//                         <button className="bg-[#71BC2B] hover:bg-[#63a525] text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg flex items-center gap-2 group">
//                             CTA <span className="group-hover:translate-x-1 transition-transform">→</span>
//                         </button>
//                         <button className="bg-white hover:bg-gray-50 text-[#71BC2B] px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg">
//                             CTA
//                         </button>
//                     </div>
//             </section> */}
//     </main>
//   );
// }

export default function Page() {
    return (
        <main>
            <HeroPricing />
            <FeatureSection />
            <DeliverySection />
            <PricingSection />
        </main>
    )
}