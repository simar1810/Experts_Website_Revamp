import { notFound, redirect } from "next/navigation";
import {
  resolveListingIdFromProfilePath,
  titleCaseFromSlug,
} from "@/lib/expertProfileSlug";
import { slugifySegment } from "@/lib/slugifyPathSegment";
import { availableCities } from "@/lib/data/locations";
import { availableSpecialities } from "@/lib/data/specialities";
import ExpertProfilePageClient from "./ExpertProfilePageClient";

/** App routes — must not be treated as city slugs in the 1-segment catch-all. */
const RESERVED_ROOT_SEGMENTS = new Set([
  "dashboard",
  "profile",
  "find-experts",
  "discover-programs",
  "enquiries",
  "collections",
  "legal",
  "experts",
  "pricing",
  "blogs",
  "testimonials",
  "coach_profile",
  "home",
]);

function labelFromSlugPreferList(slug, list) {
  const key = slugifySegment(slug);
  const hit = list.find((item) => slugifySegment(item) === key);
  return hit || titleCaseFromSlug(slug);
}

/**
 * Expert profiles at site root: `/{city}/{specialisation}/{name-ordinal}`.
 * Shorter paths send users to `/find-experts` with matching filters.
 */
export default async function ExpertProfileCatchAllPage({ params }) {
  const { segments } = await params;
  if (!Array.isArray(segments) || segments.length === 0) {
    notFound();
  }

  if (segments.length === 1) {
    const head = String(segments[0] ?? "").toLowerCase();
    if (RESERVED_ROOT_SEGMENTS.has(head)) {
      notFound();
    }
    const q = new URLSearchParams();
    q.set("location", labelFromSlugPreferList(segments[0], availableCities));
    redirect(`/find-experts?${q.toString()}`);
  }

  if (segments.length === 2) {
    const q = new URLSearchParams();
    q.set("location", labelFromSlugPreferList(segments[0], availableCities));
    q.set(
      "speciality",
      labelFromSlugPreferList(segments[1], availableSpecialities),
    );
    redirect(`/find-experts?${q.toString()}`);
  }

  if (segments.length !== 3) {
    notFound();
  }

  const [location, specialisation, nameSegment] = segments;
  let decodedName = nameSegment;
  try {
    decodedName = decodeURIComponent(nameSegment);
  } catch {
    decodedName = nameSegment;
  }

  const listingId = await resolveListingIdFromProfilePath(
    location,
    specialisation,
    decodedName,
  );
  if (!listingId) notFound();
  return <ExpertProfilePageClient listingId={String(listingId)} />;
}
