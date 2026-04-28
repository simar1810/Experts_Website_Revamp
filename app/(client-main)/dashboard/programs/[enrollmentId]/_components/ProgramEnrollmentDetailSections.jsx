"use client";

import {
  exerciseDisplayName,
  getWorkoutExercisesForDisplay,
  resolveMealPlanForDisplay,
  resolveMealPlanTables,
  resolveNudgesForDisplay,
  resolveWorkoutForDisplay,
} from "@/lib/dashboardProgramEnrollment";

function SectionHeading({ eyebrow, title }) {
  return (
    <div className="space-y-1">
      {eyebrow ? (
        <p className="font-lato text-[10px] font-bold uppercase tracking-[0.18em] text-[#3d6630]/80">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-lato text-lg font-extrabold tracking-tight text-[#285c16]">
        {title}
      </h2>
    </div>
  );
}

function ParagraphBlock({ title, body, guidelines, supplements }) {
  const paragraphs = [];
  if (typeof body === "string" && body.trim()) paragraphs.push(body.trim());
  if (typeof guidelines === "string" && guidelines.trim())
    paragraphs.push(guidelines.trim());
  if (supplements != null) {
    if (typeof supplements === "string" && supplements.trim()) {
      paragraphs.push(supplements.trim());
    } else if (Array.isArray(supplements)) {
      const joined = supplements
        .filter((s) => typeof s === "string" && s.trim())
        .map((s) => s.trim())
        .join("; ");
      if (joined) paragraphs.push(joined);
    }
  }

  if (paragraphs.length === 0) return null;

  return (
    <div className="rounded-2xl border border-[#dfead2] bg-[#fbfcf8] p-5">
      {title ? (
        <SectionHeading eyebrow="" title={title} />
      ) : null}
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-zinc-700">
        {paragraphs.map((p, i) => (
          <p key={i} className="whitespace-pre-wrap">
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}

function MealPlanSection({ enrollment }) {
  const plan = resolveMealPlanForDisplay(enrollment);
  const source =
    enrollment.assignedMealPlan != null &&
    typeof enrollment.assignedMealPlan === "object"
      ? "Your assigned meal plan"
      : enrollment.program?.linkedMealPlan
        ? "Program meal plan overview"
        : null;

  if (!plan || typeof plan !== "object") return null;

  const title =
    typeof plan.title === "string" && plan.title.trim()
      ? plan.title.trim()
      : "Meal plan";

  const image =
    typeof plan.image === "string" && plan.image.trim() ? plan.image.trim() : "";

  return (
    <section className="space-y-4">
      <SectionHeading
        eyebrow={source ?? "Nutrition"}
        title={title}
      />
      {plan.tag ? (
        <p className="text-xs font-semibold uppercase tracking-wide text-[#357200]/90">
          {String(plan.tag)}
        </p>
      ) : null}
      {plan.noOfDays != null ? (
        <p className="text-sm text-zinc-600">
          {plan.noOfDays} day{plan.noOfDays === 1 ? "" : "s"}
          {plan.mode ? ` · ${plan.mode}` : ""}
        </p>
      ) : null}
      {image ? (
        <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt=""
            className="max-h-72 w-full object-cover"
          />
        </div>
      ) : null}
      <ParagraphBlock
        title=""
        body={plan.description}
        guidelines={plan.guidelines}
        supplements={plan.supplements}
      />
      {plan.planCode ? (
        <p className="text-xs text-zinc-400">Plan code: {String(plan.planCode)}</p>
      ) : null}
    </section>
  );
}

function shallowFields(obj, max = 14) {
  if (!obj || typeof obj !== "object") return [];
  return Object.entries(obj)
    .filter(([k, v]) => {
      if (k.startsWith("_")) return false;
      const t = typeof v;
      return t === "string" || t === "number" || t === "boolean";
    })
    .slice(0, max);
}

function MealTablesSection({ enrollment }) {
  const tables = resolveMealPlanTables(enrollment);
  if (!tables.length) return null;

  return (
    <section className="space-y-4">
      <SectionHeading
        eyebrow="Schedule"
        title="Your meal schedule"
      />
      <div className="space-y-4">
        {tables.map((row, i) => {
          if (row == null) return null;
          if (typeof row === "string") {
            return (
              <p
                key={i}
                className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700"
              >
                {row}
              </p>
            );
          }
          if (typeof row !== "object") {
            return (
              <p
                key={i}
                className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm"
              >
                {String(row)}
              </p>
            );
          }
          const headline =
            (typeof row.day === "string" && row.day) ||
            (typeof row.label === "string" && row.label) ||
            (typeof row.title === "string" && row.title) ||
            `Day ${i + 1}`;
          const fields = shallowFields(row);
          const meals = Array.isArray(row.meals) ? row.meals : null;

          return (
            <div
              key={i}
              className="rounded-2xl border border-[#dfead2] bg-white p-4 shadow-sm"
            >
              <p className="font-lato font-extrabold text-[#285c16]">{headline}</p>
              {meals ? (
                <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-zinc-700">
                  {meals.map((m, j) => (
                    <li key={j}>
                      {typeof m === "object" ? JSON.stringify(m) : String(m)}
                    </li>
                  ))}
                </ul>
              ) : fields.length ? (
                <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                  {fields.map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-[10px] font-bold uppercase tracking-wide text-zinc-400">
                        {k}
                      </dt>
                      <dd className="text-zinc-700">{String(v)}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <pre className="mt-3 overflow-x-auto rounded-xl bg-zinc-50 p-3 text-xs text-zinc-600">
                  {JSON.stringify(row, null, 2)}
                </pre>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function WorkoutSection({ enrollment }) {
  const workout = resolveWorkoutForDisplay(enrollment);
  const source =
    enrollment.assignedWorkout != null &&
    typeof enrollment.assignedWorkout === "object"
      ? "Your assigned workout"
      : enrollment.program?.linkedWorkout
        ? "Program workout overview"
        : null;

  if (!workout || typeof workout !== "object") return null;

  const title =
    typeof workout.title === "string" && workout.title.trim()
      ? workout.title.trim()
      : "Workout";

  const exercises = getWorkoutExercisesForDisplay(workout);

  const image =
    typeof workout.image === "string" && workout.image.trim()
      ? workout.image.trim()
      : "";

  return (
    <section className="space-y-4">
      <SectionHeading
        eyebrow={source ?? "Movement"}
        title={title}
      />
      {workout.category || workout.subcategory ? (
        <p className="text-sm text-zinc-600">
          {[workout.category, workout.subcategory].filter(Boolean).join(" · ")}
        </p>
      ) : null}
      {workout.noOfDays != null ? (
        <p className="text-sm text-zinc-600">
          {workout.noOfDays} day{workout.noOfDays === 1 ? "" : "s"}
          {workout.mode ? ` · ${workout.mode}` : ""}
        </p>
      ) : null}
      {workout.tag ? (
        <span className="inline-block rounded-full bg-[#eef6ff] px-2 py-0.5 text-[10px] font-bold uppercase text-[#1d4ed8]">
          {String(workout.tag)}
        </span>
      ) : null}
      {image ? (
        <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt=""
            className="max-h-72 w-full object-cover"
          />
        </div>
      ) : null}
      <ParagraphBlock
        title=""
        body={workout.description}
        guidelines={workout.guidelines}
        supplements={null}
      />

      {exercises.length > 0 ? (
        <div className="space-y-3">
          <h3 className="font-lato text-sm font-extrabold uppercase tracking-[0.1em] text-[#3d6630]">
            Exercises
          </h3>
          <ol className="space-y-4">
            {exercises.map((ex, idx) => {
              const name = exerciseDisplayName(ex);
              const ed = ex?.exerciseDetail;
              const instructions =
                (ed && typeof ed.instructions === "string" && ed.instructions.trim()) ||
                (typeof ex.instructions === "string" && ex.instructions.trim()) ||
                "";
              const video =
                (ed && typeof ed.video === "string" && ed.video.trim()) ||
                (typeof ex.video === "string" && ex.video.trim()) ||
                "";
              const thumb =
                (ed && typeof ed.thumbnail === "string" && ed.thumbnail.trim()) ||
                (typeof ex.thumbnail === "string" && ex.thumbnail.trim()) ||
                "";

              return (
                <li
                  key={ex._id ?? ex.id ?? idx}
                  className="rounded-2xl border border-zinc-200/90 bg-white p-4"
                >
                  <p className="font-lato font-extrabold text-[#285c16]">
                    <span className="mr-2 tabular-nums text-zinc-400">
                      {idx + 1}.
                    </span>
                    {name}
                  </p>
                  {instructions ? (
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-zinc-600">
                      {instructions}
                    </p>
                  ) : null}
                  {thumb ? (
                    <div className="mt-3 max-w-lg overflow-hidden rounded-xl border border-zinc-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={thumb} alt="" className="w-full object-cover" />
                    </div>
                  ) : null}
                  {video ? (
                    <a
                      href={video}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex text-sm font-semibold text-[#357200] underline-offset-4 hover:underline"
                    >
                      Watch video
                    </a>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </div>
      ) : null}
    </section>
  );
}

function NudgesSection({ enrollment }) {
  const nudges = resolveNudgesForDisplay(enrollment);
  if (!nudges.length) return null;

  const sourceLabel =
    Array.isArray(enrollment.assignedNudges) && enrollment.assignedNudges.length
      ? "Your nudges"
      : "Program nudge templates";

  return (
    <section className="space-y-4">
      <SectionHeading eyebrow={sourceLabel} title="Messages & reminders" />
      <ul className="space-y-4">
        {nudges.map((nudge, i) => {
          if (nudge == null || typeof nudge !== "object") return null;
          const title =
            typeof nudge.title === "string" && nudge.title.trim()
              ? nudge.title.trim()
              : `Nudge ${i + 1}`;
          const subject =
            typeof nudge.subject === "string" && nudge.subject.trim()
              ? nudge.subject.trim()
              : "";
          const message =
            typeof nudge.message === "string" && nudge.message.trim()
              ? nudge.message.trim()
              : "";
          return (
            <li
              key={nudge._id ?? nudge.id ?? i}
              className="rounded-2xl border border-[#dfead2] bg-[#fbfcf8] p-4"
            >
              <p className="font-lato font-extrabold text-[#285c16]">{title}</p>
              {subject ? (
                <p className="mt-1 text-sm font-semibold text-zinc-700">
                  {subject}
                </p>
              ) : null}
              {message ? (
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-zinc-600">
                  {message}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function FaqSection({ program }) {
  if (!program || typeof program !== "object") return null;
  const faqs = program.faqs;
  if (!Array.isArray(faqs) || faqs.length === 0) return null;

  return (
    <section className="space-y-4">
      <SectionHeading eyebrow="Help" title="Frequently asked questions" />
      <div className="divide-y divide-zinc-100 rounded-2xl border border-zinc-200/80 bg-white">
        {faqs.map((faq, i) => {
          if (!faq || typeof faq !== "object") return null;
          const q =
            typeof faq.question === "string"
              ? faq.question.trim()
              : typeof faq.q === "string"
                ? faq.q.trim()
                : "";
          const a =
            typeof faq.answer === "string"
              ? faq.answer.trim()
              : typeof faq.a === "string"
                ? faq.a.trim()
                : "";
          if (!q && !a) return null;
          return (
            <div key={i} className="px-5 py-4">
              <p className="font-lato font-extrabold text-[#285c16]">{q}</p>
              {a ? (
                <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-600">
                  {a}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function TagsRow({ tags }) {
  if (!Array.isArray(tags) || tags.length === 0) return null;
  const flat = tags.map((t) => (typeof t === "string" ? t.trim() : String(t))).filter(Boolean);
  if (!flat.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {flat.map((tag, i) => (
        <span
          key={i}
          className="rounded-full bg-[#f2f8ec] px-3 py-1 text-[11px] font-semibold text-[#2d5a1f]"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

/** Extra program narrative (pricing line, duration fields) beyond overview paragraph. */
function ProgramMetaStrip({ program }) {
  if (!program || typeof program !== "object") return null;

  const bits = [];

  const du = program.durationUnit;
  const d =
    program.duration ??
    program.durationDays ??
    (program.durationDays != null ? program.durationDays : null);

  if (program.programType) bits.push(`Type: ${String(program.programType)}`);
  if (d != null && du) bits.push(`${d} ${String(du)}`);
  else if (d != null) bits.push(`${d} ${d === 1 ? "day" : "days"}`);

  if (program.currency != null && program.amount != null) {
    const sym = program.currencySymbol || "";
    bits.push(
      `${sym}${program.amount} ${program.currency}`.trim(),
    );
  }

  if (!bits.length) return null;

  return (
    <p className="text-sm text-zinc-500">{bits.join(" · ")}</p>
  );
}

export default function ProgramEnrollmentDetailSections({ enrollment, detail }) {
  const program = enrollment?.program;

  return (
    <div className="space-y-12">
      {detail.overview?.trim() ? (
        <section className="space-y-2">
          <SectionHeading eyebrow="Overview" title="About this program" />
          <div className="prose prose-sm max-w-none text-zinc-600">
            <p className="whitespace-pre-wrap leading-relaxed">{detail.overview}</p>
          </div>
        </section>
      ) : null}

      {program ? <TagsRow tags={program.tags} /> : null}

      <ProgramMetaStrip program={program} />

      <MealPlanSection enrollment={enrollment} />
      <MealTablesSection enrollment={enrollment} />

      <WorkoutSection enrollment={enrollment} />
      <NudgesSection enrollment={enrollment} />

      <FaqSection program={program} />

      {!resolveMealPlanForDisplay(enrollment) &&
      !resolveWorkoutForDisplay(enrollment) &&
      resolveNudgesForDisplay(enrollment).length === 0 &&
      !resolveMealPlanTables(enrollment).length &&
      !(program?.faqs?.length > 0) ? (
        <p className="rounded-2xl border border-dashed border-zinc-200 px-6 py-8 text-center text-sm text-zinc-500">
          More program sections (meal plan, workout, nudges) will appear here when your
          expert assigns them or when they are included on this program template.
        </p>
      ) : null}
    </div>
  );
}
