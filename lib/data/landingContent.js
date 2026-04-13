/** Marketing copy + assets for the client landing page (`/`). */

export const heroContent = {
  /** Inline headline — weights/sizes are applied in `HeroSection`. */
  headline: {
    leanBefore: "Find the right ",
    highlightExpert: "Wellness Expert",
    leanMid: " for your ",
    highlightGoals: "Goals",
  },
  /** Subhead copy with emphasis segments (darker mid-gray). */
  descriptionSegments: [
    { text: "Discover trusted " },
    { text: "transformation programs", emphasize: true },
    { text: " by " },
    { text: "nutritionists", emphasize: true },
    { text: ", " },
    { text: "fitness coaches", emphasize: true },
    { text: ", and wellness experts based on your " },
    { text: "needs", emphasize: true },
    { text: ", " },
    { text: "specialty", emphasize: true },
    { text: ", and " },
    { text: "location", emphasize: true },
    { text: "." },
  ],
  primaryCta: "FIND EXPERTS",
  secondaryCta: "BROWSE PROGRAMS",
  digitalBadgeLines: ["100%", "DIGITAL", "ELITE"],
  /** Hero portrait — remote Unsplash; see next.config.mjs remotePatterns */
  heroImageSrc:
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
  heroImageAlt: "Athlete training in a gym",
};

export const precisionContent = {
  id: "precision",
  title: "DISCOVER EXPERTS BY SPECIALTY",
  subtitle:
    "Filter by specialty and location to find the right wellness professional for your goals.",
  field1Label: "SPECIALTY",
  field2Label: "LOCATION",
  specialityPlaceholder: "Enter Speciality",
  locationPlaceholder: "Enter City",
  submitLabel: "BROWSE EXPERTS",
};

/** Top programs carousel — matches marketing layout (forest panel + program cards). */
export const topProgramsContent = {
  titleLight: "TOP",
  titleHighlight: "PROGRAMS",
  seeMoreLabel: "See More",
  seeMoreHref: "/BrowsePrograms",
  programs: [
    {
      id: "pt-lite",
      badgeLabel: "TOP RATED",
      name: "PT Lite Monthly Package",
      features: [
        "Weekly Neuro-Muscular Tuning",
        "Bespoke Joint Mobility Protocol",
        "24/7 Digital Concierge Access",
      ],
      price: "₹2999",
      enrollLabel: "ENROLL NOW",
      enrollHref: "/experts",
      deliveryTags: ["ONLINE", "IN-CLINIC"],
      authorName: "Naresh Verma",
      enrollmentLine: "100k+ People Enrolled in this Program",
      authorAvatarSrc:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&q=80",
      imageSrc:
        "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80",
      imageAlt: "Training and wellness program",
    },
    {
      id: "strength-elite",
      badgeLabel: "TOP RATED",
      name: "Strength Elite Quarterly",
      features: [
        "Monthly Performance Testing",
        "Custom Mesocycle Programming",
        "Priority Coach Messaging",
      ],
      price: "₹7999",
      enrollLabel: "ENROLL NOW",
      enrollHref: "/experts",
      deliveryTags: ["ONLINE", "IN-CLINIC"],
      authorName: "Priya Nair",
      enrollmentLine: "50k+ Athletes Trust This Program",
      authorAvatarSrc:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&q=80",
      imageSrc:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
      imageAlt: "Strength training session",
    },
  ],
};

export const curatedContent = {
  titleBefore: "THE TOP ",
  titleHighlight: "EXPERTS",
  description:
    "From nutrition to fitness, every expert is selected to ensure quality guidance and a better client experience.",
  seeMoreHref: "/find-experts",
};

export const momentumContent = {
  watermark: "EXPERTS",
  titleWhite: "TRUSTED EXPERTS",
  titleGreen: "REAL PROGRESS.",
  stats: [
    { value: "7k+", label: "TRUSTED WELLNESS EXPERTS" },
    { value: "12k+", label: "PEOPLE SUPPORTED" },
    { value: "89%", label: "POSITIVE CLIENT EXPERIENCE" },
  ],
  imageSrc:
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
  imageAlt: "Runner on a track",
  testimonial: {
    quote:
      "I didn't just find a coach — I found the right guidance for my goals.",
    authorName: "Ayushmaan",
    authorRole: "JOB PERSON",
    avatarSrc:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
  },
};

export const finalCtaContent = {
  badge: "READY WHEN YOU ARE",
  line1: "BETTER GUIDANCE",
  line2: "CAN CHANGE EVERYTHING.",
  line3: "START WITH THE RIGHT EXPERT.",
  primaryCta: "FIND EXPERTS",
  secondaryCta: "BROWSE PROGRAMS",
};
