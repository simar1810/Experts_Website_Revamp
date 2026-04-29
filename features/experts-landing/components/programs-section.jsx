"use client";
import { AlertCircle, RefreshCw, Clock, Users, ArrowRight, Tag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import useSWR from "swr";
import { useMemo } from 'react';
import { mockPrograms } from "@/features/experts-landing/helpers/mock"
import { fetchData } from '../helpers/network';

function ProgramCard({ program }) {
  const {
    title,
    durationLabel,
    clientsCount,
    activeDiscount,
    amount,
    currency,
    coverImage,
    shortDescription,
    tags,
    featured
  } = program;

  const originalPrice = activeDiscount?.originalAmount;
  const discountPercent = activeDiscount?.percentDiscount;

  return (
    <div className={`group relative flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm border-2 transition-all hover:shadow-md ${featured ? 'border-[var(--brand-primary)]' : 'border-transparent'}`}>
      
      <div className="relative h-52 w-full overflow-hidden">
        <img
          src={coverImage || "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=500&auto=format&fit=crop"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={e => e.target.src = "/not-found.png"}
        />
        
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {featured && (
            <span className="bg-[var(--brand-primary)] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
              Featured
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-[var(--brand-secondary)] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
              {discountPercent}% OFF
            </span>
          )}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex flex-wrap gap-2 mb-3">
          {tags?.slice(0, 2).map((tag, idx) => (
            <span key={idx} className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase">
              <Tag size={10} /> {tag}
            </span>
          ))}
        </div>

        <h3 className="text-xl font-extrabold text-gray-900 leading-tight mb-2 group-hover:text-[var(--brand-primary)] transition-colors">
          {title}
        </h3>
        
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
          {shortDescription}
        </p>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-1.5 text-gray-700 font-bold text-xs">
            <Clock size={14} className="text-[var(--brand-primary)]" />
            {durationLabel}
          </div>
          {program.clientsVisible && (
            <div className="flex items-center gap-1.5 text-gray-700 font-bold text-xs">
              <Users size={14} className="text-[var(--brand-primary)]" />
              {clientsCount}+ Enrolled
            </div>
          )}
        </div>

        <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
          <div className="flex flex-col">
            {originalPrice && (
              <span className="text-xs text-gray-400 line-through font-medium">
                {currency} {originalPrice}
              </span>
            )}
            <span className="text-xl font-black text-gray-900">
              {currency === 'INR' ? '₹' : currency} {amount}
            </span>
          </div>

          <Button className="bg-[var(--brand-primary)] hover:opacity-90 text-white rounded-full px-5 h-10 font-bold flex gap-2 group/btn border-none shadow-none">
            Enroll
            <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ProgramsSection({ partner, listingId }) {
  const endpoint = useMemo(() => process.env.NEXT_PUBLIC_PARTNER_ENDPOINT + `/experts/listing/${listingId}/programs`, [partner]);
  const { isLoading, isValidating, error, data, mutate } = useSWR(endpoint, () => fetchData(endpoint,{
    headers: {
      "x-tenant": partner
    }
  }));

  if (isLoading || isValidating) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6 py-16 max-w-7xl mx-auto">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
          <div className="h-52 w-full bg-gray-200" />
          <div className="p-6 space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="pt-6 border-t border-gray-50 flex justify-between items-center">
              <div className="h-6 bg-gray-200 rounded w-20" />
              <div className="h-10 bg-gray-200 rounded-full w-28" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (error || !data?.success) return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="bg-red-50 p-4 rounded-full mb-6">
        <AlertCircle className="w-12 h-12 text-[var(--brand-secondary)]" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Failed to load programs</h3>
      <Button 
        onClick={mutate}
        className="bg-[var(--brand-primary)] text-white rounded-full px-8 py-6 font-bold hover:opacity-90 flex gap-2"
      >
        <RefreshCw className="w-4 h-4" /> Try Again
      </Button>
    </div>
  );

  const programs = data?.data || [];

  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
              <span className="text-[var(--brand-secondary)] uppercase italic">Transformation</span> 
              <br /> Programs
            </h2>
            <p className="text-gray-500 font-medium">Expert-led plans tailored for your goals</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program) => (
            <ProgramCard key={program._id?.$oid || program.id} program={program} />
          ))}
        </div>
      </div>
    </section>
  );
}