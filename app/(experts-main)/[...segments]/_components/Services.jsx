import { Bolt, Brain, GraduationCap } from "lucide-react";

function ServiceCard({ title, text, active = false, icon: Icon }) {
  return (
    <article
      className={`rounded-2xl border p-5 transition-colors ${
        active
          ? "border-[#055a22] bg-[#055a22] text-white"
          : "border-[#e7ebe8] bg-white text-[#0f3320]"
      }`}
    >
      <Icon
        className={`mb-3 h-5 w-5 ${active ? "text-lime-300" : "text-[#0f7a36]"}`}
      />
      <h3 className="mb-2 text-base font-bold">{title}</h3>
      <p
        className={`text-xs leading-5 ${active ? "text-green-100" : "text-[#65746c]"}`}
      >
        {text}
      </p>
    </article>
  );
}

export default function Services({ details }) {
  const specializations = details?.specializations || [];
  const certifications = details?.certifications?.names || [];
  const serviceCards = [
    {
      icon: Bolt,
      title: specializations[0] || "Primary Specialization",
      text: specializations[0]
        ? `Focused care in ${specializations[0].toLowerCase()}.`
        : "Specialization details will be updated soon.",
      active: false,
    },
    {
      icon: Brain,
      title: specializations[1] || "Secondary Specialization",
      text: specializations[1]
        ? `Personalized coaching for ${specializations[1].toLowerCase()}.`
        : "Additional specialization details will be added soon.",
      active: true,
    },
    {
      icon: GraduationCap,
      title: specializations[2] || "Languages",
      text: (details?.languages || []).length
        ? `Consultation available in ${(details.languages || []).join(", ")}.`
        : "Language preferences available on enquiry.",
      active: false,
    },
    {
      icon: GraduationCap,
      title: "Certifications",
      text: certifications.length
        ? certifications.join(", ")
        : "Certification records are not shared publicly yet.",
      active: false,
    },
  ];

  return (
    <section className="w-full sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-6xl">
        <h2 className="mb-6 text-3xl font-extrabold text-[#0d3b1f]">
          Services Offered
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {serviceCards.map((item) => (
            <ServiceCard
              key={item.title}
              icon={item.icon}
              title={item.title}
              text={item.text}
              active={item.active}
            />
          ))}
          <article className="rounded-2xl bg-linear-to-r from-[#025120] to-[#0d7e74] p-6 text-white md:col-span-2">
            <p className="max-w-md text-xl font-semibold leading-7">
              {details?.offersOnline || details?.offersInPerson
                ? `Available for ${[details?.offersOnline && "online", details?.offersInPerson && "in-person"].filter(Boolean).join(" and ")} consultations.`
                : "Consultation mode details will be shared after enquiry."}
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
