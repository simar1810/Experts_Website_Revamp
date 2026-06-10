import Link from "next/link";
import toast from "react-hot-toast";

export function showPurchaseSuccessToast(message = "Payment successful.") {
  toast.success(
    (t) => (
      <span className="text-sm">
        {message}{" "}
        <Link
          href="/dashboard/purchases"
          className="font-semibold text-[#357200] underline underline-offset-2"
          onClick={() => toast.dismiss(t.id)}
        >
          View purchase history
        </Link>
      </span>
    ),
    { duration: 6500 },
  );
}
