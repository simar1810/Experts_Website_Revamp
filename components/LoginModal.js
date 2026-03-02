'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { fetchAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }) {
    const { login } = useAuth();
    const router = useRouter();

    const [showOtp, setShowOtp] = useState(false);
    const [timer, setTimer] = useState(23);
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState(['', '', '', '']);

    // Validation state
    const [error, setError] = useState(false);
    const [touched, setTouched] = useState(false);

    // Body scroll lock
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        let interval;
        if (isOpen && showOtp && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isOpen, showOtp, timer]);

    useEffect(() => {
        if (!isOpen) {
            setShowOtp(false);
            setTimer(23);
            setPhone('');
            setOtp(['', '', '', '']);
            setError(false);
            setTouched(false);
        }
    }, [isOpen]);

    const handleSendOtp = async () => {
        setTouched(true);
        if (!phone) {
            setError(true);
            return;
        }

        try {
            await fetchAPI('/experts/client/send-otp', {
                mobileNumber: phone,
            }, 'POST');
            setShowOtp(true);
        } catch (error) {
            console.error('Login OTP failed:', error);
            // Show OTP anyway for now
            setShowOtp(true);
        }
    };

    const handleResendOtp = async () => {
        try {
            await fetchAPI('/experts/client/send-otp', {
                mobileNumber: phone,
            }, 'POST');
            setTimer(23);
        } catch (error) {
            console.error('Resend OTP failed:', error);
        }
    };

    const handleVerifyOtp = async () => {
        try {
            // Using temporary endpoint as requested
            const response = await fetchAPI('/experts/client/verify-otp', {
                mobileNumber: phone,
                otp: otp.join(''),
            }, 'POST');

            const token = response.token;
            if (token) {
                login(token, response.client_snapshot);
            }
            onClose();

            // Redirect if needed
            const redirectCoachId = localStorage.getItem('redirect_after_login');
            if (redirectCoachId) {
                localStorage.removeItem('redirect_after_login');
                router.push(`/experts/${redirectCoachId}`);
            }
        } catch (error) {
            console.error('Login verification failed:', error);
        }
    };

    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        if (value && index < 3) {
            const nextInput = document.getElementById(`login-otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
                onClick={onClose}
            ></div>

            <div className="relative w-full max-w-[520px] animate-in fade-in zoom-in duration-300 outline-none z-10">
                <div className="bg-white rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 relative shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-2 border-[#71BC2B]">
                    <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors p-2">
                        <X size={24} />
                    </button>

                    <div className="max-w-md mx-auto">
                        {!showOtp ? (
                            <>
                                <h2 className="text-2xl sm:text-3xl font-black text-center text-gray-900 mb-8 tracking-tight">
                                    Login to WellnessZ
                                </h2>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center px-1">
                                            <label className="block text-sm font-bold text-gray-900">Phone Number</label>
                                            {touched && error && <span className="text-[10px] sm:text-xs font-bold text-red-500 animate-in fade-in slide-in-from-right-1 tracking-tight">(required)</span>}
                                        </div>
                                        <input
                                            type="text"
                                            value={phone}
                                            onChange={(e) => {
                                                setPhone(e.target.value);
                                                if (touched && e.target.value) setError(false);
                                            }}
                                            placeholder="Write here..."
                                            className={`w-full px-6 py-4 bg-gray-50 border rounded-full text-sm focus:outline-none transition-all placeholder:text-gray-400 font-medium ${touched && error ? 'border-red-500 focus:ring-red-500/10' : 'border-gray-100 focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500'}`}
                                        />
                                    </div>

                                    <button
                                        onClick={handleSendOtp}
                                        className="w-full py-4 bg-[#71BC2B] hover:bg-[#63a525] text-white rounded-full font-bold text-base shadow-lg shadow-lime-500/20 transition-all transform active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        Send OTP →
                                    </button>

                                    <div className="text-center pt-4">
                                        <p className="text-sm text-gray-500 font-medium">
                                            Don't have an account?{' '}
                                            <button
                                                onClick={onSwitchToRegister}
                                                className="text-[#71BC2B] font-bold hover:underline"
                                            >
                                                Register Now
                                            </button>
                                        </p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-6">
                                <h2 className="text-xl sm:text-2xl font-black text-center text-gray-900 tracking-tight">
                                    Login Verification
                                </h2>
                                <p className="text-xs sm:text-sm text-center text-gray-400 leading-relaxed font-medium">
                                    Enter the OTP sent to your mobile number to continue.
                                </p>

                                <div className="flex justify-center gap-3 sm:gap-4 py-2">
                                    {otp.map((val, idx) => (
                                        <input
                                            key={idx}
                                            id={`login-otp-${idx}`}
                                            type="text"
                                            maxLength={1}
                                            value={val}
                                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                                            inputMode="numeric"
                                            className="w-14 h-14 sm:w-16 sm:h-16 border-2 border-gray-100 rounded-2xl text-center text-xl font-bold text-gray-900 focus:outline-none focus:border-lime-500 transition-all bg-gray-50 focus:bg-white"
                                        />
                                    ))}
                                </div>

                                <div className="flex items-center justify-between px-2">
                                    <p className="text-xs sm:text-sm font-medium text-gray-500">
                                        Resend OTP in <span className="text-[#71BC2B] font-bold">{timer}</span> Seconds
                                    </p>
                                    <button
                                        onClick={handleResendOtp}
                                        disabled={timer > 0}
                                        className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-colors border ${timer > 0 ? 'text-gray-400 border-gray-100 cursor-not-allowed' : 'text-[#71BC2B] hover:bg-lime-50 border-lime-100'}`}
                                    >
                                        Resend OTP
                                    </button>
                                </div>

                                <button
                                    onClick={handleVerifyOtp}
                                    className="w-full py-4 bg-[#71BC2B] hover:bg-[#63a525] text-white rounded-full font-bold text-base shadow-lg shadow-lime-500/20 transition-all transform active:scale-95 flex items-center justify-center gap-2"
                                >
                                    Verify & Login →
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
