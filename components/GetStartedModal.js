'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function GetStartedModal({ isOpen, onClose }) {
    const [timer, setTimer] = useState(23);

    useEffect(() => {
        let interval;
        if (isOpen && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isOpen, timer]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center min-h-screen p-4">
            <div className="bg-white w-full max-w-[500px] rounded-3xl p-8 relative shadow-2xl animate-in fade-in zoom-in duration-300 my-auto">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="max-w-md mx-auto">
                    <h2 className="text-xl font-black text-center text-gray-900 mb-6 tracking-tight">
                        Get Started with Experts
                    </h2>

                    <div className="space-y-4">
                        {/* Name Field */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-700">Name</label>
                            <input
                                type="text"
                                placeholder="Write here..."
                                className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500 transition-all placeholder:text-gray-300 font-medium"
                            />
                        </div>

                        {/* Phone Number Field */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-700">Phone Number</label>
                            <input
                                type="text"
                                placeholder="Write here..."
                                className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500 transition-all placeholder:text-gray-300 font-medium"
                            />
                        </div>

                        {/* City & State Fields */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700">City</label>
                                <input
                                    type="text"
                                    placeholder="Select Level"
                                    className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500 transition-all placeholder:text-gray-300 font-medium"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-700">State</label>
                                <input
                                    type="text"
                                    placeholder="Select Mode"
                                    className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500 transition-all placeholder:text-gray-300 font-medium"
                                />
                            </div>
                        </div>

                        {/* OTP Section */}
                        <div className="space-y-3 pt-2">
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-700">One Time Password (OTP)</label>
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex gap-1.5">
                                    {[1, 2, 3, 4, 5, 6].map((idx) => (
                                        <input
                                            key={idx}
                                            type="text"
                                            maxLength={1}
                                            className="w-9 h-11 border border-gray-100 rounded-lg text-center text-sm font-bold focus:outline-none focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500 transition-all"
                                        />
                                    ))}
                                </div>
                                <button className="px-4 py-2 border border-lime-500 text-lime-600 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-lime-50 transition-colors shrink-0">
                                    Resend
                                </button>
                            </div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                Resend in {timer} Seconds
                            </p>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button className="w-full py-3.5 bg-[#71BC2B] hover:bg-[#63a525] text-white rounded-xl font-black text-sm shadow-lg shadow-lime-500/10 transition-all transform active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest">
                                Continue →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
