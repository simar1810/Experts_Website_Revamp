/**
 * Enrollment shaping for client dashboard Programs list + detail.
 * List: GET /experts/client/program-enrollments
 * Detail: GET /experts/client/program-enrollments/:enrollmentId
 */

export const PROGRAM_IMAGE_FALLBACK =
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=240&fit=crop&q=80";
export const COACH_AVATAR_FALLBACK =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&q=80";

export function isEnrollmentCompleted(e) {
  if (
    e.status === "expired" ||
    e.status === "cancelled" ||
    e.status === "refunded"
  )
    return true;
  if (e.endsAt && new Date(e.endsAt) <= new Date()) return true;
  return false;
}

export function enrollmentProgressPercent(e) {
  const start = new Date(e.startsAt).getTime();
  const end = new Date(e.endsAt).getTime();
  const now = Date.now();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start)
    return 0;
  if (now <= start) return 0;
  if (now >= end) return 100;
  return Math.round(((now - start) / (end - start)) * 100);
}

export function formatProgramDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function daysUntilEnd(value) {
  if (!value) return null;
  const end = new Date(value).getTime();
  if (!Number.isFinite(end)) return null;
  return Math.max(0, Math.ceil((end - Date.now()) / (24 * 60 * 60 * 1000)));
}

export function mapEnrollmentToProgramCard(e) {
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
    prog && typeof prog.coverImage === "string" && prog.coverImage.trim()
      ? prog.coverImage.trim()
      : PROGRAM_IMAGE_FALLBACK;

  const enrollmentId = String(e._id ?? e.id ?? "");

  return {
    enrollmentId,
    id: enrollmentId,
    title,
    description:
      prog &&
      typeof prog.shortDescription === "string" &&
      prog.shortDescription.trim()
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

/**
 * Rich model for `/dashboard/programs/[enrollmentId]` — enrollment from list or detail API.
 */
export function mapEnrollmentToDetail(e) {
  const base = mapEnrollmentToProgramCard(e);
  const prog = e.program;
  const coach = e.coach;

  const about =
    prog && typeof prog.about === "string" && prog.about.trim()
      ? prog.about.trim()
      : "";

  const shortDesc =
    prog &&
    typeof prog.shortDescription === "string" &&
    prog.shortDescription.trim()
      ? prog.shortDescription.trim()
      : "";

  return {
    ...base,
    enrollmentStatus: e.status || "",
    shortDescription: shortDesc,
    about,
    overview: about || shortDesc || base.description,
    programId:
      prog && (prog._id != null || prog.id != null)
        ? String(prog._id ?? prog.id)
        : "",
    coachRawName:
      coach && typeof coach.name === "string" && coach.name.trim()
        ? coach.name.trim()
        : "Expert",
    completed: isEnrollmentCompleted(e),
  };
}

export function programFromDetailApiResponse(data) {
  if (!data || typeof data !== "object") return null;
  if (data.program != null && typeof data.program === "object") {
    return data.program;
  }
  if (data.data != null && typeof data.data === "object") {
    return data.data.program ?? null;
  }
  return null;
}

export function mergeEnrollmentWithProgramDetail(enrollment, programDetail) {
  if (!enrollment || typeof enrollment !== "object") return enrollment;
  if (!programDetail || typeof programDetail !== "object") return enrollment;

  return {
    ...enrollment,
    program: {
      ...(enrollment.program && typeof enrollment.program === "object"
        ? enrollment.program
        : {}),
      ...programDetail,
    },
  };
}

/** Prefer assigned content; fall back to program template links for catalog-style copy. */
export function resolveMealPlanForDisplay(enrollment) {
  if (!enrollment || typeof enrollment !== "object") return null;
  const assigned = enrollment.assignedMealPlan;
  const linked = enrollment.program?.linkedMealPlan;
  if (assigned != null && Object.keys(assigned).length > 0) return assigned;
  if (linked != null && Object.keys(linked).length > 0) return linked;
  return null;
}

export function resolveWorkoutForDisplay(enrollment) {
  if (!enrollment || typeof enrollment !== "object") return null;
  const assigned = enrollment.assignedWorkout;
  const linked = enrollment.program?.linkedWorkout;
  if (assigned != null && Object.keys(assigned).length > 0) return assigned;
  if (linked != null && Object.keys(linked).length > 0) return linked;
  return null;
}

export function resolveNudgesForDisplay(enrollment) {
  if (!enrollment || typeof enrollment !== "object") return [];
  const assigned = enrollment.assignedNudges;
  const linked = enrollment.program?.linkedNudges;
  const fromAssigned = Array.isArray(assigned) ? assigned : [];
  const fromLinked = Array.isArray(linked) ? linked : [];
  if (fromAssigned.length > 0) return fromAssigned;
  return fromLinked;
}

export function resolveMealPlanTables(enrollment) {
  if (!enrollment || typeof enrollment !== "object") return [];
  const t = enrollment.assignedMealPlanTablesResolved;
  return Array.isArray(t) ? t : [];
}

/**
 * Exercises for display: prefer backend-resolved list, then raw exercises array.
 */
export function getWorkoutExercisesForDisplay(workout) {
  if (!workout || typeof workout !== "object") return [];
  const resolved = workout.exercisesResolved;
  if (Array.isArray(resolved) && resolved.length > 0) return resolved;
  const ex = workout.exercises;
  return Array.isArray(ex) ? ex : [];
}

export function exerciseDisplayName(ex) {
  if (!ex || typeof ex !== "object") return "Exercise";
  const d = ex.exerciseDetail;
  if (d && typeof d.name === "string" && d.name.trim()) return d.name.trim();
  if (typeof ex.name === "string" && ex.name.trim()) return ex.name.trim();
  return "Exercise";
}

/**
 * Extract enrollment from a future GET `/experts/client/program-enrollments/:id`
 * body (not wired in all backends today). The dashboard detail page currently
 * uses the list endpoint and matches by `_id` instead.
 */
export function enrollmentFromDetailApiResponse(data) {
  if (!data || typeof data !== "object") return null;
  if (data.enrollment != null) return data.enrollment;
  if (data.data != null && typeof data.data === "object") {
    return data.data.enrollment ?? null;
  }
  return null;
}
