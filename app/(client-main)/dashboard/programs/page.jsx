"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Flame, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import DashboardHeading from "../_components/common/DashboardHeading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { fetchAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";

const WEEK_BARS = [
  { day: "MON", pct: 42, emphasis: false },
  { day: "TUE", pct: 58, emphasis: false },
  { day: "WED", pct: 71, emphasis: false },
  { day: "THU", pct: 100, emphasis: true },
  { day: "FRI", pct: 48, emphasis: false },
  { day: "SAT", pct: 35, emphasis: false },
  { day: "SUN", pct: 22, emphasis: false },
];

const INTENSITY_CHART_CONFIG = {
  intensity: {
    label: "Relative load",
    color: "#70C136",
  },
};

const BAR_ACTIVE = "#2d5a1f";
const BAR_DEFAULT = "rgba(197, 217, 181, 0.9)";

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
    coach: coachName.startsWith("Coach ") ? coachName : `Coach ${coachName}`,
    coachAvatar,
    image,
    progress: enrollmentProgressPercent(e),
  };
}

function WeeklyTrainingIntensity() {
  const chartData = useMemo(
    () =>
      WEEK_BARS.map(({ day, pct, emphasis }) => ({
        day,
        intensity: pct,
        emphasis,
      })),
    [],
  );

  return (
    <Card className="rounded-2xl border border-zinc-200/80 bg-white py-6 shadow-sm ring-0">
      <CardHeader className="px-6">
        <div className="flex flex-col gap-1 [.border-b]:pb-0">
          <CardTitle className="font-lato text-lg font-bold text-zinc-900">
            Weekly Training Intensity
          </CardTitle>
          <CardDescription className="font-lato text-sm text-zinc-500">
            Volume and load variance over the last 7 days
            <span className="mt-1.5 block text-xs font-normal text-zinc-400">
              Illustrative sample data — personal analytics will appear here when
              available.
            </span>
          </CardDescription>
        </div>
        <CardAction>
          <div className="flex shrink-0 items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#70C136]/15 text-[#2d5a1f]">
              <TrendingUp className="h-4 w-4" strokeWidth={2.5} aria-hidden />
            </span>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="px-4 pt-2 sm:px-6">
        <ChartContainer
          config={INTENSITY_CHART_CONFIG}
          className="aspect-auto h-[220px] w-full"
          aria-label="Bar chart of training intensity Monday through Sunday"
        >
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 8, left: 0, bottom: 4 }}
            barCategoryGap={5}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.05em",
                fontFamily: "var(--font-lato), sans-serif",
              }}
              className="fill-zinc-400"
            />
            <YAxis hide domain={[0, 100]} />
            <ChartTooltip
              cursor={{ fill: "hsl(var(--muted) / 0.3)" }}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value) => (
                    <span className="font-lato text-muted-foreground tabular-nums">
                      {value}%
                    </span>
                  )}
                />
              }
            />
            <Bar dataKey="intensity" radius={[8, 8, 0, 0]}>
              {chartData.map((entry) => (
                <Cell
                  key={entry.day}
                  fill={entry.emphasis ? BAR_ACTIVE : BAR_DEFAULT}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function StatPills() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-zinc-400 lg:hidden">
        Stats below are illustrative — not tied to your account yet.
      </p>
      <div className="rounded-2xl bg-[#e8f5dc] px-5 py-5 shadow-sm">
        <p className="font-lato text-[10px] font-semibold uppercase tracking-wider text-[#3d6630]">
          Monthly completion
        </p>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="font-lato text-3xl font-extrabold text-[#2d5a1f]">
            84%
          </span>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-[#70C136] shadow-sm">
            <Check className="h-6 w-6" strokeWidth={2.5} aria-hidden />
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-zinc-200/80 bg-white px-5 py-5 shadow-sm">
        <div className="flex items-center gap-2 text-amber-600">
          <Flame className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden />
          <p className="font-lato text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
            Active streak
          </p>
        </div>
        <p className="mt-3 font-lato text-2xl font-extrabold text-zinc-900">
          12 Days
        </p>
      </div>
      <p className="hidden text-xs text-zinc-400 lg:block">
        Illustrative stats — personal metrics coming later.
      </p>
    </div>
  );
}

function ProgramCard({ program }) {
  const pct = Math.min(100, Math.max(0, program.progress));

  return (
    <article className="flex flex-col rounded-3xl border border-zinc-200/80 bg-white p-6 pb-10 font-lato shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative aspect-5/3 w-full shrink-0 overflow-hidden rounded-xl bg-zinc-100 sm:aspect-auto sm:h-30 sm:w-46">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={program.image}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-3">
          <h4 className="font-lato text-lg font-bold tracking-tight text-[#357200]">
            {program.title}
          </h4>
          <div className="flex items-center gap-2.5">
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-zinc-200 ring-2 ring-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={program.coachAvatar}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <span className="font-lato text-sm font-medium text-[#357200]/75">
              {program.coach}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-lato text-[10px] font-semibold uppercase tracking-wider text-[#357200]">
            Progress
          </span>
          <span className="font-lato text-[10px] font-semibold uppercase tabular-nums tracking-wider text-[#357200]">
            {pct}%
          </span>
        </div>
        <div
          className="h-2 w-full overflow-hidden rounded-full bg-[#67BC2A1A]"
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
    <div className="font-lato space-y-8 pb-4">
      <DashboardHeading text="YOUR PROGRAMS" />

      <div className="grid gap-4 lg:grid-cols-[1fr_minmax(240px,280px)] lg:items-stretch">
        <WeeklyTrainingIntensity />
        <StatPills />
      </div>
      <p className="hidden text-center text-xs text-zinc-400 lg:block">
        Weekly overview above uses sample data until personal analytics are
        connected.
      </p>

      <section className="space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-lato text-xl font-bold text-[#2d5a1f]">
            Active Curriculum
          </h3>
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
          <div className="grid gap-4 md:grid-cols-2">
            {activeList.map((p) => (
              <ProgramCard key={p.id} program={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
