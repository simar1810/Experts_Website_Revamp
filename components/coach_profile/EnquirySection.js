'use client';

import { ChevronDown } from 'lucide-react';

export default function EnquirySection({ coachData }) {
    return (
        <section id="enquiry-box" className="w-full bg-[#F8FAF7] px-4 sm:px-8 lg:px-16 py-12 lg:py-16">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">

                {/* 1. Quick Enquiry Form */}
                <div className="bg-white rounded-[2rem] p-8 sm:p-10 shadow-lg shadow-gray-200/40">
                    <div className="mb-8">
                        <h2 className="text-2xl font-black text-[#0D3B1E] mb-1.5 tracking-tight">Quick Enquiry</h2>
                        <p className="text-gray-400 font-medium text-xs sm:text-sm">Direct access to our clinical coordination team.</p>
                    </div>

                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1">NAME</label>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    className="w-full bg-gray-50 border-transparent rounded-xl p-3.5 text-gray-900 placeholder-gray-300 outline-none focus:ring-2 focus:ring-[#84CC16]/20 transition-all text-xs sm:text-sm font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1">EMAIL</label>
                                <input
                                    type="email"
                                    placeholder="email@address.com"
                                    className="w-full bg-gray-50 border-transparent rounded-xl p-3.5 text-gray-900 placeholder-gray-300 outline-none focus:ring-2 focus:ring-[#84CC16]/20 transition-all text-xs sm:text-sm font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1">NATURE OF ENQUIRY</label>
                            <div className="relative">
                                <select className="w-full bg-gray-50 border-transparent rounded-xl p-3.5 text-gray-900 appearance-none outline-none focus:ring-2 focus:ring-[#84CC16]/20 transition-all text-xs sm:text-sm font-medium cursor-pointer">
                                    <option>Select Option</option>
                                    <option>Consultation</option>
                                    <option>Personal Training</option>
                                    <option>Recovery Program</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1">MESSAGE</label>
                            <textarea
                                placeholder="Briefly describe your condition..."
                                className="w-full h-32 bg-gray-50 border-transparent rounded-xl p-4 text-gray-900 placeholder-gray-300 outline-none focus:ring-2 focus:ring-[#84CC16]/20 transition-all text-xs sm:text-sm font-medium resize-none shadow-inner"
                            ></textarea>
                        </div>

                        <button className="w-full bg-[#052e16] hover:bg-[#073d1d] text-white py-4 rounded-xl font-black text-xs tracking-widest uppercase shadow-xl shadow-emerald-900/10 active:scale-95 transition-all">
                            Submit Secure Enquiry
                        </button>
                    </form>
                </div>

                {/* 2. App Download Promo */}
                <div className="bg-[#052e16] rounded-[2rem] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden group">
                    {/* Abstract radial glow */}
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#84CC16]/5 rounded-full blur-[100px] group-hover:bg-[#84CC16]/10 transition-colors"></div>

                    <div className="space-y-6 relative z-10">
                        <span className="inline-block bg-[#84CC16] text-[#052e16] text-[9px] font-black uppercase tracking-[0.25em] px-3 py-1.5 rounded-full mb-2">
                            NOW AVAILABLE
                        </span>

                        <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-[1.15]">
                            Download WellnessZ App Today!
                        </h2>

                        <p className="text-white/60 font-medium leading-relaxed max-w-sm text-xs sm:text-sm">
                            Manage your recovery, schedule appointments, and access exclusive patient resources directly from your device.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-10 relative z-10">
                        {/* Mock App Store Buttons */}
                        <a href="#" className="flex items-center gap-2.5 bg-transparent border border-white/10 hover:bg-white/5 px-5 py-2.5 rounded-xl transition-all group/btn">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Apple_logo_black.svg" className="w-5 h-5 invert" alt="App Store" />
                            <div className="flex flex-col">
                                <span className="text-[8px] font-bold text-white/40 leading-none lowercase">Download on the</span>
                                <span className="text-sm font-bold text-white leading-tight">App Store</span>
                            </div>
                        </a>

                        <a href="#" className="flex items-center gap-2.5 bg-transparent border border-white/10 hover:bg-white/5 px-5 py-2.5 rounded-xl transition-all">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/d/d7/Google_Play_Store_badge_EN.svg" className="w-20 h-6" alt="Google Play" />
                        </a>
                    </div>
                </div>

            </div>
        </section>
    );
}
