"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { fetchAPI } from "@/lib/api";
import {
  daysUntilEnd,
  formatProgramDate,
  mapEnrollmentToDetail,
  mergeEnrollmentWithProgramDetail,
  programFromDetailApiResponse,
} from "@/lib/dashboardProgramEnrollment";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Dumbbell,
  IndianRupee,
  Leaf,
  MessageCircle,
  Sparkles,
  Tag,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import DashboardHeading from "../../_components/common/DashboardHeading";
import ProgramEnrollmentDetailSections from "./_components/ProgramEnrollmentDetailSections";

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function formatMoney(program) {
  if (!program || program.programType === "free") return "Free";
  const amount = Number(program.amount);
  if (!Number.isFinite(amount) || amount <= 0) return "";
  const currency = text(program.currency) || "INR";
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

function durationText(program, detail) {
  const label = text(program?.durationLabel) || text(detail?.durationLabel);
  if (label) return label;
  const duration = program?.duration ?? program?.durationDays;
  const unit = text(program?.durationUnit) || "days";
  if (duration == null) return "";
  return `${duration} ${unit}`;
}

function statusLabel(detail) {
  if (detail.completed) return "Completed";
  const days = daysUntilEnd(detail.endsAt);
  if (days == null) return "In progress";
  if (days === 0) return "Ends today";
  return `${days} days left`;
}

function StatTile({ icon: Icon, label, value, helper, variant = "white" }) {
  return (
    <div
      className={cn(
        "rounded-3xl border p-5 shadow-sm",
        variant === "green"
          ? "border-[#d7edc8] bg-[#e8f5dc]"
          : "border-zinc-200/80 bg-white",
      )}
    >
      <div className="flex items-start gap-4">
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
            variant === "green"
              ? "bg-white/85 text-[#70C136]"
              : "bg-[#f2f8ec] text-[#357200]",
          )}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="font-lato text-[10px] font-bold uppercase tracking-[0.18em] text-[#3d6630]">
            {label}
          </p>
          <p className="mt-2 font-lato text-xl font-extrabold tracking-tight text-[#1f3d18]">
            {value || "Not set"}
          </p>
          {helper ? (
            <p className="mt-1 text-xs leading-relaxed text-zinc-500">
              {helper}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ProgramTagList({ tags }) {
  const flat = Array.isArray(tags)
    ? tags
        .map((tag) => (typeof tag === "string" ? tag.trim() : String(tag)))
        .filter(Boolean)
        .slice(0, 8)
    : [];
  if (!flat.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {flat.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#2d5a1f] ring-1 ring-[#d7edc8]"
        >
          <Tag className="h-3 w-3" aria-hidden />
          {tag}
        </span>
      ))}
    </div>
  );
}

function IncludedCard({ icon: Icon, title, active, helper }) {
  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-4">
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
            active ? "bg-[#e8f5dc] text-[#357200]" : "bg-zinc-100 text-zinc-400",
          )}
        >
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <div>
          <p className="font-lato font-extrabold text-[#285c16]">{title}</p>
          <p className="mt-1 text-sm leading-relaxed text-zinc-500">{helper}</p>
        </div>
      </div>
    </div>
  );
}

