import { redirect } from "next/navigation";

/** Legacy `/find-experts/{...}` profile URLs → root `/…` */
export default async function LegacyFindExpertsProfileRedirect({ params }) {
  const { segments } = await params;
  if (!Array.isArray(segments) || segments.length === 0) {
    redirect("/find-experts");
  }
  redirect(`/${segments.join("/")}`);
}
