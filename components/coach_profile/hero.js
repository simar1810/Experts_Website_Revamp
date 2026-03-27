'use client';

import { CheckCircle2, ThumbsUp, ArrowRight } from 'lucide-react';

const DUMMY = {
    role: 'Medical Director',
    name: 'Dr. Shantanu Jambhekar',
    bio: 'A pioneer in neuro-muscular integration and complex joint restoration, blending clinical precision with an editorial eye for patient longevity.',
    yearsExp: 16,
    patientServed: '10k+',
    proceduresDone: '1.2k+',
    recommendedScore: 99,
    isVerified: true,
    photo: '/images/coach.png',
};

export default function CoachHero({ coachData, onBookConsultation, onSendEnquiry }) {
    // Use real data if passed, else fall back to dummy
    const coachInfo = coachData?.coach;
    const details = coachData?.expertDetails;

    const role = details?.specializations?.[0] || DUMMY.role;
    const name = coachInfo?.name || DUMMY.name;
    const bio = details?.bio || DUMMY.bio;
    const yearsExp = details?.yearsExperience || DUMMY.yearsExp;
    const clients = details?.clientsTrained || DUMMY.patientServed;
    const procedures = details?.totalSessions || DUMMY.proceduresDone;
    const score = details?.recommendedScoreFinal
        ? Math.round(details.recommendedScoreFinal * 100)
        : DUMMY.recommendedScore;
    const isVerified = details?.isVerified ?? DUMMY.isVerified;
    const photo = coachInfo?.profilePhoto || details?.profilePhoto || DUMMY.photo;

    // Format numbers nicely
    const fmt = (val) => {
        if (typeof val === 'string') return val;
        if (val >= 1000) return `${(val / 1000).toFixed(1)}k+`;
        return `${val}+`;
    };

    return (
        <section
            className="w-full px-4 sm:px-8 lg:px-16 py-10 lg:py-16 overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #EEF5EB 0%, #F4F9F1 60%, #EAF3E5 100%)' }}
        >
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

                {/* ── LEFT ── */}
                <div className="flex-1 space-y-5 text-center lg:text-left">

                    {/* Role pill */}
                    <span className="inline-flex items-center bg-[#C6F135] text-[#1a4a05] text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-sm">
                        {role}
                    </span>

                    {/* Name */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0D3B1E] leading-[1.05] tracking-tight">
                        {name}
                    </h1>

                    {/* Bio */}
                    <p className="text-gray-500 text-sm sm:text-base leading-relaxed max-w-[420px] mx-auto lg:mx-0 font-medium">
                        {bio}
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-1">
                        <button
                            onClick={onBookConsultation}
                            className="flex items-center gap-3 bg-[#0D3B1E] hover:bg-[#0b3019] text-white px-6 py-3 rounded-2xl font-black text-sm transition-all shadow-xl shadow-emerald-900/30 active:scale-95 group"
                        >
                            <span>Book Consultation</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
                        </button>

                        <button
                            onClick={onSendEnquiry}
                            className="text-gray-700 font-black text-sm hover:text-[#0D3B1E] transition-colors tracking-wide underline underline-offset-4 decoration-gray-200"
                        >
                            Send Enquiry
                        </button>
                    </div>

                    {/* Trust badges */}
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                        {isVerified && (
                            <span className="flex items-center gap-1.5 bg-[#D9F5A0] text-[#2a6b04] text-[10px] font-black px-3 py-1.5 rounded-full">
                                <CheckCircle2 className="w-3 h-3 shrink-0" />
                                WellnessZ verified Expert
                            </span>
                        )}
                        <span className="flex items-center gap-1.5 bg-[#D9F5A0] text-[#2a6b04] text-[10px] font-black px-3 py-1.5 rounded-full">
                            <ThumbsUp className="w-3 h-3 shrink-0" />
                            {score}% Recommended
                        </span>
                    </div>
                </div>

                {/* ── RIGHT: photo + floating cards ── */}
                <div className="relative flex-shrink-0 w-[280px] sm:w-[340px] lg:w-[380px] h-[340px] sm:h-[400px] lg:h-[440px] mt-10 lg:mt-0">

                    {/* Photo card */}
                    <div className="absolute inset-0 rounded-[2.2rem] overflow-hidden bg-[#cfe8c5] shadow-2xl shadow-emerald-900/20">
                        <img
                            src={photo}
                            alt={name}
                            className="w-full h-full object-cover object-top scale-[1.02]"
                            onError={(e) => { e.target.src = '/images/coach.png'; }}
                        />
                    </div>

                    {/* Stat card — top right (years experience) */}
                    <div className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-xl border border-white/60 text-right z-10">
                        <p className="text-2xl font-black text-[#0D3B1E] leading-none">{fmt(yearsExp)}</p>
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.18em] mt-1">Years Experience</p>
                    </div>

                    {/* Stat card — bottom left (patients served) */}
                    <div className="absolute -bottom-5 -left-5 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-xl border border-white/60 z-10">
                        <p className="text-2xl font-black text-[#0D3B1E] leading-none">{fmt(clients)}</p>
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.18em] mt-1">Patients Served</p>
                    </div>

                    {/* Stat card — bottom right (procedures done) */}
                    <div className="absolute -bottom-5 right-6 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-xl border border-white/60 z-10">
                        <p className="text-2xl font-black text-[#0D3B1E] leading-none">{fmt(procedures)}</p>
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.18em] mt-1">Procedures Done</p>
                    </div>
                </div>

            </div>
        </section>
    );
}
