"use client";

import {
  AlertCircle,
  ArrowRight,
  Clock,
  RefreshCw,
  Tag,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import useSWR from "swr";
import {
  fetchPublicListingPrograms,
  normalizeListingId,
  programStableId,
} from "@/features/experts-landing/lib/publicListingProgramsApi";

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
    featured,
    clientsVisible,
  } = program;

  const originalPrice = activeDiscount?.originalAmount;
  const discountPercent = activeDiscount?.percentDiscount ?? 0;

  const showEnrollmentCount =
    clientsVisible !== false &&
    clientsCount !== false &&
    clientsCount != null;

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-3xl border-2 bg-white shadow-sm transition-all hover:shadow-md ${featured ? "border-[var(--brand-primary)]" : "border-transparent"}`}
    >
      <div className="relative h-52 w-full overflow-hidden">
        <img
          src={
            coverImage ||
            "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=500&auto=format&fit=crop"
          }
          alt={title || "Program"}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = "/not-found.png";
          }}
        />

        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {featured && (
            <span className="bg-[var(--brand-primary)] px-3 py-1 text-[10px] font-black tracking-wider text-white uppercase shadow-lg">
              Featured
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-[var(--brand-secondary)] px-3 py-1 text-[10px] font-black tracking-wider text-white uppercase">
              {discountPercent}% OFF
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-grow flex-col p-6">
        <div className="mb-3 flex flex-wrap gap-2">
          {(tags || []).slice(0, 2).map((tag, idx) => (
            <span
              key={idx}
              className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase"
            >
              <Tag size={10} /> {tag}
            </span>
          ))}
        </div>

        <h3 className="mb-2 text-xl leading-tight font-extrabold text-gray-900 transition-colors group-hover:text-[var(--brand-primary)]">
          {title}
        </h3>

        <p className="mb-4 line-clamp-2 text-sm text-gray-500">{shortDescription}</p>

        <div className="mb-6 flex items-center gap-4">
          {durationLabel ? (
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
              <Clock size={14} className="text-[var(--brand-primary)]" />
              {durationLabel}
            </div>
          ) : null}
          {showEnrollmentCount ? (
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
              <Users size={14} className="text-[var(--brand-primary)]" />
              {clientsCount}+ Enrolled
            </div>
          ) : null}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-6">
          <div className="flex flex-col">
            {originalPrice ? (
              <span className="text-xs font-medium text-gray-400 line-through">
                {currency} {originalPrice}
              </span>
            ) : null}
            <span className="text-xl font-black text-gray-900">
              {currency === "INR" ? "₹" : currency}{" "}
              {amount != null ? amount : "—"}
            </span>
          </div>

          <Button className="group/btn flex h-10 gap-2 rounded-full border-none bg-[var(--brand-primary)] px-5 font-bold text-white shadow-none hover:opacity-90">
            Enroll
            <ArrowRight
              size={16}
              className="transition-transform group-hover/btn:translate-x-1"
            />
          </Button>
        </div>
      </div>
    </div>
  );
}

async function programsListingFetcher([_, listingId, tenant]) {
  const { programs, error } = await fetchPublicListingPrograms(
    listingId,
    tenant,
  );
  if (error) throw error;
  return programs;
}

export default function ProgramsSection({ partner, listingId }) {
  const id = normalizeListingId(listingId);
  const tenant =
    partner != null && String(partner).trim() ? String(partner).trim() : "";

  const swrKey =
    id ? ["public-listing-programs", id, tenant] : null;

  const { isLoading, isValidating, error, data, mutate } = useSWR(
    swrKey,
    programsListingFetcher,
    { revalidateOnFocus: false },
  );

  const programs = Array.isArray(data) ? data : [];

  if (!id) {
    return null;
  }

  if (isLoading || isValidating) {
    return (
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-16 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm"
          >
            <div className="h-52 w-full bg-gray-200" />
            <div className="space-y-4 p-6">
              <div className="h-4 w-1/4 rounded bg-gray-200" />
              <div className="h-6 w-3/4 rounded bg-gray-200" />
              <div className="h-4 w-full rounded bg-gray-200" />
              <div className="flex items-center justify-between border-t border-gray-50 pt-6">
                <div className="h-6 w-20 rounded bg-gray-200" />
                <div className="h-10 w-28 rounded-full bg-gray-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <section className="bg-white px-6 py-16">
        <div className="mx-auto flex max-w-lg flex-col items-center justify-center text-center">
          <div className="mb-6 rounded-full bg-red-50 p-4">
            <AlertCircle className="h-12 w-12 text-[var(--brand-secondary)]" />
          </div>
          <h3 className="mb-2 text-2xl font-bold text-gray-900">
            Could not load programs
          </h3>
          <p className="mb-8 text-gray-500">{error.message}</p>
          <Button
            type="button"
            onClick={() => mutate()}
            className="flex gap-2 rounded-full bg-[var(--brand-primary)] px-8 py-6 font-bold text-white hover:opacity-90"
          >
            <RefreshCw className="h-4 w-4" /> Try again
          </Button>
        </div>
      </section>
    );
  }

  if (programs.length === 0) {
    return (
      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="mb-2 text-2xl font-black tracking-tight text-gray-900">
            Programs
          </h2>
          <p className="text-gray-500">
            No published programs are available for this listing yet.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="mb-2 text-3xl font-black tracking-tight md:text-4xl">
              <span className="text-[var(--brand-secondary)] uppercase italic">
                Transformation
              </span>
              <br /> Programs
            </h2>
            <p className="font-medium text-gray-500">
              Expert-led plans tailored for your goals
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <ProgramCard
              key={programStableId(program)}
              program={program}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
