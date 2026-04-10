"use client";

import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Monitor,
} from "lucide-react";
import DashboardHeading from "../_components/common/DashboardHeading";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const SESSIONS = [
  {
    id: "1",
    coachName: "Jordan Blake",
    coachImage:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&h=120&fit=crop&q=80",
    badge: "ELITE TIER",
    day: 5,
    monthIndex: 9,
    year: 2024,
    title: "1-ON-1 STRENGTH TRAINING",
    timeStart: "09:00 AM",
    timeEnd: "10:30 AM",
    isVirtual: false,
    locationLabel: "Studio B",
  },
  {
    id: "2",
    coachName: "Samira Chen",
    coachImage:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&q=80",
    badge: "RECOVERY",
    day: 10,
    monthIndex: 9,
    year: 2024,
    title: "MOBILITY & FOAM ROLLING",
    timeStart: "02:00 PM",
    timeEnd: "03:00 PM",
    isVirtual: true,
    locationLabel: "Virtual Session",
  },
  {
    id: "3",
    coachName: "Marcus Vance",
    coachImage:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&q=80",
    badge: "ELITE TIER",
    day: 12,
    monthIndex: 9,
    year: 2024,
    title: "CONDITIONING CIRCUIT",
    timeStart: "06:30 PM",
    timeEnd: "07:30 PM",
    isVirtual: false,
    locationLabel: "Track — East Wing",
  },
];

