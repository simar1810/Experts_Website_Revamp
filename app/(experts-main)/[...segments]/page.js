import { notFound } from "next/navigation";
import { resolveListingIdFromProfilePath } from "@/lib/expertProfileSlug";
import ExpertProfilePageClient from "./ExpertProfilePageClient";

/**
 * Expert profiles at site root: `/{city}/{specialisation}/{name-ordinal}` only.
 */
export default async function ExpertProfileCatchAllPage({ params }) {
  const { segments } = await params;
  if (!Array.isArray(segments) || segments.length !== 3) {
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
