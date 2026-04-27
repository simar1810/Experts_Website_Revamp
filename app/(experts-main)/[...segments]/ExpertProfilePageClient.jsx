"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { fetchAPI } from "@/lib/api";
import {
  buildSubmitEnquiryComposerPrefill,
  ensureClientThreadForListing,
} from "@/lib/expertListingChat";
import { setPendingExpertEnquiry } from "@/lib/pendingExpertEnquiry";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Hero from "./_components/Hero";
import About from "./_components/About";
import Services from "./_components/Services";
import MembershipPrograms from "./_components/MembershipPrograms";
import StoriesContact from "./_components/StoriesContact";

export default function ExpertProfilePageClient({ listingId }) {
  const { isAuthenticated, openLoginModal, openRegisterModal, user } =
    useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const previewData = useMemo(() => {
    const raw = searchParams.get("preview");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (error) {
      console.error("Invalid preview payload:", error);
      return null;
    }
  }, [searchParams]);

  const [coachData, setCoachData] = useState(previewData);
  const [isLoading, setIsLoading] = useState(!previewData);
  const [reviews, setReviews] = useState(previewData?.reviews || []);
  const [programs, setPrograms] = useState(previewData?.programs || []);

  useEffect(() => {
    const getCoachDetails = async () => {
      try {
        if (!coachData) {
          setIsLoading(true);
        }
        const data = await fetchAPI("/experts/listing/public/details", {
          listingId,
        });
        setCoachData(data);
        setReviews(data?.reviews || []);
        setPrograms(data?.programs || []);
      } catch (error) {
        console.error("Failed to fetch expert details:", error);
        toast.error("Could not load expert details");
      } finally {
        setIsLoading(false);
      }
    };

    getCoachDetails();
  }, [listingId]);

  const coachInfo = useMemo(() => coachData?.coach || {}, [coachData]);
  const details = useMemo(() => coachData?.expertDetails || {}, [coachData]);
  const recommendedScoreFinal = useMemo(
    () =>
      coachData?.recommendedScoreFinal ??
      coachData?.coach?.recommendedScoreFinal ??
      coachData?.listing?.recommendedScoreFinal ??
      coachData?.expertDetails?.recommendedScoreFinal,
    [coachData],
  );

  const onSendEnquiry = async () => {
    if (!isAuthenticated) {
      setPendingExpertEnquiry({
        listingId: String(listingId),
        consultationMode: details?.offersOnline ? "online" : "in_person",
        submitEnquiryComposer: true,
      });
      openRegisterModal();
      return;
    }
    const dismiss = toast.loading("Opening chat…");
    try {
      const { threadId } = await ensureClientThreadForListing({
        fetchAPI,
        listingId,
        offersOnline: Boolean(details?.offersOnline),
      });
      toast.dismiss(dismiss);
      const q = new URLSearchParams();
      q.set("thread", String(threadId));
      q.set("draft", buildSubmitEnquiryComposerPrefill(user));
      router.push(`/dashboard/enquiries?${q.toString()}`);
    } catch (e) {
      toast.dismiss(dismiss);
      toast.error(
        e instanceof Error ? e.message : "Could not open chat. Try again.",
      );
    }
  };

  if (isLoading && !coachData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0f5e2c]" />
      </div>
    );
  }

  if (!coachData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#566b60] font-semibold">
        Expert profile not found.
      </div>
    );
  }

  return (
    <main className="bg-white min-h-screen pb-10 font-manrope ">
      <div className="flex w-full flex-col gap-y-20">
        <Hero
          coachInfo={coachInfo}
          details={details}
          recommendedScoreFinal={recommendedScoreFinal}
          onSendEnquiry={onSendEnquiry}
        />
        <About details={details} coachInfo={coachInfo} />
        <Services details={details} />
        <MembershipPrograms
          details={details}
          programs={programs}
          isAuthenticated={isAuthenticated}
          openLoginModal={openLoginModal}
          user={user}
        />
        <StoriesContact details={details} reviews={reviews} />
      </div>
    </main>
  );
}
