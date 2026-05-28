"use client";

import {
  BadgeCheck,
  Brain,
  Dumbbell,
  Leaf,
  Sparkles,
  Star,
  Stethoscope,
} from "lucide-react";
import { useBrandingContext } from "@/features/experts-landing/context/branding";

const CATEGORIES = [
  {
    title: "Fitness Trainers",
    description:
      "Certified personal trainers, strength coaches, and functional fitness experts.",
    badge: "ACE • NASM • K11 • REPS",
    icon: Dumbbell,
  },
  {
    title: "Dietitians & Nutritionists",
    description:
      "Clinical dietitians, sports nutritionists, and certified nutrition coaches.",
    badge: "RD • CDE • Precision Nutrition",
    icon: Leaf,
  },
  {
    title: "Yoga Instructors",
    description:
      "Certified yoga teachers across Hatha, Vinyasa, Ashtanga, and therapeutic styles.",
    badge: "RYT 200/500 • Yoga Alliance",
    icon: Sparkles,
  },
  {
    title: "Doctors & Physiotherapists",
    description:
      "MBBS, sports medicine doctors, and licensed physiotherapists building digital practices.",
    badge: "MBBS • BPT • MPT • DSM",
    icon: Stethoscope,
  },
  {
    title: "Mental Wellness Coaches",
    description:
      "Therapists, mental health counselors, and certified life coaches.",
    badge: "ICF • RCI • Psychology Degree",
    icon: Brain,
  },
  {
    title: "Specialized Coaches",
    description:
      "Pre/post-natal coaches, rehab specialists, women's health, and more.",
    badge: "Specialty Certifications",
    icon: Star,
  },
];

export default function WhoCanJoinSection() {
  const { displayName } = useBrandingContext();

  return (
    <section className="bg-white px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
            {`Who Can Join ${displayName}?`}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            We only onboard certified, serious coaches. If you&apos;re one of
            these — you&apos;re in.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map(({ title, description, badge, icon: Icon }) => (
            <div
              key={title}
              className="flex flex-col items-center rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-sm transition-transform duration-300 hover:-translate-y-2"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E8F5E9]">
                <Icon className="h-8 w-8 text-[#1B5E20]" aria-hidden />
              </div>
              <div className="mb-3 flex items-center gap-2">
                <h4 className="text-xl font-bold text-slate-900">{title}</h4>
                <BadgeCheck className="h-5 w-5 text-[#72c03c]" aria-hidden />
              </div>
              <p className="mb-6 text-sm text-slate-600">{description}</p>
              <span className="rounded-full bg-[#E8F5E9] px-4 py-1.5 text-xs font-bold text-[#1B5E20]">
                {badge}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h5 className="mb-2 text-lg font-semibold text-slate-900">
            Don&apos;t see your specialty?
          </h5>
          <p className="mb-4 text-slate-600">
            If you&apos;re certified and serious about scaling, we want to hear
            from you.
          </p>
          <a
            className="inline-flex items-center justify-center gap-1 font-bold text-[#72c03c] hover:underline"
            href="mailto:support@wellnessz.in?subject=Zeefit%20%E2%80%94%20coach%20specialty%20enquiry"
          >
            Tell us about you →
          </a>
        </div>
      </div>
    </section>
  );
}
