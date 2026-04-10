import { IdCard } from "lucide-react";
import { cn } from "@/lib/utils";

function InfoField({ label, value }) {
  return (
    <div className="space-y-1">
      <p
        className={cn(
          "text-sm font-bold uppercase tracking-widest text-[#2d6a3a]",
          "sm:text-xs",
        )}
      >
        {label}
      </p>
      <p className="text-base font-bold text-black sm:text-md">{value}</p>
    </div>
  );
}

/**
 * @param {object} props
 * @param {string} [props.title]
 * @param {string} props.fullName
 * @param {string} props.email
 * @param {string} props.mobileContact
 * @param {string} props.baseLocation
 */
export default function ProfilePersonalInfoCard({
  title = "Personal Identity",
  fullName,
  email,
  mobileContact,
  baseLocation,
}) {
  return (
    <article
      className={cn(
        "font-lato rounded-2xl bg-white p-6 sm:p-7 md:p-8",
        "shadow-xl shadow-zinc-900/5 ring-1 ring-zinc-200/80",
      )}
    >
      <header className="mb-2 flex items-center gap-3 sm:mb-6">
        <IdCard
          className="size-6 shrink-0 text-[#357200] sm:size-7"
          strokeWidth={2}
          aria-hidden
        />
        <h2 className="text-sm font-black uppercase tracking-wider text-[#2d6a3a] sm:text-base">
          {title}
        </h2>
      </header>

      <div className="flex flex-col gap-6 sm:gap-3">
        <InfoField label="Full Name" value={fullName} />
        <InfoField label="Email Address" value={email} />
        <InfoField label="Mobile Contact" value={mobileContact} />
        <InfoField label="Base Location" value={baseLocation} />
      </div>
    </article>
  );
}
