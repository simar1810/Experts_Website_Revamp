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
    { text: ", and " },
    { text: "wellness experts", emphasize: true },
    { text: " based on your " },
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
    "/images/home/hero-main.png",
  heroImageAlt: "Athlete training in a gym",
};

/** Full-width band below primary hero (green + community image). */
export const secondaryHeroContent = {
  headlineBefore: "With Great Fitness Goals... ",
  headlineAfter: "Comes The Need For A Coach Who Won't Let You Quit",
  subheadline:
    "Connect with certified coaches on Zeefit who start delivering real value from your very first consultation.",
  imageSrc: "/images/home/secondary-hero-main.png",
  imageAlt:
    "Diverse group of people smiling together, representing the Zeefit coaching community",
  imageWidth: 798,
  imageHeight: 532,
};

export const precisionContent = {
  id: "precision",
  title: "You have tried apps, gyms, and random advice. Now try the right fitness expert",
  subtitle:
    "Search trusted experts and their top programs on Zeefit",
  field1Label: "SPECIALTY",
  field2Label: "LOCATION",
  specialityPlaceholder: "Enter Speciality",
  locationPlaceholder: "Enter City",
  submitLabel: "FIND EXPERTS",
  didYouKnow: {
    title: "did you know?",
    subtitle: "Saving fitness reels doesn't burn calories",
  },
  campaignSuccess: {
    label: "Find Coaches",
    value: "95%",
    status: "more results",
  },
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
  headingLine1: "TOP EXPERTS YOU CAN",
  headingLine2Prefix: "FIND ON ",
  headingLine2Highlight: "ZEEFIT",
  description:
    "From nutrition to fitness, every expert is selected to ensure quality guidance and a better client experience.",
  seeMoreHref: "/find-experts",
};

export const expertsList = [
  {
    id: 1,
    name: "Rakesh Kumar",
    title: "Performance & Growth Coach",
    imageSrc: "/images/experts/expert-1.png",
    imageAlt: "Alex Rivers smiling in a professional setting",
    tags: [
      { label: "Elite", variant: "lime" },
      { label: "Business", variant: "muted" },
    ],
    listingHref: "/experts/alex-rivers",
  },
  {
    id: 2,
    name: "Jindal Mahal",
    title: "Mindset Specialist",
    imageSrc: "/images/experts/expert-2.jpg",
    imageAlt: "Jordan Smith giving a keynote",
    tags: [{ label: "Pro", variant: "lime" }],
    listingHref: "/experts/jordan-smith",
  },
];

export const momentumContent = {
  watermark: "EXPERTS",
  titleTrusted: "WE'RE JUST",
  titleGreen: "GETTING STARTED.",
  stats: [
    { value: "7k+", label: "TRUSTED WELLNESS EXPERTS" },
    { value: "25+", label: "PEOPLE SUPPORTED" },
    { value: "95%", label: "POSITIVE CLIENT EXPERIENCE" },
    { value: "20+", label: "PARTNERS ONBOARDED" },
  ],
  imageSrc: "/images/zeefit/experts%202.jpg",
  imageAlt: "Wellness coaching on Zeefit",
  testimonial: {
    quote:
      "Sitting long hours for work gave me serious back and lower body pain. A trainer from Zeefit helped me turn things around — I feel better and my daily routine is much healthier now.",
    authorName: "Ayushmaan",
    authorRole: "SOFTWARE ENGINEER",
    avatarSrc: "/images/Image1.jpeg",
  },
};

