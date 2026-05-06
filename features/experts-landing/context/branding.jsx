"use client"
import { createContext, useContext, useMemo } from "react"
import { fetchData } from "../helpers/network";
import useSWR from "swr";
import InvalidPartner from "../components/invalid-partner"

const BrandingContext = createContext();

export default function BrandingProvider(props) {
  if (!props.success) {
    return (
      <BrandingContext.Provider value={{
        displayName: "Zeefit",
        logo: "/experts-logo.png"
      }}>
        {props.children}
      </BrandingContext.Provider>
    )
  }
  return <BrandingProviderContainer {...props} />
}

function BrandingProviderContainer({ partner, children }) {
  const endpoint = useMemo(() => process.env.NEXT_PUBLIC_PARTNER_ENDPOINT + "/experts/public/config", [partner]);
  const { isLoading, error, data } = useSWR(
    endpoint, () => fetchData(endpoint, {
      headers: partner ? {
        'x-tenant': partner
      } : {}
    }));

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div
        style={{ clipPath: "polygon(0% 0%, 100% 100%, 0% 100%)" }}
        className="w-8 aspect-square border-4 border-[#1C8CB8] rounded-full animate-spin"
      />
    </div>
  }

  if (error || data?.message === "Partner not found") {
    return <InvalidPartner />
  }

  const brandInfo = data?.partner || {};

  return <BrandingContext.Provider value={{
    ...brandInfo,
    displayName: brandInfo?.branding?.displayName || "Zee Fit",
    logo: brandInfo?.branding?.logo ||  "/experts-logo.png"
  }}>
    <div style={{
      '--brand-primary': brandInfo?.branding?.primaryColor || '#67bc2a',
      '--brand-secondary': brandInfo?.branding?.secondaryColor || '#b1271c',
    }}>
      {children}
    </div>
  </BrandingContext.Provider>
}

export const useBrandingContext = function () {
  const context = useContext(BrandingContext);
  return context
}
