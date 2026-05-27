import { notFound, redirect } from "next/navigation";
import {
  resolveListingIdFromProfilePath,
  titleCaseFromSlug,
} from "@/lib/expertProfileSlug";
import { slugifySegment } from "@/lib/slugifyPathSegment";
import { availableCities } from "@/lib/data/locations";
import { availableSpecialities } from "@/lib/data/specialities";
import ExpertProfilePageClient from "./ExpertProfilePageClient";

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
