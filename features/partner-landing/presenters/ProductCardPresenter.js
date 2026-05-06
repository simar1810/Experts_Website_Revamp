/**
 * Converts partner product payload into a UI-friendly product card model.
 */
export class ProductCardPresenter {
  /**
   * @param {Object} product
   * @returns {Object}
   */
  static toCard(product = {}) {
    const amount =
      product?.amount ??
      product?.price ??
      product?.priceInr ??
      product?.metadata?.amount ??
      product?.metadata?.price ??
      null;

    return {
      id: product?._id || product?.slug || product?.id || Math.random().toString(36),
      title: product?.name || product?.title || "Wellness Product",
      subtitle:
        product?.metadata?.category ||
        product?.metadata?.series ||
        "Expert Curated",
      image:
        (Array.isArray(product?.imageUrls) && product.imageUrls[0]) ||
        product?.metadata?.imageUrl ||
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=80",
      points: ProductCardPresenter.getPoints(product),
      priceText: ProductCardPresenter.priceText(amount),
      redirectUrl: typeof product?.redirectUrl === "string" ? product.redirectUrl : "",
      leadBy: ProductCardPresenter.getLeadBy(product),
      badges: ProductCardPresenter.getBadges(product),
    };
  }

  /**
   * @param {Object} product
   * @returns {string[]}
   */
  static getPoints(product = {}) {
    const raw = String(product?.description || "")
      .split(/\n+|(?<=\.)\s+/)
      .map((line) => line.trim())
      .filter(Boolean);
    if (raw.length > 0) return raw.slice(0, 3);
    return ["Expert-designed protocol", "Actionable guided plan", "Simple daily workflow"];
  }

  /**
   * @param {number|string|null} amount
   * @returns {string}
   */
  static priceText(amount) {
    const number = Number(amount);
    if (!Number.isFinite(number)) return "Price on request";
    try {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: Number.isInteger(number) ? 0 : 2,
      }).format(number);
    } catch {
      return `₹${number}`;
    }
  }

  /**
   * @param {Object} product
   * @returns {string}
   */
  static getLeadBy(product = {}) {
    const leadBy =
      product?.metadata?.leadBy ||
      product?.metadata?.coachName ||
      product?.metadata?.expertName ||
      "";
    return leadBy ? `Led by ${leadBy}` : "Led by Wellness Expert";
  }

  /**
   * @param {Object} product
   * @returns {Array<{label: string, tone: "light" | "success"}>}
   */
  static getBadges(product = {}) {
    const badges = [];
    if (product?.featured) {
      badges.push({ label: "TOP RATED", tone: "light" });
    }
    const mode = String(
      product?.metadata?.deliveryMode || product?.metadata?.consultationMode || "",
    ).toLowerCase();
    if (mode.includes("online")) {
      badges.push({ label: "ONLINE", tone: "success" });
    }
    return badges;
  }
}
