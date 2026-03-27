'use client';

import { Quote } from 'lucide-react';

export default function PatientStories({ coachData }) {
    // Real data fallback logic if needed later
    // For now using provided image content

    const stories = [
        {
            name: 'Marcus K.',
            role: 'PROFESSIONAL ATHLETE',
            testimonial: "The level of attention Dr. Jambhekar provides is unmatched. After two years of chronic back pain, I was back on the golf course within three months of his Elite Rehab program.",
            ratings: {
                Guidance: '5/5',
                Professionalism: '5/5',
                Results: '5/5',
                Communication: '5/5'
            }
        },
        {
            name: 'Marcus K.',
            role: 'PROFESSIONAL ATHLETE',
            testimonial: "The level of attention Dr. Jambhekar provides is unmatched. After two years of chronic back pain, I was back on the golf course within three months of his Elite Rehab program.",
            ratings: {
                Guidance: '5/5',
                Professionalism: '5/5',
                Results: '5/5',
                Communication: '5/5'
            }
        },
        {
            name: 'Marcus K.',
            role: 'PROFESSIONAL ATHLETE',
            testimonial: "The level of attention Dr. Jambhekar provides is unmatched. After two years of chronic back pain, I was back on the golf course within three months of his Elite Rehab program.",
            ratings: {
                Guidance: '5/5',
                Professionalism: '5/5',
                Results: '5/5',
                Communication: '5/5'
            }
        }
    ];

    return (
        <section className="w-full bg-[#F8FAF7] px-4 sm:px-8 lg:px-16 py-12 lg:py-16">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Section Header */}
                <div className="text-center space-y-4">
                    <h2 className="text-2xl sm:text-3xl font-black text-[#0D3B1E] tracking-tight">
                        Patient Stories
                    </h2>
                    <p className="text-gray-400 text-xs sm:text-sm italic font-medium max-w-2xl mx-auto leading-relaxed">
                        "True health is silent. It is the absence of friction in every movement."
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stories.map((story, idx) => (
                        <div key={idx} className="bg-white rounded-[1.8rem] p-7 sm:p-8 shadow-sm flex flex-col justify-between space-y-8 relative overflow-hidden active:shadow-md transition-shadow cursor-default border border-gray-50">

                            {/* Quote Icon Overlay */}
                            <div className="absolute top-6 right-6 opacity-10">
                                <Quote className="w-10 h-10 text-[#84CC16] fill-[#84CC16]" />
                            </div>

                            <div className="space-y-8 relative z-10">
                                {/* Testimonial Text */}
                                <p className="text-gray-500 font-medium leading-[1.7] text-sm italic">
                                    "{story.testimonial}"
                                </p>

                                {/* Detailed Ratings Badges */}
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(story.ratings).map(([cat, score], sIdx) => (
                                        <div key={sIdx} className="bg-[#F8FAF7] rounded-full px-2.5 py-1 flex items-center gap-1 border border-gray-50/50">
                                            <span className="text-[9px] font-black text-gray-400 capitalize">{cat}</span>
                                            <span className="text-[9px] font-black text-[#84CC16]">{score}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Patient Info Footer */}
                            <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                                <div className="w-10 h-10 bg-[#D1F5E6] rounded-full flex items-center justify-center shrink-0">
                                    <span className="text-[#0D3B1E] font-black text-xs tracking-tighter">
                                        {story.name.split(' ').map(n => n[0]).join('')}
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <h4 className="text-[#0D3B1E] font-black text-sm leading-none">
                                        {story.name}
                                    </h4>
                                    <span className="text-gray-400 font-black text-[8px] uppercase tracking-[0.12em] mt-1">
                                        {story.role}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
