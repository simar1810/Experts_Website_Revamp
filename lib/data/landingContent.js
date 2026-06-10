/** Marketing copy + assets for the client landing page (`/`). */

export const heroContent = {
  /** Inline headline — weights/sizes are applied in `HeroSection`. */
  headline: {
    line1: "Find certified",
    line2: "Health Coaches",
    line3Prefix: "For your ",
    line3Highlight: "Goals",
  },
  /** Subhead copy — plain weight throughout (no emphasis segments). */
  description:
    "Discover trusted transformation programs by nutritionists, fitness coaches, and wellness coaches based on your needs, specialty, and location.",
  primaryCta: "FIND COACHES",
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
  title: "You have tried apps, gyms, and random advice. Now try the right fitness coach",
  subtitle:
    "Search trusted coaches and their top programs on Zeefit",
  field1Label: "SPECIALTY",
  field2Label: "LOCATION",
  specialityPlaceholder: "Enter Speciality",
  locationPlaceholder: "Enter City",
  submitLabel: "FIND COACHES",
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
  titleLight: "TOP PERFORMING",
  titleHighlight: "PROGRAMS",
  seeMoreLabel: "See More",
  seeMoreHref: "/discover-programs#top-selling-programs",
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
  headingLine1: "TOP COACHES YOU CAN",
  headingLine2Prefix: "FIND ON ",
  headingLine2Highlight: "ZEEFIT",
  description:
    "From nutrition to fitness, every coach is selected to ensure quality guidance and a better client experience.",
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
  watermark: "COACHES",
  titleTrusted: "WE'RE JUST",
  titleGreen: "GETTING STARTED.",
  stats: [
    { value: "7k+", label: "TRUSTED WELLNESS COACHES" },
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
  titleLight: "THEY TRUST ZEEFIT COACHES, ",
  titleHighlight: "NOW YOUR TURN",
  subtitle:
    "Real progress from people who trained with curated wellness and performance coaches.",
  badge: "25K+ CLIENTS TRANSFORMED THEMSELVES WITH ZEEFIT",
  /** One full vertical loop (0 → −50% translate); lower = faster. */
  marqueeDurationSec: 10,
  /** Three sharp foreground cards (hero focus). */
  featured: [
    {
      src: "/images/testimonials/1_Kunal_Santwani2.png",
      alt: "Client doing pull-ups in the gym",
      width: 1958,
      height: 1974,
    },
    // {
    //   src: "/images/testimonials/3_Jayesh_Rathod.png",
    //   alt: "Client training core on a mat",
    // },
    {
      src: "/images/testimonials/simar-transformation.png",
      alt: "Client transformation progress shot",
      width: 1080,
      height: 1080,
    },
    {
      src: "/images/testimonials/4_Shalaka_Patil.png",
      alt: "Strength training with a barbell",
      width: 1894,
      height: 1957,
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

export const testimonials = [
  {
    id: 1,
    name: "SAPAN KRISHNA",
    role: "Actor and Model",
    imageSrc: "/images/testimonials/find-experts/Sapan.png",
    content:
      "His expertise in bodybuilding and healthy living is truly impressive. His calm, supportive nature and deep knowledge of training and nutrition can help anyone achieve their body goals.",
  },
  {
    id: 2,
    name: "KUNAL SANTWANI",
    role: "Actor & Model",
    imageSrc: "/images/testimonials/find-experts/kunal.png",
    content:
      "My coach helped me achieve my dream body transformation for a show in 2019. Since then, he has been my go-to fitness expert for staying in shape year-round.",
  },
  {
    id: 3,
    name: "POOJA CHAUDHARY",
    role: "Business Analyst",
    imageSrc: "/images/testimonials/find-experts/Pooja.png",
    content:
      "I'm grateful I found him as my first fitness coach. He helped me balance fitness with my personal and professional life, and build habits I've maintained for over 3 years.",
  },
  {
    id: 4,
    name: "NADEEM AHMED",
    role: "TV and Web Shows Director",
    imageSrc: "/images/testimonials/find-experts/Nadeem.png",
    content:
      "In the fast-paced film and television industry, staying fit is difficult. His simple, effective guidance helped me prioritize my health and even achieve a 30-day physique transformation.",
  },
  {
    id: 5,
    name: "NADEESH BHAMBI",
    role: "Actor and Social Media Influencer",
    imageSrc: "/images/testimonials/find-experts/Nadeesh.png",
    content:
      "I had a poor appetite and a hectic schedule. With his customized workout and diet plan, I became healthier, more consistent, and more confident in my own skin.",
  },
  {
    id: 6,
    name: "IKROOP NIJJAR",
    role: "Product Marketing Lead, LinkedIn",
    imageSrc: "/images/testimonials/find-experts/Ikroop.png",
    content:
      "I started training with a goal to complete the Everest Base Camp trek. His methodical, science-backed approach and nutrition guidance made the journey smooth and enjoyable.",
  },
  {
    id: 7,
    name: "SAEE ARVIND JONDHALE",
    role: "Head Legal, Believe India",
    imageSrc: "/images/testimonials/find-experts/Sae Arvind.png",
    content:
      "Since I started training with him, I've become healthier, fitter, and more disciplined. His attention to posture, technique, and balanced nutrition makes him an excellent lifestyle coach.",
  },
  {
    id: 8,
    name: "DEVANSHU DUBEY",
    role: "Owner: The Divine Cafe & Household CEO",
    imageSrc: "/images/testimonials/find-experts/Devanshu.png",
    content:
      "I've taken personal training for years, but his punctuality, professionalism, and dedication truly stand out. His knowledge and preparation make every session worth looking forward to.",
  },
  {
    id: 9,
    name: "DHWANI THAKER",
    role: "Human Resource",
    imageSrc: "/images/testimonials/find-experts/Dhwani.png",
    content:
      "I chose him to help reverse my PCOD symptoms and lose weight. His knowledge, support, and unique training approach helped me build a healthier lifestyle.",
  },
  {
    id: 10,
    name: "DEEPAK K VIG",
    role: "Businessman",
    imageSrc: "/images/testimonials/find-experts/Deepak.png",
    content:
      "My coach exceeded my expectations with his patience, knowledge, and personalized plans. After 6 months, I feel happier, stronger, and confident about my fitness journey.",
  },
];
