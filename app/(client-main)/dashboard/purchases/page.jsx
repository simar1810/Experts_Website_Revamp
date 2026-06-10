"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { fetchClientPurchaseHistory } from "@/lib/clientPurchaseHistory";
import DashboardHeading from "../_components/common/DashboardHeading";
import PurchaseHistoryFilters from "./_components/PurchaseHistoryFilters";
import PurchaseHistoryStats from "./_components/PurchaseHistoryStats";
import PurchaseHistoryTable from "./_components/PurchaseHistoryTable";

export default function PurchasesPage() {
  const { isAuthenticated, openLoginModal } = useAuth();
  const [kind, setKind] = useState("all");
  const [status, setStatus] = useState("all");
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({
    totalOrders: 0,
    totalSpent: 0,
    currency: "INR",
    programCount: 0,
    productCount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const loadPurchases = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    setLoadError(null);

    try {
      const data = await fetchClientPurchaseHistory({ kind, status });
      setItems(data.items);
      setSummary(data.summary);
    } catch (error) {
      setItems([]);
      setLoadError(
        error instanceof Error
          ? error.message
          : "Could not load purchase history.",
      );
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, kind, status]);

  useEffect(() => {
    if (!isAuthenticated) {
      setItems([]);
      setLoadError(null);
      setLoading(false);
      return;
    }

    loadPurchases();
  }, [isAuthenticated, loadPurchases]);

  if (!isAuthenticated) {
    return (
      <div className="font-lato mx-auto flex max-w-lg flex-col items-center justify-center space-y-4 py-16 text-center pb-4">
        <DashboardHeading text="PURCHASE HISTORY" />
        <p className="text-sm text-zinc-600">
          Log in to see programs and products you have purchased.
        </p>
        <Button
          type="button"
          className="mt-4 rounded-xl bg-[var(--brand-primary)] px-8 py-3 font-semibold text-white hover:bg-[#6ca832]"
          onClick={openLoginModal}
        >
          Log in
        </Button>
      </div>
    );
  }

  return (
    <div className="font-lato space-y-8 pb-8">
      <DashboardHeading text="PURCHASE HISTORY" />

      <PurchaseHistoryStats summary={summary} />

      <PurchaseHistoryFilters
        kind={kind}
        status={status}
        onKindChange={setKind}
        onStatusChange={setStatus}
      />

      {loadError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p>{loadError}</p>
          <button
            type="button"
            onClick={loadPurchases}
            className="mt-2 font-semibold underline underline-offset-2"
          >
            Try again
          </button>
        </div>
      ) : null}

      {loading ? (
        <p className="rounded-2xl border border-dashed border-zinc-200 bg-white/60 px-6 py-12 text-center text-sm text-zinc-500">
          Loading your purchase history…
        </p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-200 bg-white/60 px-6 py-12 text-center">
          <p className="text-sm text-zinc-600">No purchases yet.</p>
          <p className="mt-2 text-sm text-zinc-500">
            Explore expert programs and partner products to get started.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/discover-programs"
              className="inline-flex items-center justify-center rounded-xl bg-[#357200] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#055f24]"
            >
              Browse programs
            </Link>
            <Link
              href="/collections"
              className="inline-flex items-center justify-center rounded-xl border border-[#357200] px-5 py-2.5 text-sm font-semibold text-[#357200] transition hover:bg-[#f2f8ec]"
            >
              Browse products
            </Link>
          </div>
        </div>
      ) : (
        <PurchaseHistoryTable items={items} />
      )}
    </div>
  );
}
