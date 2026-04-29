"use client";
import { AlertCircle, RefreshCw, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import useSWR from "swr";
import { useMemo } from 'react';
import { fetchData } from "@/features/experts-landing/helpers/network"

function ExpertCard({ expert }) {
  const name = expert.coach?.name || "Expert Coach";
  const profileImage = expert.profilePhoto || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=500&auto=format&fit=crop";
  const specialty = expert.specializations?.join(", ") || "Wellness Expert";
  const experience = expert.yearsExperience || 0;
  const locationText = `${expert.city}, ${expert.state}`;
  const centerName = expert.certifications?.institute || "Verified Institute";
  const rating = expert.ratingAgg?.overall?.avg || 0;
  const reviewCount = expert.reviewAgg?.totalReviews || 0;

  const isFeatured = expert.planLevel === -1;

  return (
    <div className={`relative flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm border-2 transition-all ${isFeatured ? 'border-[var(--brand-primary)]' : 'border-transparent'}`}>

      <div className="relative h-48 w-full">
        <img
          src={profileImage}
          alt={name}
          className="w-full h-full object-cover"
          onError={e => e.target.src = "/not-found.png"}
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {expert.certifications?.isVerified && (
            <span className="bg-gray-200/80 backdrop-blur-sm text-[10px] font-bold px-2 py-0.5 rounded text-gray-700 uppercase">
              Verified
            </span>
          )}
          {expert.offersOnline && (
            <span className="bg-green-600/80 backdrop-blur-sm text-[10px] font-bold px-2 py-0.5 rounded text-white uppercase">
              Online
            </span>
          )}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 leading-tight">{name}</h3>
        
        <p className="text-[var(--brand-primary)] font-semibold text-sm mt-1">
          {specialty}
        </p>
        
        <p className="text-[var(--brand-secondary)] text-xs font-medium mt-1">
          {experience} Years of Overall Experience
        </p>

        <div className="mt-4 space-y-1">
          <p className="text-xs font-bold text-gray-800">{locationText}</p>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            {centerName}
          </p>
        </div>

        <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-[var(--brand-secondary)] text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 font-bold">
              <Star size={10} fill="currentColor" /> {rating.toFixed(1)}
            </div>
            <span className="text-[10px] text-gray-500 font-medium underline cursor-pointer">
              {reviewCount} Patient Stories
            </span>
          </div>

          <Button className="bg-[var(--brand-primary)] hover:opacity-90 text-white rounded-full text-[11px] px-4 h-8 font-bold border-none">
            Message Expert
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ExpertSection({ partner }) {
  const endpoint = useMemo(() => process.env.NEXT_PUBLIC_PARTNER_ENDPOINT + "/experts/listing/search", [partner])
  const { isLoading, isValidating, error, data, mutate } = useSWR(endpoint, () => fetchData(endpoint, {
    method: "POST",
    hreader: {
      "x-tenant": partner
    }
  }));

  if (isLoading || isValidating) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6 py-16 max-w-7xl mx-auto">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
          <div className="h-48 w-full bg-gray-200" />
          <div className="p-5 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />

            <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
              <div className="h-4 bg-gray-200 rounded w-20" />
              <div className="h-8 bg-gray-200 rounded-full w-24" />
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
      
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        Something went wrong
      </h3>
      
      <p className="text-gray-500 max-w-md mb-8">
        {data?.message || "We couldn't load the wellness experts right now. Please check your connection and try again."}
      </p>

      <Button 
        onClick={mutate}
        className="cursor-pointer bg-[var(--brand-primary)] text-white rounded-full px-8 py-6 font-bold hover:opacity-90 flex gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </Button>
    </div>
  )

  const experts = Array.isArray(data?.free) ? data?.free : []

  return (
    <section className="bg-gray-50 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-3xl md:text-4xl font-extrabold mb-12">
          <span className="text-[#b1271c]">Our Top Curated</span> <span className="text-black">Experts</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {experts.map((expert) => (
            <ExpertCard key={expert._id} expert={expert} />
          ))}
        </div>

        {/* <div className="mt-12 flex justify-center">
          <Button variant="outline" className="rounded-full bg-gray-100 border-none px-8 py-6 text-gray-500 font-bold hover:bg-gray-200">
            Load More Experts <span className="ml-2">⌄</span>
          </Button>
        </div> */}
      </div>
    </section>
  );
};