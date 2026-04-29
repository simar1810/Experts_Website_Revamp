import Image from "next/image";

function ServiceCard({ title, text, active = false, icon, compact = false }) {
  const lucideClass = `mb-3 h-5 w-5 shrink-0 ${
    active ? "text-lime-300" : "text-[#0f7a36]"
  }`;
  const LucideIcon = typeof icon === "string" ? null : icon;
  const pad = compact ? "p-5" : "p-8";

  return (
    <article
      className={`rounded-2xl border transition-colors ${pad} ${
        active
          ? "border-[#03632C] bg-[#03632C] text-white"
          : "border-[#e7ebe8] bg-white text-[#0f3320]"
      }`}
    >
      {typeof icon === "string" ? (
        <Image
          className={`mb-3 object-contain ${compact ? "h-4 w-4" : "h-5 w-5"}`}
          src={icon}
          width={compact ? 16 : 20}
          height={compact ? 16 : 20}
          alt={title}
        />
      ) : LucideIcon ? (
        <LucideIcon className={lucideClass} aria-hidden />
      ) : null}
      <h3
        className={`mb-2 font-bold ${compact ? "text-sm leading-snug" : "text-base"}`}
      >
        {title}
      </h3>
      <p
        className={`leading-5 ${compact ? "text-[11px] leading-5" : "text-xs"} ${active ? "text-green-100" : "text-[#65746c]"}`}
      >
        {text}
      </p>
    </article>
  );
}

function ConsultationBentoPattern() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full text-white"
      aria-hidden
      preserveAspectRatio="none"
    >
      <ellipse
        cx="108%"
        cy="50%"
        rx="58%"
        ry="92%"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="5 9"
        className="opacity-[0.18]"
      />
      <ellipse
        cx="98%"
        cy="50%"
        rx="42%"
        ry="72%"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.75"
        className="opacity-[0.14]"
      />
      <ellipse
        cx="92%"
        cy="50%"
        rx="28%"
        ry="52%"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
        strokeDasharray="3 7"
        className="opacity-[0.2]"
      />
      <line
        x1="58%"
        y1="0%"
        x2="58%"
        y2="100%"
        stroke="currentColor"
        strokeWidth="0.55"
        strokeDasharray="4 7"
        className="opacity-[0.12]"
      />
      <line
        x1="72%"
        y1="0%"
        x2="72%"
        y2="100%"
        stroke="currentColor"
        strokeWidth="0.55"
        strokeDasharray="2 6"
        className="opacity-[0.18]"
      />
      <line
        x1="0%"
        y1="38%"
        x2="45%"
        y2="38%"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeDasharray="6 10"
        className="opacity-[0.08]"
      />
    </svg>
  );
}

function ConsultationBentoCard({ headline, subline, className = "" }) {
  return (
    <article
      className={`relative flex min-h-[220px] items-center overflow-hidden rounded-[2rem] p-8 pl-9 md:min-h-[250px] md:p-10 ${className}`}
    >
      <div
        className="absolute inset-0 bg-linear-to-r from-[#67BC2A] to-[#03632C]"
        aria-hidden
      />
      <ConsultationBentoPattern />
      <div className="relative z-10 max-w-md md:max-w-lg">
        <p className="text-xl font-semibold leading-snug tracking-tight text-white md:text-2xl">
          {headline}
        </p>
        {subline ? (
          <p className="mt-3 text-sm font-medium leading-relaxed text-white/90">
            {subline}
          </p>
        ) : null}
      </div>
    </article>
  );
}

function CertificationsBentoCard({ text }) {
  return (
    <article className="flex flex-row items-center justify-between gap-4 rounded-[1.75rem] border border-[#e8ece9] bg-white px-5 py-5 sm:gap-6 sm:px-6 sm:py-5">
      <div className="min-w-0 flex-1 sm:max-w-[58%]">
        <h3 className="text-base font-bold tracking-tight text-[#0d3b1f]">
          Certifications
        </h3>
        <p className="mt-1 text-sm leading-6 text-[#65746c]">{text}</p>
      </div>
      <div
        className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#ACEDDA] sm:h-24 sm:w-24"
        aria-hidden
      >
        <Image
          src="/png/cert.png"
          width={30}
          height={30}
          alt="Certifications"
        />
      </div>
    </article>
  );
}

const CONSULTATION_HEADLINE =
  "Pioneering the next era of clinical editorial care.";

