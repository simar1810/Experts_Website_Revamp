// "use client";

// import { useEffect, useMemo, useState } from "react";
// import {
//   ChevronLeft,
//   ChevronRight,
//   Clock,
//   MapPin,
//   Monitor,
// } from "lucide-react";
// import DashboardHeading from "../_components/common/DashboardHeading";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import { cn } from "@/lib/utils";
// import { useAuth } from "@/context/AuthContext";
// import { fetchAPI } from "@/lib/api";

// const COACH_PLACEHOLDER =
//   "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&h=120&fit=crop&q=80";

// function mapAppointmentToSession(appt) {
//   const start = new Date(appt.startAt);
//   const end = new Date(appt.endAt);
//   const joinUrl =
//     typeof appt.meeting?.joinUrl === "string" ? appt.meeting.joinUrl.trim() : "";
//   const isVirtual =
//     Boolean(joinUrl) ||
//     (appt.meeting?.provider &&
//       appt.meeting.provider !== "none" &&
//       appt.meeting.provider !== "others");

//   const coach = appt.coach;
//   const coachImage =
//     coach && typeof coach.profilePhoto === "string" && coach.profilePhoto.trim()
//       ? coach.profilePhoto.trim()
//       : COACH_PLACEHOLDER;
//   const coachName =
//     coach && typeof coach.name === "string" && coach.name.trim()
//       ? coach.name.trim()
//       : "Expert";

//   const titleRaw = appt.title || appt.appointmentType || "Consultation";
//   const title =
//     typeof titleRaw === "string" ? titleRaw.trim() || "Consultation" : "Consultation";

//   const statusBadge =
//     typeof appt.status === "string" && appt.status.trim()
//       ? appt.status.trim().replace(/_/g, " ").toUpperCase()
//       : "SCHEDULED";

//   const locationLabel = isVirtual
//     ? "Virtual session"
//     : (typeof appt.agenda === "string" && appt.agenda.trim()
//         ? appt.agenda.trim()
//         : "In person"
//       ).slice(0, 120);

//   return {
//     id: String(appt._id),
//     coachName,
//     coachImage,
//     badge: statusBadge,
//     day: start.getDate(),
//     monthIndex: start.getMonth(),
//     year: start.getFullYear(),
//     title: title.toUpperCase(),
//     timeStart: start.toLocaleTimeString("en-US", {
//       hour: "numeric",
//       minute: "2-digit",
//     }),
//     timeEnd: end.toLocaleTimeString("en-US", {
//       hour: "numeric",
//       minute: "2-digit",
//     }),
//     isVirtual,
//     locationLabel,
//     joinUrl,
//   };
// }

// function SessionCard({ session }) {
//   const dateLabel = new Date(
//     session.year,
//     session.monthIndex,
//     session.day,
//   ).toLocaleDateString("en-US", {
//     month: "short",
//     day: "2-digit",
//     year: "numeric",
//   });

//   const openJoin = () => {
//     if (session.joinUrl) {
//       window.open(session.joinUrl, "_blank", "noopener,noreferrer");
//     }
//   };

//   return (
//     <article className="font-lato flex flex-col gap-4 rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm sm:flex-row sm:items-stretch sm:gap-5">
//       <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl bg-zinc-100 sm:h-auto sm:w-24">
//         {/* eslint-disable-next-line @next/next/no-img-element */}
//         <img
//           src={session.coachImage}
//           alt=""
//           className="h-full w-full object-cover"
//         />
//       </div>
//       <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
//         <div className="flex flex-wrap items-center gap-2">
//           <span className="rounded-md bg-[#d4ebc4] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#2d5a1f]">
//             {session.badge}
//           </span>
//           <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
//             {dateLabel.replace(",", "").toUpperCase()}
//           </span>
//         </div>
//         <h3 className="font-lato text-base font-extrabold uppercase tracking-wide text-zinc-900 sm:text-lg">
//           {session.title}
//         </h3>
//         <p className="text-sm font-medium text-zinc-600">
//           with Coach {session.coachName}
//         </p>
//         <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-zinc-600">
//           <span className="inline-flex items-center gap-1.5">
//             <Clock className="h-4 w-4 shrink-0 text-[#70C136]" aria-hidden />
//             {session.timeStart} - {session.timeEnd}
//           </span>
//           <span className="inline-flex items-center gap-1.5">
//             {session.isVirtual ? (
//               <Monitor
//                 className="h-4 w-4 shrink-0 text-[#70C136]"
//                 aria-hidden
//               />
//             ) : (
//               <MapPin className="h-4 w-4 shrink-0 text-[#70C136]" aria-hidden />
//             )}
//             {session.locationLabel}
//           </span>
//         </div>
//       </div>
//       <div className="flex shrink-0 items-center sm:items-center">
//         <Button
//           type="button"
//           onClick={openJoin}
//           disabled={!session.joinUrl}
//           className="w-full rounded-xl bg-[#70C136] px-12 py-6 font-lato text-sm font-bold uppercase tracking-wide text-white hover:bg-[#5fa82d] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-26"
//         >
//           {session.joinUrl ? "Join" : "No link yet"}
//         </Button>
//       </div>
//     </article>
//   );
// }

