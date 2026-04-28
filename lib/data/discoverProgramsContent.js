/** Copy + program data for `/discover-programs`. */

export const discoverHeroContent = {
  badge: "CURATED WELLNESS",
  titleBefore: "Discover Our",
  titleHighlight: "Programs",
  description:
    "Elevate your vitality through expert-led Wellness pathways and evidence-based nutrition. Your journey to peak performance starts here.",
  imageSrc:
    "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=960&q=80",
  imageAlt: "Indoor plants in natural light",
};

export const discoverFilterContent = {
  searchPlaceholder: "Search programs...",
  specialtyLabel: "Specialty",
  durationLabel: "Duration",
  priceLabel: "Price Range",
  filterButtonLabel: "Filter",
  specialtyOptions: [
    { value: "", label: "Specialty" },
    { value: "nutrition", label: "Nutrition" },
    { value: "fitness", label: "Fitness" },
    { value: "recovery", label: "Recovery" },
  ],
  durationOptions: [
    { value: "", label: "Duration" },
    { value: "15dplus", label: "15 days+" },
    { value: "30dplus", label: "30 days+" },
    { value: "90dplus", label: "90 days+" },
  ],
  priceOptions: [
    { value: "", label: "Price Range" },
    { value: "under3k", label: "Under Rs 3,000" },
    { value: "3to8k", label: "Rs 3,000 - Rs 8,000" },
    { value: "8kplus", label: "Rs 8,000+" },
  ],
};

export const discoverTopSellingContent = {
  titleBefore: "Our",
  titleMid: "Top Selling",
  titleHighlight: "Programs",
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
      price: "\u20B92999",
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
      price: "\u20B97999",
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
    {
      id: "metabolic-reset",
      badgeLabel: "TOP RATED",
      name: "Metabolic Reset Intensive",
      features: [
        "Weekly Body Composition Reviews",
        "Personalized Macro Coaching",
        "Habit Tracking & Accountability",
      ],
      price: "\u20B94499",
      enrollLabel: "ENROLL NOW",
      enrollHref: "/experts",
      deliveryTags: ["ONLINE", "HYBRID"],
      authorName: "Dr. Julian Thorne",
      enrollmentLine: "32k+ Clients Completed",
      authorAvatarSrc:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&q=80",
      imageSrc:
        "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80",
      imageAlt: "Healthy nutrition and meals",
    },
    {
      id: "mind-body",
      badgeLabel: "TOP RATED",
      name: "Mind-Body Performance Lab",
      features: [
        "Guided Breathwork Protocols",
        "Sleep & Recovery Optimization",
        "Stress Resilience Training",
      ],
      price: "\u20B93499",
      enrollLabel: "ENROLL NOW",
      enrollHref: "/experts",
      deliveryTags: ["ONLINE", "IN-CLINIC"],
      authorName: "Sarah Jenkins, RD",
      enrollmentLine: "18k+ Enrolled Worldwide",
      authorAvatarSrc:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=96&q=80",
      imageSrc:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80",
      imageAlt: "Meditation and calm wellness",
    },
    // --- Added 4 More Entries Below ---
    {
      id: "yoga-bliss",
      badgeLabel: "TOP RATED",
      name: "Yoga Bliss 30-Day Flow",
      features: [
        "Daily Guided Yoga Classes",
        "Posture Correction & Flexibility",
        "Mindfulness & Breathwork Sessions",
      ],
      price: "\u20B92500",
      enrollLabel: "ENROLL NOW",
      enrollHref: "/experts",
      deliveryTags: ["ONLINE"],
      authorName: "Aarti Mehra",
      enrollmentLine: "14k+ Members Participated",
      authorAvatarSrc:
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=96&q=80",
      imageSrc:
        "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=600&q=80",
      imageAlt: "Yoga class in sunlit studio",
    },
    {
      id: "athlete-rehab",
      badgeLabel: "TOP RATED",
      name: "Athlete Rehab Protocol",
      features: [
        "Injury Assessment Clinic",
        "Recovery Mobility Drills",
        "Individual Rehab Support",
      ],
      price: "\u20B94500",
      enrollLabel: "ENROLL NOW",
      enrollHref: "/experts",
      deliveryTags: ["IN-CLINIC", "HYBRID"],
      authorName: "Ravi Sengar, PT",
      enrollmentLine: "8k+ Recoveries Guided",
      authorAvatarSrc:
        "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=96&q=80",
      imageSrc:
        "https://images.unsplash.com/photo-1503389152951-9c3d68e07e45?w=600&q=80",
      imageAlt: "Physical therapy and athlete recovery",
    },
    {
      id: "nutrition-master",
      badgeLabel: "TOP RATED",
      name: "Nutrition Mastery Blueprint",
      features: [
        "1-on-1 Virtual Consultations",
        "Advanced Gut Health Protocols",
        "Metabolism-Boosting Recipes",
      ],
      price: "\u20B96499",
      enrollLabel: "ENROLL NOW",
      enrollHref: "/experts",
      deliveryTags: ["ONLINE"],
      authorName: "Sonal Prakash, MSc",
      enrollmentLine: "22k+ Clients Transformed",
      authorAvatarSrc:
        "https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?w=96&q=80",
      imageSrc:
        "https://images.unsplash.com/photo-1510626176961-4b57d4fbad04?w=600&q=80",
      imageAlt: "Fruits, veggies, and meal prep bowls",
    },
    {
      id: "endurance-boost",
      badgeLabel: "TOP RATED",
      name: "Endurance Boost Starter Pack",
      features: [
        "Cardio Conditioning Programs",
        "Sport-Specific Endurance Work",
        "Monthly Progress Analysis",
      ],
      price: "\u20B93599",
      enrollLabel: "ENROLL NOW",
      enrollHref: "/experts",
      deliveryTags: ["ONLINE", "IN-CLINIC"],
      authorName: "Karan Deshmukh",
      enrollmentLine: "6k+ Runners Enrolled",
      authorAvatarSrc:
        "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=96&q=80",
      imageSrc:
        "https://images.unsplash.com/photo-1509228468518-c5eeecbff44a?w=600&q=80",
      imageAlt: "Running training outdoors",
    },
  ],
};

