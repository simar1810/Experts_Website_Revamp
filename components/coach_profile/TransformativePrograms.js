'use client';

import { CheckCircle2 } from 'lucide-react';

export default function TransformativePrograms({ coachData }) {
    // Real data fallback logic if needed later
    // For now using provided image content

    const programs = [
        {
            title: 'PT Lite Monthly Package',
            benefits: [
                'Weekly Neuro-Muscular Tuning',
                'Bespoke Joint Mobility Protocol',
                '24/7 Digital Concierge Access',
            ],
            price: '2999',
            image: '/home/sehaj/.gemini/antigravity/brain/c953ca88-441c-4cc1-a214-751faf04ed47/physio_treatment_image_1774623213478.png'
        },
        {
            title: 'PT Lite Monthly Package',
            benefits: [
                'Weekly Neuro-Muscular Tuning',
                'Bespoke Joint Mobility Protocol',
                '24/7 Digital Concierge Access',
            ],
            price: '2999',
            image: null // Just as an alternative view
        }
    ];

    return (
        <section className="w-full bg-[#002B19] px-4 sm:px-8 lg:px-16 py-12 lg:py-16 text-white">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Header Part */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="space-y-3">
                        <span className="text-[#84CC16] text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em]">
                            MEMBERSHIP TIERS
                        </span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-none">
                            Transformation Programs
                        </h2>
                    </div>
                    <p className="text-[#8CC2A9] text-xs sm:text-sm font-medium leading-relaxed max-w-sm">
                        Curated recovery and performance pathways designed for the modern professional.
                    </p>
                </div>

                {/* Horizontal Scrolling or Flexbox Container for Cards */}
                <div className="flex flex-col lg:flex-row gap-6 overflow-x-auto pb-6 scrollbar-hide">
                    {programs.map((program, idx) => (
                        <div
                            key={idx}
                            className="bg-[#003B22] border border-white/5 rounded-[2rem] p-8 sm:p-10 flex flex-col md:flex-row gap-6 lg:min-w-[650px] flex-1 min-h-[360px]"
                        >
                            {/* Card Content Area */}
                            <div className="flex-1 flex flex-col justify-between space-y-8">
                                <div className="space-y-6">
                                    <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                                        {program.title}
                                    </h3>
                                    <ul className="space-y-3">
                                        {program.benefits.map((benefit, bIdx) => (
                                            <li key={bIdx} className="flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-[#84CC16]" />
                                                <span className="text-white/80 font-medium text-xs sm:text-sm tracking-wide leading-tight">
                                                    {benefit}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl sm:text-4xl font-black">₹{program.price}</span>
                                        <span className="text-white/40 font-bold uppercase tracking-widest text-[9px]">
                                            /month
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3">
                                        <button className="bg-[#A3F398] hover:bg-[#8ee085] text-[#002B19] px-6 py-3 rounded-xl font-black text-xs tracking-[0.05em] shadow-lg shadow-lime-900/40 active:scale-95 transition-all">
                                            ENROLL NOW
                                        </button>
                                        <div className="flex items-center gap-2">
                                            <span className="bg-[#0D3B1E] text-[#84CC16]/60 border border-[#84CC16]/10 px-3 py-1.5 rounded-lg font-black text-[9px] uppercase tracking-widest">
                                                ONLINE
                                            </span>
                                            <span className="bg-[#0D3B1E] text-white/50 border border-white/5 px-3 py-1.5 rounded-lg font-black text-[9px] uppercase tracking-widest">
                                                IN-CLINIC
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Image Part - Cutout UI effect */}
                            {program.image && (
                                <div className="w-full md:w-[240px] h-[300px] shrink-0 rounded-[1.8rem] overflow-hidden shadow-2xl relative">
                                    <img
                                        src={program.image}
                                        alt={program.title}
                                        className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                                    />
                                    {/* Subtle gradient overlay to match card Green */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#003B22]/40 to-transparent pointer-events-none"></div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
