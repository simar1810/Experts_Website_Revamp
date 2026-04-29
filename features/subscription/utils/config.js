export const mockups = [
  { id: 1, scale: "scale-75", zIndex: "z-0", opacity: "opacity-40", translate: "-translate-x-32 md:-translate-x-48" },
  { id: 2, scale: "scale-90", zIndex: "z-10", opacity: "opacity-80", translate: "-translate-x-16 md:-translate-x-24" },
  { id: 3, scale: "scale-110", zIndex: "z-30", opacity: "opacity-100", translate: "translate-x-0" },
  { id: 4, scale: "scale-90", zIndex: "z-10", opacity: "opacity-80", translate: "translate-x-16 md:translate-x-24" },
  { id: 5, scale: "scale-75", zIndex: "z-0", opacity: "opacity-40", translate: "translate-x-32 md:translate-x-48" },
];

export const features = [
  {
    kicker: "Discovery & reach",
    title: "Turn Your Coaching Into a Discoverable Brand",
    description: [
      "Most coaches do not struggle because they lack skill. They struggle because high-paying, serious clients never reach them consistently. ZeeFit changes that.",
      "Instead of depending only on Instagram, referrals, or ads, your programs get placed in front of people who are already searching for results and are ready to invest in their health.",
    ],
    subFeatures: [
      "Program Discovery Platform",
      "High-Intent User Traffic",
      "Better Reach, Better Clients",
    ],
    imageSide: "left",
  },
  {
    kicker: "Programs & offers",
    title: "Turn Client Interest Into Program Sales",
    description: [
      "Getting attention is easy. Turning that attention into paying clients is the real challenge.",
      "On ZeeFit, your coaching is shown as clear, structured programs that users can understand quickly and join with confidence. So when people find you, they are not just curious. They are much closer to starting.",
    ],
    subFeatures: [
      "Create and List Your Programs",
      "Clear Offers, Better Conversions",
      "Ready-to-Join Experience",
    ],
    imageSide: "right",
  },
  {
    kicker: "Client conversations",
    title: "Connect With Clients at the Right Moment",
    description: [
      "ZeeFit helps people explore your programs and take the next step when their intent is already high. Whether they want to book a session, join a group plan, or ask a question, the interaction starts with more clarity and stronger intent. That means fewer random chats and better client conversations.",
    ],
    subFeatures: [
      "Direct Session Bookings",
      "Group Program Access",
      "High-Intent Client Enquiries",
    ],
    imageSide: "left",
  },
];