function SessionCard({ session }) {
  const dateLabel = new Date(
    session.year,
    session.monthIndex,
    session.day,
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  return (
    <article className="font-lato flex flex-col gap-4 rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm sm:flex-row sm:items-stretch sm:gap-5">
      <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl bg-zinc-100 sm:h-auto sm:w-24">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={session.coachImage}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-[#d4ebc4] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#2d5a1f]">
            {session.badge}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
            {dateLabel.replace(",", "").toUpperCase()}
          </span>
        </div>
        <h3 className="font-lato text-base font-extrabold uppercase tracking-wide text-zinc-900 sm:text-lg">
          {session.title}
        </h3>
        <p className="text-sm font-medium text-zinc-600">
          with Coach {session.coachName}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-zinc-600">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4 shrink-0 text-[#70C136]" aria-hidden />
            {session.timeStart} - {session.timeEnd}
          </span>
          <span className="inline-flex items-center gap-1.5">
            {session.isVirtual ? (
              <Monitor
                className="h-4 w-4 shrink-0 text-[#70C136]"
                aria-hidden
              />
            ) : (
              <MapPin className="h-4 w-4 shrink-0 text-[#70C136]" aria-hidden />
            )}
            {session.locationLabel}
          </span>
        </div>
      </div>
      <div className="flex shrink-0 items-center sm:items-center">
        <Button
          type="button"
          className="w-full rounded-xl bg-[#70C136] px-12 py-6 font-lato text-sm font-bold uppercase tracking-wide text-white hover:bg-[#5fa82d] sm:w-auto sm:min-w-26"
        >
          Join
        </Button>
      </div>
    </article>
  );
}

export default function SessionsPage() {
  const [month, setMonth] = useState(() => new Date(2024, 9, 1));
  const [selectedDate, setSelectedDate] = useState(() => new Date(2024, 9, 5));

  const year = month.getFullYear();
  const monthIndex = month.getMonth();

  const sessionDates = useMemo(
    () => SESSIONS.map((s) => new Date(s.year, s.monthIndex, s.day)),
    [],
  );

  const sessionsInMonth = useMemo(
    () =>
      SESSIONS.filter(
        (s) => s.year === year && s.monthIndex === monthIndex,
      ).sort((a, b) => a.day - b.day),
    [year, monthIndex],
  );

  const monthName = month.toLocaleDateString("en-US", { month: "long" });

  const subtext =
    sessionsInMonth.length === 0
      ? `No sessions scheduled in ${monthName}.`
      : `You have ${sessionsInMonth.length} session${sessionsInMonth.length === 1 ? "" : "s"} scheduled in ${monthName}.`;

  function shiftMonth(delta) {
    setMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));
  }

  return (
    <div className="space-y-8 pb-4">
      <div className="grid gap-6 lg:grid-cols-[minmax(260px,320px)_1fr] lg:items-start">
        <div className="rounded-3xl bg-[#67BC2A1A] p-4 sm:p-5">
          <div className="mb-3 flex h-9 items-center justify-between gap-2">
            <p className="font-lato text-base font-bold capitalize tracking-tight text-[#357200]">
              {month.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
            <div className="flex shrink-0 items-center gap-0.5">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 text-[#357200] hover:bg-[#357200]/12"
                onClick={() => shiftMonth(-1)}
                aria-label="Previous month"
              >
                <ChevronLeft className="size-5" strokeWidth={2.2} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 text-[#357200] hover:bg-[#357200]/12"
                onClick={() => shiftMonth(1)}
                aria-label="Next month"
              >
                <ChevronRight className="size-5" strokeWidth={2.2} />
              </Button>
            </div>
          </div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) {
                setSelectedDate(date);
                setMonth(new Date(date.getFullYear(), date.getMonth(), 1));
              }
            }}
            month={month}
            onMonthChange={setMonth}
            weekStartsOn={1}
            captionLayout="label"
            hideNavigation
            formatters={{
              formatWeekdayName: (date) =>
                date
                  .toLocaleDateString("en-US", { weekday: "short" })
                  .toUpperCase()
                  .slice(0, 2),
            }}
            modifiers={{ hasSession: sessionDates }}
            modifiersClassNames={{
              hasSession: cn(
                "relative after:absolute after:bottom-0.5 after:left-1/2 after:z-10 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-[#357200] after:content-['']",
                "[&:has([data-selected-single=true])]:after:bg-white",
              ),
            }}
            classNames={{
              root: "w-full",
              months: "w-full",
              month: "w-full gap-2",
              month_caption: "hidden",
              caption_label: "hidden",
              nav: "hidden",
              button_previous: "hidden",
              button_next: "hidden",
              weekdays: "flex w-full",
              weekday:
                "flex-1 text-center text-[10px] font-bold uppercase tracking-wide text-[#357200]/50 sm:text-[11px]",
              week: "mt-1.5 flex w-full",
              day: "text-[#357200]",
              outside: "opacity-[0.32] aria-selected:opacity-100",
              today: "text-[#357200] data-[selected=true]:bg-transparent",
              disabled: "opacity-40",
            }}
            className={cn(
              "font-lato",
              "w-full max-w-none border-0 bg-transparent p-0 shadow-none",
              "[--cell-size:2.5rem] [--cell-radius:0.375rem]",
              "[&_button]:min-h-(--cell-size) [&_button]:font-semibold [&_button]:text-[#357200]",
              "[&_button:hover]:bg-[#357200]/10",
              "[&_button[data-selected-single=true]]:rounded-md! [&_button[data-selected-single=true]]:bg-[#357200]! [&_button[data-selected-single=true]]:text-white!",
              "[&_button[data-selected-single=true]]:shadow-[0_4px_14px_rgba(53,114,0,0.35)]",
              "[&_button[data-selected-single=true]]:hover:bg-[#357200]!",
              "[&_button[data-selected-single=true]_span]:text-white! [&_button[data-selected-single=true]_span]:opacity-100!",
            )}
          />
        </div>

        <div className="flex flex-col gap-y-3">
          <div>
            <DashboardHeading text="UPCOMING SESSIONS" />
            <p className="max-w-xl text-sm text-zinc-500">{subtext}</p>
          </div>
          <div className="space-y-4">
            {sessionsInMonth.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-zinc-200 bg-white/70 px-6 py-12 text-center text-sm text-zinc-500">
                No upcoming sessions in this month.
              </p>
            ) : (
              sessionsInMonth.map((s) => <SessionCard key={s.id} session={s} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
