"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { TopProgramCard } from "../../_components/landing/TopProgramCard";
import { discoverTopSellingContent } from "@/lib/data/discoverProgramsContent";
import { ProgramsFilterBar } from "./ProgramsFilterBar";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useAuth } from "@/context/AuthContext";
import {
  fetchDiscoverProgramsList,
  programDocumentToTopCard,
} from "@/lib/discoverProgramsApi";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
const RAZORPAY_KEY =
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
  process.env.NEXT_PUBLIC_RAZORPAY_API_KEY;
const CARDS_PER_PAGE = 4;
const MAX_VISIBLE_PROGRAMS = 8;
const SEARCH_DEBOUNCE_MS = 400;
const API_PAGE_LIMIT = 24;

async function postPaymentWithAuth(endpoint, body) {
  const headers = { "Content-Type": "application/json" };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("client_token");
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));

  if (res.status === 401 && typeof window !== "undefined") {
    localStorage.removeItem("client_token");
    window.dispatchEvent(new Event("auth_unauthorized"));
  }
  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }
  return data;
}

async function getWithClientAuth(endpoint) {
  const headers = {};
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("client_token");
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "GET",
    headers,
  });
  const data = await res.json().catch(() => ({}));

  if (res.status === 401 && typeof window !== "undefined") {
    localStorage.removeItem("client_token");
    window.dispatchEvent(new Event("auth_unauthorized"));
  }
  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }
  return data;
}

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function chunkPrograms(items, size) {
  const pages = [];
  for (let i = 0; i < items.length; i += size) {
    pages.push(items.slice(i, i + size));
  }
  return pages;
}

const gridCardClassName =
  "w-full min-w-0 max-h-none max-w-none overflow-visible sm:w-full lg:w-full";

function getSpecialtyOptionsFromPrograms(programs, selectedSpecialty = "") {
  const specialties = new Map();
  programs.forEach((program) => {
    (program.specialtyValues || []).forEach((value) => {
      const label = String(value || "").trim();
      if (label) specialties.set(label.toLowerCase(), label);
    });
  });

  const selected = String(selectedSpecialty || "").trim();
  if (selected) specialties.set(selected.toLowerCase(), selected);

  return [
    { value: "", label: "All specialties" },
    ...Array.from(specialties.values())
      .sort((a, b) => a.localeCompare(b))
      .map((label) => ({ value: label, label })),
  ];
}

function isActiveEnrollment(enrollment) {
  if (enrollment?.status !== "active") return false;
  if (!enrollment?.endsAt) return true;
  return new Date(enrollment.endsAt).getTime() > Date.now();
}

function useClientProgramsFromApi({ initialSearch = "", initialProgramId = "" } = {}) {
  const [programs, setPrograms] = useState(() => []);
  const [specialtyOptions, setSpecialtyOptions] = useState(() => [
    { value: "", label: "All specialties" },
  ]);
  const [loadState, setLoadState] = useState({
    status: "loading",
    error: null,
  });
  const [search, setSearch] = useState(() => initialSearch);
  const [programId, setProgramId] = useState(() => initialProgramId);
  const [filters, setFilters] = useState({
    specialty: "",
    duration: "",
    price: "",
  });
  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);

  const load = useCallback(async ({ searchText, activeFilters }) => {
    setLoadState((s) => ({ ...s, status: "loading", error: null }));
    try {
      const res = await fetchDiscoverProgramsList({
        search: searchText,
        programId,
        specialty: activeFilters?.specialty || "",
        duration: activeFilters?.duration || "",
        price: activeFilters?.price || "",
        page: 1,
        limit: API_PAGE_LIMIT,
        whitelabel: "wellnessz",
      });
      const raw = Array.isArray(res.data) ? res.data : [];
      const mappedPrograms = raw
        .slice(0, MAX_VISIBLE_PROGRAMS)
        .map(programDocumentToTopCard);
      setPrograms(mappedPrograms);
      setSpecialtyOptions((currentOptions) => {
        const nextOptions = getSpecialtyOptionsFromPrograms(
          mappedPrograms,
          activeFilters?.specialty,
        );
        const merged = new Map();
        [...currentOptions, ...nextOptions].forEach((option) => {
          if (option?.value === "") {
            merged.set("", { value: "", label: "All specialties" });
            return;
          }
          const label = String(option?.label || option?.value || "").trim();
          if (label) merged.set(label.toLowerCase(), { value: label, label });
        });
        return [
          merged.get("") || { value: "", label: "All specialties" },
          ...Array.from(merged.values())
            .filter((option) => option.value !== "")
            .sort((a, b) => a.label.localeCompare(b.label)),
        ];
      });
      setLoadState({ status: "ok", error: null });
    } catch (e) {
      setPrograms(discoverTopSellingContent.programs);
      setLoadState({
        status: "error",
        error: e instanceof Error ? e.message : "Could not load programs",
      });
    }
  }, [programId]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      load({ searchText: debouncedSearch, activeFilters: filters });
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [load, debouncedSearch, filters]);

  return {
    programs,
    specialtyOptions,
    loadState,
    search,
    setSearch: (value) => {
      setProgramId("");
      setSearch(value);
    },
    filters,
    setFilters: (value) => {
      setProgramId("");
      setFilters(value);
    },
    refresh: () =>
      load({ searchText: debouncedSearch, activeFilters: filters }),
  };
}