/** Badge variants for styling in `BestSellerCard`. */
export const discoverBestSellerBadgeVariants = {
  online: "bg-[#00450DCC] text-white",
};

export const discoverBestSellersContent = {
  titleBefore: "Some of Our",
  titleHighlight: "Best Sellers",
  loadMoreLabel: "Load More Programs",
  programs: [
    {
      id: "bs-1",
      imageSrc:
        "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=640&q=80",
      imageAlt: "Gym training",
      badges: [
        { key: "top", label: "TOP RATED", variant: "topRated" },
        { key: "on", label: "ONLINE", variant: "online" },
      ],
      title: "30-Day Total Body Transformation",
      instructorLine: "Lead by Dr. Julian Thorne",
      features: [
        "Weekly 1-on-1 Coaching",
        "Custom Bio-Individual Meal Plans",
        "Daily Performance Tracking",
      ],
      price: "\u20B92100",
      priceSuffix: "/month",
      enrollHref: "/experts",
    },
    {
      id: "bs-2",
      imageSrc:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=640&q=80",
      imageAlt: "Healthy salad bowl",
      badges: [
        { key: "top", label: "TOP RATED", variant: "topRated" },
        { key: "in", label: "IN-CLINIC", variant: "inClinic" },
      ],
      title: "Nutrition Blueprint Pro",
      instructorLine: "by Sarah Jenkins, RD",
      features: [
        "Metabolic Assessment",
        "Meal Prep Playbooks",
        "Supplement Guidance",
      ],
      price: "\u20B91899",
      priceSuffix: "/month",
      enrollHref: "/experts",
    },
    {
      id: "bs-3",
      imageSrc:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=640&q=80",
      imageAlt: "Meditation outdoors",
      badges: [
        { key: "hy", label: "HYBRID", variant: "hybrid" },
        { key: "on", label: "ONLINE", variant: "online" },
      ],
      title: "Calm & Focus Reset",
      instructorLine: "Lead by Maya Kapoor",
      features: [
        "Daily Micro-Practices",
        "Sleep Architecture Plan",
        "Office Ergonomics Audit",
      ],
      price: "\u20B91599",
      priceSuffix: "/month",
      enrollHref: "/experts",
    },
    {
      id: "bs-4",
      imageSrc:
        "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=640&q=80",
      imageAlt: "Athletic training",
      badges: [
        { key: "top", label: "TOP RATED", variant: "topRated" },
        { key: "on", label: "ONLINE", variant: "online" },
      ],
      title: "Athletic Mobility System",
      instructorLine: "Lead by Coach Arjun Mehta",
      features: [
        "Joint-by-Joint Screens",
        "Corrective Exercise Library",
        "Return-to-Play Timeline",
      ],
      price: "\u20B92499",
      priceSuffix: "/month",
      enrollHref: "/experts",
    },
    {
      id: "bs-5",
      imageSrc:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=640&q=80",
      imageAlt: "Yoga stretch",
      badges: [
        { key: "in", label: "IN-CLINIC", variant: "inClinic" },
        { key: "hy", label: "HYBRID", variant: "hybrid" },
      ],
      title: "Longevity Strength Studio",
      instructorLine: "by Dr. Elena Rossi",
      features: [
        "Strength Periodization",
        "Bone Health Protocols",
        "Recovery Lab Sessions",
      ],
      price: "\u20B93299",
      priceSuffix: "/month",
      enrollHref: "/experts",
    },
    {
      id: "bs-6",
      imageSrc:
        "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=640&q=80",
      imageAlt: "Healthy breakfast",
      badges: [
        { key: "top", label: "TOP RATED", variant: "topRated" },
        { key: "on", label: "ONLINE", variant: "online" },
      ],
      title: "Gut Health Accelerator",
      instructorLine: "Lead by Dr. Julian Thorne",
      features: [
        "Symptom Mapping",
        "Elimination Roadmap",
        "Reintroduction Schedule",
      ],
      price: "\u20B91999",
      priceSuffix: "/month",
      enrollHref: "/experts",
    },
    {
      id: "bs-7",
      imageSrc:
        "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=640&q=80",
      imageAlt: "Nature walk for wellness",
      badges: [
        { key: "hy", label: "HYBRID", variant: "hybrid" },
        { key: "in", label: "IN-CLINIC", variant: "inClinic" },
      ],
      title: "Mindful Movement Journey",
      instructorLine: "Lead by Priya Singh",
      features: [
        "Guided Mindfulness Walks",
        "Flexible Mobility Sessions",
        "Stress Resilience Techniques",
      ],
      price: "\u20B91849",
      priceSuffix: "/month",
      enrollHref: "/experts",
    },
    {
      id: "bs-8",
      imageSrc:
        "https://images.unsplash.com/photo-1477332552946-cfb384aeaf1c?w=640&q=80",
      imageAlt: "Vegan food preparation",
      badges: [
        { key: "top", label: "TOP RATED", variant: "topRated" },
        { key: "hy", label: "HYBRID", variant: "hybrid" },
      ],
      title: "Plant-Powered Nutrition Mastery",
      instructorLine: "by Ankit Suri, MSc",
      features: [
        "Vegan & Vegetarian Coaching",
        "Digestive Optimization",
        "Anti-Inflammatory Recipes",
      ],
      price: "\u20B91799",
      priceSuffix: "/month",
      enrollHref: "/experts",
    },
    {
      id: "bs-9",
      imageSrc:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=640&q=80",
      imageAlt: "Physiotherapy session",
      badges: [
        { key: "in", label: "IN-CLINIC", variant: "inClinic" },
        { key: "top", label: "TOP RATED", variant: "topRated" },
      ],
      title: "Joint Care Intensive",
      instructorLine: "Lead by Dr. Kavita Desai",
      features: [
        "Comprehensive Joint Assessment",
        "Corrective Exercise Therapy",
        "Inflammation Management",
      ],
      price: "\u20B92999",
      priceSuffix: "/month",
      enrollHref: "/experts",
    },
    {
      id: "bs-10",
      imageSrc:
        "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=640&q=80",
      imageAlt: "Outdoor group fitness",
      badges: [
        { key: "hy", label: "HYBRID", variant: "hybrid" },
        { key: "on", label: "ONLINE", variant: "online" },
      ],
      title: "Fit Tribe Community",
      instructorLine: "by Rajeev Bhalla",
      features: [
        "Weekly Group Challenges",
        "Member Support Forums",
        "Outdoor Training Events",
      ],
      price: "\u20B91399",
      priceSuffix: "/month",
      enrollHref: "/experts",
    },
    {
      id: "bs-11",
      imageSrc:
        "https://images.unsplash.com/photo-1426767800460-2160ac458505?w=640&q=80",
      imageAlt: "Hands preparing fresh salad",
      badges: [
        { key: "top", label: "TOP RATED", variant: "topRated" },
        { key: "in", label: "IN-CLINIC", variant: "inClinic" },
      ],
      title: "Metabolic Optimization Pathway",
      instructorLine: "Lead by Dr. Prerna Shah",
      features: [
        "Personalized Biomarker Testing",
        "Energy Management System",
        "Insulin Sensitivity Guidance",
      ],
      price: "\u20B92249",
      priceSuffix: "/month",
      enrollHref: "/experts",
    },
    {
      id: "bs-12",
      imageSrc:
        "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=640&q=80",
      imageAlt: "Indoor cycling wellness class",
      badges: [
        { key: "hy", label: "HYBRID", variant: "hybrid" },
        { key: "on", label: "ONLINE", variant: "online" },
      ],
      title: "Cardio Core Reboot",
      instructorLine: "by Savita Menon",
      features: [
        "HIIT Protocols",
        "Heart Health Strategies",
        "Weekly Progress Reports",
      ],
      price: "\u20B92099",
      priceSuffix: "/month",
      enrollHref: "/experts",
    },
  ],
};
