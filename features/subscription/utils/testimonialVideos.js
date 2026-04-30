/** MP4/MOV files under `public/mp4/testimonials` (encoded for spaces / punctuation). */
export function pricingTestimonialVideoSrc(filename) {
  return `/mp4/testimonials/${encodeURIComponent(filename)}`;
}

export const PRICING_TESTIMONIAL_VIDEOS = [
  {
    src: pricingTestimonialVideoSrc("testmonial fitly.mp4"),
    name: "Fitly coach growth story",
    stripLabel: "Fitly Coach",
  },
  {
    src: pricingTestimonialVideoSrc("Video 1.mp4"),
    name: "Coach visibility story",
    stripLabel: "Visibility",
  },
  {
    src: pricingTestimonialVideoSrc("Love the interface of the app.mp4"),
    name: "Love the app interface",
    stripLabel: "Interface",
  },
  {
    src: pricingTestimonialVideoSrc("Sales have boosted alot!!.mp4"),
    name: "Sales have boosted a lot",
    stripLabel: "Sales",
  },
  {
    src: pricingTestimonialVideoSrc(
      "After using WellnessZ app by Mr. Pradeep Kumar Arya.mp4",
    ),
    name: "After using WellnessZ — Pradeep Kumar Arya",
    stripLabel: "Pradeep A.",
  },
  {
    src: pricingTestimonialVideoSrc("The app handles my clients so well!.mp4"),
    name: "The app handles my clients well",
    stripLabel: "Clients",
  },
  {
    src: pricingTestimonialVideoSrc("fitness trainer.mp4"),
    name: "Fitness trainer experience",
    stripLabel: "Trainer",
  },
  {
    src: pricingTestimonialVideoSrc("video 2.mp4"),
    name: "Client management story",
    stripLabel: "Client Wins",
  },
  {
    src: pricingTestimonialVideoSrc("testimonial.MOV"),
    name: "Coach success story",
    stripLabel: "Success Story",
  },
];

export function googleDrivePreviewUrl(driveId) {
  return `https://drive.google.com/file/d/${driveId}/preview`;
}

export function googleDriveThumbnailUrl(driveId) {
  return `https://drive.google.com/thumbnail?id=${driveId}&sz=w1000`;
}
