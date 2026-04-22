/**
 * Same roster as `components/FeaturedExperts` (“Top Rated Experts” on /experts).
 * Single source of truth for marketing + client landing.
 */
export const FEATURED_EXPERTS_STATIC = [
  {
    _id: "replace-with-real-listing-id-1",
    websiteLink: "http://www.fitbodyculture.in",
    coach: {
      name: "Ankush",
      profilePhoto: "/images/ankush-s-bhaskar.png",
    },
    specializations: ["Fitness Trainer"],
    city: "Mumbai",
    state: "Maharashtra",
    ratingAgg: { overall: { avg: 4.9 } },
    reviewAgg: { totalReviews: 48 },
  },
  {
    _id: "replace-with-real-listing-id-2",
    websiteLink: "https://dietitiananubha.com/",
    coach: {
      name: "Anubha",
      profilePhoto: "/images/anubha-taparia.png",
    },
    specializations: ["Dietitian"],
    city: "Bengaluru",
    state: "Karnataka",
    ratingAgg: { overall: { avg: 4.8 } },
    reviewAgg: { totalReviews: 32 },
  },
  {
    _id: "replace-with-real-listing-id-23",
    websiteLink: "https://fitlydietclinic.com/",
    coach: {
      name: "Onkar Singh",
      profilePhoto: "/images/onkar-singh.jpeg",
    },
    specializations: ["Dietitian"],
    city: "Bengaluru",
    state: "Karnataka",
    ratingAgg: { overall: { avg: 4.8 } },
    reviewAgg: { totalReviews: 32 },
  },
  {
    _id: "replace-with-real-listing-id-24",
    websiteLink: "http://www.NutridatewithPriyanka.com",
    coach: {
      name: "Priyanka Shah",
      profilePhoto: "/images/priyanka-shah.jpeg",
    },
    specializations: ["Nutritionist"],
    city: "Bengaluru",
    state: "Karnataka",
    ratingAgg: { overall: { avg: 4.8 } },
    reviewAgg: { totalReviews: 32 },
  },
  {
    _id: "anuja",
    websiteLink: "",
    coach: {
      name: "Anuja",
      profilePhoto: "/images/anuja.png",
    },
    specializations: ["Dietitian"],
    city: "Bengaluru",
    state: "Karnataka",
    ratingAgg: { overall: { avg: 4.8 } },
    reviewAgg: { totalReviews: 32 },
  },
];

/** Paragraph under “Top Rated Experts” on /experts — reusable for landing subtitle if desired. */
export function getFeaturedExpertsBlurb(experts = FEATURED_EXPERTS_STATIC) {
  if (!Array.isArray(experts) || !experts.length) {
    return "Verified wellness coaches on our platform, ranked by ratings and real client reviews. Explore profiles and find your match.";
  }
  const reviewSum = experts.reduce(
    (acc, e) => acc + (Number(e.reviewAgg?.totalReviews) || 0),
    0,
  );
  const primarySpecs = [
    ...new Set(
      experts
        .map((e) =>
          Array.isArray(e.specializations) ? e.specializations[0] : null,
        )
        .filter((s) => typeof s === "string" && s.trim()),
    ),
  ].slice(0, 4);

  let text =
    "These coaches are selected from active listings and ordered by rating quality, review volume, and profile strength on our platform.";
  if (reviewSum > 0) {
    text += ` Together, they have ${reviewSum.toLocaleString()} client reviews recorded.`;
  }
  if (primarySpecs.length) {
    const tail = primarySpecs.length >= 4 ? ", and more" : "";
    text += ` Featured focus areas include ${primarySpecs.slice(0, 3).join(", ")}${primarySpecs.length > 3 ? tail : ""}.`;
  }
  return text;
}
