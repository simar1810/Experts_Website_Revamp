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
      "Most coaches don’t lack skill they lack a steady flow of serious, high paying clients. Zeefit connects your programs with people are ready to invest in.",
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
      "Getting attention is easy. Turning it into paying clients is the real challenge. Zeefit helps people understand your programs and take the next step.",
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
      "Zeefit shows your programs to people who are ready to start. So you get fewer random chats and more serious client conversations.",
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
    title: "Basic Level Coach",
    description:
      "For coaches who want better visibility, client management, and brand trust.",
    bestFor:
      "Better client discovery and profile credibility.",
    features: [
      "Sponsored listing on Zeefit",
      "WZ Assured trust badge",
      "Premium placement compared to free listings",
      "WellnessZ Basic Plan access for 20+ clients",
      "Reach of 1,500+ people every day",
      "Access to Zeefit partner fitness brands",
      "Earn affiliate income from top health and fitness brands",
      "Better client discovery and profile credibility",
    ],
    buttonText: (renewal) => (renewal ? "Renew Now" : "Get Started"),
    billingText: () => "Billed Monthly",
    originalPrice: (months, currency) => {
      if (months === 1 && currency === "INR") {
        return 700;
      } else if (months === 12 && currency === "INR") {
        return 8_400;
      } else if (months === 1 && currency === "USD") {
        return 19;
      } else if (months === 12 && currency === "USD") {
        return 228;
      }
    },
    discountedPrice: (months, currency, discountPercentage) => {
      if (months === 1 && currency === "INR") {
        return (700 - (700 * discountPercentage * 0.01)).toFixed(0);
      } else if (months === 12 && currency === "INR") {
        return (8_400 - (8_400 * discountPercentage * 0.01)).toFixed(0);
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
    title: "Pro Level Coach",
    description:
      "For coaches who want stronger authority, visibility, and business growth support.",
    bestFor:
      "Stronger authority-building support for your coaching brand.",
    features: [
      "Everything in Basic Level Coach",
      "Featured placement on Zeefit pages",
      "Listing on WellnessZ and Zeefit discovery sections",
      "Special references on WellnessZ and Zeefit social media",
      "Blog/article placement opportunities",
      "Partner listing opportunities",
      "WellnessZ Pro Plan access to manage up to 80 clients",
      "Stronger authority-building support for your coaching brand",
    ],
    buttonText: (renewal) => (renewal ? "Renew Now" : "Get Started"),
    billingText: () => "Billed Monthly",
    originalPrice: (months, currency) => {
      if (months === 1 && currency === "INR") {
        return 1_200;
      } else if (months === 12 && currency === "INR") {
        return 14_400;
      } else if (months === 1 && currency === "USD") {
        return 29;
      } else if (months === 12 && currency === "USD") {
        return 348;
      }
    },
    discountedPrice: (months, currency, discountPercentage = 100) => {
      if (currency === "INR" && months === 1) {
        return (1_200 - (1_200 * discountPercentage * 0.01)).toFixed(0);
      } else if (currency === "INR" && months === 12) {
        return (14_400 - (14_400 * discountPercentage * 0.01)).toFixed(0);
      } else if (currency === "USD" && months === 1) {
        return (29 - (29 * discountPercentage * 0.01)).toFixed(0);;
      } else if (currency === "USD" && months === 12) {
        return (279 - (279 * discountPercentage * 0.01)).toFixed(0);;
      }
    },
  },
  {
    id: 3,
    code: "iosBranded",
    title: "Z Coach",
    description: "For serious coaches who want their own branded coaching ecosystem.",
    bestFor:
      "Best for coaches ready to build a premium coaching business.",
    buttonText: (renewal) => (renewal ? "Renew Now" : "Get Started"),
    billingText: () => "Billed Monthly",
    features: [
      "Everything in Pro Level Coach",
      "Your own branded coaching app",
      "App live on Play Store and App Store",
      "Your logo, colors, and brand identity",
      "Premium expert profile on Zeefit",
      "Higher visibility across Zeefit",
      "Centralized Meta ads support",
      "Stronger authority positioning",
      "Listing on partnered nutrition brand websites",
      "Unlimited client management",
      "Unlimited storage on your own app",
    ],
    discountedPrice: (months, currency) => {
      if (months === 1 && currency === "INR") {
        return 8_000;
      } else if (months === 12 && currency === "INR") {
        return 96_000;
      } else if (months === 1 && currency === "USD") {
        return 69;
      } else if (months === 12 && currency === "USD") {
        return 599;
      }
    },
    originalPrice: (months, currency) => {
      if (months === 1 && currency === "INR") {
        return 8_000;
      } else if (months === 12 && currency === "INR") {
        return 96_000;
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
    "Basic coach profile listing on Zeefit",
    "Visibility among listed coaches",
    "WellnessZ app access for your first 3 clients",
    "Tools to improve your profile presence",
    "Reach of 1,000+ people on your profile",
    "Best for new coaches who want to start getting discovered"
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