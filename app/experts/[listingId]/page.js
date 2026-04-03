"use client";

import { use, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { fetchAPI } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "next/navigation";
import Hero from "./_components/Hero";
import MembershipPrograms from "@/app/experts/[listingId]/_components/MembershipPrograms";
import About from "./_components/About";
import Services from "./_components/Services";
import StoriesContact from "./_components/StoriesContact";

export default function ExpertProfilePage({ params }) {
  const { listingId } = use(params);
  const { isAuthenticated, openLoginModal, user } = useAuth();
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
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    contact: "",
    message: "",
    location: "Ujice Leardin, CA",
    mapImage: "",
  });

  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      name: user?.name || prev.name,
      email: user?.email || prev.email,
    }));
  }, [user]);

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

  useEffect(() => {
    const details = coachData?.expertDetails;
    if (!details) return;
    const location = [details.city, details.state, details.country]
      .filter(Boolean)
      .join(", ");
    if (!location) return;
    setFormState((prev) => ({ ...prev, location }));
  }, [coachData]);

  const coachInfo = useMemo(() => coachData?.coach || {}, [coachData]);
  const details = useMemo(() => coachData?.expertDetails || {}, [coachData]);

  const onFormChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const submitEnquiry = async (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      openLoginModal();
      return;
    }

    if (!formState.message.trim()) {
      toast.error("Please add your enquiry message");
      return;
    }

    const consultationMode = details?.offersOnline ? "online" : "in_person";
    const meta = [formState.name, formState.email, formState.contact]
      .filter(Boolean)
      .join(" | ");
    const finalMessage = meta
      ? `${formState.message}\n\nContact: ${meta}`
      : formState.message;

    try {
      const data = await fetchAPI("/experts/inquiry/create", {
        listingId: String(listingId),
        message: finalMessage,
        consultationMode,
      });

      const inquiryId = data?.inquiry?._id;
      if (!inquiryId) {
        const msg =
          typeof data?.message === "string" && data.message.trim()
            ? data.message
            : "Could not send enquiry. Please try again.";
        toast.error(msg);
        return;
      }

      try {
        await fetchAPI("/experts/chat/thread-client", {
          inquiryId: String(inquiryId),
        });
      } catch (threadErr) {
        console.error("Chat thread after inquiry:", threadErr);
        toast.error(
          threadErr?.message ||
            "Your enquiry was delivered, but chat could not be opened. Refresh the page or try again shortly.",
        );
      }

      toast.success("Enquiry sent successfully");
      setFormState((prev) => ({ ...prev, message: "" }));
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Could not send enquiry");
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
      {/* <div className="h-[72px]" /> */}
      {/* sm:px-8 lg:px-10 */}
      <div className="flex w-full flex-col gap-y-20">
        <Hero coachInfo={coachInfo} details={details} />
        <About details={details} coachInfo={coachInfo} />
        <Services details={details} />
        <MembershipPrograms
          details={details}
          programs={programs}
          isAuthenticated={isAuthenticated}
          openLoginModal={openLoginModal}
          user={user}
        />
        <StoriesContact
          details={details}
          reviews={reviews}
          formState={formState}
          onFormChange={onFormChange}
          onSubmit={submitEnquiry}
        />
      </div>
    </main>
  );
}
