import { redirect } from "next/navigation";

const CLIENT_APP_SEGMENTS = new Set([
  "dashboard",
  "profile",
  "enquiries",
  "discover-programs",
  "collections",
  "legal",
]);

/** Legacy `/find-experts/{...}` profile URLs → root `/…` */
export default async function LegacyFindExpertsProfileRedirect({ params }) {
  const { segments } = await params;
  if (!Array.isArray(segments) || segments.length === 0) {
    redirect("/find-experts");
  }
  const head = String(segments[0] ?? "").toLowerCase();
  if (head === "profile" || head === "dashboard") {
    redirect("/profile");
  }
  if (CLIENT_APP_SEGMENTS.has(head)) {
    redirect(`/${segments.join("/")}`);
  }
  redirect(`/${segments.join("/")}`);
}
