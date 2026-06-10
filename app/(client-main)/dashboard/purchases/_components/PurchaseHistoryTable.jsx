import Link from "next/link";
import PurchaseStatusBadge from "./PurchaseStatusBadge";

function PurchaseAmount({ item }) {
  return (
    <div className="text-right">
      <p className="font-lato text-sm font-extrabold text-[#285c16]">
        {item.payableAmountLabel}
      </p>
      {item.hasDiscount ? (
        <p className="mt-0.5 text-xs text-zinc-400 line-through">
          {item.listedAmountLabel}
        </p>
      ) : null}
      {item.couponCode ? (
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#357200]">
          Coupon: {item.couponCode}
        </p>
      ) : null}
    </div>
  );
}

function PurchaseAction({ item }) {
  const canView = Boolean(item.href);
  const canRetry = item.status === "created" || item.status === "failed";

  if (canView) {
    return (
      <Link
        href={item.href}
        className="inline-flex items-center justify-center rounded-xl bg-[#357200] px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#055f24]"
      >
        {item.kind === "program" ? "View program" : "View product"}
      </Link>
    );
  }

  if (canRetry) {
    return (
      <Link
        href={item.retryHref}
        className="inline-flex items-center justify-center rounded-xl border border-[#357200] px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#357200] transition hover:bg-[#f2f8ec]"
      >
        Try again
      </Link>
    );
  }

  return <span className="text-xs text-zinc-400">—</span>;
}

function PurchaseItemMeta({ item }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-zinc-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.imageUrl}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
      <div className="min-w-0">
        <p className="truncate font-lato text-sm font-extrabold text-[#285c16]">
          {item.title}
        </p>
        <p className="truncate text-xs text-zinc-500">{item.subtitle}</p>
        {item.paymentReference ? (
          <p
            className="mt-1 truncate text-[11px] text-zinc-400"
            title={item.paymentReference}
          >
            Ref: {item.paymentReferenceShort}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function PurchaseCard({ item }) {
  return (
    <article className="rounded-3xl border border-zinc-200/80 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <PurchaseItemMeta item={item} />
        <PurchaseStatusBadge label={item.statusLabel} tone={item.statusTone} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
            Date
          </p>
          <p className="mt-1 font-medium text-zinc-700">
            {item.purchasedAtLabel}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
            Type
          </p>
          <p className="mt-1 font-medium text-zinc-700">{item.kindLabel}</p>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-3 border-t border-zinc-100 pt-4">
        <PurchaseAmount item={item} />
        <PurchaseAction item={item} />
      </div>
    </article>
  );
}

export default function PurchaseHistoryTable({ items }) {
  if (!items.length) return null;

  return (
    <>
      <div className="hidden overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-sm lg:block">
        <table className="min-w-full border-collapse font-lato">
          <thead className="border-b border-zinc-100 bg-[#fafbf9]">
            <tr>
              <th
                scope="col"
                className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500"
              >
                Item
              </th>
              <th
                scope="col"
                className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500"
              >
                Type
              </th>
              <th
                scope="col"
                className="px-5 py-4 text-right text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500"
              >
                Amount
              </th>
              <th
                scope="col"
                className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-5 py-4 text-right text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={`${item.source}-${item.id}`}
                className="border-b border-zinc-100 last:border-b-0"
              >
                <td className="px-5 py-4 align-top text-sm text-zinc-600">
                  {item.purchasedAtLabel}
                </td>
                <td className="px-5 py-4 align-top">
                  <PurchaseItemMeta item={item} />
                </td>
                <td className="px-5 py-4 align-top text-sm font-medium text-zinc-700">
                  {item.kindLabel}
                </td>
                <td className="px-5 py-4 align-top">
                  <PurchaseAmount item={item} />
                </td>
                <td className="px-5 py-4 align-top">
                  <PurchaseStatusBadge
                    label={item.statusLabel}
                    tone={item.statusTone}
                  />
                </td>
                <td className="px-5 py-4 align-top text-right">
                  <PurchaseAction item={item} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 lg:hidden">
        {items.map((item) => (
          <PurchaseCard key={`${item.source}-${item.id}`} item={item} />
        ))}
      </div>
    </>
  );
}
