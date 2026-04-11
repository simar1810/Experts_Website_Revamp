import React from "react";
import { mockups } from "../utils/config";

const DeliverySection = function () {
  return (
    <section className="relative w-full bg-[#F8F9FA] py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-[0.03]" 
           style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', size: '40px 40px', backgroundSize: '40px 40px' }} 
      />

      <div className="container relative z-10 mx-auto px-4">
        <h2 className="mb-16 text-center text-3xl font-bold tracking-tight text-[#1A1A1A] md:mb-24 md:text-5xl">
          How you deliver your services
        </h2>

        <div className="relative flex h-[400px] items-center justify-center md:h-[600px]">
          {mockups.map((phone) => (
            <div
              key={phone.id}
              className={`absolute transition-all duration-700 ease-in-out ${phone.scale} ${phone.zIndex} ${phone.opacity} ${phone.translate}`}
            >
              <div className="relative h-[350px] w-[170px] rounded-[2.5rem] border-[6px] border-[#1A1A1A] bg-black shadow-2xl md:h-[500px] md:w-[240px] md:border-[8px]">
                <div className="absolute top-0 left-1/2 h-5 w-24 -translate-x-1/2 rounded-b-xl bg-[#1A1A1A] md:h-6 md:w-32" />
                
                {phone.id === 3 ? (
                  <div className="h-full w-full overflow-hidden rounded-[1.8rem]">
                    <img 
                      src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop" 
                      alt="Service Delivery"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute bottom-10 left-0 w-full px-4 text-center text-white">
                        <span className="mb-2 inline-block rounded-full border border-white/40 px-3 py-0.5 text-[8px] uppercase tracking-widest md:text-[10px]">Free</span>
                        <p className="text-xs font-bold md:text-lg">iPhone 12 Pro Mockup</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-end pb-10 text-center text-white">
                    <span className="mb-2 inline-block rounded-full border border-white/20 px-3 py-0.5 text-[8px] uppercase tracking-widest md:text-[10px]">Free</span>
                    <p className="px-4 text-[10px] font-bold md:text-base">iPhone 12 Pro Mockup</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DeliverySection;