export function TopSellingProgramsSection({
  initialSearch = "",
  initialProgramId = "",
} = {}) {
  const c = discoverTopSellingContent;
  const router = useRouter();
  const scrollRef = useRef(null);
  const {
    programs,
    specialtyOptions,
    loadState,
    search,
    setSearch,
    filters,
    setFilters,
    refresh,
  } = useClientProgramsFromApi({ initialSearch, initialProgramId });
  const { isAuthenticated, openLoginModal, user } = useAuth();
  const [enrollingProgramId, setEnrollingProgramId] = useState(null);
  const [enrolledProgramIds, setEnrolledProgramIds] = useState(() => new Set());

  const pages = useMemo(
    () => chunkPrograms(programs, CARDS_PER_PAGE),
    [programs],
  );
  const pageCount = pages.length;

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(pageCount > 1);

  const syncArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el || pageCount <= 1) {
      setCanPrev(false);
      setCanNext(false);
      return;
    }
    const w = el.clientWidth;
    if (w <= 0) return;
    const i = Math.round(el.scrollLeft / w);
    setCanPrev(i > 0);
    setCanNext(i < pageCount - 1);
  }, [pageCount]);

  useEffect(() => {
    syncArrows();
  }, [syncArrows, pageCount]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ left: 0, behavior: "auto" });
  }, [programs]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => syncArrows());
    ro.observe(el);
    return () => ro.disconnect();
  }, [syncArrows]);

  useEffect(() => {
    if (!isAuthenticated) {
      setEnrolledProgramIds(new Set());
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await getWithClientAuth("/experts/client/program-enrollments");
        const rows = Array.isArray(res?.enrollments) ? res.enrollments : [];
        if (cancelled) return;
        setEnrolledProgramIds(
          new Set(
            rows
              .filter(isActiveEnrollment)
              .map((enrollment) => enrollment?.program?._id || enrollment?.program)
              .filter(Boolean)
              .map(String),
          ),
        );
      } catch {
        if (!cancelled) setEnrolledProgramIds(new Set());
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const scrollByPage = (dir) => {
    const el = scrollRef.current;
    if (!el || pageCount <= 1) return;
    const w = el.clientWidth;
    if (w <= 0) return;
    const current = Math.round(el.scrollLeft / w);
    const next = Math.max(0, Math.min(pageCount - 1, current + dir));
    el.scrollTo({ left: next * w, behavior: "smooth" });
  };

  const handleEnroll = async (program) => {
    if (!program?.programId) {
      toast.error("This program is not available to enroll.");
      return;
    }
    if (!isAuthenticated) {
      openLoginModal?.();
      return;
    }
    if (enrolledProgramIds.has(String(program.programId))) {
      router.push("/dashboard/programs");
      return;
    }

    setEnrollingProgramId(program.programId);
    try {
      if (program.programType === "free") {
        const res = await postPaymentWithAuth(
          "/payments/expert-programs/free-join",
          { programId: program.programId },
        );
        toast.success(res.message || "Joined successfully");
        router.push("/dashboard/programs");
        return;
      }

      if (!RAZORPAY_KEY) {
        toast.error("Set NEXT_PUBLIC_RAZORPAY_API_KEY for Razorpay checkout.");
        return;
      }

      const orderData = await postPaymentWithAuth(
        "/payments/expert-programs/order",
        {
          programId: program.programId,
          amount: program.amount,
        },
      );
      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) {
        toast.error("Payment checkout failed to load");
        return;
      }

      const contactRaw =
        user?.mobileNumber || user?.phoneNumber || user?.contact || "";
      const digits = String(contactRaw).replace(/\D/g, "");
      const prefill = Object.fromEntries(
        [
          ["name", user?.name],
          ["email", user?.email],
          ["contact", digits.length >= 10 ? digits.slice(-10) : ""],
        ].filter(([, value]) => value != null && String(value).trim() !== ""),
      );

      const options = {
        key: orderData.keyId || RAZORPAY_KEY,
        name: "WellnessZ",
        description: program.name || "Expert program",
        order_id: orderData.orderId,
        prefill,
        theme: { color: "#0a5b22" },
        handler: async (rzResponse) => {
          try {
            await postPaymentWithAuth("/payments/expert-programs/verify", {
              paymentId: String(orderData.paymentId),
              razorpayOrderId: rzResponse.razorpay_order_id,
              razorpayPaymentId: rzResponse.razorpay_payment_id,
              razorpaySignature: rzResponse.razorpay_signature,
            });
            toast.success("Payment successful");
            router.push("/dashboard/programs");
          } catch (err) {
            toast.error(err.message || "Payment verification failed");
          }
        },
      };

      const rz = new window.Razorpay(options);
      rz.on("payment.failed", (response) => {
        const err = response?.error || {};
        toast.error(
          [err.description, err.reason, err.code].filter(Boolean).join(" - ") ||
            "Payment failed. Please try again.",
        );
      });
      rz.open();
    } catch (e) {
      toast.error(e.message || "Could not start payment");
    } finally {
      setEnrollingProgramId(null);
    }
  };

  return (
    <section
      id="top-selling-programs"
      className="w-full scroll-mt-24 bg-[#03632C] py-10 font-lato sm:py-14 lg:py-20"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center font-lexend text-[1.8rem] font-bold leading-tight tracking-tighter sm:text-3xl lg:text-[3.6rem] text-[#9AF45D] ">
          <span className="">{c.titleBefore}</span>{" "}
          <span className="text-white">{c.titleMid}</span>{" "}
          <span className="">{c.titleHighlight}</span>
        </h2>

        <div className="mt-6 sm:mt-10">
          <ProgramsFilterBar
            searchValue={search}
            onSearchChange={setSearch}
            filters={filters}
            onFiltersChange={setFilters}
            specialtyOptions={specialtyOptions}
            onFilterApply={refresh}
          />
        </div>

        {loadState.status === "error" && loadState.error ? (
          <p className="mt-4 text-center text-sm text-white/80" role="status">
            {loadState.error} Showing sample programs below.
          </p>
        ) : null}

        <div
          ref={scrollRef}
          onScroll={syncArrows}
          className="scrollbar-hide -mx-4 mt-6 flex min-h-48 snap-x snap-mandatory overflow-x-auto pb-2 sm:mx-0 sm:mt-10"
        >
          {loadState.status === "loading" && programs.length === 0 ? (
            <div className="flex w-full min-w-full items-center justify-center px-4 py-16 sm:px-0">
              <p className="text-sm font-medium text-white/90">
                Loading programs…
              </p>
            </div>
          ) : programs.length === 0 ? (
            <div className="flex w-full min-w-full items-center justify-center px-4 py-16 sm:px-0">
              <p className="text-center text-sm text-white/90">
                No programs match your search. Try different keywords.
              </p>
            </div>
          ) : (
            pages.map((pagePrograms) => (
              <div
                key={pagePrograms[0].id}
                className="w-full min-w-full shrink-0 snap-center px-4 sm:px-0"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                  {pagePrograms.map((p) => {
                    const alreadyEnrolled = enrolledProgramIds.has(
                      String(p.programId),
                    );
                    return (
                      <TopProgramCard
                        key={p.id}
                        className={gridCardClassName}
                        emphasizeHover
                        badgeLabel={p.badgeLabel}
                        name={p.name}
                        features={p.features}
                        price={p.price}
                        enrollLabel={
                          alreadyEnrolled ? "Go to program" : p.enrollLabel
                        }
                        enrollHref={p.enrollHref}
                        deliveryTags={p.deliveryTags}
                        authorName={p.authorName}
                        enrollmentLine={p.enrollmentLine}
                        authorAvatarSrc={p.authorAvatarSrc}
                        imageSrc={p.imageSrc}
                        imageAlt={p.imageAlt}
                        onEnroll={() => handleEnroll(p)}
                        enrollDisabled={enrollingProgramId === p.programId}
                      />
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {pageCount > 1 ? (
          <div className="mt-8 flex justify-center gap-2 sm:mt-12">
            <button
              type="button"
              aria-label="Previous programs"
              disabled={!canPrev}
              onClick={() => scrollByPage(-1)}
              className="flex size-11 items-center justify-center rounded-full border border-white/30 bg-transparent text-white transition-colors hover:bg-white/10 disabled:pointer-events-none disabled:opacity-35"
            >
              <ArrowLeft className="size-5" strokeWidth={2} />
            </button>
            <button
              type="button"
              aria-label="Next programs"
              disabled={!canNext}
              onClick={() => scrollByPage(1)}
              className="flex size-11 items-center justify-center rounded-full border border-white/30 bg-transparent text-white transition-colors hover:bg-white/10 disabled:pointer-events-none disabled:opacity-35"
            >
              <ArrowRight className="size-5" strokeWidth={2} />
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
