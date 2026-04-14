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
  primaryCtaHref: "/find-experts",
  secondaryCta: "BROWSE PROGRAMS",
  secondaryCtaHref: "/discover-programs",
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
  seeMoreHref: "/discover-programs",
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

/** Before / after style showcase — dummy assets until CMS/real shots exist. */
export const clientResultsContent = {
  titleLight: "CLIENT ",
  titleHighlight: "TRANSFORMATIONS.",
  subtitle:
    "Real progress from people who trained with curated wellness and performance experts.",
  badge: "100+ CLIENTS TRANSFORMED THEMSELVES WITH EXPERTS",
  /** One full vertical loop (0 → −50% translate); lower = faster. */
  marqueeDurationSec: 10,
  /** Three sharp foreground cards (hero focus). */
  featured: [
    {
      src: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=720&q=85",
      alt: "Client doing pull-ups in the gym",
    },
    {
      src: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=520&q=80",
      alt: "Client training core on a mat",
    },
    {
      src: "https://images.unsplash.com/photo-1583454155184-870a1f63aebc?w=720&q=85",
      alt: "Strength training with a barbell",
    },
  ],
  /** Tiled behind the featured cards — light blur in the section (keep photos readable). */
  marqueePool: [
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=520&q=80",
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=520&q=80",
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=520&q=80",
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=520&q=80",
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=520&q=80",
    "https://images.unsplash.com/photo-1583454110551-21f2fa29afe3?w=520&q=80",
    "https://images.unsplash.com/photo-1599058945522-28dba584b8d9?w=520&q=80",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=520&q=80",
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=520&q=80",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=520&q=80",
    "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=520&q=80",
    "https://images.unsplash.com/photo-1434596922112-19c563067271?w=520&q=80",
    "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=520&q=80",
    "https://images.unsplash.com/photo-1576678929414-7fd465bf6a98?w=520&q=80",
    "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=520&q=80",
    "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=520&q=80",
  ],
};

export const finalCtaContent = {
  badge: "READY WHEN YOU ARE",
  line1: "BETTER GUIDANCE",
  line2: "CAN CHANGE EVERYTHING.",
  line3: "START WITH THE RIGHT EXPERT.",
  primaryCta: "FIND EXPERTS",
  primaryCtaHref: "/find-experts",
  secondaryCta: "BROWSE PROGRAMS",
  secondaryCtaHref: "/discover-programs",
};
