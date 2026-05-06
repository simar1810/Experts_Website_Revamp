/**
 * Converts raw expert API objects into stable card view models.
 */
export class ExpertCardPresenter {
  /**
   * @param {Object} expert
   * @returns {Object}
   */
  static toCard(expert = {}) {
    const rating = Number(expert?.ratingAgg?.overall?.avg || 4.5);
    const reviews = Number(expert?.reviewAgg?.totalReviews || 0);
    const tags = [];
    if (rating >= 4.5 && reviews > 0) {
      tags.push({ label: "TOP RATED", tone: "light" });
    }
    if (expert?.offersOnline) {
      tags.push({ label: "ONLINE", tone: "success" });
    }

    return {
      id: expert?._id || `${expert?.coach?._id || "expert"}`,
      listingId:
        expert?._id ||
        expert?.id ||
        expert?.listingId ||
        expert?.expertListingId ||
        expert?.listing?._id ||
        "",
      name: expert?.coach?.name || "Expert Coach",
      image:
        expert?.profilePhoto ||
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=500&auto=format&fit=crop",
      specialty:
        Array.isArray(expert?.specializations) && expert.specializations.length
          ? expert.specializations[0]
          : "Wellness Specialist",
      experience: Number(expert?.yearsExperience || 0),
      location: [expert?.city, expert?.state].filter(Boolean).join(", ") || "India",
      centerName: expert?.certifications?.institute || "Verified Wellness Center",
      rating,
      reviews,
      tags,
      offersOnline: Boolean(expert?.offersOnline),
    };
  }
}
