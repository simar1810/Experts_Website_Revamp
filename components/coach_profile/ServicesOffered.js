'use client';

import { Zap, Brain, User, BarChart3 } from 'lucide-react';

export default function ServicesOffered({ coachData }) {
    // Real data fallback logic if needed later
    // For now using provided image content

    return (
        <section className="w-full bg-[#F8FAF7] px-4 sm:px-8 lg:px-16 py-12 lg:py-16">
            <div className="max-w-7xl mx-auto space-y-10">

                {/* Section Title */}
                <h2 className="text-2xl sm:text-3xl font-black text-[#0D3B1E] tracking-tight">
                    Services Offered
                </h2>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                    {/* LEFT COLUMN */}
                    <div className="flex flex-col gap-5">

                        {/* 1. Specializations Card */}
                        <div className="bg-white rounded-[1.8rem] p-8 sm:p-10 shadow-sm flex flex-col justify-center min-h-[260px] flex-1">
                            <div className="bg-white w-fit mb-5">
                                <User className="w-7 h-7 text-[#0D3B1E]" strokeWidth={2.5} />
                                <div className="mt-1 flex gap-1">
                                    <div className="w-1 h-1 bg-[#0D3B1E] rounded-full"></div>
                                    <div className="w-1 h-1 bg-[#0D3B1E] rounded-full"></div>
                                    <div className="w-1 h-1 bg-[#0D3B1E] rounded-full"></div>
                                </div>
                            </div>
                            <h3 className="text-xl font-black text-[#0D3B1E] mb-3">Specializations</h3>
                            <p className="text-gray-500 font-medium leading-relaxed text-sm max-w-sm">
                                Advanced regenerative strategies for chronic degenerative conditions, focusing on non-surgical structural alignment.
                            </p>
                        </div>

                        {/* 2. Certifications Card */}
                        <div className="bg-white rounded-[1.8rem] p-8 sm:p-10 shadow-sm flex items-center justify-between min-h-[180px]">
                            <div className="space-y-3 max-w-[60%]">
                                <h3 className="text-xl font-black text-[#0D3B1E]">Certifications</h3>
                                <p className="text-gray-500 font-medium leading-relaxed text-xs sm:text-sm">
                                    Precision spinal care using gravity-assisted decompression and core stabilization protocols.
                                </p>
                            </div>
                            <div className="w-20 h-20 sm:w-28 sm:h-28 bg-[#D1F5E6] rounded-full flex items-center justify-center shrink-0">
                                <BarChart3 className="w-8 h-8 text-[#0D3B1E]" />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="flex flex-col gap-5">

                        {/* Sub-grid for top right cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 flex-1">

                            {/* 3. Athlete Peak Performance (Green Card) */}
                            <div className="bg-[#052e16] rounded-[1.8rem] p-7 sm:p-8 text-white flex flex-col min-h-[280px]">
                                <Zap className="w-7 h-7 text-[#C6F135] mb-6" fill="currentColor" />
                                <h3 className="text-xl font-black leading-tight mb-4">
                                    Athlete Peak Performance
                                </h3>
                                <p className="text-white/70 font-medium leading-relaxed text-xs sm:text-sm">
                                    Optimizing biomechanics for elite professional athletes and high-performers.
                                </p>
                            </div>

                            {/* 4. Neuro-Muscular (Grey Card) */}
                            <div className="bg-[#EAEAEA] rounded-[1.8rem] p-7 sm:p-8 flex flex-col min-h-[280px]">
                                <Brain className="w-7 h-7 text-[#0D3B1E] mb-6" />
                                <h3 className="text-xl font-black text-[#0D3B1E] leading-tight mb-4">
                                    Neuro-Muscular
                                </h3>
                                <p className="text-gray-500 font-medium leading-relaxed text-xs sm:text-sm">
                                    Integration of neural pathways and muscular response.
                                </p>
                            </div>
                        </div>

                        {/* 5. Pioneering Card (Gradient) */}
                        <div
                            className="rounded-[1.8rem] p-8 sm:p-10 min-h-[200px] flex items-center relative overflow-hidden"
                            style={{
                                background: 'linear-gradient(135deg, #052e16 0%, #0d5e50 100%)'
                            }}
                        >
                            {/* Abstract background elements */}
                            <div className="absolute inset-0 opacity-10 pointer-events-none">
                                <svg className="w-full h-full" viewBox="0 0 400 200" fill="none">
                                    <circle cx="300" cy="100" r="150" stroke="white" strokeWidth="0.5" />
                                    <circle cx="300" cy="100" r="120" stroke="white" strokeWidth="0.5" />
                                    <circle cx="300" cy="100" r="90" stroke="white" strokeWidth="0.5" />
                                    <line x1="0" y1="100" x2="400" y2="100" stroke="white" strokeWidth="0.1" />
                                    <line x1="200" y1="0" x2="200" y2="200" stroke="white" strokeWidth="0.1" />
                                </svg>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-black text-white max-w-sm relative z-10 leading-snug">
                                Pioneering the next era of clinical editorial care.
                            </h3>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
