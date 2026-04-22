import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

import {
  Geist,
  Geist_Mono,
  Lato,
  Lexend,
  Manrope,
  Montserrat,
  Playfair_Display,
} from "next/font/google";
import "./globals.css";
import ClientMainLayoutShell from "./(client-main)/ClientMainLayoutShell";
import { ValuesProvider } from "@/context/valuesContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
  title: "WellnessZ Experts",
  description: "All in One Business Platform for Wellness Professionals",
  manifest: "/app.webmanifest",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="overflow-x-clip h-full" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${lato.variable} ${lexend.variable} ${manrope.variable} ${playfair.variable} antialiased overflow-x-clip h-full`}
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
                  primary: "#84cc16",
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
          <ValuesProvider>
            {" "}
            <ClientMainLayoutShell>{children}</ClientMainLayoutShell>
          </ValuesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