export const plans = [
  {
    id: 1,
    code: "basic",
    title: "BASIC",
    description:
      "For solo coaches starting structured coaching. Run your coaching practice cleanly without advanced automation.",
    bestFor:
      "Coaches with under 40 clients who still manage most follow-ups manually.",
    features: [
      "Up to 40 active clients",
      "Create meal plans",
      "Create workout sessions using the library",
      "Appointment booking",
      "Online session scheduling",
      "Group challenges",
      "Activity tracker",
      "Client progress tracking",
      "Access to a food data base for easier meal planning",
      "Group nudges only (same reminder to all clients)",
    ],
    buttonText: (renewal) => (renewal ? "Renew Now" : "Start your 14 day free trial"),
    billingText: (months) =>
      months === 1 ? "Billed Monthly" : "Billed Yearly",
    originalPrice: (months, currency) => {
      if (months === 1 && currency === "INR") {
        return 499;
      } else if (months === 12 && currency === "INR") {
        return 5_988;
      } else if (months === 1 && currency === "USD") {
        return 19;
      } else if (months === 12 && currency === "USD") {
        return 228;
      }
    },
    discountedPrice: (months, currency, discountPercentage) => {
      if (months === 1 && currency === "INR") {
        return (499 - (499 * discountPercentage * 0.01)).toFixed(0);
      } else if (months === 12 && currency === "INR") {
        return (4_990 - (4_990 * discountPercentage * 0.01)).toFixed(0);
      } else if (months === 1 && currency === "USD") {
        return (19 - (19 * discountPercentage * 0.01)).toFixed(0);
      } else if (months === 12 && currency === "USD") {
        return (189 - (189 * discountPercentage * 0.01)).toFixed(0);
      }
    },
  },
  {
    id: 2,
    code: "pro",
    title: "PRO",
    description:
      "For full-time coaches scaling beyond manual effort. Built for personalisation, accuracy, and higher client volume.",
    bestFor:
      "Coaches managing 40+ clients who want to save time and scale without burnout. One retained client covers the entire monthly cost.",
    features: [
      "Includes everything in Basic, plus",
      "Up to 120 active clients",
      "Personalised habit-based nudges (per client)",
      "AI-powered health journaling",
      "Access to 28,000+ ICMR & NIN verified food database",
      "Advanced calorie & macro tracking",
      "Pre-built condition-based meal plans",
      "Pre-built goal-based workout plans",
      "Offline attendance tracking (clinics, group meets)",
      "Team management (assistants, junior coaches)",
    ],
    buttonText: (renewal) => (renewal ? "Renew Now" : "Start your 14 day free trial"),
    billingText: (months) =>
      months === 1 ? "Billed Monthly" : "Billed Yearly",
    originalPrice: (months, currency) => {
      if (months === 1 && currency === "INR") {
        return 999;
      } else if (months === 12 && currency === "INR") {
        return 11_988;
      } else if (months === 1 && currency === "USD") {
        return 29;
      } else if (months === 12 && currency === "USD") {
        return 348;
      }
    },
    discountedPrice: (months, currency, discountPercentage = 100) => {
      if (currency === "INR" && months === 1) {
        return (999 - (999 * discountPercentage * 0.01)).toFixed(0);
      } else if (currency === "INR" && months === 12) {
        return (9990 - (9990 * discountPercentage * 0.01)).toFixed(0);
      } else if (currency === "USD" && months === 1) {
        return (29 - (29 * discountPercentage * 0.01)).toFixed(0);;
      } else if (currency === "USD" && months === 12) {
        return (279 - (279 * discountPercentage * 0.01)).toFixed(0);;
      }
    },
  },
  {
    id: 3,
    // code: "sales",
    code: "iosBranded",
    title: "OWN YOUR COACHING APP",
    description: "For established coaches building a long-term brand",
    bestFor:
      "Coaches with 50+ active clients, clinics, or hybrid online + offline practices. This is not an app upgrade. This is ownership of your coaching business.",
    buttonText: (renewal) => (renewal ? "Renew Now" : "Start your 14 day free trial"),
    billingText: (months) =>
      months === 1 ? "Billed Monthly" : "Billed Yearly",
    features: [
      "All Pro plan features",
      "Your app name on Play Store / App Store",
      "Your logo, colors, and brand identity",
      "Zero WellnessZ branding for clients",
      "Complete web panel",
      "Higher client trust & retention",
      "Strong switching cost for clients",
    ],
    buttonText: () => "Start your 14 day free trial",
    discountedPrice: (months, currency) => {
      if (months === 1 && currency === "INR") {
        return 3_999;
      } else if (months === 12 && currency === "INR") {
        return 23_990;
      } else if (months === 1 && currency === "USD") {
        return 69;
      } else if (months === 12 && currency === "USD") {
        return 599;
      }
    },
    originalPrice: (months, currency) => {
      if (months === 1 && currency === "INR") {
        return 3_999;
      } else if (months === 12 && currency === "INR") {
        return 47_988;
      } else if (months === 1 && currency === "USD") {
        return 69;
      } else if (months === 12 && currency === "USD") {
        return 828;
      }
    },
    // nestedPlans: [enterprisePlanBrandedAndroid, enterprisePlanBrandedIOS],
  },
];

export const enterprisePlan = {
  id: 5,
  code: "enterprise",
  title: "ENTERPRISE PLAN",
  description: "For clinics, large coaching teams & high-volume practices",
  bestFor:
    "Built for organisations managing large client volumes, multiple coaches, and custom workflows. Enterprise is not a fixed plan — it’s a tailored system designed around how your practice actually runs.",
  features: [
    "Nutrition clinics with multiple dietitians",
    "Coaching brands managing 200+ active clients",
    "Corporate wellness providers",
    "Hybrid online + offline practices",
    "Coaches needing custom integrations or workflows",
  ],
  buttonText: () => "Contact Sales",
  billingText: () => "",
  originalPrice: (months, currency) => {
    switch (months) {
      case 1:
        return 9990;
      case 12:
        return 11988;
      default:
        return 9990;
    }
  },
  discountedPrice: (months) => {
    switch (months) {
      case 1:
        return 1200;
      default:
        return 1300;
    }
  },
};

export const freeTier = {
  features: [
    "Full App Access",
    "Client Management",
    "Exercise & Meal Libraries",
    "Progress Tracking",
    "WhatsApp Reminders (Limited)"
  ]
}

export const partnerLogos = [
  "/experts-logo.png",
  "/experts-logo.png",
  "/experts-logo.png",
  "/experts-logo.png",
  "/experts-logo.png",
  "/experts-logo.png",
  "/experts-logo.png",
  "/experts-logo.png",
  "/experts-logo.png",
  "/experts-logo.png",
  "/experts-logo.png",
  "/experts-logo.png",
  "/experts-logo.png",
  "/experts-logo.png",
  "/experts-logo.png",
  "/experts-logo.png",
  "/experts-logo.png",
  "/experts-logo.png",
]