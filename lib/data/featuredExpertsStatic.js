/**
 * Same roster as `components/FeaturedExperts` (“Top Rated Experts” on /experts).
 * Single source of truth for marketing + client landing.
 */
export const FEATURED_EXPERTS_STATIC = [
  {
    _id: "replace-with-real-listing-id-1",
    websiteLink: "http://www.fitbodyculture.in",
    displayTitle: "Founder, Fit Body Culture",
    coach: {
      name: "Ankush",
      profilePhoto: "/images/ankush-s-bhaskar.png",
    },
    specializations: ["Fitness Trainer"],
    bioPreview:
      "Founder of Fit Body Culture | Ex-National Fitness Athlete & Actor. After years in high-pressure environments, I now help busy professionals get results without extreme routines through a simplified, sustainable fitness approach.",
    city: "Mumbai",
    state: "Maharashtra",
    ratingAgg: { overall: { avg: 4.9 } },
    reviewAgg: { totalReviews: 48 },
  },
  {
    _id: "replace-with-real-listing-id-2",
    websiteLink: "https://dietitiananubha.in/",
    displayTitle: "Founder, Dietitian Anubha",
    coach: {
      name: "Anubha",
      profilePhoto: "/images/anubha-taparia.png",
    },
    specializations: ["Dietitian"],
    bioPreview:
      "Founder of Dietitian Anubha | Senior Clinical Dietitian | 19+ years experience | 1,00,000+ lives impacted. Expert in women and child nutrition, delivering personalized, science-backed plans that are practical, sustainable, and results-driven.",
    city: "Bengaluru",
    state: "Karnataka",
    ratingAgg: { overall: { avg: 4.8 } },
    reviewAgg: { totalReviews: 32 },
  },
  {
    _id: "replace-with-real-listing-id-23",
    websiteLink: "https://fitlydietclinic.com/",
    displayTitle: "Founder, Fitly Diet Clinic",
    coach: {
      name: "Onkar Singh",
      profilePhoto: "/images/onkar-singh.jpeg",
    },
    specializations: ["Dietitian"],
    bioPreview:
      "Founder of Fitly Diet Clinic | Nutritionist inspiring Indians to live their best life. I have almost 9 years of experience counseling 30,000+ clients. My approach is simple: nourish YOU. No diets, no fads, no shortcuts, with focus on renal health, diabetes, gut health, and weight loss.",
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
    displayTitle: "Founder, Aahar Path",
    coach: {
      name: "Anuja",
      profilePhoto: "/images/anuja.png",
    },
    specializations: ["Dietitian"],
    bioPreview:
      "Founder of Aahar Path | Clinical Nutritionist | 5+ years experience | 1,000+ clients transformed. Expert in diabetes, PCOS/PCOD, thyroid, and weight management, offering customized, culturally aligned nutrition plans for lasting health.",
    city: "Bengaluru",
    state: "Karnataka",
    ratingAgg: { overall: { avg: 4.8 } },
    reviewAgg: { totalReviews: 32 },
  },
  {
    _id: "replace-with-real-listing-id-suvidhi",
    websiteLink: "https://innohealth.co.in/",
    displayTitle: "Founder, Innohealth",
    coach: {
      name: "Suvidhi",
      profilePhoto: "/images/Suvidhi.jpeg",
    },
    specializations: ["Clinical Nutritionist"],
    bioPreview:
      "Founder of Innohealth | Clinical Nutritionist focused on delivering customized, evidence-based nutrition plans to help individuals manage weight, hormones, digestion, and overall wellness sustainably.",
    city: "Bengaluru",
    state: "Karnataka",
    ratingAgg: { overall: { avg: 4.8 } },
    reviewAgg: { totalReviews: 32 },
  },
  {
    _id: "replace-with-real-listing-id-shruti",
    websiteLink: "https://nutryst.in/",
    displayTitle: "Founder, Nutryst",
    coach: {
      name: "Shruti",
      profilePhoto: "/images/shruty.jpeg",
    },
    specializations: ["Nutritionist"],
    bioPreview:
      "Founder of Nutryst | Renowned nutritionist with 8+ years of experience and 3,000+ client success stories. Specializes in holistic and sports nutrition, delivering personalized, science-driven plans for lasting results.",
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
