'use client';

import { MapPin, Clock } from 'lucide-react';

export default function LocationBlock({ coachData }) {
    // Real data fallback logic
    const address = coachData?.expertDetails?.address || '450 Editorial Way\nSan Francisco, CA 94103';
    const hours = [
        'Mon - Fri: 08:00 - 18:00',
        'Sat: By appointment only'
    ];

    return (
        <section id="coach-location" className="scroll-mt-24 w-full bg-white px-4 sm:px-8 lg:px-16 py-12 lg:py-16">
            <div className="max-w-7xl mx-auto bg-[#F0F5EE] rounded-[2.5rem] p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">

                {/* 1. Text Information */}
                <div className="flex-1 space-y-10">
                    <h2 className="text-3xl sm:text-4xl font-black text-[#0D3B1E] tracking-tight">
                        Visit the Office
                    </h2>

                    <div className="space-y-8">
                        {/* Office Location */}
                        <div className="flex items-start gap-4">
                            <div className="bg-white p-2.5 rounded-xl shadow-sm mt-1">
                                <MapPin className="w-4 h-4 text-[#0D3B1E]" strokeWidth={2.5} />
                            </div>
                            <div className="space-y-1.5">
                                <h3 className="text-lg font-black text-[#0D3B1E]">Office Location</h3>
                                <p className="text-gray-500 font-medium leading-relaxed whitespace-pre-line text-xs sm:text-sm">
                                    {address}
                                </p>
                            </div>
                        </div>

                        {/* Operating Hours */}
                        <div className="flex items-start gap-4">
                            <div className="bg-white p-2.5 rounded-xl shadow-sm mt-1">
                                <Clock className="w-4 h-4 text-[#0D3B1E]" strokeWidth={2.5} />
                            </div>
                            <div className="space-y-1.5">
                                <h3 className="text-lg font-black text-[#0D3B1E]">Operating Hours</h3>
                                <div className="space-y-1">
                                    {hours.map((line, i) => (
                                        <p key={i} className="text-gray-500 font-medium text-xs sm:text-sm leading-relaxed">
                                            {line}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <button className="bg-[#052e16] hover:bg-[#073d1d] text-white px-8 py-3.5 rounded-xl font-black text-xs tracking-widest uppercase shadow-lg shadow-emerald-900/10 active:scale-95 transition-all">
                        Get Directions
                    </button>
                </div>

                {/* 2. Visual Map Mockup */}
                <div className="flex-shrink-0 w-full max-w-[440px] h-[280px] sm:h-[320px] rounded-[2rem] bg-[#AEC7AC] shadow-xl relative overflow-hidden flex items-center justify-center">
                    {/* Stylized Pin UI */}
                    <div className="relative">
                        {/* Large Yellow Outer Pin */}
                        <div className="w-20 h-28 bg-[#D1B036] rounded-t-full rounded-b-[40%] flex items-center justify-center shadow-lg relative z-10 animate-bounce cursor-default">
                            {/* White Inner Circle */}
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-inner">
                                {/* Dark green actual pin icon */}
                                <div className="w-4 h-4 bg-[#0D3B1E] rounded-full relative">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full"></div>
                                </div>
                            </div>
                        </div>
                        {/* Shadow beneath pin */}
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-2.5 bg-black/10 rounded-full blur-[4px]"></div>
                    </div>

                    {/* Subtle grid/map pattern overlay */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <svg className="w-full h-full" viewBox="0 0 400 300">
                            <line x1="100" y1="0" x2="100" y2="300" stroke="white" strokeWidth="2" />
                            <line x1="200" y1="0" x2="200" y2="300" stroke="white" strokeWidth="2" />
                            <line x1="300" y1="0" x2="300" y2="300" stroke="white" strokeWidth="2" />
                            <line x1="0" y1="100" x2="400" y2="100" stroke="white" strokeWidth="2" />
                            <line x1="0" y1="200" x2="400" y2="200" stroke="white" strokeWidth="2" />
                        </svg>
                    </div>
                </div>

            </div>
        </section>
    );
}