/** Before / after style showcase — dummy assets until CMS/real shots exist. */
export const clientResultsContent = {
  titleLight: "CLIENT ",
  titleHighlight: "TRANSFORMATIONS.",
  subtitle:
    "Real progress from people who trained with curated wellness and performance experts.",
  badge: "25K+ CLIENTS TRANSFORMED THEMSELVES WITH ZEEFIT",
  /** One full vertical loop (0 → −50% translate); lower = faster. */
  marqueeDurationSec: 10,
  /** Three sharp foreground cards (hero focus). */
  featured: [
    {
      src: "/images/testimonials/1_Kunal_Santwani2.png",
      alt: "Client doing pull-ups in the gym",
    },
    {
      src: "/images/testimonials/3_Jayesh_Rathod.png",
      alt: "Client training core on a mat",
    },
    {
      src: "/images/testimonials/4_Shalaka_Patil.png",
      alt: "Strength training with a barbell",
    },
  ],
  /** Tiled behind the featured cards — light blur in the section (keep photos readable). */
  marqueePool: [
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=520&q=80",
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=520&q=80",
    "https://images.unsplash.com/photo-1583454110551-21f2fa29afe3?w=520&q=80",
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=520&q=80",
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=520&q=80",
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
  line1: "Big goals? Cool",
  line2: "Now meet the people",
  line3: "who make them real",
  primaryCta: "FIND EXPERTS",
  primaryCtaHref: "/find-experts",
  secondaryCta: "BROWSE PROGRAMS",
  secondaryCtaHref: "/discover-programs",
};

export const testimonials = [
  {
    id: 1,
    name: "Mike Hussey",
    role: "Wellness Coach",
    imageSrc: "/images/testimonials/testimonial-1.jpg",
    content: " ",
  },
  {
    id: 2,
    name: "Mike Hussey",
    role: "Wellness Coach",
    imageSrc: "/images/testimonials/testimonial-2.jpg",
    content: " ",
  },
  {
    id: 3,
    name: "Mike Hussey",
    role: "Wellness Coach",
    imageSrc: "/images/testimonials/testimonial-3.png",
    content: " ",
  },
  {
    id: 4,
    name: "Mike Hussey",
    role: "Wellness Coach",
    imageSrc: "/images/testimonials/testimonial-4.png",
    content: " ",
  },
  {
    id: 5,
    name: "Mike Hussey",
    role: "Wellness Coach",
    imageSrc: "/images/testimonials/testimonial-5.png",
    content: " ",
  },
  {
    id: 6,
    name: "Mike Hussey",
    role: "Wellness Coach",
    imageSrc: "/images/testimonials/testimonial-6.png",
    content: " ",
  },
  {
    id: 7,
    name: "Mike Hussey",
    role: "Wellness Coach",
    imageSrc: "/images/testimonials/testimonial-7.png",
    content: " ",
  },
  {
    id: 8,
    name: "Mike Hussey",
    role: "Wellness Coach",
    imageSrc: "/images/testimonials/testimonial-8.jpg",
    content: " ",
  },
  {
    id: 9,
    name: "Mike Hussey",
    role: "Wellness Coach",
    imageSrc: "/images/testimonials/testimonial-9.jpg",
    content: " ",
  },
  {
    id: 10,
    name: "Mike Hussey",
    role: "Wellness Coach",
    imageSrc: "/images/testimonials/testimonial-10.jpg",
    content: " ",
  },
  {
    id: 11,
    name: "Mike Hussey",
    role: "Wellness Coach",
    imageSrc: "/images/testimonials/testimonial-11.jpg",
    content: " ",
  },
  {
    id: 12,
    name: "Mike Hussey",
    role: "Wellness Coach",
    imageSrc: "/images/testimonials/testimonial-12.jpg",
    content: " ",
  },
  {
    id: 13,
    name: "Mike Hussey",
    role: "Wellness Coach",
    imageSrc: "/images/testimonials/testimonial-13.jpg",
    content: " ",
  },
  {
    id: 14,
    name: "Mike Hussey",
    role: "Wellness Coach",
    imageSrc: "/images/testimonials/testimonial-14.jpg",
    content: " ",
  },
  {
    id: 15,
    name: "Mike Hussey",
    role: "Wellness Coach",
    imageSrc: "/images/testimonials/testimonial-15.jpg",
    content: " ",
  },
  {
    id: 16,
    name: "Mike Hussey",
    role: "Wellness Coach",
    imageSrc: "/images/testimonials/testimonial-16.jpg",
    content: " ",
  },
  {
    id: 17,
    name: "Mike Hussey",
    role: "Wellness Coach",
    imageSrc: "/images/testimonials/testimonial-17.jpg",
    content: " ",
  },
  {
    id: 18,
    name: "Mike Hussey",
    role: "Wellness Coach",
    imageSrc: "/images/testimonials/testimonial-18.jpg",
    content: " ",
  },
];
