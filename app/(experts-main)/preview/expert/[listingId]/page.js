import { notFound, redirect } from "next/navigation";
import ExpertProfilePageClient from "../../../[...segments]/ExpertProfilePageClient";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_MAIN_ORIGIN ||
  process.env.MAIN_SITE_ORIGIN ||
  "http://localhost:3000";

async function getListingLiveStatus(listingId) {
  try {
    const res = await fetch(
      `${API_BASE}/experts/listing/resolve-profile-path`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
        cache: "no-store",
      },
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getPublicProfilePath(listingId) {
  try {
    const res = await fetch(`${SITE_ORIGIN}/api/experts/profile-paths`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingIds: [listingId] }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    const path = data?.paths?.[listingId];
    return typeof path === "string" && path.trim() ? path : null;
  } catch {
    return null;
  }
}

export default async function ExpertPreviewPage({ params }) {
  const { listingId } = await params;
  const id = String(listingId || "").trim();
  if (!id) notFound();

  const status = await getListingLiveStatus(id);
  const isPubliclyLive =
    Boolean(status?.approved) && !Boolean(status?.contentPendingReview);

  if (isPubliclyLive) {
    const publicPath = await getPublicProfilePath(id);
    if (publicPath) {
      redirect(publicPath.startsWith("/") ? publicPath : `/${publicPath}`);
    }
  }

  return <ExpertProfilePageClient listingId={id} previewMode />;
}
