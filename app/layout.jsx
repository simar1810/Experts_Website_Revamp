import { AuthProvider } from "@/context/AuthContext";
import PartnerLandingPage from "@/features/partner-landing/pages/PartnerLandingPage";
import BrandingProvider from "@/features/partner-landing/context/branding";
import { Toaster } from "react-hot-toast";
import { Geist, Lato, Lexend, Manrope, Playfair_Display } from "next/font/google";
import ClientMainLayoutShell from "./(client-main)/ClientMainLayoutShell";
import { ValuesProvider } from "@/context/valuesContext";
import { resolvePartner } from "@/lib/tenant/resolve-partner";
import { headers } from "next/headers";
import { isShopRequestHost, normalizeHost } from "@/lib/shopHost";
import { SWRConfig } from "swr";
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
});

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata = {
  title: "Zeefit",
  description: "All in One Business Platform for Wellness Professionals",
  manifest: "/app.webmanifest",
};

export default async function RootLayout({ children }) {
  const { success, partner, pathname } = await resolvePartner();
  const headersList = await headers();
  const host = normalizeHost(
    headersList.get("x-forwarded-host") || headersList.get("host") || "",
  );
  const hideShopNavLinks = isShopRequestHost(
    host,
    process.env.SHOP_HOSTNAME || "shop.zeefit.in",
  );
  return (
    <html lang="en" className="overflow-x-clip h-full" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${lato.variable} ${lexend.variable} ${manrope.variable} ${playfair.variable} antialiased overflow-x-clip h-full`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <Toaster
            position="bottom-right"
            reverseOrder={false}
            // Above full-screen modals (e.g. z-9999 in GetStartedModal / LoginModal)
            containerStyle={{ zIndex: 10000 }}
            toastOptions={{
              duration: 4000,
              style: {
                background: "#fff",
                color: "#1a1a1a",
                padding: "16px 24px",
                borderRadius: "1.25rem",
                fontSize: "14px",
                fontWeight: "600",
                boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)",
                border: "1px solid #f3f4f6",
              },
              success: {
                iconTheme: {
                  primary: "var(--brand-primary)",
                  secondary: "#fff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
              },
            }}
          />
          <SWRConfig value={{ revalidateOnFocus: false, revalidateIfStale: false }}>
            {success && ["", "/"].includes(pathname) && <PartnerLandingPage partner={partner} />}
            <ValuesProvider>
              {(!success || !["", "/"].includes(pathname)) && <BrandingProvider success={success} partner={partner}>
                <ClientMainLayoutShell hideShopNavLinks={hideShopNavLinks}>
                  {children}
                </ClientMainLayoutShell>
              </BrandingProvider>}
            </ValuesProvider>
          </SWRConfig>
        </AuthProvider>
      </body>
    </html>
  );
}
