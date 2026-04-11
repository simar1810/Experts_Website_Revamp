const API_ENDPOINT = process.env.NEXT_PUBLIC_API_URL;

export function buildUrlWithQueryParams(baseUrl, paramsObject = {}) {
  const query = Object.entries(paramsObject)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join("&");

  return baseUrl.includes("?") ? `${baseUrl}&${query}` : `${baseUrl}?${query}`;
}

export const loadScript = async function () {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export const createRazorpayOrder = async function (state) {
  const endpoint = buildUrlWithQueryParams(
    `${API_ENDPOINT}app/razorpay-autopay`,
    {
      coachId: state.coachId,
      planId: state.planId,
      currency: state.currency,
      noOfMonths: state.noOfMonths,
      isAdmin: state.isAdmin,
      referredByCoach: state.referredBy,
      couponCode: state.appliedCoupon
    },
  );
  const response = await fetch(endpoint, {
    method: "GET",
    cache: "no-store",
  });
  console.log(response)
  const res = await response.json();
  if (res.status_code !== 200) throw new Error(res.message);
  return res;
};

export const buildRazorpayOptions = function (order, {
  onSuccess
}) {
  return {
    key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
    subscription_id: order.id,
    name: "Wellnessz",
    description: "Wellnessz Subscription",
    // callback_url: "https://wellnessz.com/api/razorpay/subscription/verify",
    redirect: true,
    modal: {
      ondismiss: () => {
        // dispatch(updateUIState("payment-cancelled"));
        console.log("dismiss hit")
      },
    },
    handler: async function () {
      if (typeof onSuccess === "function") {
        await onSuccess()
      }
    }
  }
}