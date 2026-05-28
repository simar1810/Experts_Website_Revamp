/** Coach testimonial cards under `public/images/Testimonialsss`. */
export function pricingTestimonialImageSrc(filename) {
  return `/images/Testimonialsss/${encodeURIComponent(filename)}`;
}

export const PRICING_TESTIMONIALS = [
  {
    src: pricingTestimonialImageSrc("1.png"),
    name: "Coach testimonial 1",
    alt: "Zeefit listed coach testimonial",
  },
  {
    src: pricingTestimonialImageSrc("2.png"),
    name: "Coach testimonial 2",
    alt: "Zeefit listed coach testimonial",
  },
  {
    src: pricingTestimonialImageSrc("3.png"),
    name: "Coach testimonial 3",
    alt: "Zeefit listed coach testimonial",
  },
  {
    src: pricingTestimonialImageSrc("4.png"),
    name: "Coach testimonial 4",
    alt: "Zeefit listed coach testimonial",
  },
  {
    src: pricingTestimonialImageSrc("5.png"),
    name: "Coach testimonial 5",
    alt: "Zeefit listed coach testimonial",
  },
  {
    src: pricingTestimonialImageSrc("6.png"),
    name: "Coach testimonial 6",
    alt: "Zeefit listed coach testimonial",
  },
  {
    src: pricingTestimonialImageSrc("7.png"),
    name: "Coach testimonial 7",
    alt: "Zeefit listed coach testimonial",
  },
];

/** @deprecated Use PRICING_TESTIMONIALS */
export const PRICING_TESTIMONIAL_VIDEOS = PRICING_TESTIMONIALS;
