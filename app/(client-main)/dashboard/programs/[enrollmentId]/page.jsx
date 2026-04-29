"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { fetchAPI } from "@/lib/api";
import {
  formatProgramDate,
  mapEnrollmentToDetail,
} from "@/lib/dashboardProgramEnrollment";
import { cn } from "@/lib/utils";
import { ArrowLeft, CalendarDays } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import DashboardHeading from "../../_components/common/DashboardHeading";
import ProgramEnrollmentDetailSections from "./_components/ProgramEnrollmentDetailSections";

export default function ProgramEnrollmentDetailPage() {
  const params = useParams();
  const enrollmentId =
    typeof params?.enrollmentId === "string" ? params.enrollmentId : "";

  const { isAuthenticated, openLoginModal } = useAuth();
  const [enrollment, setEnrollment] = useState(null);
  const [loadError, setLoadError] = useState(null);
  /** False until the first list request for this auth + id finishes (success or error). */
  const [fetchSettled, setFetchSettled] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !enrollmentId) {
      setEnrollment(null);
      setLoadError(null);
      setFetchSettled(false);
      return;
    }
    let cancelled = false;
    setFetchSettled(false);
    (async () => {
      setLoadError(null);
      try {
        const res = await fetchAPI(
          "/experts/client/program-enrollments",
          undefined,
          "GET",
        );
        const rows = Array.isArray(res?.enrollments) ? res.enrollments : [];
        const row = rows.find(
          (e) => String(e._id ?? e.id ?? "") === enrollmentId,
        );
        if (!cancelled) setEnrollment(row ?? null);
      } catch (e) {
        if (!cancelled) {
          setLoadError(
            e instanceof Error ? e.message : "Could not load program.",
          );
          setEnrollment(null);
        }
      } finally {
        if (!cancelled) setFetchSettled(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, enrollmentId]);

  const detail = useMemo(
    () => (enrollment ? mapEnrollmentToDetail(enrollment) : null),
    [enrollment],
  );

  const likelyNotFound =
    loadError &&
    (/404\b/.test(loadError) || /not\s*found/i.test(loadError));

  const loading = isAuthenticated && Boolean(enrollmentId) && !fetchSettled;

  const notInList =
    fetchSettled &&
    !loadError &&
    Boolean(enrollmentId) &&
    enrollment === null &&
    isAuthenticated;

  if (!isAuthenticated) {
    return (
      <div className="font-lato mx-auto flex max-w-lg flex-col items-center justify-center space-y-4 pb-16 pt-8 text-center">
        <DashboardHeading text="YOUR PROGRAM" />
        <p className="text-sm text-zinc-600">
          Log in to view program details from your enrollments.
        </p>
        <Button
          type="button"
          className="mt-4 rounded-xl bg-[#84cc16] px-8 py-3 font-semibold text-white hover:bg-[#6ca832]"
          onClick={openLoginModal}
        >
          Log in
        </Button>
      </div>
    );
  }

  if (!enrollmentId) {
    return (
      <div className="font-lato space-y-4 pb-16">
        <p className="text-sm text-zinc-600">Invalid link.</p>
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/dashboard/programs">Back to programs</Link>
        </Button>
      </div>
    );
  }

  if (loadError && fetchSettled) {
    return (
      <div className="font-lato mx-auto max-w-2xl space-y-6 pb-16">
        <Button
          asChild
          variant="ghost"
          className="-ml-2 gap-2 font-lato text-[#357200] hover:bg-[#f2f8ec]"
        >
          <Link href="/dashboard/programs" className="inline-flex items-center">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Your programs
          </Link>
        </Button>
        <p className="text-sm text-red-600">{loadError}</p>
        {likelyNotFound ? (
          <p className="text-sm text-zinc-600">
            This enrollment is not in your account, or the link may be wrong.
          </p>
        ) : null}
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/dashboard/programs">Back to programs</Link>
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="font-lato rounded-2xl border border-dashed border-zinc-200 bg-white/60 px-6 py-12 text-center text-sm text-zinc-500">
        Loading program…
      </div>
    );
  }

  if (!detail || !enrollment) {
    return (
      <div className="font-lato mx-auto max-w-2xl space-y-6 pb-16">
        <Button
          asChild
          variant="ghost"
          className="-ml-2 gap-2 font-lato text-[#357200] hover:bg-[#f2f8ec]"
        >
          <Link href="/dashboard/programs" className="inline-flex items-center">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Your programs
          </Link>
        </Button>
        <p className="text-sm text-zinc-600">
          {notInList ? (
            <>
              No enrollment matched this link in your programs list. Open a program
              from{" "}
              <Link
                href="/dashboard/programs"
                className="font-semibold text-[#357200] underline-offset-4 hover:underline"
              >
                Your programs
              </Link>
              .
            </>
          ) : (
            <>
              We could not load this enrollment. Please go back and open the program
              again.
            </>
          )}
        </p>
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/dashboard/programs">Back to programs</Link>
        </Button>
      </div>
    );
  }

  const pct = Math.min(100, Math.max(0, detail.progress));

  return (
    <div className="font-lato mx-auto max-w-3xl space-y-10 pb-12">
      <div>
        <Button
          asChild
          variant="ghost"
          className="-ml-2 gap-2 font-lato text-[#357200] hover:bg-[#f2f8ec]"
        >
          <Link href="/dashboard/programs" className="inline-flex items-center">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Your programs
          </Link>
        </Button>
      </div>

      <div className="inline-flex w-fit max-w-full flex-col items-start gap-2.5">
        <h1 className="font-lato text-2xl font-extrabold tracking-tight text-[#1f3d18] sm:text-3xl">
          {detail.title}
        </h1>
        <span
          className="h-1.5 w-[55%] min-w-16 shrink-0 bg-[#70C136]"
          aria-hidden
        />
      </div>

      <div className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-sm">
        <div className="relative aspect-[21/9] w-full bg-zinc-100 sm:aspect-video">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={detail.image}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>

        <div className="space-y-6 p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            {detail.completed ? (
              <span className="rounded-full bg-[#f2f8ec] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#357200]">
                Completed
              </span>
            ) : (
              <span className="rounded-full bg-[#eef6ff] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#1d4ed8]">
                In progress
              </span>
            )}
            {detail.enrollmentStatus ? (
              <span className="text-xs font-medium capitalize text-zinc-500">
                Status: {detail.enrollmentStatus}
              </span>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-6 border-b border-zinc-100 pb-6">
            <div className="flex items-center gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-zinc-200 ring-2 ring-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={detail.coachAvatar}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="font-lato text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                  Coach
                </p>
                <p className="font-lato text-lg font-extrabold text-[#285c16]">
                  {detail.coachRawName.startsWith("Coach ")
                    ? detail.coachRawName
                    : `Coach ${detail.coachRawName}`}
                </p>
              </div>
            </div>
            <div className="flex flex-1 flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-600">
              {detail.startsAt ? (
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-[#70C136]" aria-hidden />
                  Starts {formatProgramDate(detail.startsAt)}
                </span>
              ) : null}
              {detail.endsAt ? (
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-[#70C136]" aria-hidden />
                  Ends {formatProgramDate(detail.endsAt)}
                </span>
              ) : null}
              {detail.durationLabel ? (
                <span className="font-semibold text-[#357200]/90">
                  {detail.durationLabel}
                </span>
              ) : null}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-baseline justify-between gap-2">
              <span className="font-lato text-[10px] font-bold uppercase tracking-[0.18em] text-[#357200]">
                Progress along program dates
              </span>
              <span className="font-lato text-xs font-extrabold tabular-nums text-[#357200]">
                {pct}%
              </span>
            </div>
            <div
              className="h-3 w-full overflow-hidden rounded-full bg-[#67BC2A1A]"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Program progress ${pct}%`}
            >
              <div
                className={cn(
                  "h-full min-w-0 rounded-full bg-linear-to-r transition-[width] duration-300 ease-out",
                  detail.completed
                    ? "from-zinc-400 to-zinc-500"
                    : "from-[#357200] to-[#67BC2A]",
                )}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <ProgramEnrollmentDetailSections
            enrollment={enrollment}
            detail={detail}
          />
        </div>
      </div>
    </div>
  );
}
