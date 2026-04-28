"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen, CalendarDays, Check, Trophy } from "lucide-react";
import DashboardHeading from "../_components/common/DashboardHeading";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { fetchAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";

const PROGRAM_IMAGE_FALLBACK =
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=240&fit=crop&q=80";
const COACH_AVATAR_FALLBACK =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&q=80";

function isEnrollmentCompleted(e) {
  if (e.status === "expired" || e.status === "cancelled" || e.status === "refunded")
    return true;
  if (e.endsAt && new Date(e.endsAt) <= new Date()) return true;
  return false;
}

function enrollmentProgressPercent(e) {
  const start = new Date(e.startsAt).getTime();
  const end = new Date(e.endsAt).getTime();
  const now = Date.now();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return 0;
  if (now <= start) return 0;
  if (now >= end) return 100;
  return Math.round(((now - start) / (end - start)) * 100);
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function daysUntil(value) {
  if (!value) return null;
  const end = new Date(value).getTime();
  if (!Number.isFinite(end)) return null;
  return Math.max(0, Math.ceil((end - Date.now()) / (24 * 60 * 60 * 1000)));
}

function mapEnrollmentToProgramCard(e) {
  const prog = e.program;
  const coach = e.coach;
  const title =
    prog && typeof prog.title === "string" && prog.title.trim()
      ? prog.title.trim()
      : "Program";
  const coachName =
    coach && typeof coach.name === "string" && coach.name.trim()
      ? coach.name.trim()
      : "Expert";
  const coachAvatar =
    coach &&
    typeof coach.profilePhoto === "string" &&
    coach.profilePhoto.trim()
      ? coach.profilePhoto.trim()
      : COACH_AVATAR_FALLBACK;
  const image =
    prog &&
    typeof prog.coverImage === "string" &&
    prog.coverImage.trim()
      ? prog.coverImage.trim()
      : PROGRAM_IMAGE_FALLBACK;

  return {
    id: String(e._id),
    title,
    description:
      prog && typeof prog.shortDescription === "string" && prog.shortDescription.trim()
        ? prog.shortDescription.trim()
        : prog && typeof prog.about === "string" && prog.about.trim()
          ? prog.about.trim()
          : "",
    coach: coachName.startsWith("Coach ") ? coachName : `Coach ${coachName}`,
    coachAvatar,
    image,
    progress: enrollmentProgressPercent(e),
    startsAt: e.startsAt,
    endsAt: e.endsAt,
    durationLabel: prog?.durationLabel || "",
  };
}

function StatCard({ label, value, helper, icon: Icon, variant = "light" }) {
  return (
    <div
      className={cn(
        "rounded-3xl border p-5 shadow-sm",
        variant === "green"
          ? "border-[#d7edc8] bg-[#e8f5dc]"
          : "border-zinc-200/80 bg-white",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-lato text-[10px] font-bold uppercase tracking-[0.18em] text-[#3d6630]">
            {label}
          </p>
          <p className="mt-3 font-lato text-3xl font-extrabold tracking-tight text-[#1f3d18]">
            {value}
          </p>
        </div>
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
            variant === "green"
              ? "bg-white/85 text-[#70C136]"
              : "bg-[#f2f8ec] text-[#357200]",
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={2.4} aria-hidden />
        </div>
      </div>
      {helper ? (
        <p className="mt-4 text-xs font-medium leading-relaxed text-zinc-500">
          {helper}
        </p>
      ) : null}
    </div>
  );
}

function StatPills({ stats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3 lg:sticky lg:top-6 lg:block lg:space-y-4">
      <StatCard
        label="Overall progress"
        value={`${stats.overallProgress}%`}
        helper={`${stats.totalPrograms} enrolled ${
          stats.totalPrograms === 1 ? "program" : "programs"
        }`}
        icon={Check}
        variant="green"
      />
      <StatCard
        label="Active programs"
        value={stats.activePrograms}
        helper={
          stats.nextEndingDays == null
            ? "No active end date yet"
            : stats.nextEndingDays === 0
              ? "A program ends today"
              : `Next program ends in ${stats.nextEndingDays} days`
        }
        icon={BookOpen}
      />
      <StatCard
        label="Completed"
        value={stats.completedPrograms}
        helper="Completed, expired, refunded, and cancelled enrollments"
        icon={Trophy}
      />
    </div>
  );
}

function ProgramCard({ program }) {
  const pct = Math.min(100, Math.max(0, program.progress));
  const remainingDays = daysUntil(program.endsAt);

  return (
    <article className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white font-lato shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col sm:flex-row">
        <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-zinc-100 sm:h-auto sm:w-44 lg:w-52">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={program.image}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h4 className="line-clamp-2 font-lato text-lg font-extrabold tracking-tight text-[#285c16]">
                {program.title}
              </h4>
              {program.description ? (
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-500">
                  {program.description}
                </p>
              ) : null}
            </div>
            {remainingDays != null ? (
              <span className="shrink-0 rounded-full bg-[#f2f8ec] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#357200]">
                {remainingDays === 0 ? "Ends today" : `${remainingDays}d left`}
              </span>
            ) : null}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3 text-sm text-zinc-500">
            <div className="flex items-center gap-2.5">
              <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-zinc-200 ring-2 ring-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={program.coachAvatar}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="font-lato font-semibold text-[#357200]/80">
                {program.coach}
              </span>
            </div>
            {program.endsAt ? (
              <div className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 text-[#70C136]" aria-hidden />
                <span>Ends {formatDate(program.endsAt)}</span>
              </div>
            ) : null}
          </div>

          <div className="mt-auto pt-5">
            <div className="mb-2 flex items-baseline justify-between gap-2">
              <span className="font-lato text-[10px] font-bold uppercase tracking-[0.18em] text-[#357200]">
                Progress
              </span>
              <span className="font-lato text-xs font-extrabold tabular-nums text-[#357200]">
                {pct}%
              </span>
            </div>
            <div
              className="h-2.5 w-full overflow-hidden rounded-full bg-[#67BC2A1A]"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Program progress ${pct}%`}
            >
              <div
                className="h-full min-w-0 rounded-full bg-linear-to-r from-[#357200] to-[#67BC2A] transition-[width] duration-300 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ProgramsPage() {
  const { isAuthenticated, openLoginModal } = useAuth();
  const [curriculumFilter, setCurriculumFilter] = useState("in-progress");
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setEnrollments([]);
      setLoadError(null);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await fetchAPI(
          "/experts/client/program-enrollments",
          undefined,
          "GET",
        );
        const raw = Array.isArray(res?.enrollments) ? res.enrollments : [];
        if (!cancelled) setEnrollments(raw);
      } catch (e) {
        if (!cancelled) {
          setLoadError(
            e instanceof Error ? e.message : "Could not load programs.",
          );
          setEnrollments([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const inProgressCards = useMemo(
    () =>
      enrollments
        .filter((e) => !isEnrollmentCompleted(e))
        .map(mapEnrollmentToProgramCard),
    [enrollments],
  );

  const completedCards = useMemo(
    () =>
      enrollments
        .filter((e) => isEnrollmentCompleted(e))
        .map(mapEnrollmentToProgramCard),
    [enrollments],
  );

  const activeList =
    curriculumFilter === "completed" ? completedCards : inProgressCards;

  const dashboardStats = useMemo(() => {
    const allCards = [...inProgressCards, ...completedCards];
    const overallProgress = allCards.length
      ? Math.round(
          allCards.reduce((sum, program) => sum + program.progress, 0) /
            allCards.length,
        )
      : 0;
    const nextEndingDays = inProgressCards.reduce((best, program) => {
      const days = daysUntil(program.endsAt);
      if (days == null) return best;
      return best == null ? days : Math.min(best, days);
    }, null);

    return {
      totalPrograms: allCards.length,
      overallProgress,
      activePrograms: inProgressCards.length,
      completedPrograms: completedCards.length,
      nextEndingDays,
    };
  }, [completedCards, inProgressCards]);

  if (!isAuthenticated) {
    return (
      <div className="font-lato mx-auto flex max-w-lg flex-col items-center justify-center space-y-4 py-16 text-center pb-4">
        <DashboardHeading text="YOUR PROGRAMS" />
        <p className="text-sm text-zinc-600">
          Log in to see expert programs you have joined.
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

  return (
    <div className="font-lato space-y-8 pb-8">
      <DashboardHeading text="YOUR PROGRAMS" />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
        <section className="min-w-0 space-y-5">
          <div className="flex justify-end">
            <div
              className="inline-flex rounded-full border border-zinc-200/80 bg-white p-1 shadow-sm"
              role="tablist"
              aria-label="Curriculum filter"
            >
              <button
                type="button"
                role="tab"
                aria-selected={curriculumFilter === "in-progress"}
                className={cn(
                  "rounded-full px-4 py-2 font-lato text-[10px] font-bold uppercase tracking-wide transition-colors",
                  curriculumFilter === "in-progress"
                    ? "bg-[#e8f5dc] text-[#2d5a1f]"
                    : "text-zinc-500 hover:text-zinc-800",
                )}
                onClick={() => setCurriculumFilter("in-progress")}
              >
                In progress
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={curriculumFilter === "completed"}
                className={cn(
                  "rounded-full px-4 py-2 font-lato text-[10px] font-bold uppercase tracking-wide transition-colors",
                  curriculumFilter === "completed"
                    ? "bg-[#e8f5dc] text-[#2d5a1f]"
                    : "text-zinc-500 hover:text-zinc-800",
                )}
                onClick={() => setCurriculumFilter("completed")}
              >
                Completed
              </button>
            </div>
          </div>

          {loadError ? (
            <p className="text-sm text-red-600">{loadError}</p>
          ) : null}
          {loading ? (
            <p className="rounded-2xl border border-dashed border-zinc-200 bg-white/60 px-6 py-12 text-center font-lato text-sm text-zinc-500">
              Loading your programs…
            </p>
          ) : activeList.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-zinc-200 bg-white/60 px-6 py-12 text-center font-lato text-sm text-zinc-500">
              {curriculumFilter === "completed"
                ? "No completed programs yet. Finish a curriculum to see it here."
                : "No programs in progress. Join a program from an expert profile to see it here."}
            </p>
          ) : (
            <div className="grid gap-4">
              {activeList.map((p) => (
                <ProgramCard key={p.id} program={p} />
              ))}
            </div>
          )}
        </section>
        <StatPills stats={dashboardStats} />
      </div>
    </div>
  );
}