export default function ProgramEnrollmentDetailPage() {
  const params = useParams();
  const enrollmentId =
    typeof params?.enrollmentId === "string" ? params.enrollmentId : "";

  const { isAuthenticated, openLoginModal } = useAuth();
  const [enrollment, setEnrollment] = useState(null);
  const [programDetail, setProgramDetail] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [programDetailError, setProgramDetailError] = useState(null);
  /** False until the first list request for this auth + id finishes (success or error). */
  const [fetchSettled, setFetchSettled] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !enrollmentId) {
      setEnrollment(null);
      setProgramDetail(null);
      setLoadError(null);
      setProgramDetailError(null);
      setFetchSettled(false);
      return;
    }
    let cancelled = false;
    setFetchSettled(false);
    (async () => {
      setLoadError(null);
      setProgramDetailError(null);
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
        let nextProgramDetail = null;
        let nextProgramDetailError = null;

        const programId =
          row?.program && (row.program._id != null || row.program.id != null)
            ? String(row.program._id ?? row.program.id)
            : "";

        if (row && programId) {
          try {
            const detailRes = await fetchAPI(
              `/experts/listing/programs/detail/${encodeURIComponent(programId)}`,
              undefined,
              "GET",
            );
            nextProgramDetail = programFromDetailApiResponse(detailRes);
          } catch (e) {
            nextProgramDetailError =
              e instanceof Error
                ? e.message
                : "Could not load extra program details.";
          }
        }

        if (!cancelled) {
          setEnrollment(row ?? null);
          setProgramDetail(nextProgramDetail);
          setProgramDetailError(nextProgramDetailError);
        }
      } catch (e) {
        if (!cancelled) {
          setLoadError(
            e instanceof Error ? e.message : "Could not load program.",
          );
          setEnrollment(null);
          setProgramDetail(null);
          setProgramDetailError(null);
        }
      } finally {
        if (!cancelled) setFetchSettled(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, enrollmentId]);

  const enrichedEnrollment = useMemo(
    () => mergeEnrollmentWithProgramDetail(enrollment, programDetail),
    [enrollment, programDetail],
  );

  const detail = useMemo(
    () => (enrichedEnrollment ? mapEnrollmentToDetail(enrichedEnrollment) : null),
    [enrichedEnrollment],
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
          className="mt-4 rounded-xl bg-[var(--brand-primary)] px-8 py-3 font-semibold text-white hover:bg-[#6ca832]"
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

  const program = enrichedEnrollment?.program ?? {};
  const pct = Math.min(100, Math.max(0, detail.progress));
  const coachName = detail.coachRawName.startsWith("Coach ")
    ? detail.coachRawName
    : `Coach ${detail.coachRawName}`;
  const programDuration = durationText(program, detail);
  const price = formatMoney(program);
  const clientCount =
    program.clientsCount !== false && program.clientsCount != null
      ? Number(program.clientsCount)
      : null;
  const hasMealPlan = Boolean(
    enrichedEnrollment?.assignedMealPlan || program.linkedMealPlan,
  );
  const hasWorkout = Boolean(
    enrichedEnrollment?.assignedWorkout || program.linkedWorkout,
  );
  const hasNudges = Boolean(
    (Array.isArray(enrichedEnrollment?.assignedNudges) &&
      enrichedEnrollment.assignedNudges.length > 0) ||
      (Array.isArray(program.linkedNudges) && program.linkedNudges.length > 0) ||
      (program.linkedNudges && program.linkedNudges !== false),
  );

  return (
    <div className="font-lato mx-auto max-w-6xl space-y-8 pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button
          asChild
          variant="ghost"
          className="-ml-2 w-fit gap-2 font-lato text-[#357200] hover:bg-[#f2f8ec]"
        >
          <Link href="/dashboard/programs" className="inline-flex items-center">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Your programs
          </Link>
        </Button>
        <div className="hidden sm:block">
          <DashboardHeading text="PROGRAM DETAILS" />
        </div>
      </div>

      <section className="overflow-hidden rounded-[2rem] border border-[#d7edc8] bg-white shadow-sm">
        <div className="grid lg:grid-cols-[minmax(0,1.2fr)_420px]">
          <div className="relative min-h-[320px] bg-zinc-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={detail.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 space-y-4 p-6 text-white sm:p-8">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#285c16]">
                  {statusLabel(detail)}
                </span>
                {detail.enrollmentStatus ? (
                  <span className="rounded-full bg-black/35 px-3 py-1 text-[10px] font-bold uppercase tracking-wide backdrop-blur">
                    {detail.enrollmentStatus}
                  </span>
                ) : null}
              </div>
              <div>
                <h1 className="max-w-3xl font-lato text-3xl font-extrabold tracking-tight sm:text-4xl">
                  {detail.title}
                </h1>
                {detail.shortDescription ? (
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-white/85 sm:text-base">
                    {detail.shortDescription}
                  </p>
                ) : null}
              </div>
              <ProgramTagList tags={program.tags} />
            </div>
          </div>

          <aside className="space-y-4 bg-[#fbfcf8] p-5 sm:p-6">
            <div className="rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-zinc-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={detail.coachAvatar}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-lato text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                    Your expert
                  </p>
                  <p className="font-lato text-lg font-extrabold text-[#285c16]">
                    {coachName}
                  </p>
                </div>
              </div>
            </div>

            <StatTile
              icon={Clock3}
              label="Program status"
              value={statusLabel(detail)}
              helper={
                detail.endsAt
                  ? `Ends ${formatProgramDate(detail.endsAt)}`
                  : "Your expert controls the program timeline."
              }
              variant="green"
            />
            <StatTile
              icon={CalendarDays}
              label="Duration"
              value={programDuration}
              helper={
                detail.startsAt
                  ? `Started ${formatProgramDate(detail.startsAt)}`
                  : "Starts when your enrollment begins."
              }
            />
            <StatTile
              icon={IndianRupee}
              label="Program price"
              value={price}
              helper={
                program.programType === "free"
                  ? "No payment is required for this program."
                  : "Shown from the published program details."
              }
            />
            {clientCount != null && Number.isFinite(clientCount) ? (
              <StatTile
                icon={UsersRound}
                label="Joined clients"
                value={clientCount}
                helper="Visible count from the expert profile."
              />
            ) : null}
          </aside>
        </div>
      </section>

      {programDetailError ? (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          Some published program details could not be loaded. Your enrollment
          information is still available below.
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <main className="space-y-6">
          <section className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-baseline justify-between gap-4">
              <div>
                <p className="font-lato text-[10px] font-bold uppercase tracking-[0.18em] text-[#3d6630]">
                  Your progress
                </p>
                <h2 className="mt-2 font-lato text-2xl font-extrabold text-[#1f3d18]">
                  Keep moving through the program
                </h2>
              </div>
              <span className="font-lato text-3xl font-extrabold tabular-nums text-[#357200]">
                {pct}%
              </span>
            </div>
            <div
              className="h-3.5 w-full overflow-hidden rounded-full bg-[#67BC2A1A]"
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
          </section>

          <section className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm sm:p-8">
            <ProgramEnrollmentDetailSections
              enrollment={enrichedEnrollment}
              detail={detail}
            />
          </section>
        </main>

        <aside className="space-y-6 lg:sticky lg:top-6">
          <section className="rounded-3xl border border-[#d7edc8] bg-[#e8f5dc] p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/85 text-[#70C136]">
                <Sparkles className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="font-lato text-[10px] font-bold uppercase tracking-[0.18em] text-[#3d6630]">
                  What is included
                </p>
                <h2 className="font-lato text-xl font-extrabold text-[#1f3d18]">
                  Program toolkit
                </h2>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <IncludedCard
                icon={Leaf}
                title="Meal guidance"
                active={hasMealPlan}
                helper={
                  hasMealPlan
                    ? "Nutrition details are included or assigned."
                    : "Your expert can add meal guidance when needed."
                }
              />
              <IncludedCard
                icon={Dumbbell}
                title="Workout plan"
                active={hasWorkout}
                helper={
                  hasWorkout
                    ? "Movement details are included or assigned."
                    : "Workout details will appear once assigned."
                }
              />
              <IncludedCard
                icon={MessageCircle}
                title="Reminders"
                active={hasNudges}
                helper={
                  hasNudges
                    ? "Program messages and nudges are available."
                    : "Reminders will appear when configured."
                }
              />
            </div>
          </section>

          <section className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#f2f8ec] text-[#357200]">
                <CheckCircle2 className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="font-lato text-lg font-extrabold text-[#285c16]">
                  Need help?
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Follow the assigned sections below. If anything looks missing,
                  message your expert so they can update your plan.
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
