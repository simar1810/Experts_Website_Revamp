import { fetchAPI } from "@/lib/api";
import { PROGRAM_IMAGE_FALLBACK } from "@/lib/dashboardProgramEnrollment";
import { PRODUCT_PLACEHOLDER_IMAGE } from "@/lib/partnerProductsApi";

export const PURCHASE_KIND_OPTIONS = [
  { value: "all", label: "All" },
  { value: "program", label: "Programs" },
  { value: "product", label: "Products" },
];

export const PURCHASE_STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "paid", label: "Paid" },
  { value: "created", label: "Pending" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
  { value: "cancelled", label: "Cancelled" },
];

const STATUS_META = {
  paid: { label: "Paid", tone: "success" },
  created: { label: "Pending", tone: "warning" },
  failed: { label: "Failed", tone: "danger" },
  refunded: { label: "Refunded", tone: "neutral" },
  cancelled: { label: "Cancelled", tone: "neutral" },
};

const KIND_LABELS = {
  program: "Program",
  product: "Product",
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

export function formatPurchaseDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatPurchaseAmount(amount, currency = "INR") {
  const value = Number(amount);
  if (!Number.isFinite(value)) return "—";
  if (currency === "INR") return currencyFormatter.format(value);
  return `${currency} ${value.toFixed(2)}`;
}

export function getPurchaseStatusMeta(status) {
  return STATUS_META[status] || { label: status || "Unknown", tone: "neutral" };
}

export function getPurchaseKindLabel(kind) {
  return KIND_LABELS[kind] || "Purchase";
}

export function truncatePaymentReference(reference) {
  const text = typeof reference === "string" ? reference.trim() : "";
  if (!text) return "";
  if (text.length <= 14) return text;
  return `…${text.slice(-10)}`;
}

export function mapPurchaseHistoryItem(item) {
  const statusMeta = getPurchaseStatusMeta(item?.status);
  const listedAmount = Number(item?.listedAmount);
  const payableAmount = Number(item?.payableAmount);
  const hasDiscount =
    Number.isFinite(listedAmount) &&
    Number.isFinite(payableAmount) &&
    listedAmount > payableAmount;

  const imageUrl =
    (typeof item?.imageUrl === "string" && item.imageUrl.trim()) ||
    (item?.kind === "product" ? PRODUCT_PLACEHOLDER_IMAGE : PROGRAM_IMAGE_FALLBACK);

  return {
    ...item,
    imageUrl,
    kindLabel: getPurchaseKindLabel(item?.kind),
    statusLabel: statusMeta.label,
    statusTone: statusMeta.tone,
    purchasedAtLabel: formatPurchaseDate(item?.purchasedAt),
    listedAmountLabel: formatPurchaseAmount(listedAmount, item?.currency),
    payableAmountLabel: formatPurchaseAmount(payableAmount, item?.currency),
    hasDiscount,
    paymentReferenceShort: truncatePaymentReference(item?.paymentReference),
    retryHref:
      item?.kind === "program" ? "/discover-programs" : "/collections",
  };
}

export async function fetchClientPurchaseHistory({ kind, status } = {}) {
  const params = new URLSearchParams();
  if (kind && kind !== "all") params.set("kind", kind);
  if (status && status !== "all") params.set("status", status);

  const query = params.toString();
  const endpoint = query
    ? `/experts/client/purchase-history?${query}`
    : "/experts/client/purchase-history";

  const response = await fetchAPI(endpoint, undefined, "GET");
  const items = Array.isArray(response?.items)
    ? response.items.map(mapPurchaseHistoryItem)
    : [];

  const summary = response?.summary || {};

  return {
    items,
    summary: {
      totalOrders: Number(summary.totalOrders || items.length),
      totalSpent: Number(summary.totalSpent || 0),
      currency: summary.currency || "INR",
      programCount: Number(summary.programCount || 0),
      productCount: Number(summary.productCount || 0),
    },
  };
}

export function filterPurchaseItemsClientSide(items, { kind, status } = {}) {
  let filtered = items;
  if (kind && kind !== "all") {
    filtered = filtered.filter((item) => item.kind === kind);
  }
  if (status && status !== "all") {
    filtered = filtered.filter((item) => item.status === status);
  }
  return filtered;
}