function certificationSummaryText(cert) {
  if (!cert || typeof cert !== "object") {
    return "Certification records are not shared publicly yet.";
  }
  let rows = [];
  if (Array.isArray(cert.items) && cert.items.length > 0) {
    rows = cert.items
      .map((i) => ({
        name: String(i?.name ?? "").trim(),
        isVerified: Boolean(i?.isVerified),
      }))
      .filter((r) => r.name);
  } else {
    const names = Array.isArray(cert.names) ? cert.names : [];
    const allV = Boolean(cert.isVerified);
    rows = names
      .map((n) => ({
        name: String(n ?? "").trim(),
        isVerified: allV,
      }))
      .filter((r) => r.name);
  }
  if (rows.length === 0) {
    return "Certification records are not shared publicly yet.";
  }
  return rows
    .map((r) => (r.isVerified ? `${r.name}` : `${r.name} (not verified)`))
    .join(" · ");
}

export default function Services({ details }) {
  const specializations = details?.specializations || [];
  const certificationsText = certificationSummaryText(details?.certifications);

  const specializationsLeadText =
    details?.bio?.trim() ||
    details?.about?.trim() ||
    (specializations[0]
      ? `Focused care in ${specializations[0].toLowerCase()}.${specializations[1] ? ` Additional depth in ${specializations[1].toLowerCase()}.` : ""}`
      : "Specialization details will be updated soon.");

  const cardPrimary = {
    icon: "/png/person-standing.png",
    title: specializations[0] || "Primary Specialization",
    text: specializations[0]
      ? `Focused care in ${specializations[0].toLowerCase()}.`
      : "Specialization details will be updated soon.",
    active: false,
  };
  const cardSecondary = {
    icon: "/png/bolt.png",
    title: specializations[1] || "Secondary Specialization",
    text: specializations[1]
      ? `Personalized coaching for ${specializations[1].toLowerCase()}.`
      : "Additional specialization details will be added soon.",
    active: true,
  };
  const cardTertiary = {
    icon: "/png/brain-gear.png",
    title: specializations[2] || "Languages",
    text: (details?.languages || []).length
      ? `Consultation available in ${(details.languages || []).join(", ")}.`
      : "Language preferences available on enquiry.",
    active: false,
  };

  const consultationSubline =
    details?.offersOnline || details?.offersInPerson
      ? `Available for ${[details?.offersOnline && "online", details?.offersInPerson && "in-person"].filter(Boolean).join(" and ")} consultations.`
      : null;

  return (
    <section className="w-full px-4 sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-6xl">
        <h2 className="mb-6 text-3xl font-extrabold text-[#0d3b1f]">
          Services Offered
        </h2>

        {/* Mobile bento: full → full → 2-up → full */}
        <div className="flex flex-col gap-4 md:hidden">
          <ServiceCard
            icon="/png/person-standing.png"
            title="Specializations"
            text={specializationsLeadText}
            active={false}
          />
          <CertificationsBentoCard text={certificationsText} />
          <div className="grid grid-cols-2 gap-3">
            <ServiceCard
              icon={cardSecondary.icon}
              title={cardSecondary.title}
              text={cardSecondary.text}
              active={cardSecondary.active}
              compact
            />
            <ServiceCard
              icon={cardTertiary.icon}
              title={cardTertiary.title}
              text={cardTertiary.text}
              active={cardTertiary.active}
              compact
            />
          </div>
          <ConsultationBentoCard
            headline={CONSULTATION_HEADLINE}
            subline={consultationSubline}
          />
        </div>

        {/* Desktop: 3 tiles, then cert + consultation */}
        <div className="hidden gap-4 md:grid md:grid-cols-3">
          <ServiceCard
            icon={cardPrimary.icon}
            title={cardPrimary.title}
            text={cardPrimary.text}
            active={cardPrimary.active}
          />
          <ServiceCard
            icon={cardSecondary.icon}
            title={cardSecondary.title}
            text={cardSecondary.text}
            active={cardSecondary.active}
          />
          <ServiceCard
            icon={cardTertiary.icon}
            title={cardTertiary.title}
            text={cardTertiary.text}
            active={cardTertiary.active}
          />
          <CertificationsBentoCard text={certificationsText} />
          <ConsultationBentoCard
            headline={CONSULTATION_HEADLINE}
            subline={consultationSubline}
            className="md:col-span-2"
          />
        </div>
      </div>
    </section>
  );
}
