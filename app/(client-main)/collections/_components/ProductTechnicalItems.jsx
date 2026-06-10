"use client";

import { DynamicIcon, iconNames } from "lucide-react/dynamic";

const KNOWN_DYNAMIC_NAMES = new Set(iconNames);

/** Matches icons used before admin allowed per-row selection */
const STOREFRONT_LEGACY_FALLBACK_ICONS = ["dumbbell", "layers", "shield-check"];

function resolveStorefrontTechnicalIcon(savedName, rowIndex) {
  const trimmed = typeof savedName === "string" ? savedName.trim() : "";
  if (trimmed && KNOWN_DYNAMIC_NAMES.has(trimmed)) return trimmed;
  return STOREFRONT_LEGACY_FALLBACK_ICONS[
    rowIndex % STOREFRONT_LEGACY_FALLBACK_ICONS.length
  ];
}

export default function ProductTechnicalItems({ items }) {
  if (!items?.length) return null;

  return (
    <section className="border-t border-[#edf1e8] pt-8">
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#263616]">
        Technical Components
      </p>
      <div className="mt-7 space-y-7">
        {items.map((item, index) => {
          const iconName = resolveStorefrontTechnicalIcon(item.icon, index);
          return (
            <div key={`${item.title}-${index}`} className="flex gap-4">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#eeffc7] text-[#426b16]">
                <DynamicIcon
                  name={iconName}
                  className="size-4"
                  strokeWidth={2}
                />
              </div>
              <div>
                <h2 className="text-[13px] font-black leading-tight tracking-[-0.04em] text-[#263616]">
                  {item.title}
                </h2>
                {item.description ? (
                  <p className="mt-1 max-w-[360px] text-[11px] leading-[1.35] text-[#8a907d]">
                    {item.description}
                  </p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
