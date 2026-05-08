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
    // {
    //   src: "/images/testimonials/3_Jayesh_Rathod.png",
    //   alt: "Client training core on a mat",
    // },
    {
      src: "/images/testimonials/simar-transformation.png",
      alt: "Client transformation progress shot",
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
    name: "SAPAN KRISHNA",
    role: "Actor and Model",
    imageSrc: "/images/testimonials/find-experts/Sapan.png",
    content:
      "Ankush's impressive expertise in bodybuilding and healthy living is truly remarkable. From the moment I met him on a film set years ago, his incredible physique caught my attention. Our conversations about training and nutrition revealed his calm and supportive nature. Ankush's vast knowledge and guidance can help anyone achieve their desired body goals. As a friend, I'm grateful for his invaluable support whenever I need it. He is truly a blessing!",
  },
  {
    id: 2,
    name: "KUNAL SANTWANI",
    role: "Actor & Model",
    imageSrc: "/images/testimonials/find-experts/kunal.png",
    content:
      "Ankush Bhaiya has been instrumental in helping me reach my dream body transformation goal for a show back in 2019. Ever since then, he has been my go-to fitness expert for maintaining my fitness and keeping me in shape throughout the year. With his expert guidance and coaching, I am able to trust him blindly for all my fitness needs for any upcoming shows or projects. It's been 4 years now with him and he has delivered the best results every time.",
  },
  {
    id: 3,
    name: "POOJA CHAUDHARY",
    role: "Business Analyst",
    imageSrc: "/images/testimonials/find-experts/Pooja.png",
    content:
      "I'm so grateful that I found Ankush as my first-ever fitness coach, he taught me how to balance my fitness goals with my personal and professional life. Thanks to his guidance, fitness is now an integral part of my life, even with my busy work schedule. I'm thankful for the strong foundation that was laid by him, making it easy for me to maintain my healthy habits for over 3 years now.",
  },
  {
    id: 4,
    name: "NADEEM AHMED",
    role: "TV and Web Shows Director",
    imageSrc: "/images/testimonials/find-experts/Nadeem.png",
    content:
      "In this fast-paced world of Film and Television industry, staying fit can be a challenge. Thanks to Ankush's expert guidance, I've prioritized my health and well-being. His simple yet effective solutions have kept me in shape, despite my unpredictable schedule. After achieving initial success, I challenged Ankush to transform my physique in just 30 days for an event. With his unwavering determination, he delivered incredible results. Ankush is not only a skilled professional but also a compassionate coach who pushes you beyond your limits. Best wishes, brother!",
  },
  {
    id: 5,
    name: "NADEESH BHAMBI",
    role: "Actor and Social Media Influencer",
    imageSrc: "/images/testimonials/find-experts/Nadeesh.png",
    content:
      "I used to have a terrible appetite and was unhealthily skinny. A hectic work schedule didn't help either. With Ankush's help, I was able to stick to a workout routine customised to my schedule and a diet I could follow without difficulty. With sustained efforts I'm now the healthiest I've been and confident in my own skin.",
  },
  {
    id: 6,
    name: "IKROOP NIJJAR",
    role: "Product Marketing Lead, LinkedIn",
    imageSrc: "/images/testimonials/find-experts/Ikroop.png",
    content:
      "I started training with Ankush at the back of the pandemic with a specific goal in mind: To be fit to cover a 100km Everest Base Camp trek. I found his approach methodical, customized to my individual needs and rooted in science. He was patient and made working out enjoyable. He guided me in making better food choices and made working out a lifestyle choice. Thanks to Ankush's training and nutrition guidance, completing my trek was a breeze. I could truly feel the benefits of his expert support throughout the journey.",
  },
  {
    id: 7,
    name: "SAEE ARVIND JONDHALE",
    role: "Head Legal, Believe India",
    imageSrc: "/images/testimonials/find-experts/Sae Arvind.png",
    content:
      "I have been at my best since I started training with Ankush. Not only am I healthier and fitter, but important lifestyle patterns that I was struggling with for a long time also changed for good. Ankush has an eye for detail and always ensures that the body posture and technique are apt while strength training. The best part? There is no need to endure hunger pangs or food cravings! A well-balanced diet coupled with the best workout regime is his forte!! He is definitely the best lifestyle coach I have come across.",
  },
  {
    id: 8,
    name: "DEVANSHU DUBEY",
    role: "Fitness Client",
    imageSrc: "/images/testimonials/find-experts/Devanshu.png",
    content:
      "I have been taking personal training for the past five years now. With Ankush it's my fourth month, the amount of punctuality, professionalism, and sincerity he has shown, I have not seen it in anyone yet. He has immense knowledge about the workouts and their effects. He has always come prepared and shown full dedication in the workouts. I have started looking forward to the sessions.",
  },
  {
    id: 9,
    name: "DHWANI THAKER",
    role: "DHWANI THAKER",
    imageSrc: "/images/testimonials/find-experts/Dhwani.png",
    content:
      "I chose Ankush to reverse my PCOD symptoms and lose weight. Previous trainer experiences were disappointing, but Ankush's page showed immense promise. Taking a leap of faith, embarked on this journey, and it turned out to be the best decision I made. With Ankush's extensive knowledge and dedication, I overcame PCOD and adopted a preventive lifestyle. His unique training strategies and unwavering support have been invaluable. No more PCOS relapse for sure. Ankush has transformed my life, and he can do the same for you.",
  },
  {
    id: 10,
    name: "DEEPAK K VIG",
    role: "Fitness Client",
    imageSrc: "/images/testimonials/find-experts/Deepak.png",
    content:
      "Ankush bhai surpassed my expectations as a fitness coach. His patience and in-depth knowledge addressed all my workout and nutrition queries like no one else could even before I signed up with him. He truly understands each individual's uniqueness and crafts precise diet and workout plans that are easy to follow. Previously, I had given up on my dream of achieving a good physique due to trainers who couldn't keep me motivated beyond 10 days. But with him, I'm confident that my dream will become a reality. It's been 6 months of training with him, and I couldn't be happier and more satisfied. In fact, I've already hired him as the family fitness coach for my wife and kids. He is a complete package and truly amazing. I highly recommend Ankush bhai as a fitness coach to everyone. He's the real deal!",
  },
];