// export default function SessionsPage() {
//   const { isAuthenticated, openLoginModal } = useAuth();
//   const [month, setMonth] = useState(() => new Date());
//   const [selectedDate, setSelectedDate] = useState(() => new Date());
//   const [sessions, setSessions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [loadError, setLoadError] = useState(null);

//   const year = month.getFullYear();
//   const monthIndex = month.getMonth();

//   useEffect(() => {
//     if (!isAuthenticated) {
//       setSessions([]);
//       setLoadError(null);
//       return;
//     }
//     let cancelled = false;
//     (async () => {
//       setLoading(true);
//       setLoadError(null);
//       try {
//         const from = new Date(year, monthIndex, 1).toISOString();
//         const to = new Date(
//           year,
//           monthIndex + 1,
//           0,
//           23,
//           59,
//           59,
//           999,
//         ).toISOString();
//         const res = await fetchAPI(
//           `/appointments/client/appointments?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
//           undefined,
//           "GET",
//         );
//         const raw = Array.isArray(res?.data) ? res.data : [];
//         if (cancelled) return;
//         setSessions(raw.map(mapAppointmentToSession));
//       } catch (e) {
//         if (!cancelled) {
//           setLoadError(
//             e instanceof Error ? e.message : "Could not load appointments.",
//           );
//           setSessions([]);
//         }
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     })();
//     return () => {
//       cancelled = true;
//     };
//   }, [isAuthenticated, year, monthIndex]);

//   const sessionDates = useMemo(
//     () =>
//       sessions.map((s) => new Date(s.year, s.monthIndex, s.day)),
//     [sessions],
//   );

//   const sessionsInMonth = useMemo(
//     () =>
//       sessions
//         .filter((s) => s.year === year && s.monthIndex === monthIndex)
//         .sort((a, b) => a.day - b.day),
//     [sessions, year, monthIndex],
//   );

//   const monthName = month.toLocaleDateString("en-US", { month: "long" });

//   const subtext = loading
//     ? "Loading appointments…"
//     : sessionsInMonth.length === 0
//       ? `No sessions scheduled in ${monthName}.`
//       : `You have ${sessionsInMonth.length} session${sessionsInMonth.length === 1 ? "" : "s"} scheduled in ${monthName}.`;

//   function shiftMonth(delta) {
//     setMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));
//   }

