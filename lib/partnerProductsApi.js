const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export const PRODUCT_PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=80";

function apiUrl(path) {
  return new URL(path.replace(/^\//, ""), `${API_BASE.replace(/\/?$/, "/")}`);
}

async function fetchJson(url, init = {}, fallbackMessage = "Request failed") {
  const res = await fetch(url, {
    method: "GET",
    ...init,
    headers: {
      ...(init.headers || {}),
    },
  });
  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      typeof body?.message === "string" && body.message.trim()
        ? body.message
        : `${fallbackMessage} (${res.status})`;
    throw new Error(message);
  }

  return body;
}

export async function fetchPartnerProductCollections(init = {}) {
  const body = await fetchJson(
    apiUrl("/experts/public/partner-products"),
    init,
    "Could not load collections",
  );
  return Array.isArray(body?.items) ? body.items : [];
}

export async function fetchPartnerProductDetail(
  { partnerSlug = "", productSlug = "" } = {},
  init = {},
) {
  const url = apiUrl(
    `/experts/public/partner-products/${encodeURIComponent(
      partnerSlug,
    )}/${encodeURIComponent(productSlug)}`,
  );
  return fetchJson(url, init, "Could not load product");
}

function cleanString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function firstCleanString(values) {
  for (const value of values) {
    const text = cleanString(value);
    if (text) return text;
  }
  return "";
}

function firstUrl(values) {
  for (const value of values) {
    const text = cleanString(value);
    if (/^https?:\/\//i.test(text) || text.startsWith("/")) return text;
  }
  return "";
}

/** Only use values the browser can load as an image src (not bare S3 keys). */
function isBrowserImageUrl(value) {
  const text = cleanString(value);
  if (!text) return false;
  if (/^https?:\/\//i.test(text)) return true;
  if (text.startsWith("/")) return true;
  if (/^data:image\//i.test(text)) return true;
  return false;
}

export function getProductImageSrc(product) {
  const imageUrls = Array.isArray(product?.imageUrls) ? product.imageUrls : [];
  const fromUrls = firstUrl(imageUrls);
  if (fromUrls) return fromUrls;
  const metaImg = cleanString(product?.metadata?.imageUrl);
  if (isBrowserImageUrl(metaImg)) return metaImg;
  return PRODUCT_PLACEHOLDER_IMAGE;
}

export function formatCurrencyNumber(number, currency) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: Number.isInteger(number) ? 0 : 2,
    }).format(number);
  } catch {
    return `${currency} ${number}`;
  }
}

/**
 * Preview payable amount for a coupon (product marketing code or affiliate coach code).
 */
export async function fetchPartnerCheckoutEstimate(
  { partnerSlug = "", productSlug = "", couponCode = "" } = {},
  init = {},
) {
  const url = apiUrl(
    `/experts/public/partner-products/${encodeURIComponent(
      partnerSlug,
    )}/${encodeURIComponent(productSlug)}/checkout-estimate`,
  );
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    body: JSON.stringify({
      couponCode: typeof couponCode === "string" ? couponCode.trim() : "",
    }),
    ...init,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      typeof body?.message === "string" && body.message.trim()
        ? body.message.trim()
        : `Checkout preview failed (${res.status})`;
    throw new Error(message);
  }
  return body;
}

/**
 * @returns {{ payLabel: string, listLabel: string | null }}
 */
export function getProductPriceDisplay(product, { fallback = "Price on request" } = {}) {
  const metadata = product?.metadata && typeof product.metadata === "object"
    ? product.metadata
    : {};
  const currency =
    cleanString(metadata.currency) ||
    (typeof product?.currency === "string" ? product.currency.trim() : "") ||
    "INR";

  const payAmount =
    metadata.salePrice ??
    metadata.amount ??
    metadata.priceInr ??
    product?.amount ??
    product?.priceInr ??
    product?.price;
  const pay = Number(payAmount);

  const listRaw = Number(metadata.listPrice);
  const listLabel =
    Number.isFinite(listRaw) &&
    Number.isFinite(pay) &&
    listRaw > pay
      ? formatCurrencyNumber(listRaw, currency)
      : null;

  const displayPrice = firstCleanString([
    metadata.displayPrice,
    metadata.priceLabel,
    metadata.price,
    typeof product?.displayPrice === "string" ? product.displayPrice : "",
  ]);
  if (displayPrice) {
    return { payLabel: displayPrice, listLabel };
  }

  if (!Number.isFinite(pay) || pay < 0) {
    return { payLabel: fallback, listLabel: null };
  }

  const payLabel = formatCurrencyNumber(pay, currency);
  return { payLabel, listLabel };
}

export function formatProductPrice(product, options = {}) {
  return getProductPriceDisplay(product, options).payLabel;
}

export function getProductDetailLabel(product) {
  const metadata = product?.metadata && typeof product.metadata === "object"
    ? product.metadata
    : {};
  return firstCleanString([
    metadata.series,
    metadata.category,
    metadata.productLine,
    "Wellness essentials",
  ]);
}

export function getProductTechnicalItems(product) {
  const metadata = product?.metadata && typeof product.metadata === "object"
    ? product.metadata
    : {};
  const raw =
    metadata.technicalComponents ||
    metadata.specifications ||
    metadata.features ||
    [];
  const items = Array.isArray(raw) ? raw : [];

  return items
    .map((item, index) => {
      if (typeof item === "string") {
        const text = item.trim();
        return text
          ? { title: `Component ${index + 1}`, description: text }
          : null;
      }
      if (!item || typeof item !== "object") return null;
      const title = firstCleanString([
        item.title,
        item.name,
        `Component ${index + 1}`,
      ]);
      const description = firstCleanString([
        item.description,
        item.detail,
        item.value,
      ]);
      return title || description ? { title, description } : null;
    })
    .filter(Boolean)
    .slice(0, 4);
}

export function getProductDescriptionHighlights(product) {
  return cleanString(product?.description)
    .split(/\n+|(?<=\.)\s+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 2);
}