//   if (!isAuthenticated) {
//     return (
//       <div className="mx-auto flex max-w-lg flex-col items-center justify-center py-16 text-center">
//         <DashboardHeading text="UPCOMING SESSIONS" />
//         <p className="mt-3 text-sm text-zinc-600">
//           Log in to see consultations and sessions booked with experts.
//         </p>
//         <Button
//           type="button"
//           className="mt-8 rounded-xl bg-[#84cc16] px-8 py-3 font-semibold text-white hover:bg-[#6ca832]"
//           onClick={openLoginModal}
//         >
//           Log in
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8 pb-4">
//       <div className="grid gap-6 lg:grid-cols-[minmax(260px,320px)_1fr] lg:items-start">
//         <div className="rounded-3xl bg-[#67BC2A1A] p-4 sm:p-5">
//           <div className="mb-3 flex h-9 items-center justify-between gap-2">
//             <p className="font-lato text-base font-bold capitalize tracking-tight text-[#357200]">
//               {month.toLocaleDateString("en-US", {
//                 month: "long",
//                 year: "numeric",
//               })}
//             </p>
//             <div className="flex shrink-0 items-center gap-0.5">
//               <Button
//                 type="button"
//                 variant="ghost"
//                 size="icon"
//                 className="size-8 text-[#357200] hover:bg-[#357200]/12"
//                 onClick={() => shiftMonth(-1)}
//                 aria-label="Previous month"
//               >
//                 <ChevronLeft className="size-5" strokeWidth={2.2} />
//               </Button>
//               <Button
//                 type="button"
//                 variant="ghost"
//                 size="icon"
//                 className="size-8 text-[#357200] hover:bg-[#357200]/12"
//                 onClick={() => shiftMonth(1)}
//                 aria-label="Next month"
//               >
//                 <ChevronRight className="size-5" strokeWidth={2.2} />
//               </Button>
//             </div>
//           </div>
//           <Calendar
//             mode="single"
//             selected={selectedDate}
//             onSelect={(date) => {
//               if (date) {
//                 setSelectedDate(date);
//                 setMonth(new Date(date.getFullYear(), date.getMonth(), 1));
//               }
//             }}
//             month={month}
//             onMonthChange={setMonth}
//             weekStartsOn={1}
//             captionLayout="label"
//             hideNavigation
//             formatters={{
//               formatWeekdayName: (date) =>
//                 date
//                   .toLocaleDateString("en-US", { weekday: "short" })
//                   .toUpperCase()
//                   .slice(0, 2),
//             }}
//             modifiers={{ hasSession: sessionDates }}
//             modifiersClassNames={{
//               hasSession: cn(
//                 "relative after:absolute after:bottom-0.5 after:left-1/2 after:z-10 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-[#357200] after:content-['']",
//                 "[&:has([data-selected-single=true])]:after:bg-white",
//               ),
//             }}
//             classNames={{
//               root: "w-full",
//               months: "w-full",
//               month: "w-full gap-2",
//               month_caption: "hidden",
//               caption_label: "hidden",
//               nav: "hidden",
//               button_previous: "hidden",
//               button_next: "hidden",
//               weekdays: "flex w-full",
//               weekday:
//                 "flex-1 text-center text-[10px] font-bold uppercase tracking-wide text-[#357200]/50 sm:text-[11px]",
//               week: "mt-1.5 flex w-full",
//               day: "text-[#357200]",
//               outside: "opacity-[0.32] aria-selected:opacity-100",
//               today: "text-[#357200] data-[selected=true]:bg-transparent",
//               disabled: "opacity-40",
//             }}
//             className={cn(
//               "font-lato",
//               "w-full max-w-none border-0 bg-transparent p-0 shadow-none",
//               "[--cell-size:2.5rem] [--cell-radius:0.375rem]",
//               "[&_button]:min-h-(--cell-size) [&_button]:font-semibold [&_button]:text-[#357200]",
//               "[&_button:hover]:bg-[#357200]/10",
//               "[&_button[data-selected-single=true]]:rounded-md! [&_button[data-selected-single=true]]:bg-[#357200]! [&_button[data-selected-single=true]]:text-white!",
//               "[&_button[data-selected-single=true]]:shadow-[0_4px_14px_rgba(53,114,0,0.35)]",
//               "[&_button[data-selected-single=true]]:hover:bg-[#357200]!",
//               "[&_button[data-selected-single=true]_span]:text-white! [&_button[data-selected-single=true]_span]:opacity-100!",
//             )}
//           />
//         </div>

//         <div className="flex flex-col gap-y-3">
//           <div>
//             <DashboardHeading text="UPCOMING SESSIONS" />
//             <p className="max-w-xl text-sm text-zinc-500">{subtext}</p>
//             {loadError ? (
//               <p className="mt-2 text-sm text-red-600">{loadError}</p>
//             ) : null}
//           </div>
//           <div className="space-y-4">
//             {loading ? (
//               <p className="rounded-2xl border border-dashed border-zinc-200 bg-white/70 px-6 py-12 text-center text-sm text-zinc-500">
//                 Loading…
//               </p>
//             ) : sessionsInMonth.length === 0 ? (
//               <p className="rounded-2xl border border-dashed border-zinc-200 bg-white/70 px-6 py-12 text-center text-sm text-zinc-500">
//                 No upcoming sessions in this month.
//               </p>
//             ) : (
//               sessionsInMonth.map((s) => <SessionCard key={s.id} session={s} />)
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
